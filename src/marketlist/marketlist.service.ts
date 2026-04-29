import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  // CREATE
  async create(userId: string, data: CreateMarketlistDto) {
    if (!data.items?.length) {
      throw new BadRequestException('Items are required');
    }

    // ✅ FIXED TOTAL (price × quantity)
    const total = data.items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );

    const list = this.marketListRepo.create({
      name: data.name,
      template: data.template,
      stealthMode: data.stealthMode ?? false,
      estimatedTotal: total,
      user: { id: userId } as any,
    });

    const savedList = await this.marketListRepo.save(list);

    const items = this.itemRepo.create(
      data.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
        category: item.category,
        marketList: savedList,
      })),
    );

    await this.itemRepo.save(items);

    return {
      ...savedList,
      items,
    };
  }

  // FIND ALL
  async findAll(userId: string) {
    return this.marketListRepo.find({
      where: { user: { id: userId } },
      relations: ['items'],
    });
  }

  // FIND ONE
  async findOne(userId: string, id: string) {
    const list = await this.marketListRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['items'],
    });

    if (!list) throw new NotFoundException('Market list not found');

    return list;
  }

  // UPDATE
  async update(userId: string, id: string, data: any) {
    const list = await this.marketListRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['items'],
    });

    if (!list) throw new NotFoundException('Market list not found');

    if (data.name) list.name = data.name;

    if (data.items) {
      await this.itemRepo.delete({ marketList: { id } as any });

      const total = data.items.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0,
      );

      list.estimatedTotal = total;

      const items = this.itemRepo.create(
        data.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
          category: item.category,
          marketList: list,
        })),
      );

      await this.itemRepo.save(items);
    }

    return this.marketListRepo.save(list);
  }

  // DELETE
  async delete(userId: string, id: string) {
    const list = await this.marketListRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!list) throw new NotFoundException('Market list not found');

    await this.marketListRepo.remove(list);

    return { message: 'Deleted successfully' };
  }
}
