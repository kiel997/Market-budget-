export class CreateMarketNoteDto {
  title!: string; // ✅ renamed
  template?: string;
  stealthMode?: boolean;
  marketName?: string; // ✅ renamed

  items!: {
    name: string;
    quantity: number;
    estimatedPrice: number; // ✅ renamed
    actualPrice?: number; // ✅ optional
    category?: string;
  }[];
}
