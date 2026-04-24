import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, ShoppingBag, ArrowRight, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { products } from '../data/products';
import { cn } from '../utils/cn';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOrderToast, setShowOrderToast] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const [activeThumb, setActiveThumb] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-3xl font-bold mb-4">Товар не найден</h2>
        <button
          onClick={() => navigate('/catalog')}
          className="bg-primary text-white pill px-8 py-3 font-bold"
        >
          Вернуться в каталог
        </button>
      </div>
    );
  }

  const handleOrder = () => {
    setShowOrderToast(true);
    setTimeout(() => setShowOrderToast(false), 3000);
  };

  // Current color variant image
  const currentImage = product.colorVariants[activeColor]?.image || product.image;

  // Thumbnails based on current color variant
  const thumbs = [
    `${currentImage}&fit=crop&crop=center`,
    `${currentImage}&fit=crop&crop=top`,
    `${currentImage}&fit=crop&crop=left`,
    `${currentImage}&fit=crop&crop=bottom`,
    `${currentImage}&fit=crop&crop=right`,
  ];

  const handleColorChange = (index: number) => {
    setActiveColor(index);
    setActiveThumb(0);
  };

  return (
    <div className="pb-36">
      <AnimatePresence>
        {showOrderToast && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white pill px-6 py-3 flex items-center gap-3 shadow-xl"
          >
            <Bell size={18} />
            <span className="text-sm font-bold ">Добавлено В корзину</span>
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
          onClick={() => setIsFavorite(!isFavorite)}
          className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <Star
            size={20}
            className={cn(
              'transition-colors',
              isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-primary/40'
            )}
          />
        </button>
      </div>

      {/* Product image with rotated price sticker */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-square max-w-lg mx-auto mb-4 bg-background rounded-[2rem] overflow-visible"
      >
        <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-sm">
          <AnimatePresence mode="wait">
            <motion.img
              key={`${activeColor}-${activeThumb}`}
              src={thumbs[activeThumb]}
              alt={product.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

        {/* Rotated price sticker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 12 }}
          transition={{ delay: 0.5, type: 'spring', bounce: 0.4 }}
          className="absolute bottom-8 right-[-8px] bg-background border border-primary/10 rounded-2xl px-5 py-3 shadow-lg rotate-[12deg]"
        >
          <span className="text-2xl font-bold text-terracotta">{product.price} ₽</span>
        </motion.div>
      </motion.div>

      {/* Thumbnail carousel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-lg mx-auto flex items-center gap-3 mb-6 px-6"
      >
        <button
          onClick={() => setActiveThumb(Math.max(0, activeThumb - 1))}
          className="text-primary/30 hover:text-primary transition-colors flex-shrink-0"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-3 flex-1 justify-center py-1 px-1">
          {thumbs.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveThumb(i)}
              className={cn(
                "w-11 h-11 rounded-full overflow-hidden border-2 flex-shrink-0 transition-all duration-200",
                i === activeThumb
                  ? "border-primary shadow-md scale-[1.15]"
                  : "border-transparent opacity-50 hover:opacity-100"
              )}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <button
          onClick={() => setActiveThumb(Math.min(thumbs.length - 1, activeThumb + 1))}
          className="text-primary/30 hover:text-primary transition-colors flex-shrink-0"
        >
          <ChevronRight size={18} />
        </button>
      </motion.div>

      {/* Color variant selector */}
      {product.colorVariants.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="max-w-lg mx-auto flex items-center gap-3 mb-8 px-2"
        >
          <span className="text-xs opacity-40 uppercase tracking-wider">цвет</span>
          <div className="flex gap-2">
            {product.colorVariants.map((variant, i) => (
              <button
                key={i}
                onClick={() => handleColorChange(i)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                  i === activeColor
                    ? "border-primary scale-110 shadow-md ring-2 ring-primary/20 ring-offset-2"
                    : "border-primary/10"
                )}
                style={{ backgroundColor: variant.hex }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Product info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg mx-auto"
      >
        {/* Name */}
        <div className="mb-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
            {product.name}
          </h2>
        </div>

        {/* Description with toggle */}
        <div className="mb-6">
          <p className={cn(
            "text-sm opacity-60 leading-relaxed  transition-all",
            !expanded && "line-clamp-2"
          )}>
            {product.description}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-bold mt-1 hover:opacity-70 transition-opacity"
          >
            {expanded ? 'Скрыть —' : 'Подробнее +'}
          </button>
        </div>

        {/* Specs table with thumbnail */}
        <div className="flex gap-5 mb-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-white">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm self-center">
            {product.dimensions && (() => {
              const parts = product.dimensions!.split('×').map((d) => d.trim());
              const height = parts[2] || parts[0] || '—';
              const width = parts[1] || parts[0] || '—';
              return (
                <>
                  <span className="opacity-50">Высота</span>
                  <span className="font-bold text-right">{height}</span>
                  <span className="opacity-50">Ширина</span>
                  <span className="font-bold text-right">{width}</span>
                </>
              );
            })()}

            {product.weight && (
              <>
                <span className="opacity-50">Вес</span>
                <span className="font-bold text-right">{product.weight}</span>
              </>
            )}

            {product.material && (
              <>
                <span className="opacity-50">Материал</span>
                <span className="font-bold text-right">{product.material}</span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom bar — compact, right-aligned */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-28 right-6 z-40"
      >
        <button
          onClick={handleOrder}
          className="bg-primary text-white rounded-full pl-4 pr-5 py-3 flex items-center gap-2.5 shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <div className="bg-white/15 rounded-full p-2">
            <ShoppingBag size={16} />
          </div>
          <span className="text-sm font-bold">В корзину</span>
          <span className="text-base font-bold">{product.price} ₽</span>
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
