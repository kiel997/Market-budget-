import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
  Body,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';

import { MarketNoteService } from './market-note.service';
import { CreateMarketNoteDto } from './dto/create-marketnote.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // 🔐 PROTECT ALL ROUTES
@Controller('market-note')
export class MarketNoteController {
  constructor(private readonly noteService: MarketNoteService) {}

  // ✅ CREATE
  @Post()
  async create(
    @Req() req,
    @Body()
    body: {
      title: string;
      template?: string;
      stealthMode?: boolean;
      marketName?: string;
      items: {
        name: string;
        quantity: number;
        estimatedPrice?: number;
        price?: number;
        actualPrice?: number;
        category?: string;
      }[];
    },
  ) {
    if (!body.title) {
      throw new BadRequestException('title is required');
    }

    const userId = req.user.sub; // 🔐 FIX TOKEN USER ID

    const dto: CreateMarketNoteDto = {
      title: body.title,
      template: body.template,
      stealthMode: body.stealthMode,
      marketName: body.marketName,
      items: body.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        estimatedPrice: item.estimatedPrice ?? item.price ?? 0,
        actualPrice: item.actualPrice ?? 0,
        category: item.category,
      })),
    };

    return this.noteService.create(dto /* userId can be added if service supports it */);
  }

  // ✅ GET ALL
  @Get()
  async findAll(@Req() req) {
    const userId = req.user.sub;
    return this.noteService.findAll(); // (unchanged as requested)
  }

  // ✅ GET ONE
  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.noteService.findOne(id);
  }

  // ✅ UPDATE
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      template?: string;
      stealthMode?: boolean;
      marketName?: string;
      items?: {
        name: string;
        quantity: number;
        estimatedPrice?: number;
        price?: number;
        actualPrice?: number;
        category?: string;
      }[];
    },
  ) {
    const userId = req.user.sub;

    const dto: Partial<CreateMarketNoteDto> = {
      title: body.title,
      template: body.template,
      stealthMode: body.stealthMode,
      marketName: body.marketName,
      items: body.items?.map(item => ({
        name: item.name,
        quantity: item.quantity,
        estimatedPrice: item.estimatedPrice ?? item.price ?? 0,
        actualPrice: item.actualPrice ?? 0,
        category: item.category,
      })),
    };

    return this.noteService.update(id, dto);
  }

  // ✅ DELETE
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.noteService.delete(id);
  }
}
