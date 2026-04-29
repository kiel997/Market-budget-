import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketlistController } from './marketlist.controller';
import { MarketlistService } from './marketlist.service';
import { MarketList } from './entities/marketlist-list.entity';
import { MarketListItem } from './entities/marketlist-item.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([MarketList, MarketListItem]),
    JwtModule,
    AuthModule,
  ],
  controllers: [MarketlistController],
  providers: [MarketlistService],
})
export class MarketlistModule {}
