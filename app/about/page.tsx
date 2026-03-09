'use client';

import { ShieldCheck, Navigation, History, Info, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 mt-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl">
            <ShieldCheck className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">אודות המערכת</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">נתיב בטוח | Safe Route</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              מהי מערכת &quot;נתיב בטוח&quot;?
            </h2>
            <p className="text-lg">
              מערכת &quot;נתיב בטוח&quot; פותחה על ידי אמיר רוזן והיא כלי עזר חכם לתכנון מסלולי נסיעה בזמן חירום. המערכת משלבת נתוני ניווט אמיתיים עם מנוע בינה מלאכותית (AI) מתקדם, כדי להציע חלופות נסיעה בטוחות יותר על בסיס ניתוח היסטוריית התרעות ביישובים השונים לאורך המסלול.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Navigation className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              איך משתמשים במערכת?
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <span className="bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                  הזנת פרטים
                </div>
                <p>הזינו את כתובת המוצא, היעד, תאריך ושעת ההגעה המבוקשת שלכם במסך הראשי.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <span className="bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                  ניתוח חלופות
                </div>
                <p>המערכת תחשב מספר מסלולים אפשריים ותעניק לכל אחד מהם &quot;ציון בטיחות&quot; המבוסס על סטטיסטיקת התרעות.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <span className="bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                  בחירת מסלול
                </div>
                <p>עיינו בחלופות, קראו את הרציונל של ה-AI ובחרו את המסלול המתאים לכם ביותר.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <span className="bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                  היסטוריית התרעות
                </div>
                <p>לחיצה על &quot;הצג היסטורית התרעות&quot; תציג ציר זמן מפורט של היישובים בדרך ורמת הסיכון המשוערת בהם.</p>
              </div>
            </div>
          </section>

          <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <History className="w-6 h-6" />
              חשוב לדעת
            </h2>
            <p className="text-blue-800 dark:text-blue-200">
              המערכת נועדה לשמש ככלי עזר בלבד ומבוססת על הערכות סטטיסטיות. 
              <strong className="dark:text-white"> היא אינה מחליפה את הנחיות פיקוד העורף.</strong> 
              בזמן אמת, יש להישמע תמיד להנחיות הרשמיות ולפעול על פיהן.
            </p>
          </section>
        </div>
      </motion.div>
    </main>
  );
}
