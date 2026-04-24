export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  category: string;
  description: string;
  dimensions?: string;
  weight?: string;
  material?: string;
  color?: 'terracotta' | 'mustard' | 'primary';
  colorDots: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'минималист кресло',
    sku: 'ZN01045',
    price: 450,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
    category: 'мебель',
    description: 'элегантное кресло с чистыми линиями и мягкой обивкой. идеально подходит для создания спокойной атмосферы в вашем пространстве.',
    dimensions: '75 × 80 × 90 см',
    weight: '8.2 кг',
    material: 'дуб, льняная ткань',
    color: 'terracotta',
    colorDots: ['#8E392B', '#D18D3D', '#2D2D2D']
  },
  {
    id: '2',
    name: 'керамическая ваза',
    sku: 'ZN02018',
    price: 85,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800',
    category: 'декор',
    description: 'ваза ручной работы из натуральной керамики. каждое изделие уникально благодаря особенностям ручного производства.',
    dimensions: '15 × 15 × 30 см',
    weight: '1.4 кг',
    material: 'керамика',
    color: 'mustard',
    colorDots: ['#D18D3D', '#E8DDD0', '#6B8E6B']
  },
  {
    id: '3',
    name: 'дзен лампа',
    sku: 'ZN03092',
    price: 120,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800',
    category: 'освещение',
    description: 'мягкий рассеянный свет создаёт атмосферу умиротворения. минималистичный дизайн впишется в любой интерьер.',
    dimensions: '20 × 20 × 45 см',
    weight: '0.9 кг',
    material: 'бамбук, рисовая бумага',
    color: 'primary',
    colorDots: ['#2D2D2D', '#E8DDD0']
  },
  {
    id: '4',
    name: 'льняная подушка',
    sku: 'ZN04037',
    price: 45,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800',
    category: 'текстиль',
    description: 'подушка из натурального льна с нежной текстурой. добавляет уют и тепло в любое пространство.',
    dimensions: '50 × 50 см',
    weight: '0.5 кг',
    material: 'лён',
    color: 'terracotta',
    colorDots: ['#8E392B', '#E8DDD0', '#4A6741']
  },
  {
    id: '5',
    name: 'деревянный столик',
    sku: 'ZN05061',
    price: 280,
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800',
    category: 'мебель',
    description: 'журнальный столик из массива дуба с лаконичным силуэтом. природная красота дерева в каждой детали.',
    dimensions: '90 × 50 × 40 см',
    weight: '12.5 кг',
    material: 'массив дуба',
    color: 'mustard',
    colorDots: ['#D18D3D', '#2D2D2D']
  },
  {
    id: '6',
    name: 'ароматическая свеча',
    sku: 'ZN06014',
    price: 35,
    image: 'https://images.unsplash.com/photo-1602607544604-e41efb538828?auto=format&fit=crop&q=80&w=800',
    category: 'декор',
    description: 'свеча из натурального соевого воска с ароматом сандала и кедра. время горения — до 50 часов.',
    dimensions: '8 × 8 × 10 см',
    weight: '0.3 кг',
    material: 'соевый воск, хлопковый фитиль',
    color: 'primary',
    colorDots: ['#2D2D2D', '#E8DDD0', '#8E392B']
  }
];
