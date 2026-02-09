import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { Budget, BudgetSchema } from './schema/budget.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Budget.name, schema: BudgetSchema },
    ]),
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
