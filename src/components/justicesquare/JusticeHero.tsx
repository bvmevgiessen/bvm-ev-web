import React from 'react';
import { Scale, ArrowDown, ExternalLink, ShieldAlert } from 'lucide-react';
import { heroStats } from '../../data/justiceSquare';

export default function JusticeHero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-24 pb-20 overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-teal rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Scale size={14} />
          <span>Menschenrechte & Rechtsstaatlichkeit</span>
        </div>

        {/* Main Headings */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
            JusticeSquare – Dokumentation von Menschenrechtsverletzungen
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            Faktenbasierte, neutrale und verifizierte Erfassung von Berichten internationaler Nichtregierungsorganisationen, Urteilen des Europäischen Gerichtshofs für Menschenrechte (EGMR) sowie relevanter Berichterstattung.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              type="button"
              onClick={() => scrollToSection('news')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Aktuelle Meldungen</span>
              <ArrowDown size={15} />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('reports')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-sm transition-all cursor-pointer"
            >
              <span>NGO-Berichte</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('infografiken')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-sm transition-all cursor-pointer"
            >
              <span>Zahlen & Fakten</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-800 pt-8">
          {heroStats.map((stat) => (
            <div key={stat.id} className="bg-slate-800/60 backdrop-blur-xs rounded-xl p-4 border border-slate-700/60">
              <div className="text-2xl sm:text-3xl font-black text-teal-400 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-slate-300 font-medium leading-relaxed">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
