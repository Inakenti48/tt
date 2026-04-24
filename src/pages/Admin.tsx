import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Bell } from 'lucide-react';
import { cn } from '../utils/cn';

export function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-24">
        <h2 className="text-3xl font-bold mb-8 text-center">доступ администратора</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="пароль администратора"
            className="w-full bg-white pill px-6 py-4 border-none shadow-sm focus:ring-2 focus:ring-primary outline-none"
          />
          <button className="w-full bg-primary text-white pill py-4 font-bold">
            войти в панель
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-bold">панель администратора</h2>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 pill text-sm">
          <Bell size={16} />
          <span>уведомления активны</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'всего заказов', value: '12', icon: Package },
          { label: 'в ожидании', value: '3', icon: Bell },
          { label: 'выполнено', value: '9', icon: CheckCircle },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 pill shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/5 pill">
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm opacity-50 lowercase">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white pill shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-primary/5">
          <h3 className="text-xl font-bold">последние заказы</h3>
        </div>
        <div className="p-8">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm opacity-50 lowercase">
                <th className="pb-4 font-normal">номер заказа</th>
                <th className="pb-4 font-normal">клиент</th>
                <th className="pb-4 font-normal">статус</th>
                <th className="pb-4 font-normal text-right">сумма</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {[
                { id: '#9283', customer: 'alex@example.com', status: 'в ожидании', statusKey: 'pending', amount: '$450' },
                { id: '#9282', customer: 'martha.j@test.com', status: 'доставлен', statusKey: 'delivered', amount: '$85' },
                { id: '#9281', customer: 'zen_user@web.com', status: 'доставлен', statusKey: 'delivered', amount: '$120' },
              ].map((order) => (
                <tr key={order.id} className="text-sm">
                  <td className="py-4 font-bold">{order.id}</td>
                  <td className="py-4 lowercase">{order.customer}</td>
                  <td className="py-4">
                    <span className={cn(
                      "px-3 py-1 pill text-xs font-bold",
                      order.statusKey === 'pending' ? "bg-mustard/10 text-mustard" : "bg-primary/5 text-primary"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-bold">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
