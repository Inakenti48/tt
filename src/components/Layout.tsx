import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

function LogoUnderline() {
  return (
    <svg
      className="absolute -bottom-1 left-0 w-full h-[6px]"
      viewBox="0 0 200 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M2 4C30 2 60 3 100 2.5C140 2 170 3.5 198 2"
        stroke="#8E392B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen pb-32">
      <header className="p-8 flex justify-between items-center">
        <h1 className="text-2xl tracking-tight font-bold !uppercase relative inline-block">
          Rooomebel
          <LogoUnderline />
        </h1>
        <div className="text-sm opacity-50">Обретите покой</div>
      </header>

      <main className="px-6 md:px-12 lg:px-24">
        {children}
      </main>

      <Navbar />
    </div>
  );
}
