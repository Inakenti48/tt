export interface ColorVariant {
  hex: string;
  image: string;
}

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
  colorVariants: ColorVariant[];
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
    colorVariants: [
      { hex: '#8E392B', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800' },
      { hex: '#D18D3D', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800' },
      { hex: '#2D2D2D', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800' },
    ]
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
    colorVariants: [
      { hex: '#D18D3D', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800' },
      { hex: '#E8DDD0', image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800' },
      { hex: '#6B8E6B', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800' },
    ]
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
    colorVariants: [
      { hex: '#2D2D2D', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800' },
      { hex: '#E8DDD0', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800' },
    ]
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
    colorVariants: [
      { hex: '#8E392B', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800' },
      { hex: '#E8DDD0', image: 'https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?auto=format&fit=crop&q=80&w=800' },
      { hex: '#4A6741', image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800' },
    ]
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
    colorVariants: [
      { hex: '#D18D3D', image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800' },
      { hex: '#2D2D2D', image: 'https://images.unsplash.com/photo-1611967164521-abae8fba4668?auto=format&fit=crop&q=80&w=800' },
    ]
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
    colorVariants: [
      { hex: '#2D2D2D', image: 'https://images.unsplash.com/photo-1602607544604-e41efb538828?auto=format&fit=crop&q=80&w=800' },
      { hex: '#E8DDD0', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800' },
      { hex: '#8E392B', image: 'https://images.unsplash.com/photo-1608181831718-2501a34781b3?auto=format&fit=crop&q=80&w=800' },
    ]
  }
];
