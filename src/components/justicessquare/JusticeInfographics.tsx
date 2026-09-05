import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  ShieldAlert, 
  Scale, 
  Globe, 
  CheckCircle2, 
  Info, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { infographicSections, InfographicSection, StatMetric } from '../../data/justiceSquareData';

export default function JusticeInfographics() {
  const [activeTabId, setActiveTabId] = useState<string>(infographicSections[0].id);

  const currentSection: InfographicSection = infographicSections.find((s: InfographicSection) => s.id === activeTabId) || infographicSections[0];

  return (
    <section id="infografiken" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <BarChart3 size={14} />
            <span>Fakten & Daten</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Interaktive Infografiken & Statistiken
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            Belastbare Zahlen, behördliche Erhebungen und verifizierte Auswertungen internationaler Institutionen 
            zu Verhaftungswellen, Foltervorwürfen, Asylzahlen und Gerichtsurteilen seit 2016.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 p-1.5 bg-slate-200/60 rounded-2xl w-fit">
          {infographicSections.map((sec: InfographicSection) => {
            const isActive = sec.id === activeTabId;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveTabId(sec.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive 
                    ? 'bg-brand-navy text-white shadow-sm' 
                    : 'text-slate-600 hover:text-brand-navy hover:bg-slate-200/50'
                }`}
              >
                <span>{sec.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Active Section Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Title & Description Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-brand-navy mb-2">
                  {currentSection.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                  {currentSection.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shrink-0">
                <FileSpreadsheet size={16} className="text-brand-teal" />
                <span>Datenbasis: Internationale UN & Justizberichte</span>
              </div>
            </div>

            {/* 4 Large Highlight Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentSection.keyMetrics.map((metric: StatMetric, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-teal/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-1">
                      {metric.label}
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-brand-navy group-hover:text-brand-teal transition-colors tracking-tight mb-2">
                      {metric.value}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                      {metric.subtext}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Info size={12} className="shrink-0 text-brand-teal" />
                    <span className="truncate">Quelle: {metric.source}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Chart / Breakdown Section */}
            {currentSection.chartData && currentSection.chartData.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h4 className="text-lg font-bold text-brand-navy mb-1 flex items-center gap-2">
                  <TrendingUp size={18} className="text-brand-teal" />
                  <span>Strukturierte Aufschlüsselung nach Indikatoren & Sektoren</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                  Verifizierte Kennzahlen aus offiziellen Gerichtsdatenbanken und institutionellen Jahresberichten
                </p>

                <div className="space-y-4">
                  {currentSection.chartData.map((bar: { name: string; value: number; formatted: string; note?: string }, i: number) => {
                    const maxValue = Math.max(...(currentSection.chartData || []).map(b => b.value), 100);
                    const percentage = Math.min(100, Math.max(10, Math.round((bar.value / maxValue) * 100)));
                    return (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="font-semibold text-slate-700">{bar.name} {bar.note ? `(${bar.note})` : ''}</span>
                          <span className="font-bold text-brand-navy">{bar.formatted}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="bg-brand-teal h-full rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Findings and Sources 2-Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Detailed Findings */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h4 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-brand-teal" />
                  <span>Dokumentierte Kernbefunde</span>
                </h4>
                <ul className="space-y-3">
                  {currentSection.detailedFindings.map((finding: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <ChevronRight size={16} className="text-brand-teal shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Official Sources Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold text-brand-navy mb-2 flex items-center gap-2">
                    <Scale size={18} className="text-brand-navy" />
                    <span>Verifizierte Primärquellen</span>
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Offizielle Dokumente und Berichte, auf denen diese Auswertung beruht:
                  </p>
                  <div className="space-y-2.5">
                    {currentSection.officialSources.map((src: { name: string; url: string }, idx: number) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-brand-teal transition-all"
                      >
                        <span className="truncate pr-2">{src.name}</span>
                        <ExternalLink size={13} className="shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                  Transparenzgebot: Alle Statistiken verweisen auf publizierte Dokumente internationaler Fachgremien.
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}