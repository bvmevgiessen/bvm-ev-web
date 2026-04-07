import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Target, MapPin, ArrowLeft, GraduationCap, Compass, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import PuzzleBackground from '../components/PuzzleBackground';
import ShareButtons from '../components/ShareButtons';

export default function Jugend() {
  return (
    <div className="min-h-screen bg-white">
      <PuzzleBackground color="#0D9488" />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/youth-camp/1920/1080" 
            alt="Jugendcamp" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-brand-teal font-bold mb-8 hover:gap-4 transition-all">
            <ArrowLeft size={20} /> Zurück zur Startseite
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-sm mb-6">
              <Rocket size={16} /> Jugendplattform
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-brand-navy mb-6 leading-tight">
              Identität & <span className="text-brand-teal">Potenzial</span> entfalten
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Wir sehen eine Gesellschaft, in der jeder junge Mensch, unabhängig von Herkunft oder Hintergrund, sein volles Potenzial entfalten kann.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mentoring & Education */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6">Mentoring & Bildung</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Wir stärken schulische Kompetenzen und begleiten Jugendliche auf ihrem persönlichen Weg.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm"
            >
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-8">
                <GraduationCap className="text-brand-teal" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Gezielte Nachhilfe</h3>
              <p className="text-slate-600 leading-relaxed">
                Individuelle Unterstützung in allen Schulfächern, um Wissenslücken zu schließen und das Selbstvertrauen zu stärken.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm"
            >
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-8">
                <Target className="text-brand-teal" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Hausaufgabenbetreuung</h3>
              <p className="text-slate-600 leading-relaxed">
                Ein strukturierter Rahmen für die täglichen Schularbeiten unter fachlicher Anleitung.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Adventure & Discovery */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6">Abenteuer & Entdeckung</h2>
              <p className="text-slate-600">Gemeinsam die Welt entdecken und Grenzen überwinden durch unvergessliche Erlebnisse.</p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-slate-100 rounded-2xl text-brand-navy font-bold text-sm">#Feriencamps</div>
              <div className="px-6 py-3 bg-slate-100 rounded-2xl text-brand-navy font-bold text-sm">#Kulturreisen</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative h-80 rounded-[2.5rem] overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/youth-gallery-${i}/600/800`} 
                  alt="Gallery" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <p className="text-white font-bold">Impressionen unserer Reisen</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-brand-navy text-white relative overflow-hidden">
        <PuzzleBackground color="#ffffff" className="opacity-10" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Heart className="text-brand-teal mx-auto mb-8" size={48} fill="currentColor" />
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8 italic">
            "A society where every young person, regardless of origin, can reach their full potential."
          </h2>
          <div className="w-20 h-1 bg-brand-teal mx-auto" />
        </div>
      </section>

      {/* Share Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <ShareButtons title="BVM e.V. Jugendplattform - Identität & Potenzial entfalten" className="items-center" />
        </div>
      </section>
    </div>
  );
}
