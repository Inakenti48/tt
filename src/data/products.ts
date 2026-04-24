export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  color?: 'terracotta' | 'mustard' | 'primary';
}

export const products: Product[] = [
  {
    id: '1',
    name: 'minimalist chair',
    price: 450,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
    category: 'furniture',
    color: 'terracotta'
  },
  {
    id: '2',
    name: 'ceramic vase',
    price: 85,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800',
    category: 'decor',
    color: 'mustard'
  },
  {
    id: '3',
    name: 'zen lamp',
    price: 120,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800',
    category: 'lighting',
    color: 'primary'
  },
  {
    id: '4',
    name: 'linen cushion',
    price: 45,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800',
    category: 'textiles',
    color: 'terracotta'
  }
];
