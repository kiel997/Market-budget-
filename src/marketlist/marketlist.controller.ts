import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { MarketlistService } from './marketlist.service';
import { CreateMarketlistDto } from './dto/create-marketlist.dto';

@Controller('marketlists')
export class MarketlistController {
  constructor(private readonly marketlistService: MarketlistService) {}

  @Post()
  create(@Body() data: CreateMarketlistDto) {
    return this.marketlistService.create(data);
  }

  @Get()
  findAll() {
    return this.marketlistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketlistService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreateMarketlistDto>) {
    return this.marketlistService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.marketlistService.delete(id);
  }
}
