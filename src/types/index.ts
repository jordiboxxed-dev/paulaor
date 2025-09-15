export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_sold: boolean;
  collection?: string;
  created_at: string;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string; // uuid
  created_at: string;
  customer_name: string;
  customer_email: string;
  total_price: number;
  status: OrderStatus;
}

export interface OrderItem {
  id: number;
  order_id: string;
  product_id: number;
  quantity: number;
  price: number;
  products: Product; // For joined queries
}