import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Bell } from 'lucide-react';
import { products } from '../data/products';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showOrderToast, setShowOrderToast] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-3xl font-bold mb-4">товар не найден</h2>
        <button
          onClick={() => navigate('/catalog')}
          className="bg-primary text-white pill px-8 py-3 font-bold"
        >
          вернуться в каталог
        </button>
      </div>
    );
  }

  const handleOrder = () => {
    setShowOrderToast(true);
    setTimeout(() => setShowOrderToast(false), 3000);
  };

  // Parse dimensions for the specs table
  const dimParts = product.dimensions?.split('×').map((d) => d.trim()) || [];
  const height = dimParts[2] || dimParts[0] || '—';
  const width = dimParts[1] || dimParts[0] || '—';

  return (
    <div className="pb-32">
      <AnimatePresence>
        {showOrderToast && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white pill px-6 py-3 flex items-center gap-3 shadow-xl"
          >
            <Bell size={18} />
            <span className="text-sm font-bold lowercase">добавлено в корзину</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Product image with rotated price sticker */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-square max-w-lg mx-auto mb-8 bg-white rounded-[2rem] overflow-visible"
      >
        <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Rotated price sticker - from reference */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 12 }}
          transition={{ delay: 0.5, type: 'spring', bounce: 0.4 }}
          className="absolute bottom-8 right-[-8px] bg-background border border-primary/10 rounded-2xl px-5 py-3 shadow-lg rotate-[12deg]"
        >
          <span className="text-2xl font-bold text-terracotta">${product.price}</span>
        </motion.div>
      </motion.div>

      {/* Product info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg mx-auto"
      >
        {/* Name and SKU */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight !uppercase">
            {product.name}
          </h2>
          <p className="text-xs opacity-40 tracking-widest uppercase mt-1">{product.sku}</p>
        </div>

        {/* Specs table with thumbnail - from reference */}
        <div className="flex gap-5 mb-8">
          {/* Small product thumbnail */}
          <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Specs grid */}
          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <span className="opacity-50 font-medium">Высота</span>
            <span className="font-bold text-right">{height}</span>

            <span className="opacity-50 font-medium">Ширина</span>
            <span className="font-bold text-right">{width}</span>

            {product.weight && (
              <>
                <span className="opacity-50 font-medium">Вес</span>
                <span className="font-bold text-right">{product.weight}</span>
              </>
            )}

            {product.material && (
              <>
                <span className="opacity-50 font-medium">Материал</span>
                <span className="font-bold text-right">{product.material}</span>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm opacity-50 leading-relaxed lowercase mb-6">
          {product.description}
        </p>
      </motion.div>

      {/* Bottom "Buy Now" button - full width pill like reference */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-lg"
      >
        <button
          onClick={handleOrder}
          className="w-full bg-primary text-white rounded-full px-8 py-5 text-lg font-bold shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          купить сейчас
        </button>
      </motion.div>
    </div>
  );
}
