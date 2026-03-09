'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, MapPin, Navigation, Info, ShieldCheck, History, Clock, Activity } from 'lucide-react';
import { generateRouteAlternatives, RouteOption } from '@/lib/api';
import dynamic from 'next/dynamic';

// Dynamically import MapDisplay to avoid SSR issues with Leaflet
const MapDisplay = dynamic(() => import('@/components/MapDisplay'), { ssr: false });

export default function Home() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');

  useEffect(() => {
    // Check if disclaimer was already shown
    const hasSeenDisclaimer = localStorage.getItem('safeRouteDisclaimerSeen');
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true);
    }

    // Set default arrival time to current time + 1 hour
    const now = new Date();
    now.setHours(now.getHours() + 1);
    setArrivalDate(now.toISOString().split('T')[0]);
    setArrivalTime(now.toTimeString().slice(0, 5));
  }, []);

  const handleCloseDisclaimer = () => {
    localStorage.setItem('safeRouteDisclaimerSeen', 'true');
    setShowDisclaimer(false);
  };
  
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [showHistoryForRoute, setShowHistoryForRoute] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !arrivalTime) return;
    
    setLoading(true);
    setError(null);
    try {
      const results = await generateRouteAlternatives(origin, destination, arrivalDate, arrivalTime);
      
      // Validate departure times
      const arrivalDateTime = new Date(`${arrivalDate}T${arrivalTime}`);
      const now = new Date();
      
      const validRoutes = results.filter(r => {
        const departureTime = new Date(arrivalDateTime.getTime() - r.duration * 60000);
        return departureTime > now;
      });

      if (validRoutes.length === 0) {
        setError('אין מספיק זמן להגיע ליעד בשעה המבוקשת. אנא בחר תאריך ושעה מאוחרים יותר.');
        setRoutes([]);
        return;
      }

      setRoutes(validRoutes);
      setSelectedRouteId(validRoutes[0].id);
    } catch (err: any) {
      setError(err.message || 'אירעה שגיאה בחיפוש המסלולים. נסו שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full" dir="rtl">
      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        
        {/* Sidebar: Form & Results */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Search Form */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              תכנון מסלול בטוח
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">מוצא 📍</label>
                <input 
                  type="text" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="לדוגמה: תל אביב"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">יעד 🎯</label>
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="לדוגמה: ירושלים"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">תאריך הגעה מבוקש 📅</label>
                <input 
                  type="date" 
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">שעת הגעה מבוקשת ⏰</label>
                <input 
                  type="time" 
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-70 shadow-sm"
              >
                {loading ? (
                  <span className="animate-pulse">מנתח סיכונים... 🛡️</span>
                ) : (
                  <>מצא נתיב בטוח 🚗</>
                )}
              </button>
            </form>
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-800/50">
                {error}
              </div>
            )}
          </section>

          {/* Results List */}
          <AnimatePresence>
            {routes.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 px-1">חלופות נסיעה:</h3>
                {routes.map((route) => {
                  const arrivalDateTime = new Date(`${arrivalDate}T${arrivalTime}`);
                  const departureTime = new Date(arrivalDateTime.getTime() - route.duration * 60000);
                  const isWithin24Hours = departureTime.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;
                  
                  return (
                  <div 
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedRouteId === route.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{route.name}</h4>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${
                        route.safetyScore >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                        route.safetyScore >= 60 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {route.safetyScore >= 80 ? '✅' : route.safetyScore >= 60 ? '⚠️' : '🚨'}
                        ציון בטיחות: {route.safetyScore}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {route.distance} ק&quot;מ</span>
                        <span className="flex items-center gap-1">⏱️ {route.duration} דקות</span>
                      </div>
                      
                      <div className="bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded-lg text-sm text-blue-900 dark:text-blue-300 flex flex-col gap-1 border border-blue-100 dark:border-blue-800/50">
                        <span className="font-semibold flex items-center gap-1">
                          <Clock className="w-4 h-4" /> שעת יציאה משוערת: {departureTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })} ({departureTime.toLocaleDateString('he-IL')})
                        </span>
                        {isWithin24Hours && (
                          <span className="text-xs text-blue-700 dark:text-blue-400 flex items-center gap-1">
                            <Info className="w-3 h-3" /> מומלץ לבדוק שוב מסלולים סמוך למועד היציאה.
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-700">
                      <span className="font-semibold text-blue-800 dark:text-blue-400 flex items-center gap-1 mb-1">
                        <Info className="w-4 h-4" /> רציונל AI:
                      </span>
                      {route.rationale}
                    </div>

                    {selectedRouteId === route.id && route.instructions && route.instructions.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                      >
                        <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1">
                          <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" /> הוראות הגעה:
                        </h5>
                        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 mb-4">
                          {route.instructions.map((inst, idx) => (
                            <li key={idx}>{inst}</li>
                          ))}
                        </ul>
                        
                        {route.alertHistory && route.alertHistory.length > 0 && (
                          <div className="mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowHistoryForRoute(showHistoryForRoute === route.id ? null : route.id);
                              }}
                              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all text-sm font-bold border-2 ${
                                showHistoryForRoute === route.id 
                                  ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 shadow-inner' 
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300 shadow-sm'
                              }`}
                            >
                              <History className={`w-4 h-4 ${showHistoryForRoute === route.id ? 'animate-pulse text-blue-600 dark:text-blue-400' : ''}`} />
                              {showHistoryForRoute === route.id ? 'הסתר היסטורית התרעות' : 'הצג היסטורית התרעות במסלול'}
                            </button>
                            
                            <AnimatePresence>
                              {showHistoryForRoute === route.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-4 space-y-4 overflow-hidden"
                                >
                                  <div className="relative border-r-2 border-slate-200 dark:border-slate-700 pr-4 space-y-6 mr-2">
                                    {route.alertHistory.map((node, idx) => {
                                      const totalAlerts = node.alertsAtTime + node.alertsBefore + node.alertsAfter;
                                      const riskColor = totalAlerts === 0 ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' : 
                                                        totalAlerts <= 2 ? 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50' : 
                                                        'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50';
                                      const dotColor = totalAlerts === 0 ? 'bg-emerald-400 dark:bg-emerald-500' : totalAlerts <= 2 ? 'bg-amber-400 dark:bg-amber-500' : 'bg-red-400 dark:bg-red-500';
                                      
                                      return (
                                        <div key={idx} className="relative">
                                          {/* Timeline dot */}
                                          <div className={`absolute -right-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 shadow-sm ${dotColor}`}></div>
                                          
                                          <div className={`p-3 rounded-xl border ${riskColor}`}>
                                            <div className="flex justify-between items-center mb-2">
                                              <span className="font-bold text-slate-800 dark:text-slate-200">{node.settlement}</span>
                                              <span className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-800/60 px-2 py-1 rounded-md">
                                                <Clock className="w-3 h-3" /> {node.estimatedTime}
                                              </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                              <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-1.5 flex flex-col">
                                                <span className="text-slate-500 dark:text-slate-400 text-[10px] mb-0.5">-15 דק&apos;</span>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{node.alertsBefore}</span>
                                              </div>
                                              <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-1.5 flex flex-col shadow-sm border border-slate-100/50 dark:border-slate-700/50">
                                                <span className="text-slate-500 dark:text-slate-400 text-[10px] mb-0.5">בזמן זה</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{node.alertsAtTime}</span>
                                              </div>
                                              <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-1.5 flex flex-col">
                                                <span className="text-slate-500 dark:text-slate-400 text-[10px] mb-0.5">+15 דק&apos;</span>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{node.alertsAfter}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                  );
                })}
              </motion.section>
            )}
          </AnimatePresence>

        </div>

        {/* Map Area */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden h-[600px] lg:h-[800px] relative">
          <MapDisplay routes={routes} selectedRouteId={selectedRouteId} />
        </div>

      </main>

      {/* Disclaimer Modal */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full text-blue-600 dark:text-blue-400">
                  <ShieldAlert className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-4 text-slate-800 dark:text-slate-100">ברוכים הבאים ל-Safe-Route</h2>
              <p className="text-slate-600 dark:text-slate-300 text-center leading-relaxed mb-8">
                המערכת נועדה לעזור לכם לנווט בבטחה בעזרת נתונים ובינה מלאכותית, אבל חשוב לזכור: המערכת מבוססת על הערכות סטטיסטיות בלבד ואינה נבואה. הנחיות פיקוד העורף בזמן אמת הן הקובעות היחידות. הנסיעה היא באחריותכם הבלעדית, שימו לב להתרעות ולצופרים - שמרו על עצמכם וסעו בזהירות! 🕊️
              </p>
              <button 
                onClick={handleCloseDisclaimer}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-lg shadow-blue-200 dark:shadow-none"
              >
                הבנתי, בואו נתחיל
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
