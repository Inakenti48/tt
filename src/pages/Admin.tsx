import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package, CheckCircle, Bell, MessageCircle, Send, ArrowLeft, Plus, Trash2,
  Edit3, X, Save, Copy, Check, KeyRound, UserPlus, LogIn, Settings, Upload,
  Pipette, BarChart3, Users, ShoppingCart, Heart, Eye, Calendar,
  Shield, ChevronDown, ChevronUp, TrendingUp, Star, AlertCircle
} from 'lucide-react';
import { useStore, Order, UserRole, ALL_SECTIONS, SectionName } from '../store/useStore';
import { Product } from '../data/products';
import { categories as allCategories } from '../data/products';
import { cn } from '../utils/cn';

/* ═══════════════════════════════════════════════════
   AdminChat — order-specific chat
   ═══════════════════════════════════════════════════ */
function AdminChat({ order, onBack }: { order: Order; onBack: () => void }) {
  const { sendMessage } = useStore();
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [order.chat.length]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(order.id, 'admin', text.trim());
    setText('');
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="bg-surface/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="font-bold">{order.name}</h3>
          <p className="text-xs opacity-40">{order.phone} — {order.total} ₽</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4 scrollbar-hide">
        {order.chat.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3",
              msg.from === 'admin'
                ? "ml-auto bg-primary text-primary-inv rounded-br-md"
                : "mr-auto bg-surface shadow-sm rounded-bl-md"
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            <p className={cn(
              "text-[10px] mt-1",
              msg.from === 'admin' ? "text-primary-inv/50 text-right" : "text-primary/30"
            )}>
              {msg.time}
            </p>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 pt-4 border-t border-primary/5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ответить клиенту..."
          className="flex-1 bg-surface rounded-full px-5 py-3 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            text.trim()
              ? "bg-primary text-primary-inv hover:scale-105 active:scale-95"
              : "bg-primary/10 text-primary/30"
          )}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ProductForm — Add / Edit Product (up to 35 photos, color picker + eyedropper + color name)
   ═══════════════════════════════════════════════════ */
function ProductForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Product;
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const cats = allCategories.filter((c) => c !== 'Все');
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(initial?.price?.toString() || '');
  const [category, setCategory] = useState(initial?.category || cats[0]);
  const [description, setDescription] = useState(initial?.description || '');
  const [images, setImages] = useState<string[]>(() => {
    if (!initial) return [];
    const imgs = [initial.image, ...initial.colorVariants.map(v => v.image)];
    return [...new Set(imgs)];
  });
  const [dimWidth, setDimWidth] = useState(() => {
    if (!initial?.dimensions) return '';
    const parts = initial.dimensions.split('×').map(s => s.trim().replace(/[^\d.]/g, ''));
    return parts[0] || '';
  });
  const [dimHeight, setDimHeight] = useState(() => {
    if (!initial?.dimensions) return '';
    const parts = initial.dimensions.split('×').map(s => s.trim().replace(/[^\d.]/g, ''));
    return parts[2] || '';
  });
  const [dimDepth, setDimDepth] = useState(() => {
    if (!initial?.dimensions) return '';
    const parts = initial.dimensions.split('×').map(s => s.trim().replace(/[^\d.]/g, ''));
    return parts[1] || '';
  });
  const [weight, setWeight] = useState(initial?.weight || '');
  const [material, setMaterial] = useState(initial?.material || '');
  const [colors, setColors] = useState<{ hex: string; name: string; photos: string[] }[]>(() => {
    if (!initial) return [{ hex: '#FFFFFF', name: '', photos: [] }];
    return initial.colorVariants.map(v => ({
      hex: v.hex,
      name: (v as any).name || '',
      photos: (v as any).photos || [v.image],
    }));
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => {
          if (prev.length >= 35) return prev;
          return [...prev, reader.result as string];
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleColorPhotoUpload = (colorIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setColors(prev => prev.map((c, i) => {
          if (i !== colorIdx) return c;
          if (c.photos.length >= 35) return c;
          return { ...c, photos: [...c.photos, reader.result as string] };
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const removeColorPhoto = (colorIdx: number, photoIdx: number) => {
    setColors(prev => prev.map((c, i) => {
      if (i !== colorIdx) return c;
      return { ...c, photos: c.photos.filter((_, pi) => pi !== photoIdx) };
    }));
  };

  const addColor = () => setColors((prev) => [...prev, { hex: '#000000', name: '', photos: [] }]);
  const removeColor = (idx: number) => setColors((prev) => prev.filter((_, i) => i !== idx));
  const updateColorHex = (idx: number, hex: string) => {
    setColors((prev) => prev.map((c, i) => (i === idx ? { ...c, hex } : c)));
  };
  const updateColorName = (idx: number, name: string) => {
    setColors((prev) => prev.map((c, i) => (i === idx ? { ...c, name } : c)));
  };

  const handleEyedropper = async (idx: number) => {
    try {
      if ('EyeDropper' in window) {
        const dropper = new (window as any).EyeDropper();
        const result = await dropper.open();
        updateColorHex(idx, result.sRGBHex);
      }
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim() || (images.length === 0 && colors.every(c => c.photos.length === 0))) return;

    const dims = (dimWidth || dimHeight || dimDepth)
      ? `${dimWidth || '0'} × ${dimDepth || '0'} × ${dimHeight || '0'} см`
      : undefined;

    const mainImage = images[0] || colors[0]?.photos[0] || '';
    const product: Product = {
      id: initial?.id || `P-${Date.now().toString(36).toUpperCase()}`,
      name: name.trim(),
      sku: initial?.sku || `RM${String(Math.floor(Math.random() * 90000) + 10000)}`,
      price: Number(price),
      image: mainImage,
      category,
      description: description.trim(),
      dimensions: dims,
      weight: weight.trim() || undefined,
      material: material.trim() || undefined,
      colorVariants: colors.map((c, i) => ({
        hex: c.hex,
        name: c.name,
        image: c.photos[0] || images[i] || mainImage,
        photos: c.photos.length > 0 ? c.photos : (images[i] ? [images[i]] : [mainImage]),
      })),
    };
    onSave(product);
  };

  const fieldClass = 'w-full bg-surface rounded-2xl px-5 py-3 border border-primary/10 shadow-sm focus:ring-2 focus:ring-primary outline-none text-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">{initial ? 'Редактировать товар' : 'Новый товар'}</h3>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-primary/5 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold opacity-50 mb-1 block">Название *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Тумба Oslo" className={fieldClass} required />
        </div>
        <div>
          <label className="text-xs font-bold opacity-50 mb-1 block">Цена (₽) *</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="12900" className={fieldClass} required />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold opacity-50 mb-1 block">Категория</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass}>
          {cats.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>

      {/* General photos (up to 35) */}
      <div>
        <label className="text-xs font-bold opacity-50 mb-1 block">Общие фото товара (до 35 шт.)</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {images.map((img, i) => (
            <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-primary/10 shadow-sm group">
              <img src={img} alt="" className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute top-0.5 left-0.5 bg-primary text-primary-inv text-[7px] px-1 py-0.5 rounded-full">Главное</span>}
              <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={8} />
              </button>
            </div>
          ))}
          {images.length < 35 && (
            <label className="w-16 h-16 rounded-xl border-2 border-dashed border-primary/15 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all">
              <Upload size={14} className="opacity-30" />
              <span className="text-[8px] opacity-30 mt-0.5">{images.length}/35</span>
              <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
            </label>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold opacity-50 mb-1 block">Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание товара..." rows={3} className={fieldClass + ' resize-none'} />
      </div>

      <div>
        <label className="text-xs font-bold opacity-50 mb-2 block">Размеры (см)</label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <span className="text-[10px] opacity-30 block mb-1 text-center">Ширина</span>
            <input type="number" value={dimWidth} onChange={(e) => setDimWidth(e.target.value)} placeholder="50" className={fieldClass + ' text-center'} />
          </div>
          <div>
            <span className="text-[10px] opacity-30 block mb-1 text-center">Глубина</span>
            <input type="number" value={dimDepth} onChange={(e) => setDimDepth(e.target.value)} placeholder="40" className={fieldClass + ' text-center'} />
          </div>
          <div>
            <span className="text-[10px] opacity-30 block mb-1 text-center">Высота</span>
            <input type="number" value={dimHeight} onChange={(e) => setDimHeight(e.target.value)} placeholder="55" className={fieldClass + ' text-center'} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold opacity-50 mb-1 block">Вес</label>
          <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="12 кг" className={fieldClass} />
        </div>
        <div>
          <label className="text-xs font-bold opacity-50 mb-1 block">Материал</label>
          <input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Дуб, МДФ" className={fieldClass} />
        </div>
      </div>

      {/* Colors with picker + eyedropper + name + per-color photos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold opacity-50">Цвета (с пипеткой и названием)</label>
          <button type="button" onClick={addColor} className="text-xs opacity-40 hover:opacity-100 flex items-center gap-1 transition-opacity">
            <Plus size={12} /> Добавить цвет
          </button>
        </div>
        <div className="space-y-3">
          {colors.map((c, i) => (
            <div key={i} className="bg-background rounded-2xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={c.hex}
                  onChange={(e) => updateColorHex(i, e.target.value)}
                  className="w-8 h-8 rounded-full border-0 cursor-pointer bg-transparent [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-2 [&::-webkit-color-swatch]:border-primary/10"
                />
                <button type="button" onClick={() => handleEyedropper(i)} className="p-1.5 rounded-full hover:bg-primary/10 transition-colors" title="Пипетка">
                  <Pipette size={14} className="opacity-50" />
                </button>
                <span className="text-[10px] opacity-40 font-mono w-16">{c.hex}</span>
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => updateColorName(i, e.target.value)}
                  placeholder="Название цвета (напр. Дуб натуральный)"
                  className="flex-1 bg-surface rounded-xl px-3 py-1.5 border border-primary/5 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
                {colors.length > 1 && (
                  <button type="button" onClick={() => removeColor(i)} className="p-1 rounded-full hover:bg-red-50 transition-colors">
                    <X size={12} className="opacity-30" />
                  </button>
                )}
              </div>
              {/* Per-color photos */}
              <div className="flex gap-1.5 flex-wrap">
                {c.photos.map((photo, pi) => (
                  <div key={pi} className="relative w-12 h-12 rounded-lg overflow-hidden border border-primary/10 group">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeColorPhoto(i, pi)} className="absolute top-0 right-0 bg-black/50 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={7} />
                    </button>
                  </div>
                ))}
                {c.photos.length < 35 && (
                  <label className="w-12 h-12 rounded-lg border border-dashed border-primary/15 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <Upload size={10} className="opacity-30" />
                    <span className="text-[7px] opacity-30">{c.photos.length}/35</span>
                    <input type="file" accept="image/*" multiple onChange={(e) => handleColorPhotoUpload(i, e)} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-primary-inv rounded-full py-4 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        <Save size={18} />
        {initial ? 'Сохранить изменения' : 'Добавить товар'}
      </button>
    </form>
  );
}

/* ═══════════════════════════════════════════════════
   Dashboard — Analytics view
   ═══════════════════════════════════════════════════ */
function Dashboard() {
  const { getStats, orders, favorites, allProducts, analytics } = useStore();
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const customRange = (period === 'custom' && customFrom && customTo)
    ? { from: new Date(customFrom).getTime(), to: new Date(customTo + 'T23:59:59').getTime() }
    : undefined;

  const stats = getStats(period, customRange);

  const statCards = [
    { label: 'Посетители', value: stats.visits, icon: Eye, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Добавили в корзину', value: stats.cartAdds, icon: ShoppingCart, color: 'bg-amber-500/10 text-amber-600' },
    { label: 'Оформили заказ', value: stats.checkouts, icon: CheckCircle, color: 'bg-green-500/10 text-green-600' },
    { label: 'Открыли чат', value: stats.chatOpens, icon: MessageCircle, color: 'bg-purple-500/10 text-purple-600' },
    { label: 'Добавили в избранное', value: stats.favoriteAdds, icon: Heart, color: 'bg-red-500/10 text-red-600' },
    { label: 'Сумма избранного', value: `${stats.favoriteTotalValue.toLocaleString('ru-RU')} ₽`, icon: TrendingUp, color: 'bg-teal-500/10 text-teal-600' },
  ];

  // Count cart-abandoned (added to cart but didn't checkout)
  const cartAbandoned = stats.cartAdds - stats.checkouts;

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex flex-wrap gap-2 mb-2">
        {([
          { key: 'today' as const, label: 'Сегодня' },
          { key: 'week' as const, label: 'Неделя' },
          { key: 'month' as const, label: 'Месяц' },
          { key: 'custom' as const, label: 'Период' },
        ]).map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold transition-all",
              period === p.key ? "bg-primary text-primary-inv shadow-md" : "bg-surface border border-primary/10 hover:bg-primary/5"
            )}
          >
            {p.key === 'custom' && <Calendar size={12} className="inline mr-1" />}
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom date range */}
      {period === 'custom' && (
        <div className="flex gap-3 items-center bg-surface rounded-2xl p-3 shadow-sm">
          <div className="flex-1">
            <label className="text-[10px] opacity-40 block mb-1">От</label>
            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="w-full bg-background rounded-xl px-3 py-2 text-xs border border-primary/5 outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] opacity-40 block mb-1">До</label>
            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="w-full bg-background rounded-xl px-3 py-2 text-xs border border-primary/5 outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {statCards.map(s => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-2xl p-4 shadow-sm"
          >
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-2", s.color)}>
              <s.icon size={18} />
            </div>
            <p className="text-xl font-bold">{typeof s.value === 'number' ? s.value : s.value}</p>
            <p className="text-[10px] opacity-40 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Cart abandoned */}
      {cartAbandoned > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200/50">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={16} className="text-amber-600" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Брошенные корзины</span>
          </div>
          <p className="text-xs opacity-60">{cartAbandoned} человек добавили товары в корзину, но не оформили заказ</p>
        </div>
      )}

      {/* Current favorites summary */}
      <div className="bg-surface rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
          <Heart size={16} className="text-red-400" /> Избранное пользователей
        </h4>
        {favorites.length === 0 ? (
          <p className="text-xs opacity-40">Пока никто не добавил товары в избранное</p>
        ) : (
          <div className="space-y-2">
            {favorites.map(f => {
              const p = allProducts.find(pr => pr.id === f.productId);
              if (!p) return null;
              return (
                <div key={f.productId} className="flex items-center gap-3 bg-background rounded-xl p-2">
                  <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{p.name}</p>
                    <p className="text-[10px] opacity-40">{p.price.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                </div>
              );
            })}
            <div className="pt-2 border-t border-primary/5 flex justify-between text-sm">
              <span className="opacity-50">Общая сумма избранного</span>
              <span className="font-bold">{stats.favoriteTotalValue.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        )}
      </div>

      {/* Top carted products */}
      {stats.topCarted.length > 0 && (
        <div className="bg-surface rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
            <ShoppingCart size={16} className="text-amber-500" /> Популярные в корзине
          </h4>
          <div className="space-y-2">
            {stats.topCarted.map(({ product, count }) => (
              <div key={product.id} className="flex items-center gap-3 bg-background rounded-xl p-2">
                <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{product.name}</p>
                  <p className="text-[10px] opacity-40">{product.price.toLocaleString('ru-RU')} ₽</p>
                </div>
                <span className="text-xs font-bold bg-primary/5 px-2 py-1 rounded-full">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-surface rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold">{orders.length}</p>
          <p className="text-[10px] opacity-40">Всего заказов</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold">{allProducts.length}</p>
          <p className="text-[10px] opacity-40">Товаров</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold">{orders.reduce((s, o) => s + o.total, 0).toLocaleString('ru-RU')} ₽</p>
          <p className="text-[10px] opacity-40">Общая выручка</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   UserManager — Role management
   ═══════════════════════════════════════════════════ */
function UserManager() {
  const { users, addUser, updateUser, removeUser } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'viewer'>('viewer');
  const [sections, setSections] = useState<string[]>([...ALL_SECTIONS]);

  const sectionLabels: Record<string, string> = {
    dashboard: 'Дашборд',
    orders: 'Заказы',
    products: 'Товары',
    users: 'Пользователи',
    settings: 'Настройки',
  };

  const resetForm = () => {
    setName(''); setPassword(''); setRole('viewer'); setSections([...ALL_SECTIONS]);
    setShowForm(false); setEditingUser(null);
  };

  const handleEdit = (u: UserRole) => {
    setEditingUser(u);
    setName(u.name);
    setPassword(u.password);
    setRole(u.role);
    setSections(u.sections);
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;
    if (password.length < 4) return;

    const finalSections = role === 'admin' ? [...ALL_SECTIONS] : sections;

    if (editingUser) {
      updateUser(editingUser.id, { name: name.trim(), password: password.trim(), role, sections: finalSections });
    } else {
      addUser({ name: name.trim(), password: password.trim(), role, sections: finalSections });
    }
    resetForm();
  };

  const toggleSection = (s: string) => {
    setSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  return (
    <div className="space-y-4">
      {/* Add user button or form */}
      {showForm ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-3xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <UserPlus size={18} className="opacity-40" />
              {editingUser ? 'Редактировать пользователя' : 'Новый пользователь'}
            </h3>
            <button onClick={resetForm} className="p-2 hover:bg-primary/5 rounded-full"><X size={18} /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold opacity-50 mb-1 block">Имя *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Имя пользователя" className="w-full bg-background rounded-2xl px-5 py-3 border border-primary/5 outline-none text-sm focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="text-xs font-bold opacity-50 mb-1 block">Пароль *</label>
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Минимум 4 символа" className="w-full bg-background rounded-2xl px-5 py-3 border border-primary/5 outline-none text-sm focus:ring-2 focus:ring-primary" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold opacity-50 mb-2 block">Роль</label>
              <div className="flex gap-2">
                {([
                  { key: 'admin' as const, label: 'Админ', icon: Shield },
                  { key: 'manager' as const, label: 'Менеджер', icon: Users },
                  { key: 'viewer' as const, label: 'Наблюдатель', icon: Eye },
                ]).map(r => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      setRole(r.key);
                      if (r.key === 'admin') setSections([...ALL_SECTIONS]);
                    }}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border",
                      role === r.key ? "bg-primary text-primary-inv border-primary" : "bg-background border-primary/10 hover:bg-primary/5"
                    )}
                  >
                    <r.icon size={14} /> {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section access */}
            {role !== 'admin' && (
              <div>
                <label className="text-xs font-bold opacity-50 mb-2 block">Доступные разделы</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SECTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSection(s)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                        sections.includes(s)
                          ? "bg-primary text-primary-inv border-primary"
                          : "bg-background border-primary/10 opacity-50 hover:opacity-100"
                      )}
                    >
                      {sectionLabels[s] || s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-primary text-primary-inv rounded-full py-3.5 font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform">
              {editingUser ? 'Сохранить' : 'Создать пользователя'}
            </button>
          </form>
        </motion.div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-surface rounded-3xl shadow-sm p-5 flex items-center justify-center gap-3 border-2 border-dashed border-primary/15 hover:border-primary/30 hover:bg-primary/5 transition-all group"
        >
          <div className="bg-primary/10 rounded-full p-2 group-hover:bg-primary group-hover:text-primary-inv transition-all">
            <UserPlus size={20} />
          </div>
          <span className="font-bold opacity-60 group-hover:opacity-100 transition-opacity">Добавить пользователя</span>
        </button>
      )}

      {/* User list */}
      {users.length === 0 ? (
        <div className="bg-surface rounded-3xl shadow-sm p-12 text-center">
          <Users size={40} className="mx-auto opacity-15 mb-4" />
          <p className="opacity-40">Пользователей пока нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(u => (
            <motion.div key={u.id} layout className="bg-surface rounded-2xl shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  u.role === 'admin' ? 'bg-red-500/10 text-red-500' : u.role === 'manager' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'
                )}>
                  {u.role === 'admin' ? <Shield size={18} /> : u.role === 'manager' ? <Users size={18} /> : <Eye size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm">{u.name}</h4>
                  <p className="text-[10px] opacity-40">
                    {u.role === 'admin' ? 'Администратор' : u.role === 'manager' ? 'Менеджер' : 'Наблюдатель'} · {u.createdAt}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {u.sections.map(s => (
                      <span key={s} className="text-[9px] bg-primary/5 px-1.5 py-0.5 rounded-full opacity-60">
                        {sectionLabels[s] || s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(u)} className="p-2 rounded-full hover:bg-primary/5 transition-colors">
                    <Edit3 size={14} className="opacity-40" />
                  </button>
                  <button onClick={() => removeUser(u.id)} className="p-2 rounded-full hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="opacity-40" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Main Admin Component
   ═══════════════════════════════════════════════════ */
export function Admin() {
  const navigate = useNavigate();
  const {
    orders, allProducts, addProduct, removeProduct, updateProduct,
    adminCredentials, registerAdmin, loginAdmin, updateAdminCredentials,
    notifications, markNotificationRead, unreadCount, users,
  } = useStore();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; role: 'admin' | 'manager' | 'viewer'; sections: string[] } | null>(null);
  const [nameField, setNameField] = useState('');
  const [passwordField, setPasswordField] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameField.trim() || !passwordField.trim()) { setError('Заполните все поля'); return; }
    if (passwordField.length < 4) { setError('Пароль должен быть не менее 4 символов'); return; }
    registerAdmin(nameField.trim(), passwordField.trim());
    setRegistered(true);
    setError('');
  };

  const handleCopyCredentials = () => {
    const text = `ROOOMEBEL Админ\nИмя: ${nameField.trim()}\nПароль: ${passwordField.trim()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEnterPanel = () => {
    setIsLoggedIn(true);
    setLoggedInUser({ name: nameField.trim(), role: 'admin', sections: [...ALL_SECTIONS] });
    setRegistered(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameField.trim() || !passwordField.trim()) { setError('Заполните все поля'); return; }
    if (loginAdmin(nameField.trim(), passwordField.trim())) {
      setIsLoggedIn(true);
      // Determine role
      const userRole = users.find(u => u.name === nameField.trim() && u.password === passwordField.trim());
      if (userRole) {
        setLoggedInUser({ name: userRole.name, role: userRole.role, sections: userRole.sections });
      } else {
        // Default admin
        setLoggedInUser({ name: nameField.trim(), role: 'admin', sections: [...ALL_SECTIONS] });
      }
      setError('');
    } else {
      setError('Неверное имя или пароль');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPassword.trim()) return;
    if (newPassword.length < 4) return;
    updateAdminCredentials(newName.trim(), newPassword.trim());
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const activeOrder = orders.find((o) => o.id === selectedOrder);

  const canAccess = (section: string) => {
    if (!loggedInUser) return false;
    if (loggedInUser.role === 'admin') return true;
    return loggedInUser.sections.includes(section);
  };

  /* ── Not logged in ── */
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="bg-surface/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex bg-primary/5 rounded-full p-4 mb-4">
            <KeyRound size={32} className="opacity-60" />
          </div>
          <h2 className="text-3xl font-bold">Личный кабинет</h2>
          <p className="text-sm opacity-40 mt-2">ROOOMEBEL</p>
        </div>

        {/* Registration success */}
        {registered && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-3xl shadow-sm p-6 mb-6 text-center">
            <div className="inline-flex bg-green-50 rounded-full p-3 mb-4">
              <Check size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Регистрация успешна!</h3>
            <p className="text-sm opacity-50 mb-5 leading-relaxed">
              Сохраните ваши учётные данные, чтобы вы могли зайти и пользоваться прекрасным веб-сервисом интернет-магазина ROOOMEBEL
            </p>
            <div className="bg-background rounded-2xl p-4 mb-4 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-40 uppercase tracking-wider">Ваши данные</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-50 w-16">Имя:</span>
                  <span className="text-sm font-bold">{nameField}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-50 w-16">Пароль:</span>
                  <span className="text-sm font-bold">{passwordField}</span>
                </div>
              </div>
            </div>
            <button onClick={handleCopyCredentials} className={cn(
              "w-full rounded-full py-3.5 font-bold flex items-center justify-center gap-2 transition-all mb-3",
              copied ? "bg-green-600 text-white" : "bg-surface border border-primary/15 hover:bg-primary/5"
            )}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Скопировано!' : 'Скопировать имя и пароль'}
            </button>
            <button onClick={handleEnterPanel} className="w-full bg-primary text-primary-inv rounded-full py-3.5 font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform">
              Войти в панель
            </button>
          </motion.div>
        )}

        {/* Login / Register form */}
        {!registered && (
          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            <div className="bg-surface rounded-3xl shadow-sm p-6 space-y-4">
              <div className="flex bg-background rounded-full p-1 mb-2">
                <button type="button" onClick={() => { setAuthMode('login'); setError(''); }} className={cn(
                  "flex-1 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-1.5",
                  authMode === 'login' ? "bg-primary text-primary-inv shadow-sm" : "opacity-50"
                )}>
                  <LogIn size={15} /> Вход
                </button>
                <button type="button" onClick={() => { setAuthMode('register'); setError(''); }} className={cn(
                  "flex-1 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-1.5",
                  authMode === 'register' ? "bg-primary text-primary-inv shadow-sm" : "opacity-50"
                )}>
                  <UserPlus size={15} /> Регистрация
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold opacity-50 px-1 block">Имя</label>
                <input type="text" value={nameField} onChange={(e) => { setNameField(e.target.value); setError(''); }} placeholder="Введите ваше имя" className="w-full bg-background rounded-2xl px-5 py-4 border border-primary/5 focus:ring-2 focus:ring-primary outline-none text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold opacity-50 px-1 block">Пароль</label>
                <input type="password" value={passwordField} onChange={(e) => { setPasswordField(e.target.value); setError(''); }} placeholder={authMode === 'register' ? 'Придумайте пароль' : 'Введите пароль'} className="w-full bg-background rounded-2xl px-5 py-4 border border-primary/5 focus:ring-2 focus:ring-primary outline-none text-sm" />
              </div>
              {error && <p className="text-sm text-terracotta text-center">{error}</p>}
            </div>
            <button className="w-full bg-primary text-primary-inv rounded-full py-4 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform">
              {authMode === 'login' ? <><LogIn size={18} /> Войти</> : <><UserPlus size={18} /> Зарегистрироваться</>}
            </button>
          </form>
        )}
      </div>
    );
  }

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      updateProduct(product.id, product);
      setEditingProduct(null);
    } else {
      addProduct(product);
      setShowAddForm(false);
    }
  };

  const tabs = [
    { key: 'dashboard', label: 'Дашборд', icon: BarChart3, section: 'dashboard' },
    { key: 'orders', label: 'Заказы', icon: Package, section: 'orders', count: orders.length },
    { key: 'products', label: 'Товары', icon: CheckCircle, section: 'products', count: allProducts.length },
    { key: 'users', label: 'Пользователи', icon: Users, section: 'users', count: users.length },
  ].filter(t => canAccess(t.section));

  return (
    <div className="py-8 pb-32">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="bg-surface/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Личный кабинет</h2>
          {loggedInUser && (
            <p className="text-xs opacity-40 mt-0.5">
              {loggedInUser.name} · {loggedInUser.role === 'admin' ? 'Администратор' : loggedInUser.role === 'manager' ? 'Менеджер' : 'Наблюдатель'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canAccess('settings') && (
            <button
              onClick={() => { setShowSettings(!showSettings); setActiveTab('settings'); }}
              className={cn(
                "p-2.5 rounded-full transition-all",
                activeTab === 'settings' ? "bg-primary text-primary-inv" : "bg-primary/5 hover:bg-primary/10"
              )}
            >
              <Settings size={18} />
            </button>
          )}
          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2.5 rounded-full bg-primary/5 hover:bg-primary/10 transition-all relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-72 bg-surface rounded-2xl shadow-xl z-50 overflow-hidden border border-primary/10"
                >
                  <div className="p-3 border-b border-primary/5 flex justify-between items-center">
                    <h4 className="text-sm font-bold">Уведомления</h4>
                    <button onClick={() => setShowNotifs(false)} className="p-1 hover:bg-primary/5 rounded-full">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs opacity-40 text-center">Нет уведомлений</p>
                    ) : (
                      notifications.slice(0, 20).map(n => (
                        <button
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.orderId) {
                              setSelectedOrder(n.orderId);
                              setActiveTab('orders');
                            }
                            setShowNotifs(false);
                          }}
                          className={cn(
                            "w-full text-left p-3 hover:bg-primary/5 transition-colors border-b border-primary/5 last:border-0",
                            !n.read && "bg-primary/3"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {!n.read && <span className="w-2 h-2 bg-red-500 rounded-full mt-1 flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs leading-relaxed">{n.text}</p>
                              <p className="text-[10px] opacity-30 mt-0.5">{n.time}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {activeTab === 'settings' && canAccess('settings') && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-surface rounded-3xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <KeyRound size={18} className="opacity-40" />
                <h3 className="font-bold">Сменить учётные данные</h3>
              </div>
              <form onSubmit={handleSaveSettings} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold opacity-50 mb-1 block px-1">Новое имя</label>
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={adminCredentials?.name || 'Имя'} className="w-full bg-background rounded-2xl px-5 py-3 border border-primary/5 focus:ring-2 focus:ring-primary outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-50 mb-1 block px-1">Новый пароль</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Новый пароль" className="w-full bg-background rounded-2xl px-5 py-3 border border-primary/5 focus:ring-2 focus:ring-primary outline-none text-sm" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!newName.trim() || !newPassword.trim() || newPassword.length < 4}
                    className={cn(
                      "flex-1 rounded-full py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all",
                      settingsSaved ? "bg-green-600 text-white" : "bg-primary text-primary-inv hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:scale-100"
                    )}
                  >
                    {settingsSaved ? <><Check size={16} /> Сохранено!</> : <><Save size={16} /> Сохранить</>}
                  </button>
                  <button type="button" onClick={() => setActiveTab('dashboard')} className="px-4 py-3 rounded-full border border-primary/10 text-sm hover:bg-primary/5 transition-all">
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { setActiveTab(t.key); setShowAddForm(false); setEditingProduct(null); setSelectedOrder(null); }}
            className={cn(
              "px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5",
              activeTab === t.key ? "bg-primary text-primary-inv shadow-md" : "bg-surface border border-primary/10 hover:bg-primary/5"
            )}
          >
            <t.icon size={14} />
            {t.label}
            {t.count !== undefined && <span className="opacity-60">({t.count})</span>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Dashboard Tab ── */}
        {activeTab === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Dashboard />
          </motion.div>
        )}

        {/* ── Orders Tab ── */}
        {activeTab === 'orders' && (
          activeOrder ? (
            <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-surface pill shadow-sm p-6">
              <AdminChat order={activeOrder} onBack={() => setSelectedOrder(null)} />
            </motion.div>
          ) : (
            <motion.div key="order-list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              {orders.length === 0 ? (
                <div className="bg-surface pill shadow-sm p-12 text-center">
                  <Package size={40} className="mx-auto opacity-15 mb-4" />
                  <p className="opacity-40">Заказов пока нет</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <motion.button
                      key={order.id}
                      onClick={() => setSelectedOrder(order.id)}
                      className="w-full bg-surface pill shadow-sm p-5 flex items-center gap-4 text-left hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="bg-primary/5 rounded-full p-3">
                        <MessageCircle size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm">{order.name}</h4>
                          <span className="text-xs opacity-40">{order.createdAt}</span>
                        </div>
                        <p className="text-xs opacity-50 truncate">{order.phone}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-40">{order.items.length} товаров — {order.total} ₽</span>
                          <span className="bg-terracotta/10 text-terracotta text-[10px] font-bold px-2 py-0.5 rounded-full">{order.chat.length} сообщ.</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )
        )}

        {/* ── Products Tab ── */}
        {activeTab === 'products' && (
          <motion.div key="products" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {(showAddForm || editingProduct) ? (
              <div className="bg-surface rounded-3xl shadow-sm p-6 mb-6">
                <ProductForm
                  initial={editingProduct || undefined}
                  onSave={handleSaveProduct}
                  onCancel={() => { setShowAddForm(false); setEditingProduct(null); }}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-surface rounded-3xl shadow-sm p-5 flex items-center justify-center gap-3 mb-6 border-2 border-dashed border-primary/15 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <div className="bg-primary/10 rounded-full p-2 group-hover:bg-primary group-hover:text-primary-inv transition-all">
                  <Plus size={20} />
                </div>
                <span className="font-bold opacity-60 group-hover:opacity-100 transition-opacity">Добавить товар</span>
              </button>
            )}

            <div className="space-y-3">
              {allProducts.map((product) => (
                <motion.div key={product.id} layout className="bg-surface rounded-2xl shadow-sm p-4 flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{product.name}</h4>
                    <p className="text-xs opacity-40">{product.category} — {product.sku}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-sm font-bold">{product.price} ₽</p>
                      {product.colorVariants.length > 1 && (
                        <div className="flex gap-0.5 ml-2">
                          {product.colorVariants.slice(0, 5).map((v, i) => (
                            <span key={i} className="w-3 h-3 rounded-full border border-primary/10" style={{ backgroundColor: v.hex }} />
                          ))}
                          {product.colorVariants.length > 5 && <span className="text-[9px] opacity-30">+{product.colorVariants.length - 5}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => { setEditingProduct(product); setShowAddForm(false); }} className="p-2.5 rounded-full hover:bg-primary/5 transition-colors" title="Редактировать">
                      <Edit3 size={16} className="opacity-40" />
                    </button>
                    <button onClick={() => removeProduct(product.id)} className="p-2.5 rounded-full hover:bg-red-50 transition-colors" title="Удалить">
                      <Trash2 size={16} className="opacity-40 hover:text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <UserManager />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
