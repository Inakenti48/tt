import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle, Bell, MessageCircle, Send, ArrowLeft, Plus, Trash2, Edit3, X, ImagePlus, Save, Copy, Check, KeyRound, UserPlus, LogIn, Settings, Upload, Pipette, Palette } from 'lucide-react';
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
  const [colors, setColors] = useState<string[]>(
    initial?.colorVariants.map((v) => v.hex) || ['#FFFFFF']
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const addColor = () => setColors((prev) => [...prev, '#000000']);
  const removeColor = (idx: number) => setColors((prev) => prev.filter((_, i) => i !== idx));
  const updateColor = (idx: number, hex: string) => {
    setColors((prev) => prev.map((c, i) => (i === idx ? hex : c)));
  };

  const handleEyedropper = async (idx: number) => {
    try {
      if ('EyeDropper' in window) {
        const dropper = new (window as any).EyeDropper();
        const result = await dropper.open();
        updateColor(idx, result.sRGBHex);
      }
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim() || images.length === 0) return;

    const dims = (dimWidth || dimHeight || dimDepth)
      ? `${dimWidth || '0'} × ${dimDepth || '0'} × ${dimHeight || '0'} см`
      : undefined;

    const mainImage = images[0];
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
      colorVariants: colors.map((hex, i) => ({
        hex,
        image: images[i] || mainImage,
      })),
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

      {/* Multiple photos */}
      <div>
        <label className="text-xs font-bold opacity-50 mb-1 block">Фото товара * (можно несколько)</label>
        <div className="flex gap-3 flex-wrap mb-2">
          {images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-primary/10 shadow-sm group">
              <img src={img} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-0.5 left-0.5 bg-primary text-white text-[8px] px-1.5 py-0.5 rounded-full">Главное</span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          <label className="w-20 h-20 rounded-xl border-2 border-dashed border-primary/15 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all">
            <Upload size={16} className="opacity-30" />
            <span className="text-[9px] opacity-30 mt-0.5">Добавить</span>
            <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
          </label>
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

      {/* Colors with picker + eyedropper */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold opacity-50">Цвета</label>
          <button type="button" onClick={addColor} className="text-xs opacity-40 hover:opacity-100 flex items-center gap-1 transition-opacity">
            <Plus size={12} /> Добавить цвет
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {colors.map((hex, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-[#F9F7F2] rounded-xl px-2 py-1.5">
              <input
                type="color"
                value={hex}
                onChange={(e) => updateColor(i, e.target.value)}
                className="w-8 h-8 rounded-full border-0 cursor-pointer bg-transparent [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-2 [&::-webkit-color-swatch]:border-primary/10"
              />
              <button
                type="button"
                onClick={() => handleEyedropper(i)}
                className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                title="Пипетка"
              >
                <Pipette size={14} className="opacity-50" />
              </button>
              <span className="text-[10px] opacity-40 w-14 text-center font-mono">{hex}</span>
              {colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(i)}
                  className="p-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  <X size={12} className="opacity-30" />
                </button>
              )}
            </div>
          ))}
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
  const { orders, allProducts, addProduct, removeProduct, updateProduct, adminCredentials, registerAdmin, loginAdmin, updateAdminCredentials } = useStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nameField, setNameField] = useState('');
  const [passwordField, setPasswordField] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameField.trim() || !passwordField.trim()) {
      setError('Заполните все поля');
      return;
    }
    if (passwordField.length < 4) {
      setError('Пароль должен быть не менее 4 символов');
      return;
    }
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
    setRegistered(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameField.trim() || !passwordField.trim()) {
      setError('Заполните все поля');
      return;
    }
    if (loginAdmin(nameField.trim(), passwordField.trim())) {
      setIsLoggedIn(true);
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

  /* ── Not logged in ── */
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
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

        {/* ── Registration success: save credentials ── */}
        {registered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm p-6 mb-6 text-center"
          >
            <div className="inline-flex bg-green-50 rounded-full p-3 mb-4">
              <Check size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Регистрация успешна!</h3>
            <p className="text-sm opacity-50 mb-5 leading-relaxed">
              Сохраните ваши учётные данные, чтобы вы могли зайти и пользоваться прекрасным веб-сервисом интернет-магазина ROOOMEBEL
            </p>

            <div className="bg-[#F9F7F2] rounded-2xl p-4 mb-4 text-left">
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

            <button
              onClick={handleCopyCredentials}
              className={cn(
                "w-full rounded-full py-3.5 font-bold flex items-center justify-center gap-2 transition-all mb-3",
                copied
                  ? "bg-green-600 text-white"
                  : "bg-white border border-primary/15 hover:bg-primary/5"
              )}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Скопировано!' : 'Скопировать имя и пароль'}
            </button>

            <button
              onClick={handleEnterPanel}
              className="w-full bg-primary text-white rounded-full py-3.5 font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Войти в панель
            </button>
          </motion.div>
        )}

        {/* ── Login / Register form ── */}
        {!registered && (
          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
              {/* Toggle login / register */}
              <div className="flex bg-[#F9F7F2] rounded-full p-1 mb-2">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setError(''); }}
                  className={cn(
                    "flex-1 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-1.5",
                    authMode === 'login' ? "bg-primary text-white shadow-sm" : "opacity-50"
                  )}
                >
                  <LogIn size={15} /> Вход
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setError(''); }}
                  className={cn(
                    "flex-1 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-1.5",
                    authMode === 'register' ? "bg-primary text-white shadow-sm" : "opacity-50"
                  )}
                >
                  <UserPlus size={15} /> Регистрация
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold opacity-50 px-1 block">Имя</label>
                <input
                  type="text"
                  value={nameField}
                  onChange={(e) => { setNameField(e.target.value); setError(''); }}
                  placeholder="Введите ваше имя"
                  className="w-full bg-[#F9F7F2] rounded-2xl px-5 py-4 border border-primary/5 focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold opacity-50 px-1 block">Пароль</label>
                <input
                  type="password"
                  value={passwordField}
                  onChange={(e) => { setPasswordField(e.target.value); setError(''); }}
                  placeholder={authMode === 'register' ? 'Придумайте пароль' : 'Введите пароль'}
                  className="w-full bg-[#F9F7F2] rounded-2xl px-5 py-4 border border-primary/5 focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>

              {error && (
                <p className="text-sm text-terracotta text-center">{error}</p>
              )}
            </div>

            <button className="w-full bg-primary text-white rounded-full py-4 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform">
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
        <div>
          <h2 className="text-2xl font-bold">Личный кабинет</h2>
          {adminCredentials && (
            <p className="text-xs opacity-40 mt-0.5">Привет, {adminCredentials.name}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "p-2.5 rounded-full transition-all",
              showSettings ? "bg-primary text-white" : "bg-primary/5 hover:bg-primary/10"
            )}
          >
            <Settings size={18} />
          </button>
          <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 pill text-sm">
            <Bell size={16} />
            <span>{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <KeyRound size={18} className="opacity-40" />
                <h3 className="font-bold">Сменить учётные данные</h3>
              </div>
              <form onSubmit={handleSaveSettings} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold opacity-50 mb-1 block px-1">Новое имя</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder={adminCredentials?.name || 'Имя'}
                      className="w-full bg-[#F9F7F2] rounded-2xl px-5 py-3 border border-primary/5 focus:ring-2 focus:ring-primary outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-50 mb-1 block px-1">Новый пароль</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Новый пароль"
                      className="w-full bg-[#F9F7F2] rounded-2xl px-5 py-3 border border-primary/5 focus:ring-2 focus:ring-primary outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!newName.trim() || !newPassword.trim() || newPassword.length < 4}
                    className={cn(
                      "flex-1 rounded-full py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all",
                      settingsSaved
                        ? "bg-green-600 text-white"
                        : "bg-primary text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:scale-100"
                    )}
                  >
                    {settingsSaved ? <><Check size={16} /> Сохранено!</> : <><Save size={16} /> Сохранить</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-3 rounded-full border border-primary/10 text-sm hover:bg-primary/5 transition-all"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
