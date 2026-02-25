import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { Budget } from './entity/budget.entity';
import { Item } from './entity/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, Item]),
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
