import React from 'react';
import { motion } from 'motion/react';
import { 
  Scale, 
  FileText, 
  BarChart3, 
  Video, 
  ShieldCheck, 
  ArrowDown, 
  ExternalLink,
  BookOpen,
  Info
} from 'lucide-react';

export default function JusticeHero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative bg-brand-navy text-white overflow-hidden pt-36 pb-20 md:pt-40 md:pb-28 border-b border-slate-800">
      {/* Subtle Background Pattern & Watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <Scale className="w-[600px] h-[600px] text-white" strokeWidth={0.8} />
      </div>

      {/* Radial soft glow for focal depth without garish gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider text-brand-teal mb-6 backdrop-blur-sm"
        >
          <Scale size={14} className="text-brand-teal" />
          <span>Faktenbasierte Menschenrechtsdokumentation</span>
        </motion.div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white font-sans"
          >
            JusticeSquare – <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
              Menschenrechte, Freiheit & Gerechtigkeit
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl font-normal"
          >
            Dokumentation von systematischen Menschenrechtsverletzungen gegen die Gülen-Bewegung. 
            Strukturiert, neutral und journalistisch sauber aufbereitet anhand von Urteilen des EGMR, Berichten der Vereinten Nationen und Analysen internationaler NGOs.
          </motion.p>
        </div>

        {/* 4 Main Action / Anchor Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-3 sm:gap-4 items-center"
        >
          <button
            type="button"
            onClick={() => scrollToSection('news')}
            className="btn-primary py-3 px-6 text-sm flex items-center gap-2.5 shadow-lg shadow-teal-950/20 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <FileText size={16} />
            <span>Aktuelle News</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('reports')}
            className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold rounded-2xl py-3 px-6 text-sm flex items-center gap-2.5 backdrop-blur-sm transition-all hover:scale-[1.02] cursor-pointer"
          >
            <BookOpen size={16} className="text-brand-teal" />
            <span>Berichte & Analysen</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('infografiken')}
            className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold rounded-2xl py-3 px-6 text-sm flex items-center gap-2.5 backdrop-blur-sm transition-all hover:scale-[1.02] cursor-pointer"
          >
            <BarChart3 size={16} className="text-brand-teal" />
            <span>Infografiken</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('multimedia')}
            className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold rounded-2xl py-3 px-6 text-sm flex items-center gap-2.5 backdrop-blur-sm transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Video size={16} className="text-brand-teal" />
            <span>Multimedia</span>
          </button>
        </motion.div>

        {/* Core Statistical Pillars Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left"
        >
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white block">&gt; 332.000</span>
            <span className="text-xs uppercase tracking-wider text-brand-teal font-semibold block mt-1">Festnahmen seit 2016</span>
            <span className="text-xs text-slate-400 mt-1 block">Amtlich erfasste Ermittlungsverfahren</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white block">&gt; 150.000</span>
            <span className="text-xs uppercase tracking-wider text-brand-teal font-semibold block mt-1">KHK-Entlassungen</span>
            <span className="text-xs text-slate-400 mt-1 block">Lehrer, Richter, Beamte per Dekret entlassen</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white block">17 : 0</span>
            <span className="text-xs uppercase tracking-wider text-brand-teal font-semibold block mt-1">EGMR Große Kammer</span>
            <span className="text-xs text-slate-400 mt-1 block">Einstimmiges Yalçınkaya-Urteil (Art. 7 EMRK)</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white block">&gt; 30 Staaten</span>
            <span className="text-xs uppercase tracking-wider text-brand-teal font-semibold block mt-1">Transnationale Entführungen</span>
            <span className="text-xs text-slate-400 mt-1 block">Dokumentiert durch UN & Freedom House</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
}