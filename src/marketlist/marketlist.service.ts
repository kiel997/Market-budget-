import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { MarketList } from './entities/marketlist-list.entity';
import { MarketListItem } from './entities/marketlist-item.entity';
import { CreateMarketlistDto } from './dto/create-marketlist.dto';

@Injectable()
export class MarketlistService {
  constructor(
    @InjectRepository(MarketList)
    private readonly marketListRepo: Repository<MarketList>,

    @InjectRepository(MarketListItem)
    private readonly itemRepo: Repository<MarketListItem>,
  ) {}

  // ✅ CREATE MARKET LIST
  async create(data: CreateMarketlistDto) {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('Items are required');
    }

    const total = data.items.reduce((sum, item) => sum + Number(item.price), 0);

    const list = this.marketListRepo.create({
      name: data.name,
      template: data.template,
      stealthMode: data.stealthMode ?? false,
      estimatedTotal: total,
    });

    const savedList = await this.marketListRepo.save(list);

    const items = this.itemRepo.create(
      data.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
        category: item.category,
        marketList: savedList,
      })),
    );

    await this.itemRepo.save(items);
    savedList.items = items;

    return savedList;
  }

  // ✅ GET ALL MARKET LISTS
  async findAll() {
    return this.marketListRepo.find({ relations: ['items'] });
  }

  // ✅ GET ONE MARKET LIST
  async findOne(id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');

    const list = await this.marketListRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!list) throw new NotFoundException('Market list not found');

    return list;
  }

  // ✅ UPDATE MARKET LIST
  async update(id: string, data: Partial<CreateMarketlistDto>) {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');

    const list = await this.marketListRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!list) throw new NotFoundException('Market list not found');

    let hasChanges = false;

    if (data.name) {
      list.name = data.name;
      hasChanges = true;
    }

    if (data.items) {
      // Remove old items
      await this.itemRepo.delete({ marketList: list });

      const items = this.itemRepo.create(
        data.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
          category: item.category,
          marketList: list,
        })),
      );

      await this.itemRepo.save(items);

      list.items = items;
      list.estimatedTotal = data.items.reduce(
        (sum, item) => sum + Number(item.price),
        0,
      );

      hasChanges = true;
    }

    if (!hasChanges) {
      throw new BadRequestException('No update data provided');
    }

    return this.marketListRepo.save(list);
  }

  // ✅ DELETE MARKET LIST
  async delete(id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');

    const result = await this.marketListRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Market list not found');
    }

    return { message: 'Deleted successfully' };
  }
}
