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

  // ✅ CREATE (FIXED)
  async create(data: CreateMarketlistDto) {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('Items are required');
    }

    const total = data.items.reduce(
      (sum, item) => sum + Number(item.price),
      0,
    );

    // 1. Save list FIRST
    const list = this.marketListRepo.create({
      name: data.name,
      template: data.template,
      stealthMode: data.stealthMode ?? false,
      estimatedTotal: total,
    });

    const savedList = await this.marketListRepo.save(list);

    // 2. Create items
    const items = this.itemRepo.create(
      data.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
        marketList: savedList,
      })),
    );

    // 3. Save items
    await this.itemRepo.save(items);

    // 4. Attach items
    savedList.items = items;

    return savedList;
  }

  // ✅ GET ALL
  async findAll() {
    return this.marketListRepo.find({ relations: ['items'] });
  }

  // ✅ GET ONE
  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const list = await this.marketListRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!list) {
      throw new NotFoundException(`Market list with id ${id} not found`);
    }

    return list;
  }

  // ✅ UPDATE (FIXED)
  async update(id: string, data: Partial<CreateMarketlistDto>) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const list = await this.marketListRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!list) {
      throw new NotFoundException(`Market list with id ${id} not found`);
    }

    let hasChanges = false;

    // Update name
    if (data.name) {
      list.name = data.name;
      hasChanges = true;
    }

    // Update items
    if (data.items) {
      await this.itemRepo.delete({ marketList: list });

      if (data.items.length > 0) {
        const items = this.itemRepo.create(
          data.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: Number(item.price),
            marketList: list,
          })),
        );

        await this.itemRepo.save(items);

        list.items = items;
        list.estimatedTotal = data.items.reduce(
          (sum, item) => sum + Number(item.price),
          0,
        );
      } else {
        list.items = [];
        list.estimatedTotal = 0;
      }

      hasChanges = true;
    }

    // 🚨 Prevent empty update crash
    if (!hasChanges) {
      throw new BadRequestException('No update data provided');
    }

    return await this.marketListRepo.save(list);
  }

  // ✅ DELETE
  async delete(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const result = await this.marketListRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Market list with id ${id} not found`);
    }

    return { message: 'Deleted successfully' };
  }
}
