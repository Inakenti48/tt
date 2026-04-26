import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { LiquidButton } from '../components/LiquidButton';

export function Profile() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="flex gap-4 mb-12 justify-center">
        <button
          onClick={() => setIsLogin(true)}
          className={cn(
            "px-6 py-2 pill transition-all",
            isLogin ? "bg-primary text-primary-inv" : "opacity-50 hover:opacity-100"
          )}
        >
          Вход
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={cn(
            "px-6 py-2 pill transition-all",
            !isLogin ? "bg-primary text-primary-inv" : "opacity-50 hover:opacity-100"
          )}
        >
          Регистрация
        </button>
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
          <LiquidButton width={300} height={56}>
            {isLogin ? 'Войти' : 'Создать аккаунт'}
          </LiquidButton>
        </div>
      </motion.div>
    </div>
  );
}
