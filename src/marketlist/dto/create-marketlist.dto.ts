export class CreateItemDto {
  name: string;
  quantity: number;
  price: number;
  // unit is ignored completely
}

export class CreateMarketlistDto {
  name: string;
  template?: string;
  stealthMode?: boolean;
  items: CreateItemDto[];
}
