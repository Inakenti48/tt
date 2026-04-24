import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-6xl md:text-8xl font-bold tracking-tighter mb-6"
      >
        дизайн для<br />души
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-md text-lg opacity-60 mb-16 lowercase"
      >
        минималистичная эстетика для спокойной жизни. предметы, которые приносят гармонию в ваше пространство.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <Link
          to="/catalog"
          className="bg-primary text-white pill px-10 py-5 flex items-center justify-center gap-3 text-lg font-bold hover:scale-105 transition-transform"
        >
          исследуй каталог <ArrowRight size={20} />
        </Link>

        <Link
          to="/profile"
          className="bg-white text-primary border border-primary/10 pill px-10 py-5 flex items-center justify-center gap-3 text-lg font-bold hover:scale-105 transition-transform shadow-sm"
        >
          <LogIn size={20} /> войти
        </Link>
      </motion.div>
    </div>
  );
}
