import { IsNumber, IsString, IsOptional } from 'class-validator';

export class AddItemDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  category?: string; 
}
