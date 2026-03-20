export class CreateItemDto {
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export class CreateGroceryDto {
  name: string;
  template?: string;
  stealthMode?: boolean;
  items: CreateItemDto[];
}
