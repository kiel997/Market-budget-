import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entity/budget.entity';
import { Item } from './entity/item.entity';
import { AddItemDto } from './Dto/add-item.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,

    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  // Create a new budget
  async createBudget(title: string, totalBudget: number): Promise<Budget> {
    const budget = this.budgetRepository.create({
      title,
      totalBudget,
      totalSpent: 0,
      remaining: totalBudget,
      isExceeded: false,
      items: [],
    });
    return this.budgetRepository.save(budget);
  }

  // Add an item to a budget
  async addItem(budgetId: number, dto: AddItemDto) {
    const budget = await this.budgetRepository.findOne({
      where: { id: budgetId },
      relations: ['items'],
    });
    if (!budget) throw new NotFoundException('Budget not found');

    const totalPrice = dto.price * dto.quantity;

    const item = this.itemRepository.create({
      name: dto.name,
      quantity: dto.quantity,
      unitPrice: dto.price,
      totalPrice: totalPrice,
      category: dto.category,
      budget: budget,
    });

    await this.itemRepository.save(item);

    // Recalculate totals
    const updatedItems = [...budget.items, item];
    const totalSpent = updatedItems.reduce((sum, i) => sum + Number(i.totalPrice), 0);

    budget.totalSpent = totalSpent;
    budget.isExceeded = totalSpent > budget.totalBudget;
    budget.remaining = budget.totalBudget - totalSpent;

    await this.budgetRepository.save(budget);

    return {
      item,
      budgetSummary: budget,
    };
  }

  // Get budget summary
  async getBudgetSummary(id: number) {
    const budget = await this.budgetRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!budget) throw new NotFoundException('Budget not found');
    return budget;
  }
}
