export class CreateItemDto {
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export class CreateMarketlistDto {
  name: string;
  template?: string;
  stealthMode?: boolean;
  items: CreateItemDto[];
}
