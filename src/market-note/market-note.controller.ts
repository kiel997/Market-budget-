import { Controller, Post, Get, Patch, Param, Delete, Body, BadRequestException } from '@nestjs/common';
import { MarketNoteService } from './market-note.service';
import { CreateMarketNoteDto } from './dto/create-marketnote.dto';

@Controller('market-note')
export class MarketNoteController {
  constructor(private readonly noteService: MarketNoteService) {}

  @Post()
  async create(@Body() body: { noteName: string; template?: string; stealthMode?: boolean; marketType?: string; items: { name: string; quantity: number; price: number; category?: string }[] }) {
    if (!body.noteName) throw new BadRequestException('noteName is required');

    const dto: CreateMarketNoteDto = {
      name: body.noteName,
      template: body.template,
      stealthMode: body.stealthMode,
      marketType: body.marketType,
      items: body.items,
    };

    return this.noteService.create(dto);
  }

  @Get()
  async findAll() {
    return this.noteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { noteName?: string; template?: string; stealthMode?: boolean; marketType?: string; items?: { name: string; quantity: number; price: number; category?: string }[] }
  ) {
    const dto: Partial<CreateMarketNoteDto> = {
      name: body.noteName,
      template: body.template,
      stealthMode: body.stealthMode,
      marketType: body.marketType,
      items: body.items,
    };

    return this.noteService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.noteService.delete(id);
  }
}
