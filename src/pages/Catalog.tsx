import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { products, categories as allCategories, Product } from '../data/products';
import { cn } from '../utils/cn';
import { ShoppingBag, Bell, Search, SlidersHorizontal, Filter, ArrowRight, ArrowLeft, Compass, Check, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const categoryList = allCategories.map((cat) => ({ key: cat, label: cat }));

// Random initial tilt directions for the "tumbler" drop-in effect
const dropVariants = [
  { rotate: -8, x: -30 },
  { rotate: 6, x: 20 },
  { rotate: -5, x: -15 },
  { rotate: 9, x: 25 },
  { rotate: -7, x: -20 },
  { rotate: 5, x: 15 },
];

function TumblerCard({ product, index, onOrder }: { product: Product; index: number; onOrder: (e: React.MouseEvent, product: Product) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [12, -12]);
  const rotateY = useTransform(x, [-150, 150], [-12, 12]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const drop = dropVariants[index % dropVariants.length];

  return (
    <motion.div
      key={product.id}
      initial={{
        opacity: 0,
        y: -120,
        rotate: drop.rotate,
        x: drop.x,
        scale: 0.7,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: 0,
        x: 0,
        scale: 1,
      }}
      transition={{
        delay: index * 0.12,
        type: 'spring',
        stiffness: 120,
        damping: 14,
        mass: 0.8,
      }}
      className="group"
      style={{ perspective: 800 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
        whileTap={{ scale: 0.95, rotateX: 4, rotateY: -4 }}
        className="will-change-transform"
      >
        <Link to={`/product/${product.id}`}>
          <div
            className="relative aspect-square mb-4 bg-white rounded-2xl overflow-hidden transition-shadow duration-300"
            style={{
              boxShadow: '0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {/* Convex highlight overlay */}
            <div
              className="absolute inset-0 z-10 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.25) 0%, transparent 60%)',
              }}
            />
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          </div>

          <div className="px-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold leading-tight">{product.name}</h3>
                <p className="text-xs opacity-40 tracking-wider uppercase mt-0.5">{product.sku}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{product.price} ₽</span>
                <button
                  onClick={(e) => onOrder(e, product)}
                  className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md"
                >
                  <ShoppingBag size={16} />
                </button>
              </div>
            </div>
            {/* Color dots */}
            <div className="flex items-center gap-1.5 mt-2">
              {product.colorVariants.map((variant, i) => (
                <span
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full border",
                    i === 0 ? "border-primary/40 ring-1 ring-primary/20 ring-offset-1" : "border-primary/10"
                  )}
                  style={{ backgroundColor: variant.hex }}
                />
              ))}
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function Catalog() {
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [showOrderToast, setShowOrderToast] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Все');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  const handleOrder = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setShowOrderToast(true);
    setTimeout(() => setShowOrderToast(false), 2000);
  };

  const toggleSort = () => {
    setSortOrder((prev) => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none');
  };

  let filtered = activeCategory === 'Все'
    ? [...products]
    : products.filter((p) => p.category === activeCategory);

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  if (sortOrder === 'asc') filtered.sort((a, b) => a.price - b.price);
  if (sortOrder === 'desc') filtered.sort((a, b) => b.price - a.price);

  // Pick 4 recommended products
  const recommended = [products[3], products[2], products[4], products[7]];

  return (
    <div className="pb-20">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showOrderToast && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white pill px-6 py-3 flex items-center gap-3 shadow-xl"
          >
            <Check size={18} />
            <span className="text-sm font-bold">Добавлено в корзину</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero banner with background image — from reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] overflow-hidden mb-10 aspect-[16/10] md:aspect-[16/7]"
      >
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
          alt="интерьер"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-2">исследуй</h2>
          <p className="opacity-60 text-sm md:text-base mb-5 max-w-xs">
            Отражение вашего стиля, вкуса и индивидуальности
          </p>
          <Link
            to="#catalog-grid"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-primary text-white rounded-full px-6 py-3 flex items-center gap-2 text-sm font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <Compass size={16} />
            Узнать больше
          </Link>
        </div>
      </motion.div>

      {/* "Рекомендуем для вас" — horizontal scroll section from reference */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-bold">Рекомендуем для вас</h3>
          <Link to="#catalog-grid" className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Category pills for recommendations */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {['Кровати', 'Комоды', 'Консоли'].map((cat, i) => (
            <span
              key={cat}
              className={cn(
                "px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all cursor-pointer",
                i === 0 ? "border-primary bg-primary/5 font-bold" : "border-primary/10 hover:bg-primary/5"
              )}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Horizontal scroll cards */}
        <div className="flex gap-5 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory scrollbar-hide">
          {recommended.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="flex-shrink-0 w-44 snap-start group"
            >
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm mb-3 group-hover:shadow-md transition-shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-sm font-bold leading-tight">{product.name}</h4>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-base font-bold">{product.price} ₽</span>
                <div className="flex items-center gap-1">
                  {product.colorVariants.map((variant, i) => (
                    <span
                      key={i}
                      className="w-2.5 h-2.5 rounded-full border border-primary/10"
                      style={{ backgroundColor: variant.hex }}
                    />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Search / Filter / Sort icon row */}
      <div id="catalog-grid" className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={cn(
              "w-11 h-11 rounded-full border flex items-center justify-center transition-all",
              searchOpen ? "bg-primary text-white border-primary" : "border-primary/15 hover:bg-primary/5"
            )}
          >
            <Search size={18} className={searchOpen ? "" : "opacity-60"} />
          </button>

          {/* Filter button — toggles category pills */}
          <button
            onClick={() => setActiveCategory(activeCategory === 'Все' ? 'Тумбочки' : 'Все')}
            className={cn(
              "w-11 h-11 rounded-full border flex items-center justify-center transition-all",
              activeCategory !== 'Все' ? "bg-primary text-white border-primary" : "border-primary/15 hover:bg-primary/5"
            )}
          >
            <Filter size={18} className={activeCategory !== 'Все' ? "" : "opacity-60"} />
          </button>

          {/* Sort button */}
          <button
            onClick={toggleSort}
            className={cn(
              "w-11 h-11 rounded-full border flex items-center justify-center transition-all",
              sortOrder !== 'none' ? "bg-primary text-white border-primary" : "border-primary/15 hover:bg-primary/5"
            )}
          >
            <SlidersHorizontal size={18} className={sortOrder !== 'none' ? "" : "opacity-60"} />
          </button>

          {/* Sort label */}
          {sortOrder !== 'none' && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs opacity-50"
            >
              {sortOrder === 'asc' ? 'Цена ↑' : 'Цена ↓'}
            </motion.span>
          )}

          {/* Category pills — scrollable */}
          <div className="flex gap-2 ml-auto overflow-x-auto scrollbar-hide pb-1">
            {categoryList.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "px-4 py-2 pill border border-primary/10 text-sm whitespace-nowrap transition-all flex-shrink-0",
                  activeCategory === cat.key ? "bg-primary text-white" : "hover:bg-primary/5"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search input — expands inline when search is active */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="relative max-w-sm">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию..."
                  className="w-full bg-white rounded-2xl pl-11 pr-5 py-3 shadow-sm focus:ring-2 focus:ring-primary outline-none text-sm border border-primary/5"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-60 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product, index) => (
          <TumblerCard
            key={product.id}
            product={product}
            index={index}
            onOrder={handleOrder}
          />
        ))}
      </div>
    </div>
  );
}
