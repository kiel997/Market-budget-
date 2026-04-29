import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketNoteService } from './market-note.service';
import { MarketNoteController } from './market-note.controller';
import { MarketNote } from './entities/marketnote.entity';
import { MarketNoteItem } from './entities/marketnote-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarketNote, MarketNoteItem])], 
  providers: [MarketNoteService],
  controllers: [MarketNoteController],
})
export class MarketNoteModule {}
