import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { GroceryService } from './grocery.service';
import { CreateGroceryDto } from './dto/create-grocery.dto';

@Controller('grocery')
export class GroceryController {
  constructor(private readonly groceryService: GroceryService) {}

  @Post()
  create(@Body() dto: CreateGroceryDto) {
    return this.groceryService.create(dto);
  }

  @Get()
  getAll() {
    return this.groceryService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.groceryService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groceryService.delete(id);
  }
}
