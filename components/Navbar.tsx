'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShieldCheck, Info, Home, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-blue-900 dark:bg-slate-900 text-white p-4 shadow-md relative z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 hover:bg-blue-800 dark:hover:bg-slate-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="תפריט"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-tight">Safe-Route <span className="font-normal text-blue-200 hidden sm:inline">| נתיב בטוח</span></h1>
          </Link>
        </div>
        <div className="text-sm text-blue-200 hidden sm:block font-medium">
          מבצע &quot;שאגת הארי&quot;
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-4 mt-2 w-64 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden origin-top-right"
          >
            <nav className="flex flex-col text-slate-800 dark:text-slate-200">
              <Link 
                href="/" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 p-4 hover:bg-blue-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 transition-colors"
              >
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                  <Home className="w-5 h-5" />
                </div>
                <span className="font-semibold">מסך ראשי</span>
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 p-4 hover:bg-blue-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 transition-colors"
              >
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                  <Info className="w-5 h-5" />
                </div>
                <span className="font-semibold">אודות המערכת</span>
              </Link>
              
              {mounted && (
                <button 
                  onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                    setIsOpen(false);
                  }} 
                  className="flex items-center gap-3 p-4 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors w-full text-right"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </div>
                  <span className="font-semibold">
                    {theme === 'dark' ? 'מצב יום' : 'מצב לילה'}
                  </span>
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
