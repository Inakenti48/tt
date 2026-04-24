import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen pb-32">
      <header className="p-8 flex justify-between items-center">
        <h1 className="text-2xl tracking-tighter">Zenspace</h1>
        <div className="text-sm opacity-50">Обретите покой</div>
      </header>

      <main className="px-6 md:px-12 lg:px-24">
        {children}
      </main>

      <Navbar />
    </div>
  );
}
