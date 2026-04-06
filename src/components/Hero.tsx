import { motion } from 'motion/react';
import { ArrowRight, Globe, MapPin, Puzzle, Heart } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      {/* Puzzle Metaphor Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none -z-10 opacity-20">
        <svg viewBox="0 0 800 800" className="absolute top-0 right-0 w-[600px] h-[600px] text-brand-teal transform translate-x-1/4 -translate-y-1/4">
          <path fill="currentColor" d="M100,100 L300,100 L300,300 L100,300 Z" className="animate-pulse" />
          <path fill="currentColor" d="M350,150 L550,150 L550,350 L350,350 Z" style={{ animationDelay: '1s' }} className="animate-pulse" />
          <path fill="currentColor" d="M200,400 L400,400 L400,600 L200,600 Z" style={{ animationDelay: '2s' }} className="animate-pulse" />
        </svg>
      </div>

      {/* Location Focus: Subtle Map Overlay (Conceptual) */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1920/1080?blur=10')] bg-cover bg-center opacity-[0.03] -z-20" />

      <div className="section-padding grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/10 text-brand-teal rounded-full text-sm font-bold mb-8 border border-brand-teal/20">
            <MapPin size={16} />
            <span>Aktiv in Mittelhessen</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-brand-navy leading-[1.05] mb-8">
            Vielfalt als <br />
            <span className="text-brand-teal relative inline-block">
              Stärke
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-orange/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span> verstehen.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
            Seit 2019 führen wir Menschen unterschiedlicher Herkunft zusammen – wie Puzzleteile, die ein Gesamtbild ergeben – um gemeinsam eine gerechtere Zukunft in der Region aufzubauen.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <a href="#vision" className="btn-primary flex items-center gap-2 shadow-xl shadow-brand-teal/20">
              Unsere Vision entdecken <ArrowRight size={20} />
            </a>
            <a href="#about" className="px-8 py-3 border-2 border-slate-200 text-brand-navy rounded-full font-bold hover:bg-slate-50 transition-all">
              Über uns
            </a>
          </div>

          <div className="flex items-center gap-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 max-w-md">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white overflow-hidden shadow-sm">
                  <img
                    src={`https://picsum.photos/seed/member${i}/100/100`}
                    alt="Member"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
              <div className="w-12 h-12 rounded-2xl border-4 border-white bg-brand-orange flex items-center justify-center text-white text-xs font-bold shadow-sm">
                +100
              </div>
            </div>
            <div>
              <p className="font-extrabold text-brand-navy text-lg leading-tight">100+ Familien</p>
              <p className="text-slate-500 text-sm">Das Herz unseres Vereins</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          {/* Interactive Puzzle Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02, rotate: -1 }}
              className="rounded-[2rem] overflow-hidden shadow-xl aspect-square"
            >
              <img src="https://picsum.photos/seed/p1/600/600" alt="Community" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, rotate: 1 }}
              className="rounded-[2rem] overflow-hidden shadow-xl aspect-square bg-brand-teal flex items-center justify-center p-8 text-white"
            >
              <div className="text-center">
                <Puzzle size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-display font-bold text-xl">Kulturelle Brücken</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, rotate: -1 }}
              className="rounded-[2rem] overflow-hidden shadow-xl aspect-square bg-brand-orange flex items-center justify-center p-8 text-white"
            >
              <div className="text-center">
                <Globe size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-display font-bold text-xl">Globale Vielfalt</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, rotate: 1 }}
              className="rounded-[2rem] overflow-hidden shadow-xl aspect-square"
            >
              <img src="https://picsum.photos/seed/p2/600/600" alt="Youth" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
          </div>
          
          {/* Floating Badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-20"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal">
                <Heart size={24} fill="currentColor" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gründung</p>
                <p className="text-2xl font-extrabold text-brand-navy">2019</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

