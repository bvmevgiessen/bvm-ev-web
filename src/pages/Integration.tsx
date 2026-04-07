import React from 'react';
import { motion } from 'motion/react';
import { Users, Anchor, Info, ArrowLeft, Heart, Shield, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import PuzzleBackground from '../components/PuzzleBackground';
import ShareButtons from '../components/ShareButtons';

export default function Integration() {
  return (
    <div className="min-h-screen bg-white">
      <PuzzleBackground color="#1E293B" />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/integration-mentor/1920/1080" 
            alt="Integration" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-brand-navy font-bold mb-8 hover:gap-4 transition-all">
            <ArrowLeft size={20} /> Zurück zur Startseite
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-navy/10 text-brand-navy font-bold text-sm mb-6">
              <Anchor size={16} /> Integrationsplattform
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-brand-navy mb-6 leading-tight">
              Zentraler <span className="text-brand-navy opacity-80">Ankerpunkt</span> für alle
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Orientierungshilfe für das Leben in Deutschland, Mentoring für Erwachsene und Sprachunterstützung.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Individual Support */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/integration-support/800/1000" 
                alt="Support" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-8">Individuelle Begleitung</h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                Unser Mentoring-Programm verbindet Kinder, Jugendliche und Erwachsene mit erfahrenen Begleiter*innen, um sie persönlich, schulisch und beruflich zu stärken.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <Shield className="text-brand-navy shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-brand-navy mb-1">Schutz & Sicherheit</h4>
                    <p className="text-sm text-slate-500">Begleitung bei Behördengängen und rechtlichen Fragen.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <BookOpen className="text-brand-navy shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-brand-navy mb-1">Bildung & Karriere</h4>
                    <p className="text-sm text-slate-500">Unterstützung bei der Berufsfindung und Ausbildung.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge Hub */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6">Wissen & Orientierung</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Zentraler Wissenshub für Neuankömmlinge.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 shadow-sm"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8">
                <Info className="text-brand-navy" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Orientierungshilfe</h3>
              <p className="text-slate-600 leading-relaxed">
                Umfassende Orientierungshilfen, um Neuankömmlingen das "Leben in Deutschland" und das Zurechtfinden im Alltag zu erleichtern.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 shadow-sm"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8">
                <Users className="text-brand-navy" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Infoveranstaltungen</h3>
              <p className="text-slate-600 leading-relaxed">
                Regelmäßige Informationsabende zu aktuellen Themen der Integration und Teilhabe.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Society Contribution */}
      <section className="py-24 bg-brand-navy text-white relative overflow-hidden">
        <PuzzleBackground color="#ffffff" className="opacity-10" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Gesellschaftliche Teilhabe</h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-12">
            Wir glauben an eine Gesellschaft, in der Integration nicht nur eine Herausforderung, sondern eine gegenseitige Bereicherung ist.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-teal mb-2">100%</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Teilhabe</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-teal mb-2">Aktiv</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Mitgestalten</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-teal mb-2">Respekt</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Werte</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-teal mb-2">Vielfalt</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Stärke</div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <ShareButtons title="BVM e.V. Integrationsplattform - Zentraler Ankerpunkt für alle" className="items-center" />
        </div>
      </section>
    </div>
  );
}
