import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
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

const phrases = [
  'КРЕСЛО\nСОЗДАННОЕ',
  'УЮТНЫЙ\nИНТЕРЬЕР',
  'СТИЛЬ\nПРОДУМАННЫЙ',
  'КОМФОРТ\nСОЗДАННЫЙ',
  'ДИЗАЙН\nВДОХНОВЛЁННЫЙ',
];

function useTypewriter(phrases: string[], typingSpeed = 70, deletingSpeed = 40, pauseDuration = 2200) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = phrases[phraseIndex];

  const tick = useCallback(() => {
    if (!isDeleting) {
      // Typing
      if (displayText.length < currentPhrase.length) {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1));
      } else {
        // Pause before deleting
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        setDisplayText(currentPhrase.slice(0, displayText.length - 1));
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }
  }, [displayText, isDeleting, currentPhrase, phrases.length, pauseDuration]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  return displayText;
}

export function Home() {
  const heroProduct = products[0];
  const typedText = useTypewriter(phrases, 80, 45, 2400);

  // Split typed text by newline for multi-line display
  const lines = typedText.split('\n');

  return (
    <div className="flex flex-col items-center min-h-[80vh] pt-4">
      {/* Hero text with typewriter effect */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-left w-full max-w-md mb-8"
      >
        <h2 className="!uppercase text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          {/* Typed rotating lines */}
          <span className="inline">
            {lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </span>
          {/* Blinking cursor */}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
            className="inline-block w-[3px] md:w-[4px] h-[0.85em] bg-terracotta ml-1 align-middle translate-y-[2px]"
          />
          <br />
          {/* Static "для вас" with hand-drawn circle */}
          <span>
            для{' '}
            <span className="relative inline-block">
              вас
              <HandDrawnCircle />
            </span>
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

        {/* Floating "new arrivals" badge */}
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

      {/* CTA button */}
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
