import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Scale, 
  FileCheck2, 
  Award, 
  SearchCheck, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function JusticeEditorialGuideline() {
  const guidelines = [
    {
      title: 'Strenge Faktenorientierung & Primärquellen',
      desc: 'Alle Darstellungen und Zahlen stützen sich direkt auf überprüfbare Berichte von UN-Gremien, dem EGMR, anerkannter Nichtregierungsorganisationen sowie auf gerichtlich gewürdigte Beweise. Gerüchte oder unbestätigte Behauptungen werden nicht übernommen.',
      icon: <FileCheck2 size={20} className="text-brand-teal" />
    },
    {
      title: 'Neutralität & Verzicht auf Parteipolitik',
      desc: 'JusticeSquare verfolgt keine parteipolitischen Agenden. Das Fundament unserer Arbeit bilden universelle Menschenrechte, das Völkerrecht und die Europäische Menschenrechtskonvention (EMRK).',
      icon: <Scale size={20} className="text-brand-navy" />
    },
    {
      title: 'Klare Trennung von Fakt, Analyse & Zitat',
      desc: 'Berichterstattungen und wissenschaftliche Analysen sind strikt von Sachverhalten getrennt. Volltexte externer Veröffentlichungen werden aus Respekt vor dem Urheberrecht nicht vervielfältigt, sondern verlinkt und zusammengefasst.',
      icon: <SearchCheck size={20} className="text-brand-teal" />
    },
    {
      title: 'Fokus auf Rechtsstaat & Menschenwürde',
      desc: 'Das Recht auf ein faires Verfahren (Art. 6 EMRK) und das Rückwirkungsverbot (Art. 7 EMRK) gelten ausnahmslos für jeden Menschen, unabhängig von politischer, religiöser oder gesellschaftlicher Zugehörigkeit.',
      icon: <ShieldCheck size={20} className="text-brand-navy" />
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-slate-900 via-brand-navy to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-teal text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={14} />
              <span>Transparenz & Standards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Redaktionelle Leitlinien von JusticeSquare
            </h2>
            <p className="text-slate-300 mt-2 text-sm sm:text-base leading-relaxed">
              Glaubwürdigkeit entsteht durch akribische Belegbarkeit. Unsere redaktionellen Grundsätze 
              garantieren eine sachliche, juristisch fundierte und ethisch saubere Aufarbeitung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidelines.map((g, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xs flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0 mt-0.5">
                  {g.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5">
                    {g.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
            <span>Stand der Dokumentation: Laufend aktualisiert (Stand: 2026)</span>
            <span>Herausgegeben im Rahmen der Bildungs- und Aufklärungsarbeit von Bildung und Verständigung Mittelhessen e.V.</span>
          </div>
        </div>
      </div>
    </section>
  );
}