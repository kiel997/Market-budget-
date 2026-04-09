export class CreateMarketNoteDto {
  name!: string; // maps to noteName
  template?: string;
  stealthMode?: boolean;
  marketType?: string; // type of market
  items!: {
    name: string;
    quantity: number;
    price: number;
    category?: string;
  }[];
}
