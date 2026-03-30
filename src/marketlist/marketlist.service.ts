import {Injectable,NotFoundException, BadRequestException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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

  
  async create(data: CreateMarketlistDto) {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('Items are required');
    }

    const total = data.items.reduce(
      (sum, item) => sum + Number(item.price),
      0,
    );

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

  // ✅ GET ALL
  async findAll() {
    return this.marketListRepo.find({ relations: ['items'] });
  }

  // ✅ GET ONE
  async findOne(id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');

    const list = await this.marketListRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!list) throw new NotFoundException('Market list not found');

    return list;
  }

  // ✅ UPDATE
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

  // ✅ DELETE
  async delete(id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');

    const result = await this.marketListRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Market list not found');
    }

    return { message: 'Deleted successfully' };
  }

  
  async combine(ids: string[]) {
    const lists = await this.marketListRepo.find({
      where: { id: In(ids) },
      relations: ['items'],
    });

    if (!lists.length) {
      throw new NotFoundException('No lists found');
    }

    const allItems = lists.flatMap(list => list.items);

    const grouped = allItems.reduce((acc, item) => {
      const category = item.category || 'Other';

      if (!acc[category]) acc[category] = [];

      acc[category].push(item);

      return acc;
    }, {} as Record<string, MarketListItem[]>);

    const total = allItems.reduce(
      (sum, item) => sum + Number(item.price),
      0,
    );

    return {
      groupedItems: grouped,
      total,
    };
  }
}
