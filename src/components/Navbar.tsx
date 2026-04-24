import { motion } from 'framer-motion';
import { Home, ShoppingBag, Star, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

const navItems = [
  { id: 'home', icon: Home, label: 'home', path: '/' },
  { id: 'catalog', icon: ShoppingBag, label: 'catalog', path: '/catalog' },
  { id: 'favorites', icon: Star, label: 'favorites', path: '/favorites' },
  { id: 'profile', icon: User, label: 'profile', path: '/profile' },
];

export function Navbar() {
  const location = useLocation();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav className="bg-primary pill px-2 py-2 flex items-center gap-1 shadow-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
                           (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 transition-all duration-300",
                isActive ? "bg-white text-primary pill" : "text-white/70 hover:text-white"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-bold lowercase"
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white pill -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
