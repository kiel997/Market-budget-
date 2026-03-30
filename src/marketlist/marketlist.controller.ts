import {Controller,Post,Get,Patch,Delete, Param, Body,} from '@nestjs/common';
import { MarketlistService } from './marketlist.service';
import { CreateMarketlistDto } from './dto/create-marketlist.dto';

@Controller('marketlists')
export class MarketlistController {
  constructor(private readonly service: MarketlistService) {}

  @Post()
  create(@Body() data: CreateMarketlistDto) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<CreateMarketlistDto>,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  // 🔥 Combine endpoint (your UI uses this)
  @Post('combine')
  combine(@Body() ids: string[]) {
    return this.service.combine(ids);
  }
}
