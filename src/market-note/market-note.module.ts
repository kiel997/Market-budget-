import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MarketNote } from './entities/marketnote.entity';
import { MarketNoteItem } from './entities/marketnote-item.entity';
import { MarketNoteService } from './market-note.service';
import { MarketNoteController } from './market-note.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([MarketNote, MarketNoteItem]),

    // 🔥 THIS IS THE FIX
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mySecretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [MarketNoteController],
  providers: [MarketNoteService],
})
export class MarketNoteModule {}
