import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { products, Product } from '../data/products';
import { cn } from '../utils/cn';
import { ShoppingBag, Bell, Search, SlidersHorizontal, Filter } from 'lucide-react';

const categories = [
  { key: 'все', label: 'все' },
  { key: 'мебель', label: 'мебель' },
  { key: 'декор', label: 'декор' },
  { key: 'освещение', label: 'освещение' },
  { key: 'текстиль', label: 'текстиль' },
];

// Random initial tilt directions for the "tumbler" drop-in effect
const dropVariants = [
  { rotate: -8, x: -30 },
  { rotate: 6, x: 20 },
  { rotate: -5, x: -15 },
  { rotate: 9, x: 25 },
  { rotate: -7, x: -20 },
  { rotate: 5, x: 15 },
];

function TumblerCard({ product, index, onOrder }: { product: Product; index: number; onOrder: (e: React.MouseEvent) => void }) {
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

          <div className="flex justify-between items-start px-1">
            <div>
              <h3 className="text-base font-bold leading-tight">{product.name}</h3>
              <p className="text-xs opacity-40 tracking-wider uppercase mt-0.5">{product.sku}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">${product.price}</span>
              <button
                onClick={onOrder}
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md"
              >
                <ShoppingBag size={16} />
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

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

      {/* Search / Filter / Sort icon row */}
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
