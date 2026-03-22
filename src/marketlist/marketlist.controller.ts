import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { MarketlistService} from './marketlist.service';
import { CreateMarketlistDto } from './dto/create-marketlist.dto';

@Controller('marketlists')
export class MarketlistController {
  constructor(private readonly marketlistService: MarketlistService) {}

  @Post()
  create(@Body() dto: CreateMarketlistDto) {
    return this.marketlistService.create(dto);
  }

  @Get()
  getAll() {
    return this.marketlistService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.marketlistService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketlistService.delete(id);
  }
}
