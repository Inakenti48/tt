import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export function BellToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isPulled, setIsPulled] = useState(false);

  const handleClick = () => {
    if (isPulled) return;
    setIsPulled(true);
    setTimeout(() => {
      toggleTheme();
    }, 350);
    setTimeout(() => {
      setIsPulled(false);
    }, 700);
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={handleClick}
      className="relative flex flex-col items-center cursor-pointer"
      aria-label="Переключить тему"
      style={{ width: 40, height: 56 }}
    >
      {/* Rope / wire */}
      <motion.div
        animate={{ height: isPulled ? 30 : 14 }}
        transition={{ type: 'spring', stiffness: 350, damping: 15 }}
        className="w-[1.5px] rounded-full"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.5))'
            : 'linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.3))',
        }}
      />

      {/* Lamp — swings when pulled */}
      <motion.div
        animate={{
          rotate: isPulled ? [0, -18, 14, -8, 4, 0] : 0,
          y: isPulled ? 6 : 0,
        }}
        transition={{
          rotate: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          y: { type: 'spring', stiffness: 280, damping: 12 },
        }}
        className="relative flex flex-col items-center"
        style={{ transformOrigin: 'top center' }}
      >
        {/* Lamp shade (dome shape) */}
        <div
          className="relative"
          style={{
            width: 28,
            height: 18,
            borderRadius: '14px 14px 4px 4px',
            background: isDark
              ? 'linear-gradient(180deg, #bbb 0%, #888 60%, #777 100%)'
              : 'linear-gradient(180deg, #555 0%, #3a3a3a 60%, #2a2a2a 100%)',
            boxShadow: isDark
              ? '0 2px 10px rgba(255,200,100,0.2)'
              : '0 2px 8px rgba(0,0,0,0.25)',
          }}
        >
          {/* Shine on shade */}
          <div
            className="absolute top-1 left-2 w-3 h-2 rounded-full opacity-40"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.6), transparent 80%)',
            }}
          />
        </div>

        {/* Bulb area (bottom of lamp) */}
        <div
          className="relative -mt-[1px] flex items-center justify-center"
          style={{
            width: 18,
            height: 8,
            borderRadius: '0 0 9px 9px',
            background: isDark
              ? 'radial-gradient(ellipse at center top, rgba(255,220,140,0.95), rgba(255,190,80,0.7))'
              : 'linear-gradient(180deg, #666, #444)',
            boxShadow: isDark
              ? '0 2px 12px rgba(255,200,100,0.5), 0 4px 20px rgba(255,180,60,0.3)'
              : 'none',
          }}
        />

        {/* Glow under lamp in dark mode */}
        <AnimatePresence>
          {isDark && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: 32,
                height: 16,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(255,210,120,0.35) 0%, transparent 70%)',
                filter: 'blur(3px)',
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
