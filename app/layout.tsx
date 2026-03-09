import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles
import Navbar from '@/components/Navbar';
import { Mail } from 'lucide-react';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'נתיב בטוח | Safe Route',
  description: 'מערכת חכמה לתכנון מסלולי נסיעה בטוחים המבוססת על בינה מלאכותית וניתוח היסטוריית התרעות בזמן אמת. פותח על ידי אמיר רוזן (amir@productivity.co.il).',
  openGraph: {
    title: 'נתיב בטוח | Safe Route',
    description: 'מערכת חכמה לתכנון מסלולי נסיעה בטוחים המבוססת על בינה מלאכותית וניתוח היסטוריית התרעות בזמן אמת. פותח על ידי אמיר רוזן (amir@productivity.co.il).',
    siteName: 'Safe Route',
    locale: 'he_IL',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 text-xs py-1 text-center border-b border-slate-800">
            © 2026 Developed By Amir Rosen
          </div>
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <footer className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm flex flex-col items-center gap-2 border-t border-slate-200 dark:border-slate-800 mt-12 bg-white dark:bg-slate-900">
            <div className="font-medium">© 2026 Developed by Amir Rosen</div>
            <a href="mailto:amir@productivity.co.il" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full font-medium">
              <Mail className="w-4 h-4" /> amir@productivity.co.il
            </a>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
