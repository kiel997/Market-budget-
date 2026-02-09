import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget, BudgetDocument } from './schema/budget.schema';
import { Item } from './schema/item.schema';
import { AddItemDto } from './Dto/add-item.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
  ) {}

  // Create a new budget
  async createBudget(title: string, totalBudget: number) {
    return this.budgetModel.create({ title, totalBudget });
  }

  // Add an item to a budget
  async addItem(budgetId: string, dto: AddItemDto) {
    const budget = await this.budgetModel.findById(budgetId).exec();
    if (!budget) throw new NotFoundException('Budget not found');

    const totalPrice = dto.price * dto.quantity;

    // ✅ Push new item
    budget.items.push({
      name: dto.name,
      quantity: dto.quantity,
      unitPrice: dto.price,
      totalPrice,
    } as Item); // type assertion

    // ✅ Recalculate totals
    budget.totalSpent = budget.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    budget.isExceeded = budget.totalSpent > budget.totalBudget;
    budget.remaining = budget.totalBudget - budget.totalSpent;

    await budget.save();

    return {
      item: { ...dto, total: totalPrice },
      budgetSummary: budget,
    };
  }

  // Get budget summary
  async getBudgetSummary(id: string) {
    const budget = await this.budgetModel.findById(id).exec();
    if (!budget) throw new NotFoundException('Budget not found');
    return budget;
  }
}
