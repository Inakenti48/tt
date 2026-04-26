import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import { LiquidButton } from '../components/LiquidButton';

export function Profile() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/admin');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      {/* Tab switcher with animated gradient */}
      <div className="flex gap-3 mb-12 justify-center">
        {[
          { label: 'Вход', active: isLogin, onClick: () => setIsLogin(true) },
          { label: 'Регистрация', active: !isLogin, onClick: () => setIsLogin(false) },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={tab.onClick}
            className={cn(
              "relative px-6 py-2.5 pill font-bold text-sm transition-all overflow-hidden",
              tab.active ? "text-white shadow-lg scale-105" : "opacity-50 hover:opacity-80"
            )}
            style={tab.active ? {
              background: 'linear-gradient(315deg, rgba(101,0,94,1) 3%, rgba(60,132,206,1) 38%, rgba(48,238,226,1) 68%, rgba(255,25,25,1) 98%)',
              backgroundSize: '400% 400%',
              animation: 'gradient 6s ease infinite',
            } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={isLogin ? 'login' : 'register'}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-bold px-4">Эл. почта</label>
          <input
            type="email"
            placeholder="info@rooomebel.ru"
            className="w-full bg-surface pill px-6 py-4 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold px-4">Пароль</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-surface pill px-6 py-4 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <div className="flex justify-center">
          <LiquidButton width={300} height={56} onClick={handleSubmit}>
            {isLogin ? 'Войти' : 'Создать аккаунт'}
          </LiquidButton>
        </div>
      </motion.div>
    </div>
  );
}
