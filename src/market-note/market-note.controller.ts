import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { MarketNoteService } from './market-note.service';
import { CreateMarketNoteDto } from './dto/create-marketnote.dto';

@Controller('market-note')
export class MarketNoteController {
  constructor(private readonly noteService: MarketNoteService) {}

  // ✅ CREATE
  @Post()
  async create(
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
        price?: number; // optional fallback
        actualPrice?: number;
        category?: string;
      }[];
    },
  ) {
    if (!body.title) {
      throw new BadRequestException('title is required');
    }

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

    return this.noteService.create(dto);
  }

  // ✅ GET ALL
  @Get()
  async findAll() {
    return this.noteService.findAll();
  }

  // ✅ GET ONE
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  // ✅ UPDATE
  @Patch(':id')
  async update(
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
    const dto: Partial<CreateMarketNoteDto> = {
      title: body.title,
      template: body.template,
      stealthMode: body.stealthMode,
      marketName: body.marketName,
      items: body.items?.map(item => ({
        name: item.name,
        quantity: item.quantity,
        estimatedPrice: item.estimatedPrice ?? item.price ?? 0, // ✅ fix
        actualPrice: item.actualPrice ?? 0,
        category: item.category,
      })),
    };

    return this.noteService.update(id, dto);
  }

  // ✅ DELETE
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.noteService.delete(id);
  }
}
