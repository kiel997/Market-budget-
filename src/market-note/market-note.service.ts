import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketNote } from './entities/marketnote.entity';
import { CreateMarketNoteDto } from './dto/create-marketnote.dto';

@Injectable()
export class MarketNoteService {
  constructor(
    @InjectRepository(MarketNote)
    private readonly noteRepo: Repository<MarketNote>,
  ) {}

  // ✅ CREATE
  async create(dto: CreateMarketNoteDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Items are required');
    }

    // ✅ calculate total (price * quantity)
    const total = dto.items.reduce(
      (sum, item) => sum + (Number(item.estimatedPrice) * item.quantity),
      0,
    );

    const note = this.noteRepo.create({
      title: dto.title,
      template: dto.template,
      stealthMode: dto.stealthMode ?? false,
      marketName: dto.marketName,
      estimatedTotal: total,
      items: dto.items.map(item => ({
        ...item,
        actualPrice: item.actualPrice ?? 0, // ✅ default
      })),
    });

    const saved = await this.noteRepo.save(note);

    return this.noteRepo.findOne({
      where: { id: saved.id },
      relations: ['items'],
    });
  }

  // ✅ GET ALL
  async findAll() {
    return this.noteRepo.find({ relations: ['items'] });
  }

  // ✅ GET ONE
  async findOne(id: string) {
    const note = await this.noteRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!note) throw new NotFoundException('Market Note not found');

    return note;
  }

  // ✅ UPDATE
  async update(id: string, dto: Partial<CreateMarketNoteDto>) {
    const note = await this.noteRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!note) throw new NotFoundException('Market Note not found');

    let hasChanges = false;

    if (dto.title) { note.title = dto.title; hasChanges = true; }
    if (dto.template !== undefined) { note.template = dto.template; hasChanges = true; }
    if (dto.stealthMode !== undefined) { note.stealthMode = dto.stealthMode; hasChanges = true; }
    if (dto.marketName !== undefined) { note.marketName = dto.marketName; hasChanges = true; }

    if (dto.items && dto.items.length > 0) {
      note.items = dto.items.map(item => ({
        ...item,
        actualPrice: item.actualPrice ?? 0,
      })) as any;

      note.estimatedTotal = dto.items.reduce(
        (sum, item) => sum + (Number(item.estimatedPrice) * item.quantity),
        0,
      );

      hasChanges = true;
    }

    if (!hasChanges) {
      throw new BadRequestException('No update data provided');
    }

    const updated = await this.noteRepo.save(note);

    return this.noteRepo.findOne({
      where: { id: updated.id },
      relations: ['items'],
    });
  }

  // ✅ DELETE
  async delete(id: string) {
    const result = await this.noteRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Market Note not found');
    }

    return { message: 'Deleted successfully' };
  }
}
