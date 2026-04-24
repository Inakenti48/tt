import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { products } from '../data/products';

function HandDrawnCircle() {
  return (
    <svg
      className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]"
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.ellipse
        cx="100"
        cy="40"
        rx="90"
        ry="34"
        stroke="#8E392B"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.2, ease: 'easeInOut' }}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 0,
          transform: 'rotate(-3deg)',
          transformOrigin: 'center',
        }}
      />
    </svg>
  );
}

export function Home() {
  const heroProduct = products[0];

  return (
    <div className="flex flex-col items-center min-h-[80vh] pt-4">
      {/* Hero text - uppercase bold like reference */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-left w-full max-w-md mb-8"
      >
        <h2 className="!uppercase text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          кресло<br />
          созданное<br />
          для{' '}
          <span className="relative inline-block">
            вас
            <HandDrawnCircle />
          </span>
        </h2>
      </motion.div>

      {/* Hero product image with floating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="relative w-full max-w-md aspect-[4/5] mb-8 bg-white rounded-[2rem] overflow-hidden shadow-sm"
      >
        <img
          src={heroProduct.image}
          alt={heroProduct.name}
          className="w-full h-full object-cover"
        />

        {/* Floating "new arrivals" badge - like the reference */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-6 left-4 bg-primary/90 backdrop-blur-sm text-white px-5 py-3 rounded-full flex items-center gap-3 shadow-lg"
        >
          <div className="bg-white/20 rounded-full p-1">
            <Plus size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold italic">6 новинок</span>
        </motion.div>
      </motion.div>

      {/* CTA button - "Discover More" style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-md"
      >
        <Link
          to="/catalog"
          className="w-full bg-primary text-white rounded-full px-10 py-5 flex items-center justify-center gap-3 text-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md"
        >
          узнать больше
        </Link>
      </motion.div>
    </div>
  );
}
