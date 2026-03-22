import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketList } from './entities/marketlist-list.entity';
import { CreateMarketlistDto } from './dto/create-marketlist.dto';

@Injectable()
export class MarketlistService {
  constructor(
    @InjectRepository(MarketList) 
    private readonly marketListRepo: Repository<MarketList>,
  ) {}

  async create(data: CreateMarketlistDto) {
    const total = data.items.reduce(
      (sum, item) => sum + item.price,
      0,
    );

    const list = this.marketListRepo.create({
      ...data,
      estimatedTotal: total,
    });

    return await this.marketListRepo.save(list);
  }

  async findAll() {
    return this.marketListRepo.find({
      relations: ['items'],
    });
  }

  async findOne(id: string) {
    return this.marketListRepo.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async delete(id: string) {
    const result = await this.marketListRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Item not found`);
    }
    return { message: 'Deleted successfully' };
  }
}
