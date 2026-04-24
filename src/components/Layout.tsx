import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen pb-32">
      <header className="p-8 flex justify-between items-center">
        <h1 className="text-2xl tracking-tighter">zenspace</h1>
        <div className="text-sm opacity-50 lowercase">explore peace</div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 md:px-12 lg:px-24"
      >
        {children}
      </motion.main>

      <Navbar />
    </div>
  );
}
