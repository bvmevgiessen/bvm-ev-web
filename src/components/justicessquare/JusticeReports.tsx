import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  ExternalLink, 
  FileCheck, 
  ShieldAlert, 
  CheckCircle, 
  Award, 
  Search,
  Building2,
  Bookmark
} from 'lucide-react';
import { justiceReportsData } from '../../data/justiceSquareData';
import { filterReports } from '../../utils/justiceSummaryEngine';

export default function JusticeReports() {
  const [reportQuery, setReportQuery] = useState('');

  const filteredReports = filterReports(justiceReportsData, reportQuery);

  return (
    <section id="reports" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen size={14} />
              <span>Internationale Institutionen</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              Berichte, Gutachten & Analysen
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl text-base">
              Fundierte Untersuchungen renommierter Menschenrechtsorganisationen, der Vereinten Nationen und 
              internationaler Justizorgane zur systematischen Aushöhlung von Rechtsstaatlichkeit und Grundrechten.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={reportQuery}
                onChange={(e) => setReportQuery(e.target.value)}
                placeholder="Berichte durchsuchen..."
                className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal"
              />
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredReports.map((report) => (
            <motion.article
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50/70 hover:bg-slate-50 rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Institution & Year Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-white border border-slate-200 text-brand-navy shadow-2xs">
                      <Building2 size={16} />
                    </span>
                    <span className="font-extrabold text-sm text-brand-navy">
                      {report.institution}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${report.badgeColor}`}>
                    {report.year} {report.referenceNumber ? `• ${report.referenceNumber}` : ''}
                  </span>
                </div>

                {/* Report Title */}
                <h3 className="text-xl font-bold text-brand-navy mb-4 leading-snug">
                  {report.title}
                </h3>

                {/* Kernaussagen (Key Points) */}
                <div className="mb-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <FileCheck size={14} className="text-brand-teal" />
                    <span>Wichtigste Kernaussagen:</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {report.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0 mt-2" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Relevanz für Gülen-Bewegung */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5 flex items-center gap-1.5">
                    <Bookmark size={13} className="text-amber-700" />
                    <span>Relevanz für die Gülen-Bewegung:</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-950/85 leading-relaxed">
                    {report.relevance}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">Verifizierter Primärquellen-Link</span>
                <a
                  href={report.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary py-2 px-4 text-xs flex items-center gap-2"
                >
                  <span>Vollständigen Bericht lesen</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
