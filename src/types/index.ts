export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_sold: boolean;
  collection?: string; // Añadido
  created_at: string;
}