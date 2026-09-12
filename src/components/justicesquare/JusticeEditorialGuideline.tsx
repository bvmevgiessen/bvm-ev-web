import React from 'react';
import { ShieldCheck, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';

export default function JusticeEditorialGuideline() {
  const principles = [
    {
      title: 'Strenge Faktenorientierung & Primärquellen',
      desc: 'Alle Berichte stützen sich auf verifizierbare Primärquellen internationaler Menschenrechtsorganisationen (z. B. Human Rights Watch, Amnesty International, UN-Gremien) und Urteile ordentlicher Gerichte (insbesondere des EGMR).'
    },
    {
      title: 'Neutraler Tonfall & Sachlichkeit',
      desc: 'Berichterstattung erfolgt nüchtern, faktenbasiert und distanziert. Keine polemischen Formulierungen oder ungeprüfte Gerüchte.'
    },
    {
      title: 'Schutz von Betroffenen & Privatsphäre',
      desc: 'Personenbezogene Angaben werden anonymisiert, wo eine Veröffentlichung Leben, Freiheit oder Familie von Betroffenen gefährden könnte.'
    },
    {
      title: 'Urheberrechtskonformität & Zitate',
      desc: 'Inhalte Dritter werden ausschließlich in Form kurzer redaktioneller Zusammenfassungen mit präziser Quellenangabe und direktem Link zum Original wiedergegeben.'
    }
  ];

  return (
    <section id="guidelines" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">
              <ShieldCheck size={16} />
              <span>Transparenz & Standards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-4">
              Redaktionelle Leitlinien von JusticeSquare
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              JusticeSquare versteht sich als seriöse Dokumentationsplattform für Rechtsstaatlichkeit und Menschenrechte. Um höchste Glaubwürdigkeit zu wahren, verpflichten sich Redaktion und Kuratierung folgenden Grundsätzen:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {principles.map((p, idx) => (
                <div key={idx} className="flex gap-3">
                  <CheckCircle2 size={18} className="text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{p.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
