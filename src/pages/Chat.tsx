import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Package } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

export function Chat() {
  const { orders, activeOrderId, setActiveOrderId, sendMessage } = useStore();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const order = orders.find((o) => o.id === activeOrderId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [order?.chat.length]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Package size={48} className="opacity-15 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Нет активных заказов</h2>
        <p className="text-sm opacity-50 mb-6">Добавьте товары в корзину и оформите заказ</p>
        <button
          onClick={() => navigate('/catalog')}
          className="bg-primary text-primary-inv rounded-full px-8 py-3 font-bold"
        >
          В каталог
        </button>
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(order.id, 'client', text.trim());
    setText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-lg mx-auto">
      {/* Chat header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-surface/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="font-bold text-base">Заказ {order.id}</h3>
          <p className="text-xs opacity-40">{order.items.length} товаров — {order.total} ₽</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4 scrollbar-hide">
        {order.chat.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3",
              msg.from === 'client'
                ? "ml-auto bg-primary text-primary-inv rounded-br-md"
                : "mr-auto bg-surface shadow-sm rounded-bl-md"
            )}
          >
            <p className="text-sm">{msg.text}</p>
            <p className={cn(
              "text-[10px] mt-1",
              msg.from === 'client' ? "text-primary-inv/50 text-right" : "text-primary/30"
            )}>
              {msg.time}
            </p>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-primary/5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Написать сообщение..."
          className="flex-1 bg-surface rounded-full px-5 py-3 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            text.trim()
              ? "bg-primary text-primary-inv hover:scale-105 active:scale-95"
              : "bg-primary/10 text-primary/30"
          )}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
