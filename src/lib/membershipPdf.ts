import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartHandshake, Sparkles, Users } from 'lucide-react';
import Navbar from '../components/Navbar';

type Kind = 'ordentlich' | 'foerder';

export default function MitmachenPage() {
  const [kind, setKind] = useState<Kind>('ordentlich');

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-white border-b border-slate-100">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/10 rounded-full text-brand-teal text-xs font-black uppercase tracking-[0.2em] mb-6">
              <Sparkles size={14} />
              Mitmachen
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-brand-navy mb-6 leading-tight">
              Werde Teil von <span className="text-brand-teal">BVM</span>
            </h1>
            <p className="text-slate-600 text-lg md:text-xl">
              Gestalte mit uns Integration, Dialog, Community und Jugendarbeit in Mittelhessen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="py-12 md:py-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            
            {/* Tab Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-white p-1.5 rounded-full border border-slate-200 shadow-sm inline-flex relative">
                <button
                  type="button"
                  onClick={() => setKind('ordentlich')}
                  className={`relative z-10 flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    kind === 'ordentlich' ? 'text-white' : 'text-slate-600 hover:text-brand-teal'
                  }`}
                >
                  <Users size={16} />
                  Ordentliches Mitglied
                </button>
                <button
                  type="button"
                  onClick={() => setKind('foerder')}
                  className={`relative z-10 flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    kind === 'foerder' ? 'text-white' : 'text-slate-600 hover:text-brand-teal'
                  }`}
                >
                  <HeartHandshake size={16} />
                  Fördermitglied
                </button>
                <div
                  className="absolute inset-y-1.5 w-[calc(50%-0.375rem)] bg-brand-teal rounded-full transition-transform duration-300 ease-out z-0"
                  style={{ transform: kind === 'ordentlich' ? 'translateX(0)' : 'translateX(100%)' }}
                />
              </div>
            </div>

            {/* Embedded Form */ }
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-2 md:p-6 min-h-[600px] flex justify-center">
               <JotformEmbed kind={kind} />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

function JotformEmbed({ kind }: { kind: Kind }) {
  const formId = kind === 'ordentlich' ? '261356778155063' : '261354458091055';
  
  return (
    <AnimatePresence mode="wait">
      <JotformInstance key={formId} formId={formId} />
    </AnimatePresence>
  );
}

function JotformInstance({ formId }: { formId: string }) {
  useEffect(() => {
    // Jotform embed script needs to be injected into the DOM properly
    // to render the iframe and handle resizing
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://form.jotform.com/jsform/${formId}`;
    script.async = true;
    
    // Using getElementById ensures we target the correct DOM node that just mounted
    const container = document.getElementById(`jotform-container-${formId}`);
    if (container) {
      container.appendChild(script);
    }
    
    return () => {
      if (container) {
        container.innerHTML = ''; // Clean up on unmount
      }
    };
  }, [formId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full flex justify-center"
    >
      <div id={`jotform-container-${formId}`} className="w-full max-w-2xl min-h-[600px]" />
    </motion.div>
  );
}

