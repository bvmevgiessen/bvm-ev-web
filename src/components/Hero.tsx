import { motion } from 'motion/react';
import { ArrowRight, Globe, MapPin, Puzzle, Heart } from 'lucide-react';
import PuzzleBackground from './PuzzleBackground';
import SafeImage from './SafeImage';

export default function Hero() {
  const avatarMembers = [
    { name: 'Ayse M.', bg: 'bg-brand-teal text-white' },
    { name: 'Jonas F.', bg: 'bg-brand-orange text-white' },
    { name: 'Katarina V.', bg: 'bg-brand-navy text-white' },
    { name: 'Bilal I.', bg: 'bg-emerald-600 text-white' },
  ];

  return (
    <section id="home" className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden bg-white">
      <PuzzleBackground color="#0D9488" className="opacity-[0.03]" />
      
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
            <div className="flex -space-x-3">
              {avatarMembers.map((member, i) => (
                <div 
                  key={i} 
                  className={`w-12 h-12 rounded-2xl border-4 border-white ${member.bg} flex items-center justify-center font-bold text-xs tracking-wider shadow-sm select-none`}
                  title={member.name}
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
              ))}
              <div className="w-12 h-12 rounded-2xl border-4 border-white bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shadow-sm select-none">
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
              className="rounded-[2rem] overflow-hidden shadow-xl aspect-square relative bg-slate-100"
            >
              <SafeImage 
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=600" 
                alt="Engagierte Vereinsmitglieder und Bürger im Dialog bei einer BVM-Veranstaltung" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                fallbackType="community"
              />
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
              className="rounded-[2rem] overflow-hidden shadow-xl aspect-square relative bg-slate-100"
            >
              <SafeImage 
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600" 
                alt="Jugendliche Teilnehmer bei einem Bildungsworkshop von BVM e.V." 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                fallbackType="youth"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}