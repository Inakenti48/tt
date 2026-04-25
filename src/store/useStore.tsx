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

export interface AdminCredentials {
  name: string;
  password: string;
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
  adminCredentials: AdminCredentials | null;
  registerAdmin: (name: string, password: string) => void;
  loginAdmin: (name: string, password: string) => boolean;
  updateAdminCredentials: (name: string, password: string) => void;
  placeCustomOrder: (name: string, phone: string, width: string, height: string, depth: string, description: string) => string;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>(defaultProducts);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials | null>(() => {
    try {
      const saved = localStorage.getItem('rooomebel_admin');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

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

  const registerAdmin = (name: string, password: string) => {
    const creds = { name, password };
    setAdminCredentials(creds);
    localStorage.setItem('rooomebel_admin', JSON.stringify(creds));
  };

  const loginAdmin = (name: string, password: string): boolean => {
    // Default admin/admin always works
    if (name === 'admin' && password === 'admin') return true;
    if (!adminCredentials) return false;
    return adminCredentials.name === name && adminCredentials.password === password;
  };

  const updateAdminCredentials = (name: string, password: string) => {
    const creds = { name, password };
    setAdminCredentials(creds);
    localStorage.setItem('rooomebel_admin', JSON.stringify(creds));
  };

  const placeCustomOrder = (name: string, phone: string, width: string, height: string, depth: string, description: string): string => {
    const id = `IND-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const dims = `${width} × ${depth} × ${height} см`;

    const newOrder: Order = {
      id,
      name,
      phone,
      items: [],
      total: 0,
      chat: [
        {
          id: '1',
          from: 'client',
          text: `🛠 Индивидуальный заказ\n\nИмя: ${name}\nТелефон: ${phone}\nРазмеры: ${dims}\n${description ? `Описание: ${description}` : ''}`,
          time: timeStr,
        },
        {
          id: '2',
          from: 'admin',
          text: `Здравствуйте, ${name}! Мы получили ваш индивидуальный заказ с размерами ${dims}. Скоро свяжемся с вами для уточнения деталей!`,
          time: timeStr,
        },
      ],
      createdAt: now.toLocaleDateString('ru-RU'),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(id);
    return id;
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
        adminCredentials,
        registerAdmin,
        loginAdmin,
        updateAdminCredentials,
        placeCustomOrder,
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
