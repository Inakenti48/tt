import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export function BellToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isPulled, setIsPulled] = useState(false);

  const handleClick = () => {
    setIsPulled(true);
    setTimeout(() => {
      toggleTheme();
      setIsPulled(false);
    }, 400);
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={handleClick}
      className="relative flex flex-col items-center cursor-pointer group"
      aria-label="Переключить тему"
      style={{ width: 36, height: 54 }}
    >
      {/* Rope */}
      <motion.div
        animate={{
          height: isPulled ? 28 : 16,
          scaleY: isPulled ? 1.4 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="w-[2px] rounded-full"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #555 0%, #888 100%)'
            : 'linear-gradient(180deg, #ccc 0%, #999 100%)',
        }}
      />

      {/* Bell body */}
      <motion.div
        animate={{
          rotate: isPulled ? [0, -12, 10, -6, 0] : 0,
          y: isPulled ? 4 : 0,
        }}
        transition={{
          rotate: { duration: 0.6, ease: 'easeInOut' },
          y: { type: 'spring', stiffness: 300, damping: 12 },
        }}
        className="relative flex flex-col items-center"
        style={{ transformOrigin: 'top center' }}
      >
        {/* Bell top knob */}
        <div
          className="w-2 h-2 rounded-full -mb-0.5 z-10"
          style={{
            backgroundColor: isDark ? '#e0e0e0' : '#444',
            boxShadow: isDark
              ? '0 0 6px rgba(255,255,255,0.2)'
              : '0 0 4px rgba(0,0,0,0.15)',
          }}
        />

        {/* Bell shape */}
        <div
          className="relative overflow-hidden"
          style={{
            width: 26,
            height: 20,
            borderRadius: '4px 4px 13px 13px',
            background: isDark
              ? 'linear-gradient(180deg, #e0e0e0 0%, #999 100%)'
              : 'linear-gradient(180deg, #555 0%, #333 100%)',
            boxShadow: isDark
              ? '0 2px 8px rgba(255,255,255,0.08), inset 0 -3px 6px rgba(0,0,0,0.2)'
              : '0 2px 8px rgba(0,0,0,0.2), inset 0 -3px 6px rgba(0,0,0,0.3)',
          }}
        >
          {/* Light reflection */}
          <div
            className="absolute top-1 left-1 w-3 h-2 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, transparent 80%)',
            }}
          />

          {/* Glow when dark mode (lamp is "on") */}
          {isDark && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-3 rounded-full"
              style={{
                background: 'radial-gradient(ellipse, rgba(255,220,150,0.7) 0%, transparent 80%)',
              }}
            />
          )}
        </div>

        {/* Bell rim */}
        <div
          className="-mt-px"
          style={{
            width: 30,
            height: 4,
            borderRadius: '0 0 15px 15px',
            background: isDark
              ? 'linear-gradient(180deg, #bbb 0%, #888 100%)'
              : 'linear-gradient(180deg, #444 0%, #222 100%)',
          }}
        />

        {/* Clapper */}
        <motion.div
          animate={{ x: isPulled ? [0, -2, 2, -1, 0] : 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-1.5 h-1.5 rounded-full mt-px"
          style={{
            backgroundColor: isDark ? '#ddd' : '#333',
          }}
        />
      </motion.div>

      {/* Light cone (visible in dark mode) */}
      {isDark && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 0.12, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: 0,
            height: 0,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: '30px solid rgba(255,220,150,0.3)',
            transformOrigin: 'top center',
          }}
        />
      )}
    </button>
  );
}
