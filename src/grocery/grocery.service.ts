import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroceryList } from './entities/grocery-list.entity';
import { CreateGroceryDto } from './dto/create-grocery.dto';

@Injectable()
export class GroceryService {
  constructor(
    @InjectRepository(GroceryList) 
    private readonly groceryRepo: Repository<GroceryList>,
  ) {}

  async create(data: CreateGroceryDto) {
    const total = data.items.reduce(
      (sum, item) => sum + item.price,
      0,
    );

    const list = this.groceryRepo.create({
      ...data,
      estimatedTotal: total,
    });

    return await this.groceryRepo.save(list);
  }

  async findAll() {
    return this.groceryRepo.find({
      relations: ['items'],
    });
  }

  async findOne(id: string) {
    return this.groceryRepo.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async delete(id: string) {
    return this.groceryRepo.delete(id);
  }
}
