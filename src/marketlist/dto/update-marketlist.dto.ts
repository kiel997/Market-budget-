// src/marketlist/dto/update-marketlist.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMarketlistDto } from './create-marketlist.dto';

export class UpdateMarketlistDto extends PartialType(CreateMarketlistDto) {}
