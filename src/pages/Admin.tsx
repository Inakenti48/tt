import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle, Bell, MessageCircle, Send, ArrowLeft, Plus, Trash2, Edit3, X, ImagePlus, Save } from 'lucide-react';
import { useStore, Order } from '../store/useStore';
import { Product } from '../data/products';
import { categories as allCategories } from '../data/products';
import { cn } from '../utils/cn';

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
        <button onClick={onBack} className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
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
                ? "ml-auto bg-primary text-white rounded-br-md"
                : "mr-auto bg-white shadow-sm rounded-bl-md"
            )}
          >
            <p className="text-sm">{msg.text}</p>
            <p className={cn(
              "text-[10px] mt-1",
              msg.from === 'admin' ? "text-white/50 text-right" : "text-primary/30"
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
          className="flex-1 bg-white rounded-full px-5 py-3 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            text.trim()
              ? "bg-primary text-white hover:scale-105 active:scale-95"
              : "bg-primary/10 text-primary/30"
          )}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

/* ───── Add / Edit Product Form ───── */
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
  const [image, setImage] = useState(initial?.image || '');
  const [dimensions, setDimensions] = useState(initial?.dimensions || '');
  const [weight, setWeight] = useState(initial?.weight || '');
  const [material, setMaterial] = useState(initial?.material || '');
  const [colorHexes, setColorHexes] = useState(
    initial?.colorVariants.map((v) => v.hex).join(', ') || '#FFFFFF'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim() || !image.trim()) return;

    const hexArr = colorHexes.split(',').map((h) => h.trim()).filter(Boolean);
    const product: Product = {
      id: initial?.id || `P-${Date.now().toString(36).toUpperCase()}`,
      name: name.trim(),
      sku: initial?.sku || `RM${String(Math.floor(Math.random() * 90000) + 10000)}`,
      price: Number(price),
      image: image.trim(),
      category,
      description: description.trim(),
      dimensions: dimensions.trim() || undefined,
      weight: weight.trim() || undefined,
      material: material.trim() || undefined,
      colorVariants: hexArr.map((hex) => ({ hex, image: image.trim() })),
    };
    onSave(product);
  };

  const fieldClass = 'w-full bg-white rounded-2xl px-5 py-3 border border-primary/10 shadow-sm focus:ring-2 focus:ring-primary outline-none text-sm';

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
          {cats.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold opacity-50 mb-1 block">Ссылка на фото *</label>
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://images.unsplash.com/..." className={fieldClass} required />
      </div>

      {image && (
        <div className="flex justify-center">
          <img src={image} alt="Превью" className="w-32 h-32 object-cover rounded-2xl shadow-sm border border-primary/10" />
        </div>
      )}

      <div>
        <label className="text-xs font-bold opacity-50 mb-1 block">Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание товара..." rows={3} className={fieldClass + ' resize-none'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold opacity-50 mb-1 block">Размеры</label>
          <input value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="50 × 40 × 55 см" className={fieldClass} />
        </div>
        <div>
          <label className="text-xs font-bold opacity-50 mb-1 block">Вес</label>
          <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="12 кг" className={fieldClass} />
        </div>
        <div>
          <label className="text-xs font-bold opacity-50 mb-1 block">Материал</label>
          <input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Дуб, МДФ" className={fieldClass} />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold opacity-50 mb-1 block">Цвета (HEX через запятую)</label>
        <input value={colorHexes} onChange={(e) => setColorHexes(e.target.value)} placeholder="#8B6F47, #2C2C2C, #FFFFFF" className={fieldClass} />
        <div className="flex gap-2 mt-2">
          {colorHexes.split(',').map((h, i) => {
            const hex = h.trim();
            return hex ? (
              <span key={i} className="w-6 h-6 rounded-full border border-primary/15 shadow-sm" style={{ backgroundColor: hex }} />
            ) : null;
          })}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white rounded-full py-4 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        <Save size={18} />
        {initial ? 'Сохранить изменения' : 'Добавить товар'}
      </button>
    </form>
  );
}

