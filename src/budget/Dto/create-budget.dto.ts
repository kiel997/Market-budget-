import { IsNumber, IsString } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  title: string;

  @IsNumber()
  totalBudget: number;
}
