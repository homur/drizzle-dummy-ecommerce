export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  inventory: number;
  imageUrl: string;
  isHighlighted: boolean;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}