export function Admin() {
  const navigate = useNavigate();
  const { orders, allProducts, addProduct, removeProduct, updateProduct } = useStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const activeOrder = orders.find((o) => o.id === selectedOrder);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <h2 className="text-3xl font-bold mb-8 text-center">Панель администратора</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold px-1">Логин</label>
            <input
              type="text"
              value={login}
              onChange={(e) => { setLogin(e.target.value); setError(false); }}
              placeholder="Логин"
              className="w-full bg-white pill px-6 py-4 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold px-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Пароль"
              className="w-full bg-white pill px-6 py-4 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          {error && (
            <p className="text-sm text-terracotta text-center">Неверный логин или пароль</p>
          )}
          <button className="w-full bg-primary text-white pill py-4 font-bold">
            Войти
          </button>
        </form>
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

  const handleDeleteProduct = (id: string) => {
    removeProduct(id);
  };

  return (
    <div className="py-8 pb-32">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft size={20} />
        </button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Панель администратора</h2>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 pill text-sm">
          <Bell size={16} />
          <span>{orders.length} заказов</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Всего заказов', value: String(orders.length), icon: Package },
          { label: 'Товаров', value: String(allProducts.length), icon: CheckCircle },
          { label: 'Сумма', value: `${orders.reduce((s, o) => s + o.total, 0)} ₽`, icon: MessageCircle },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-5 pill shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/5 pill">
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-xs opacity-50">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs: Заказы / Товары */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setActiveTab('orders'); setShowAddForm(false); setEditingProduct(null); }}
          className={cn(
            "px-5 py-2.5 rounded-full text-sm font-bold transition-all",
            activeTab === 'orders' ? "bg-primary text-white shadow-md" : "bg-white border border-primary/10 hover:bg-primary/5"
          )}
        >
          Заказы ({orders.length})
        </button>
        <button
          onClick={() => { setActiveTab('products'); setSelectedOrder(null); }}
          className={cn(
            "px-5 py-2.5 rounded-full text-sm font-bold transition-all",
            activeTab === 'products' ? "bg-primary text-white shadow-md" : "bg-white border border-primary/10 hover:bg-primary/5"
          )}
        >
          Товары ({allProducts.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Orders Tab ── */}
        {activeTab === 'orders' && (
          activeOrder ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white pill shadow-sm p-6"
            >
              <AdminChat order={activeOrder} onBack={() => setSelectedOrder(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="order-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {orders.length === 0 ? (
                <div className="bg-white pill shadow-sm p-12 text-center">
                  <Package size={40} className="mx-auto opacity-15 mb-4" />
                  <p className="opacity-40">Заказов пока нет</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <motion.button
                      key={order.id}
                      onClick={() => setSelectedOrder(order.id)}
                      className="w-full bg-white pill shadow-sm p-5 flex items-center gap-4 text-left hover:shadow-md transition-shadow"
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
                          <span className="text-xs opacity-40">
                            {order.items.length} товаров — {order.total} ₽
                          </span>
                          <span className="bg-terracotta/10 text-terracotta text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {order.chat.length} сообщ.
                          </span>
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
          <motion.div
            key="products"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Add / Edit Form */}
            {(showAddForm || editingProduct) ? (
              <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
                <ProductForm
                  initial={editingProduct || undefined}
                  onSave={handleSaveProduct}
                  onCancel={() => { setShowAddForm(false); setEditingProduct(null); }}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-white rounded-3xl shadow-sm p-5 flex items-center justify-center gap-3 mb-6 border-2 border-dashed border-primary/15 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <div className="bg-primary/10 rounded-full p-2 group-hover:bg-primary group-hover:text-white transition-all">
                  <Plus size={20} />
                </div>
                <span className="font-bold opacity-60 group-hover:opacity-100 transition-opacity">Добавить товар</span>
              </button>
            )}

            {/* Product List */}
            <div className="space-y-3">
              {allProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{product.name}</h4>
                    <p className="text-xs opacity-40">{product.category} — {product.sku}</p>
                    <p className="text-sm font-bold mt-0.5">{product.price} ₽</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => { setEditingProduct(product); setShowAddForm(false); }}
                      className="p-2.5 rounded-full hover:bg-primary/5 transition-colors"
                      title="Редактировать"
                    >
                      <Edit3 size={16} className="opacity-40" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2.5 rounded-full hover:bg-red-50 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 size={16} className="opacity-40 hover:text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
