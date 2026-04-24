import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, ArrowRight, Bell } from 'lucide-react';
import { products } from '../data/products';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
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
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-white p-3 pill shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft size={22} />
        </button>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="bg-white p-3 pill shadow-sm hover:shadow-md transition-shadow"
        >
          <Heart
            size={22}
            className={isFavorite ? 'fill-red-500 text-red-500' : ''}
          />
        </button>
      </div>

      {/* Product image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-square max-w-lg mx-auto mb-10 bg-white pill overflow-hidden shadow-sm"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Product info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg mx-auto"
      >
        <div className="mb-6">
          <p className="text-sm opacity-50 lowercase mb-1">{product.category}</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h2>
          <p className="text-base opacity-60 leading-relaxed lowercase">
            {product.description}
          </p>
        </div>

        {/* Specs */}
        {(product.dimensions || product.material) && (
          <div className="flex gap-6 mb-8">
            {product.dimensions && (
              <div className="bg-white px-5 py-3 pill shadow-sm">
                <p className="text-xs opacity-40 lowercase mb-1">размеры</p>
                <p className="text-sm font-bold">{product.dimensions}</p>
              </div>
            )}
            {product.material && (
              <div className="bg-white px-5 py-3 pill shadow-sm">
                <p className="text-xs opacity-40 lowercase mb-1">материал</p>
                <p className="text-sm font-bold">{product.material}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Floating bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-lg"
      >
        <button
          onClick={handleOrder}
          className="w-full bg-primary text-white pill px-8 py-5 flex items-center justify-between shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} />
            <span className="text-lg font-bold lowercase">в корзину</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">${product.price}</span>
            <ArrowRight size={20} />
          </div>
        </button>
      </motion.div>
    </div>
  );
}
