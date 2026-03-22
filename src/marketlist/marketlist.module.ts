import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketlistController } from './marketlist.controller';
import { MarketlistService } from './marketlist.service';
import { MarketList } from './entities/marketlist-list.entity';
import { MarketListItem } from './entities/marketlist-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarketList, MarketListItem])],
  controllers: [MarketlistController],
  providers: [MarketlistService],
})
export class MarketlistModule {}
