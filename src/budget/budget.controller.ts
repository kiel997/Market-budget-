import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './Dto/create-budget.dto';
import { AddItemDto } from './Dto/add-item.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  create(@Body() dto: CreateBudgetDto) {
    return this.budgetService.createBudget(dto.title, dto.totalBudget);
  }

  @Post(':id/item')
  addItem(@Param('id') id: string, @Body() dto: AddItemDto) {
    return this.budgetService.addItem(id, dto);
  }

  @Get(':id')
  getSummary(@Param('id') id: string) {
    return this.budgetService.getBudgetSummary(id);
  }
}
