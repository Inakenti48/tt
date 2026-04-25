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
      className="relative flex flex-col items-center cursor-pointer group"
      aria-label="Переключить тему"
      style={{ width: 44, height: 80 }}
    >
      {/* Long rope from top */}
      <motion.div
        animate={{
          height: isPulled ? 42 : 24,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 14 }}
        className="w-[2px] rounded-full origin-top"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.4) 100%)'
            : 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      {/* Bell body - swings when pulled */}
      <motion.div
        animate={{
          rotate: isPulled ? [0, -15, 12, -8, 4, 0] : 0,
          y: isPulled ? 8 : 0,
        }}
        transition={{
          rotate: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
          y: { type: 'spring', stiffness: 250, damping: 10 },
        }}
        className="relative flex flex-col items-center"
        style={{ transformOrigin: 'top center' }}
      >
        {/* Bell top knob */}
        <div
          className="w-2.5 h-2.5 rounded-full -mb-1 z-10"
          style={{
            backgroundColor: isDark ? '#ccc' : '#555',
            boxShadow: isDark
              ? '0 0 8px rgba(255,220,150,0.3)'
              : '0 0 4px rgba(0,0,0,0.2)',
          }}
        />

        {/* Bell shape */}
        <div
          className="relative overflow-hidden"
          style={{
            width: 32,
            height: 26,
            borderRadius: '5px 5px 16px 16px',
            background: isDark
              ? 'linear-gradient(180deg, #d4d4d4 0%, #999 50%, #888 100%)'
              : 'linear-gradient(180deg, #666 0%, #444 50%, #333 100%)',
            boxShadow: isDark
              ? '0 3px 12px rgba(255,220,150,0.15), inset 0 -4px 8px rgba(0,0,0,0.2)'
              : '0 3px 12px rgba(0,0,0,0.25), inset 0 -4px 8px rgba(0,0,0,0.3)',
          }}
        >
          {/* Highlight reflection */}
          <div
            className="absolute top-1 left-1.5 w-4 h-3 rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.35) 0%, transparent 80%)',
            }}
          />

          {/* Warm glow when dark mode */}
          <AnimatePresence>
            {isDark && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-4 rounded-full"
                style={{
                  background: 'radial-gradient(ellipse, rgba(255,210,130,0.8) 0%, transparent 80%)',
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Bell rim */}
        <div
          className="-mt-px"
          style={{
            width: 36,
            height: 5,
            borderRadius: '0 0 18px 18px',
            background: isDark
              ? 'linear-gradient(180deg, #bbb 0%, #999 100%)'
              : 'linear-gradient(180deg, #555 0%, #333 100%)',
          }}
        />

        {/* Clapper - swings independently */}
        <motion.div
          animate={{
            x: isPulled ? [0, -3, 3, -2, 1, 0] : 0,
            y: isPulled ? [0, 2, 0] : 0
          }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-2 h-2 rounded-full mt-0.5"
          style={{
            backgroundColor: isDark ? '#ccc' : '#444',
            boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </motion.div>

      {/* Pull knob at end of rope */}
      <motion.div
        animate={{ y: isPulled ? 6 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2"
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle at 30% 30%, #ddd, #999)'
              : 'radial-gradient(circle at 30% 30%, #777, #333)',
            boxShadow: isDark
              ? '0 2px 4px rgba(0,0,0,0.3)'
              : '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </motion.div>

      {/* Light cone in dark mode */}
      <AnimatePresence>
        {isDark && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 0.15, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: 0,
              height: 0,
              borderLeft: '24px solid transparent',
              borderRight: '24px solid transparent',
              borderTop: '40px solid rgba(255,210,130,0.25)',
              transformOrigin: 'top center',
              filter: 'blur(2px)',
            }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}
