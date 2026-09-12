import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink, ShieldCheck, Search, Building2 } from 'lucide-react';
import { FEEDS_FALLBACK, FEEDS_URL, ReportItem } from '../../data/justiceSquare';

export default function JusticeReports() {
  const [reports, setReports] = useState<ReportItem[]>(FEEDS_FALLBACK.reports || []);
  const [search, setSearch] = useState('');
  const [selectedInst, setSelectedInst] = useState<string>('Alle');

  useEffect(() => {
    let isMounted = true;
    async function loadReports() {
      try {
        const res = await fetch(FEEDS_URL);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.reports && Array.isArray(data.reports) && data.reports.length > 0) {
            setReports(data.reports);
          }
        }
      } catch (e) {
        // Fallback pre-set
      }
    }
    loadReports();
    return () => {
      isMounted = false;
    };
  }, []);

  const institutions = ['Alle', ...Array.from(new Set(reports.map(r => r.institution).filter(Boolean)))];

  const filteredReports = reports.filter((rep) => {
    const matchesInst = selectedInst === 'Alle' || rep.institution === selectedInst;
    const matchesSearch = !search ||
      rep.title.toLowerCase().includes(search.toLowerCase()) ||
      rep.summary.toLowerCase().includes(search.toLowerCase()) ||
      rep.institution.toLowerCase().includes(search.toLowerCase());
    return matchesInst && matchesSearch;
  });

  return (
    <section id="reports" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
              <FileText size={15} />
              <span>Primärquellen & Dokumentation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Internationale NGO- & UN-Berichte
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Umfassende Berichte von Human Rights Watch, den Vereinten Nationen, Gerichtsdatenbanken und Menschenrechtsinitiativen.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Bericht oder Organisation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Institution filter */}
        {institutions.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Building2 size={13} />
              Organisation:
            </span>
            {institutions.map((inst) => (
              <button
                key={inst}
                type="button"
                onClick={() => setSelectedInst(inst)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedInst === inst
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {inst}
              </button>
            ))}
          </div>
        )}

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col hover:border-teal-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="font-semibold text-slate-800 px-2.5 py-1 bg-slate-100 rounded-md">
                  {rep.institution}
                </span>
                <span className="text-slate-400 font-mono">{rep.date}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3">
                <a
                  href={rep.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-teal transition-colors"
                >
                  {rep.title}
                </a>
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
                {rep.summary}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <ShieldCheck size={14} className="text-teal-600" />
                  <span>Verifizierte Primärquelle</span>
                </span>
                <a
                  href={rep.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-brand-teal hover:bg-teal-100 font-semibold transition-colors"
                >
                  <span>Vollständigen Bericht aufrufen</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
