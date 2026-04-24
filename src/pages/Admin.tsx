import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle, Bell, MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { useStore, Order } from '../store/useStore';
import { cn } from '../utils/cn';

function AdminChat({ order, onBack }: { order: Order; onBack: () => void }) {
  const { sendMessage } = useStore();
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [order.chat.length]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(order.id, 'admin', text.trim());
    setText('');
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-primary/5 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="font-bold">{order.name}</h3>
          <p className="text-xs opacity-40">{order.phone} — {order.total} ₽</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4 scrollbar-hide">
        {order.chat.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3",
              msg.from === 'admin'
                ? "ml-auto bg-primary text-white rounded-br-md"
                : "mr-auto bg-white shadow-sm rounded-bl-md"
            )}
          >
            <p className="text-sm">{msg.text}</p>
            <p className={cn(
              "text-[10px] mt-1",
              msg.from === 'admin' ? "text-white/50 text-right" : "text-primary/30"
            )}>
              {msg.time}
            </p>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 pt-4 border-t border-primary/5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ответить клиенту..."
          className="flex-1 bg-white rounded-full px-5 py-3 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            text.trim()
              ? "bg-primary text-white hover:scale-105 active:scale-95"
              : "bg-primary/10 text-primary/30"
          )}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export function Admin() {
  const { orders } = useStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const activeOrder = orders.find((o) => o.id === selectedOrder);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-24">
        <h2 className="text-3xl font-bold mb-8 text-center">Панель администратора</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold px-1">Логин</label>
            <input
              type="text"
              value={login}
              onChange={(e) => { setLogin(e.target.value); setError(false); }}
              placeholder="Логин"
              className="w-full bg-white pill px-6 py-4 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold px-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Пароль"
              className="w-full bg-white pill px-6 py-4 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          {error && (
            <p className="text-sm text-terracotta text-center">Неверный логин или пароль</p>
          )}
          <button className="w-full bg-primary text-white pill py-4 font-bold">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Панель администратора</h2>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 pill text-sm">
          <Bell size={16} />
          <span>{orders.length} заказов</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Всего заказов', value: String(orders.length), icon: Package },
          { label: 'Сообщений', value: String(orders.reduce((s, o) => s + o.chat.length, 0)), icon: MessageCircle },
          { label: 'Сумма', value: `${orders.reduce((s, o) => s + o.total, 0)} ₽`, icon: CheckCircle },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-5 pill shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/5 pill">
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-xs opacity-50">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeOrder ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white pill shadow-sm p-6"
          >
            <AdminChat order={activeOrder} onBack={() => setSelectedOrder(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {orders.length === 0 ? (
              <div className="bg-white pill shadow-sm p-12 text-center">
                <Package size={40} className="mx-auto opacity-15 mb-4" />
                <p className="opacity-40">Заказов пока нет</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <motion.button
                    key={order.id}
                    onClick={() => setSelectedOrder(order.id)}
                    className="w-full bg-white pill shadow-sm p-5 flex items-center gap-4 text-left hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="bg-primary/5 rounded-full p-3">
                      <MessageCircle size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm">{order.name}</h4>
                        <span className="text-xs opacity-40">{order.createdAt}</span>
                      </div>
                      <p className="text-xs opacity-50 truncate">{order.phone}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-40">
                          {order.items.length} товаров — {order.total} ₽
                        </span>
                        <span className="bg-terracotta/10 text-terracotta text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {order.chat.length} сообщ.
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
