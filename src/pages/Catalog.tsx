import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { cn } from '../utils/cn';
import { ShoppingBag, Bell, Search } from 'lucide-react';

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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">исследуй</h2>
          <p className="opacity-50 lowercase mt-1">наша коллекция</p>
        </div>
        <div className="flex gap-2 flex-wrap">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link to={`/product/${product.id}`}>
              <div className="relative aspect-square mb-4 bg-white pill overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleOrder}
                    className="bg-white/80 backdrop-blur-md p-2 pill text-primary hover:bg-white transition-colors"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-start px-2">
                <div>
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-sm opacity-50 lowercase">{product.category}</p>
                </div>
                <button
                  onClick={handleOrder}
                  className="bg-primary text-white pill px-4 py-2 text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  в корзину • ${product.price}
                </button>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
