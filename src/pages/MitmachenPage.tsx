import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, HeartHandshake, ShieldCheck, Sparkles, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import OrdentlichForm from '../components/forms/OrdentlichForm';
import FoerderForm from '../components/forms/FoerderForm';

type Kind = 'ordentlich' | 'foerder' | null;

export default function MitmachenPage() {
  const [kind, setKind] = useState<Kind>(null);

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
            <AnimatePresence mode="wait">
              {kind === null && (
                <motion.div
                  key="selector"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  data-testid="kind-selector"
                >
                  <SelectionCard
                    icon={<Users size={28} />}
                    title="Ordentliche Mitgliedschaft"
                    description="Für aktive Mitgestaltung mit Stimmrecht. Du bringst dich ein, wirkst in Projekten mit und entscheidest die Vereinsrichtung mit."
                    bullets={[
                      'Aktives Stimm- und Wahlrecht',
                      'Teilnahme an der Mitgliederversammlung',
                      'Mitgliedsbeitrag 2,50 € / Monat (oder beitragsfrei)',
                    ]}
                    cta="Antrag stellen"
                    onClick={() => setKind('ordentlich')}
                    testId="select-ordentlich"
                  />
                  <SelectionCard
                    icon={<HeartHandshake size={28} />}
                    title="Fördermitgliedschaft"
                    description="Du unterstützt unsere Vision finanziell und bekommst auf Wunsch eine Spendenquittung – ohne weitere Verpflichtungen."
                    bullets={[
                      'Freier Beitrag, monatlich oder jährlich',
                      'Spendenquittung auf Wunsch',
                      'Du bleibst über Newsletter informiert',
                    ]}
                    cta="Förderer werden"
                    onClick={() => setKind('foerder')}
                    accent
                    testId="select-foerder"
                  />
                </motion.div>
              )}

              {kind !== null && (
                <motion.div
                  key={kind}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <button
                    type="button"
                    onClick={() => setKind(null)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-teal mb-6 group"
                    data-testid="back-to-selector"
                  >
                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    Mitgliedschaftsart ändern
                  </button>

                  <div className="bg-white rounded-[2rem] shadow-md border border-slate-100 p-6 md:p-10">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                      <div className="h-12 w-12 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                        {kind === 'ordentlich' ? <Users size={22} /> : <HeartHandshake size={22} />}
                      </div>
                      <div>
                        <h2 className="text-2xl font-extrabold text-brand-navy">
                          {kind === 'ordentlich'
                            ? 'Antrag Ordentliche Mitgliedschaft'
                            : 'Antrag Fördermitgliedschaft'}
                        </h2>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <ShieldCheck size={14} className="text-emerald-500" />
                          Verschlüsselte Übertragung über Formspree
                        </p>
                      </div>
                    </div>

                    {kind === 'ordentlich' ? <OrdentlichForm /> : <FoerderForm />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

interface SelectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  onClick: () => void;
  accent?: boolean;
  testId?: string;
}

function SelectionCard({
  icon,
  title,
  description,
  bullets,
  cta,
  onClick,
  accent,
  testId,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={[
        'group text-left rounded-[2rem] p-8 md:p-10 border-2 transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1',
        accent
          ? 'bg-gradient-to-br from-brand-teal to-emerald-600 border-transparent text-white'
          : 'bg-white border-slate-200 hover:border-brand-teal',
      ].join(' ')}
    >
      <div
        className={[
          'h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110',
          accent ? 'bg-white/15 text-white' : 'bg-brand-teal/10 text-brand-teal',
        ].join(' ')}
      >
        {icon}
      </div>
      <h2
        className={[
          'text-2xl md:text-3xl font-extrabold mb-3 leading-tight',
          accent ? 'text-white' : 'text-brand-navy',
        ].join(' ')}
      >
        {title}
      </h2>
      <p
        className={[
          'mb-6 leading-relaxed',
          accent ? 'text-white/90' : 'text-slate-600',
        ].join(' ')}
      >
        {description}
      </p>
      <ul className="space-y-2 mb-8">
        {bullets.map((b) => (
          <li
            key={b}
            className={[
              'flex items-start gap-2 text-sm',
              accent ? 'text-white/90' : 'text-slate-700',
            ].join(' ')}
          >
            <span
              className={[
                'mt-1 h-1.5 w-1.5 rounded-full shrink-0',
                accent ? 'bg-white' : 'bg-brand-teal',
              ].join(' ')}
            />
            {b}
          </li>
        ))}
      </ul>
      <span
        className={[
          'inline-flex items-center gap-2 font-black',
          accent ? 'text-white' : 'text-brand-teal',
        ].join(' ')}
      >
        {cta}
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </span>
    </button>
  );
}
