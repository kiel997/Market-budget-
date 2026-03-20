import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroceryController } from './grocery.controller';
import { GroceryService } from './grocery.service';
import { GroceryList } from './entities/grocery-list.entity';
import { GroceryItem } from './entities/grocery-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroceryList, GroceryItem])],
  controllers: [GroceryController],
  providers: [GroceryService],
})
export class GroceryModule {}
