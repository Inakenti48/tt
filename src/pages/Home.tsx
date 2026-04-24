import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-6xl md:text-8xl font-bold tracking-tighter mb-8"
      >
        design for<br />the soul
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-md text-lg opacity-60 mb-12 lowercase"
      >
        minimalist aesthetics for a peaceful lifestyle. curated objects that bring zen to your space.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          to="/catalog"
          className="bg-primary text-white pill px-10 py-5 flex items-center gap-3 text-xl hover:scale-105 transition-transform"
        >
          explore catalog <ArrowRight size={20} />
        </Link>
      </motion.div>
    </div>
  );
}
