export class CreateItemDto {
  [x: string]: any;
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
