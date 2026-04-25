import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, products as defaultProducts } from '../data/products';

export interface CartItem {
  product: Product;
  qty: number;
  colorIndex: number;
}

export interface ChatMessage {
  id: string;
  from: 'client' | 'admin';
  text: string;
  time: string;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  items: CartItem[];
  total: number;
  chat: ChatMessage[];
  createdAt: string;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, colorIndex?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  orders: Order[];
  placeOrder: (name: string, phone: string) => string;
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  sendMessage: (orderId: string, from: 'client' | 'admin', text: string) => void;
  allProducts: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>(defaultProducts);

  const addToCart = (product: Product, colorIndex = 0) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1, colorIndex }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (name: string, phone: string): string => {
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id,
      name,
      phone,
      items: [...cart],
      total,
      chat: [
        {
          id: '1',
          from: 'client',
          text: `Здравствуйте! Меня зовут ${name}. Хочу оформить заказ на сумму ${total} ₽. Мой телефон: ${phone}`,
          time: timeStr,
        },
      ],
      createdAt: now.toLocaleDateString('ru-RU'),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(id);
    clearCart();
    setCartOpen(false);
    return id;
  };

  const addProduct = (product: Product) => {
    setAllProducts((prev) => [product, ...prev]);
  };

  const removeProduct = (productId: string) => {
    setAllProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setAllProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  const sendMessage = (orderId: string, from: 'client' | 'admin', text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const msg: ChatMessage = {
      id: Date.now().toString(),
      from,
      text,
      time: timeStr,
    };
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, chat: [...o.chat, msg] } : o
      )
    );
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartOpen,
        setCartOpen,
        orders,
        placeOrder,
        activeOrderId,
        setActiveOrderId,
        sendMessage,
        allProducts,
        addProduct,
        removeProduct,
        updateProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
