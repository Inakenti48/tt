import { motion } from 'framer-motion';
import { Home, ShoppingBag, Star, User, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useStore } from '../store/useStore';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { id: 'home', icon: Home, label: 'Главная', path: '/' },
  { id: 'catalog', icon: ShoppingBag, label: 'Каталог', path: '/catalog' },
  { id: 'favorites', icon: Star, label: 'Избранное', path: '/favorites' },
  { id: 'chat', icon: MessageCircle, label: 'Чат', path: '/chat' },
  { id: 'profile', icon: User, label: 'Профиль', path: '/profile' },
];

export function Navbar() {
  const location = useLocation();
  const { cart, setCartOpen, orders } = useStore();
  const { theme } = useTheme();

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const hasOrders = orders.length > 0;
  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav className={cn("pill px-2 py-2 flex items-center gap-1 shadow-2xl", isDark ? "bg-white" : "bg-primary")}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
                           (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 transition-all duration-300",
                isActive
                  ? (isDark ? "bg-[#1C1C1E] text-white pill" : "bg-white text-primary pill")
                  : isDark ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />

              {/* Chat badge */}
              {item.id === 'chat' && hasOrders && !isActive && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-terracotta rounded-full" />
              )}

              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-bold"
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className={cn("absolute inset-0 pill -z-10", isDark ? "bg-[#1C1C1E]" : "bg-white")}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}

        {/* Cart button */}
        {cartCount > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setCartOpen(true)}
            className="relative ml-1 bg-terracotta text-white px-4 py-2 pill flex items-center gap-2"
          >
            <ShoppingBag size={18} />
            <span className="text-sm font-bold">{cartCount}</span>
          </motion.button>
        )}
      </nav>
    </div>
  );
}
