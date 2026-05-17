import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Music } from 'lucide-react';

export default function EventPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the popup has been shown in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenSymphonyPopup');
    
    if (!hasSeenPopup) {
      // Delay opening for a better user experience
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenSymphonyPopup', 'true');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/10 hover:bg-black/20 text-white rounded-full flex items-center justify-center transition-colors z-10"
            >
              <X size={20} />
            </button>
            <div className="relative h-48 bg-brand-navy overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1600" 
                alt="Symphony of the Earth" 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block px-3 py-1 bg-brand-orange text-white text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                  Symphony of the Earth
                </span>
                <h2 className="text-2xl font-bold text-white leading-tight">
                  Internationales Kulturfestival
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-brand-navy font-medium mb-6 text-center px-4 bg-brand-teal/10 py-4 rounded-2xl">
                🎶 Gemeinsam aus Mittelhessen nach Stuttgart! Erleben Sie das internationale Kulturfestival.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                    <Calendar className="text-brand-teal" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">13. Juni 2026</p>
                    <p className="text-sm">Seien Sie dabei!</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="text-brand-teal" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">Porsche Arena</p>
                    <p className="text-sm">Stuttgart, Deutschland</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-600">
                   <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                    <Music className="text-brand-teal" size={24} />
                  </div>
                  <div>
                    <p className="text-sm">Musik, Tanz und Kultur aus aller Welt für Frieden und ein gemeinsames Miteinander.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold text-brand-navy bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Später
                </button>
                <a 
                  href="https://intflc.org/symphony-of-the-earth/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-[2] px-6 py-4 rounded-xl font-bold text-white bg-brand-teal hover:bg-teal-600 transition-colors text-center inline-block"
                  onClick={() => setIsOpen(false)}
                >
                  Mehr erfahren
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
