import React from 'react';
import { Mail, FileDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function Newsletter() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-2 px-4 bg-brand-teal/10 text-brand-teal font-bold rounded-full mb-6 tracking-wide uppercase text-sm">
            Bleiben Sie informiert
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-navy mb-6">
            Newsletter & Aktuelles
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Verpassen Sie keine Neuigkeiten! Abonnieren Sie unseren Newsletter oder laden Sie sich unseren aktuellen Quartalsbericht herunter, um alles über unsere Events in Gießen und Wetzlar zu erfahren.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Email Newsletter Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange mb-6">
              <Mail size={28} />
            </div>
            <h3 className="text-2xl font-bold text-brand-navy mb-4">Per E-Mail abonnieren</h3>
            <p className="text-slate-600 mb-8 flex-grow">
              Erhalten Sie jeden Monat die neuesten Nachrichten direkt in Ihr Postfach. Bleiben Sie am Puls der Zeit.
            </p>
            
            <form action="https://formspree.io/f/xqejpyol" method="POST" className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                name="email"
                placeholder="Ihre E-Mail-Adresse" 
                required
                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all outline-none"
              />
              <button 
                type="submit"
                className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
              >
                Abonnieren
              </button>
            </form>
          </motion.div>

          {/* PDF Download Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-brand-navy p-8 md:p-10 rounded-3xl shadow-xl shadow-brand-navy/20 border border-brand-navy flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="w-14 h-14 bg-brand-teal/20 rounded-2xl flex items-center justify-center text-brand-teal mb-6">
              <FileDown size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Quartalsbericht herunterladen</h3>
            <p className="text-slate-300 mb-8 flex-grow">
              Laden Sie sich unsere gesammelten Blogbeiträge, Berichte und Events der letzten 3 Monate bequem als automatisch generierte PDF-Datei herunter.
            </p>
            
            <div>
              <a 
                href="/assets/pdf/newsletter-latest.pdf" 
                download
                className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-xl transition-colors w-full sm:w-auto"
              >
                <FileDown size={20} />
                PDF Downloaden
              </a>
              <p className="text-white/50 text-xs mt-4">
                Wird automatisch alle 3 Monate aktualisiert.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
