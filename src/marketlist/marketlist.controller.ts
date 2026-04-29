import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Req,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { MarketlistService } from './marketlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMarketlistDto } from './dto/create-marketlist.dto';
import { isUUID } from 'class-validator';

@Controller('marketlists')
@UseGuards(JwtAuthGuard)
export class MarketlistController {
  constructor(private readonly service: MarketlistService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateMarketlistDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid ID');
    return this.service.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: any) {
    if (!isUUID(id)) throw new BadRequestException('Invalid ID');
    return this.service.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid ID');
    return this.service.delete(req.user.userId, id);
  }
}
