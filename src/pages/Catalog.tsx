import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import { cn } from '../utils/cn';
import { ShoppingBag, Bell } from 'lucide-react';

export function Catalog() {
  const [showOrderToast, setShowOrderToast] = useState(false);

  const handleOrder = () => {
    setShowOrderToast(true);
    setTimeout(() => setShowOrderToast(false), 3000);
  };

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
            <span className="text-sm font-bold lowercase">order notification sent to admin</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">explore</h2>
          <p className="opacity-50 lowercase">our curated collection</p>
        </div>
        <div className="flex gap-2">
          {['all', 'furniture', 'decor', 'lighting'].map((cat) => (
            <button
              key={cat}
              className={cn(
                "px-4 py-2 pill border border-primary/10 text-sm lowercase transition-all",
                cat === 'all' ? "bg-primary text-white" : "hover:bg-primary/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="relative aspect-square mb-4 bg-white pill overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4">
                <button className="bg-white/80 backdrop-blur-md p-2 pill text-primary hover:bg-white transition-colors">
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
                add to cart • ${product.price}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
