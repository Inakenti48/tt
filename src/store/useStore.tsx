import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, products as defaultProducts, categories as defaultCategories } from '../data/products';

/* ─── Types ─── */
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
  timestamp: number;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  items: CartItem[];
  total: number;
  chat: ChatMessage[];
  createdAt: string;
  createdTimestamp: number;
}

export interface AdminCredentials {
  name: string;
  password: string;
}

export interface UserRole {
  id: string;
  name: string;
  password: string;
  role: 'admin' | 'manager' | 'viewer';
  sections: string[];
  createdAt: string;
}

export interface FavoriteItem {
  productId: string;
  addedAt: number;
  userId?: string;
}

export interface AnalyticsEvent {
  type: 'visit' | 'cart_add' | 'cart_checkout' | 'chat_open' | 'favorite_add' | 'favorite_remove';
  timestamp: number;
  productId?: string;
  userId?: string;
  data?: Record<string, any>;
}

export interface RecommendationCategory {
  id: string;
  name: string;
  productIds: string[];
}

export interface ProductColorEntry {
  hex: string;
  name: string;
  image: string;
  photos: string[];
}

/* ─── DB helpers (localStorage "SQL") ─── */
const DB_KEYS = {
  admin: 'rooomebel_admin',
  users: 'rooomebel_users',
  analytics: 'rooomebel_analytics',
  favorites: 'rooomebel_favorites',
  orders: 'rooomebel_orders',
  products: 'rooomebel_products',
  notifications: 'rooomebel_notifications',
  recommendations: 'rooomebel_recommendations',
  categories: 'rooomebel_categories',
} as const;

function dbGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function dbSet(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ─── All admin sections ─── */
export const ALL_SECTIONS = ['dashboard', 'orders', 'products', 'recommendations', 'users', 'settings'] as const;
export type SectionName = typeof ALL_SECTIONS[number];

/* ─── Context type ─── */
interface StoreContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, colorIndex?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;

  // Orders
  orders: Order[];
  placeOrder: (name: string, phone: string) => string;
  placeCustomOrder: (name: string, phone: string, width: string, height: string, depth: string, description: string) => string;
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  sendMessage: (orderId: string, from: 'client' | 'admin', text: string) => void;

  // Products
  allProducts: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;

  // Admin auth
  adminCredentials: AdminCredentials | null;
  registerAdmin: (name: string, password: string) => void;
  loginAdmin: (name: string, password: string) => boolean;
  updateAdminCredentials: (name: string, password: string) => void;

  // User roles
  users: UserRole[];
  addUser: (user: Omit<UserRole, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<UserRole>) => void;
  removeUser: (id: string) => void;

  // Favorites
  favorites: FavoriteItem[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Analytics
  analytics: AnalyticsEvent[];
  trackEvent: (event: Omit<AnalyticsEvent, 'timestamp'>) => void;
  getStats: (period: 'today' | 'week' | 'month' | 'custom', customRange?: { from: number; to: number }) => {
    visits: number;
    cartAdds: number;
    checkouts: number;
    chatOpens: number;
    favoriteAdds: number;
    favoriteTotalValue: number;
    topFavorited: { product: Product; count: number }[];
    topCarted: { product: Product; count: number }[];
  };

  // Notifications
  notifications: { id: string; text: string; time: string; read: boolean; orderId?: string }[];
  addNotification: (text: string, orderId?: string) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;

  // Recommendations
  recommendations: RecommendationCategory[];
  addRecommendation: (name: string, productIds: string[]) => void;
  updateRecommendation: (id: string, updates: Partial<RecommendationCategory>) => void;
  removeRecommendation: (id: string) => void;

  // Categories
  customCategories: string[];
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  allCategories: string[];
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(() => dbGet(DB_KEYS.orders, []));
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    const saved = dbGet<Product[] | null>(DB_KEYS.products, null);
    return saved && saved.length > 0 ? saved : defaultProducts;
  });
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials | null>(() =>
    dbGet(DB_KEYS.admin, null)
  );
  const [users, setUsers] = useState<UserRole[]>(() => dbGet(DB_KEYS.users, []));
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => dbGet(DB_KEYS.favorites, []));
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>(() => dbGet(DB_KEYS.analytics, []));
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; read: boolean; orderId?: string }[]>(
    () => dbGet(DB_KEYS.notifications, [])
  );
  const [recommendations, setRecommendations] = useState<RecommendationCategory[]>(
    () => dbGet(DB_KEYS.recommendations, [])
  );
  const [customCategories, setCustomCategories] = useState<string[]>(
    () => dbGet(DB_KEYS.categories, [])
  );

  // Persist to localStorage
  useEffect(() => { dbSet(DB_KEYS.orders, orders); }, [orders]);
  useEffect(() => { dbSet(DB_KEYS.products, allProducts); }, [allProducts]);
  useEffect(() => { dbSet(DB_KEYS.users, users); }, [users]);
  useEffect(() => { dbSet(DB_KEYS.favorites, favorites); }, [favorites]);
  useEffect(() => { dbSet(DB_KEYS.analytics, analytics); }, [analytics]);
  useEffect(() => { dbSet(DB_KEYS.notifications, notifications); }, [notifications]);
  useEffect(() => { dbSet(DB_KEYS.recommendations, recommendations); }, [recommendations]);
  useEffect(() => { dbSet(DB_KEYS.categories, customCategories); }, [customCategories]);

  // Track initial visit
  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('rooomebel_last_visit');
    if (lastVisit !== today) {
      localStorage.setItem('rooomebel_last_visit', today);
    }
    setAnalytics(prev => [...prev, { type: 'visit', timestamp: Date.now() }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackEvent = useCallback((event: Omit<AnalyticsEvent, 'timestamp'>) => {
    const entry: AnalyticsEvent = { ...event, timestamp: Date.now() };
    setAnalytics(prev => [...prev, entry]);
  }, []);

  // Cart
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
    trackEvent({ type: 'cart_add', productId: product.id });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Orders
  const placeOrder = (name: string, phone: string): string => {
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id, name, phone,
      items: [...cart],
      total,
      chat: [{
        id: '1', from: 'client',
        text: `Здравствуйте! Меня зовут ${name}. Хочу оформить заказ на сумму ${total} ₽. Мой телефон: ${phone}`,
        time: timeStr, timestamp: Date.now(),
      }],
      createdAt: now.toLocaleDateString('ru-RU'),
      createdTimestamp: Date.now(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(id);
    clearCart();
    setCartOpen(false);
    trackEvent({ type: 'cart_checkout', data: { total, itemCount: cart.length } });
    addNotification(`Новый заказ от ${name} на ${total} ₽`, id);
    return id;
  };

  const placeCustomOrder = (name: string, phone: string, width: string, height: string, depth: string, description: string): string => {
    const id = `IND-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const dims = `${width} × ${depth} × ${height} см`;

    const newOrder: Order = {
      id, name, phone, items: [], total: 0,
      chat: [
        { id: '1', from: 'client', text: `Индивидуальный заказ\n\nИмя: ${name}\nТелефон: ${phone}\nРазмеры: ${dims}\n${description ? `Описание: ${description}` : ''}`, time: timeStr, timestamp: Date.now() },
        { id: '2', from: 'admin', text: `Здравствуйте, ${name}! Мы получили ваш индивидуальный заказ с размерами ${dims}. Скоро свяжемся с вами для уточнения деталей!`, time: timeStr, timestamp: Date.now() },
      ],
      createdAt: now.toLocaleDateString('ru-RU'),
      createdTimestamp: Date.now(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(id);
    addNotification(`Индивидуальный заказ от ${name}`, id);
    return id;
  };

  const sendMessage = (orderId: string, from: 'client' | 'admin', text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const msg: ChatMessage = {
      id: Date.now().toString(), from, text, time: timeStr, timestamp: Date.now(),
    };
    setOrders((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, chat: [...o.chat, msg] } : o)
    );
    if (from === 'client') {
      addNotification(`Новое сообщение от клиента в заказе ${orderId}`, orderId);
      trackEvent({ type: 'chat_open', data: { orderId } });
    }
    if (from === 'admin') {
      addNotification(`Админ ответил в заказе ${orderId}`, orderId);
    }
  };

  // Products
  const addProduct = (product: Product) => setAllProducts((prev) => [product, ...prev]);
  const removeProduct = (productId: string) => setAllProducts((prev) => prev.filter((p) => p.id !== productId));
  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setAllProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...updates } : p)));
  };

  // Admin auth
  const registerAdmin = (name: string, password: string) => {
    const creds = { name, password };
    setAdminCredentials(creds);
    dbSet(DB_KEYS.admin, creds);
  };

  const loginAdmin = (name: string, password: string): boolean => {
    if (name === 'admin' && password === 'admin') return true;
    if (adminCredentials && adminCredentials.name === name && adminCredentials.password === password) return true;
    // Check user roles
    const user = users.find(u => u.name === name && u.password === password);
    if (user) return true;
    return false;
  };

  const updateAdminCredentials = (name: string, password: string) => {
    const creds = { name, password };
    setAdminCredentials(creds);
    dbSet(DB_KEYS.admin, creds);
  };

  // User roles
  const addUser = (userData: Omit<UserRole, 'id' | 'createdAt'>) => {
    const user: UserRole = {
      ...userData,
      id: `USR-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toLocaleDateString('ru-RU'),
    };
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (id: string, updates: Partial<UserRole>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.productId === productId);
      if (exists) {
        trackEvent({ type: 'favorite_remove', productId });
        return prev.filter(f => f.productId !== productId);
      }
      trackEvent({ type: 'favorite_add', productId });
      return [...prev, { productId, addedAt: Date.now() }];
    });
  };

  const isFavoriteCheck = (productId: string) => favorites.some(f => f.productId === productId);

  // Analytics
  const getStats = useCallback((
    period: 'today' | 'week' | 'month' | 'custom',
    customRange?: { from: number; to: number }
  ) => {
    const now = Date.now();
    let from: number;
    let to = now;

    if (period === 'custom' && customRange) {
      from = customRange.from;
      to = customRange.to;
    } else {
      const d = new Date();
      switch (period) {
        case 'today':
          d.setHours(0, 0, 0, 0);
          from = d.getTime();
          break;
        case 'week':
          d.setDate(d.getDate() - 7);
          d.setHours(0, 0, 0, 0);
          from = d.getTime();
          break;
        case 'month':
          d.setMonth(d.getMonth() - 1);
          d.setHours(0, 0, 0, 0);
          from = d.getTime();
          break;
        default:
          from = 0;
      }
    }

    const filtered = analytics.filter(e => e.timestamp >= from && e.timestamp <= to);

    const visits = filtered.filter(e => e.type === 'visit').length;
    const cartAdds = filtered.filter(e => e.type === 'cart_add').length;
    const checkouts = filtered.filter(e => e.type === 'cart_checkout').length;
    const chatOpens = filtered.filter(e => e.type === 'chat_open').length;
    const favoriteAdds = filtered.filter(e => e.type === 'favorite_add').length;

    // Favorite totals
    const favoriteTotalValue = favorites.reduce((sum, f) => {
      const p = allProducts.find(pr => pr.id === f.productId);
      return sum + (p?.price || 0);
    }, 0);

    // Top favorited products
    const favCounts: Record<string, number> = {};
    filtered.filter(e => e.type === 'favorite_add').forEach(e => {
      if (e.productId) favCounts[e.productId] = (favCounts[e.productId] || 0) + 1;
    });
    const topFavorited = Object.entries(favCounts)
      .map(([pid, count]) => ({ product: allProducts.find(p => p.id === pid)!, count }))
      .filter(x => x.product)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top carted products
    const cartCounts: Record<string, number> = {};
    filtered.filter(e => e.type === 'cart_add').forEach(e => {
      if (e.productId) cartCounts[e.productId] = (cartCounts[e.productId] || 0) + 1;
    });
    const topCarted = Object.entries(cartCounts)
      .map(([pid, count]) => ({ product: allProducts.find(p => p.id === pid)!, count }))
      .filter(x => x.product)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { visits, cartAdds, checkouts, chatOpens, favoriteAdds, favoriteTotalValue, topFavorited, topCarted };
  }, [analytics, favorites, allProducts]);

  // Notifications
  const addNotification = useCallback((text: string, orderId?: string) => {
    const notif = {
      id: Date.now().toString(),
      text,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      orderId,
    };
    setNotifications(prev => [notif, ...prev]);

    // Browser push notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ROOOMEBEL', { body: text, icon: '/favicon.ico' });
    }
  }, []);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Categories
  const allCategoriesList = [...new Set([...defaultCategories, ...customCategories])];

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || allCategoriesList.includes(trimmed)) return;
    setCustomCategories(prev => [...prev, trimmed]);
  };

  const removeCategory = (name: string) => {
    setCustomCategories(prev => prev.filter(c => c !== name));
  };

  // Recommendations
  const addRecommendation = (name: string, productIds: string[]) => {
    const rec: RecommendationCategory = {
      id: `REC-${Date.now().toString(36).toUpperCase()}`,
      name,
      productIds,
    };
    setRecommendations(prev => [...prev, rec]);
  };

  const updateRecommendation = (id: string, updates: Partial<RecommendationCategory>) => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const removeRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <StoreContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen,
      orders, placeOrder, placeCustomOrder, activeOrderId, setActiveOrderId, sendMessage,
      allProducts, addProduct, removeProduct, updateProduct,
      adminCredentials, registerAdmin, loginAdmin, updateAdminCredentials,
      users, addUser, updateUser, removeUser,
      favorites, toggleFavorite, isFavorite: isFavoriteCheck,
      analytics, trackEvent, getStats,
      notifications, addNotification, markNotificationRead, unreadCount,
      recommendations, addRecommendation, updateRecommendation, removeRecommendation,
      customCategories, addCategory, removeCategory, allCategories: allCategoriesList,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
