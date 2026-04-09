import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { MarketlistService } from './marketlist.service';
import { CreateMarketlistDto } from './dto/create-marketlist.dto';
import { isUUID } from 'class-validator';

@Controller('marketlists')
export class MarketlistController {
  constructor(private readonly marketlistService: MarketlistService) {}

  // ✅ CREATE MARKET LIST
  @Post()
  async create(@Body() data: CreateMarketlistDto) {
    return this.marketlistService.create(data);
  }

  // ✅ GET ALL MARKET LISTS
  @Get()
  async findAll() {
    return this.marketlistService.findAll();
  }

  // ✅ GET ONE MARKET LIST
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    return this.marketlistService.findOne(id);
  }

  // ✅ UPDATE MARKET LIST
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<CreateMarketlistDto>,
  ) {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    return this.marketlistService.update(id, data);
  }

  // ✅ DELETE MARKET LIST
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    return this.marketlistService.delete(id);
  }

}
