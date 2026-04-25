import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Upload, X } from 'lucide-react';

export function Profile() {
  const [isLogin, setIsLogin] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleUploadClick = () => {
    setShowModal(true);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="flex gap-4 mb-12 justify-center">
        <button
          onClick={() => setIsLogin(true)}
          className={cn(
            "px-6 py-2 pill transition-all",
            isLogin ? "bg-primary text-white" : "opacity-50 hover:opacity-100"
          )}
        >
          Вход
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={cn(
            "px-6 py-2 pill transition-all",
            !isLogin ? "bg-primary text-white" : "opacity-50 hover:opacity-100"
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
          <label className="text-sm font-bold  px-4">Эл. почта</label>
          <input
            type="email"
            placeholder="info@rooomebel.ru"
            className="w-full bg-white pill px-6 py-4 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none "
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold  px-4">Пароль</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-white pill px-6 py-4 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none "
          />
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-bold  px-4">Загрузить аватар</label>
            <button
              onClick={handleUploadClick}
              className="w-full bg-white pill px-6 py-4 border-dashed border-2 border-primary/10 flex items-center justify-center gap-2 text-primary/50 hover:bg-primary/5 transition-colors"
            >
              <Upload size={18} />
              <span>Выбрать изображение</span>
            </button>
          </div>
        )}

        <button className="w-full bg-primary text-white pill py-5 text-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-all">
          {isLogin ? 'Войти' : 'Создать аккаунт'}
        </button>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-primary text-white pill px-8 py-6 max-w-sm text-center shadow-2xl"
            >
              <p className="text-sm leading-relaxed  mb-4">
                Пожалуйста, убедитесь, что фон удален и изображение сохранено в формате png для лучшего результата
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-white text-primary pill px-6 py-2 text-sm font-bold hover:bg-white/90"
              >
                Понятно
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
