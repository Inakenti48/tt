import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { cn } from '../utils/cn';
import { ShoppingBag, Bell, Search, SlidersHorizontal, Filter } from 'lucide-react';

const categories = [
  { key: 'все', label: 'все' },
  { key: 'мебель', label: 'мебель' },
  { key: 'декор', label: 'декор' },
  { key: 'освещение', label: 'освещение' },
  { key: 'текстиль', label: 'текстиль' },
];

export function Catalog() {
  const [showOrderToast, setShowOrderToast] = useState(false);
  const [activeCategory, setActiveCategory] = useState('все');

  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowOrderToast(true);
    setTimeout(() => setShowOrderToast(false), 3000);
  };

  const filtered = activeCategory === 'все'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="pb-20">
      <AnimatePresence>
        {showOrderToast && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white pill px-6 py-3 flex items-center gap-3 shadow-xl"
          >
            <Bell size={18} />
            <span className="text-sm font-bold lowercase">уведомление о заказе отправлено</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-1">исследуй</h2>
        <p className="opacity-50 lowercase text-sm">наша коллекция</p>
      </div>

      {/* Search / Filter / Sort icon row - from reference */}
      <div className="flex items-center gap-3 mb-8">
        <button className="w-11 h-11 rounded-full border border-primary/15 flex items-center justify-center hover:bg-primary/5 transition-colors">
          <Search size={18} className="opacity-60" />
        </button>
        <button className="w-11 h-11 rounded-full border border-primary/15 flex items-center justify-center hover:bg-primary/5 transition-colors">
          <Filter size={18} className="opacity-60" />
        </button>
        <button className="w-11 h-11 rounded-full border border-primary/15 flex items-center justify-center hover:bg-primary/5 transition-colors">
          <SlidersHorizontal size={18} className="opacity-60" />
        </button>

        {/* Category pills */}
        <div className="flex gap-2 ml-auto flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "px-4 py-2 pill border border-primary/10 text-sm lowercase transition-all",
                activeCategory === cat.key ? "bg-primary text-white" : "hover:bg-primary/5"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="group"
          >
            <Link to={`/product/${product.id}`}>
              <div className="relative aspect-square mb-4 bg-white rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex justify-between items-start px-1">
                <div>
                  <h3 className="text-base font-bold leading-tight">{product.name}</h3>
                  <p className="text-xs opacity-40 tracking-wider uppercase mt-0.5">{product.sku}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">${product.price}</span>
                  <button
                    onClick={handleOrder}
                    className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
