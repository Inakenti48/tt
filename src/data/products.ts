export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  dimensions?: string;
  material?: string;
  color?: 'terracotta' | 'mustard' | 'primary';
}

export const products: Product[] = [
  {
    id: '1',
    name: 'минималист кресло',
    price: 450,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
    category: 'мебель',
    description: 'элегантное кресло с чистыми линиями и мягкой обивкой. идеально подходит для создания спокойной атмосферы в вашем пространстве.',
    dimensions: '75 × 80 × 90 см',
    material: 'дуб, льняная ткань',
    color: 'terracotta'
  },
  {
    id: '2',
    name: 'керамическая ваза',
    price: 85,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800',
    category: 'декор',
    description: 'ваза ручной работы из натуральной керамики. каждое изделие уникально благодаря особенностям ручного производства.',
    dimensions: '15 × 15 × 30 см',
    material: 'керамика',
    color: 'mustard'
  },
  {
    id: '3',
    name: 'дзен лампа',
    price: 120,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800',
    category: 'освещение',
    description: 'мягкий рассеянный свет создаёт атмосферу умиротворения. минималистичный дизайн впишется в любой интерьер.',
    dimensions: '20 × 20 × 45 см',
    material: 'бамбук, рисовая бумага',
    color: 'primary'
  },
  {
    id: '4',
    name: 'льняная подушка',
    price: 45,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800',
    category: 'текстиль',
    description: 'подушка из натурального льна с нежной текстурой. добавляет уют и тепло в любое пространство.',
    dimensions: '50 × 50 см',
    material: 'лён',
    color: 'terracotta'
  },
  {
    id: '5',
    name: 'деревянный столик',
    price: 280,
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800',
    category: 'мебель',
    description: 'журнальный столик из массива дуба с лаконичным силуэтом. природная красота дерева в каждой детали.',
    dimensions: '90 × 50 × 40 см',
    material: 'массив дуба',
    color: 'mustard'
  },
  {
    id: '6',
    name: 'ароматическая свеча',
    price: 35,
    image: 'https://images.unsplash.com/photo-1602607544604-e41efb538828?auto=format&fit=crop&q=80&w=800',
    category: 'декор',
    description: 'свеча из натурального соевого воска с ароматом сандала и кедра. время горения — до 50 часов.',
    dimensions: '8 × 8 × 10 см',
    material: 'соевый воск, хлопковый фитиль',
    color: 'primary'
  }
];
