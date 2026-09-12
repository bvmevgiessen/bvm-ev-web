import React, { useState, useEffect } from 'react';
import { BarChart3, Info, ExternalLink } from 'lucide-react';
import { FEEDS_FALLBACK, FEEDS_URL, InfographicDataset } from '../../data/justiceSquare';
import InteractiveChart from './InteractiveChart';

export default function JusticeInfographics() {
  const [datasets, setDatasets] = useState<InfographicDataset[]>(FEEDS_FALLBACK.infographics || []);
  const [activeKey, setActiveKey] = useState<string>(
    FEEDS_FALLBACK.infographics?.[0]?.key || ''
  );

  useEffect(() => {
    let isMounted = true;
    async function loadInfographics() {
      try {
        const res = await fetch(FEEDS_URL);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.infographics && Array.isArray(data.infographics) && data.infographics.length > 0) {
            setDatasets(data.infographics);
            if (!activeKey) {
              setActiveKey(data.infographics[0].key);
            }
          }
        }
      } catch (e) {
        // Fallback pre-set
      }
    }
    loadInfographics();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeDataset = datasets.find((d) => d.key === activeKey) || datasets[0];

  return (
    <section id="infografiken" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
            <BarChart3 size={15} />
            <span>Datengestützte Analyse</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Zahlen & Entwicklungen
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Visuelle Aufbereitung der statistisch erfassten Verfahrenszahlen, Festnahmen und Dekret-Entlassungen.
          </p>
        </div>

        {/* Tab Buttons */}
        {datasets.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {datasets.map((ds) => (
              <button
                key={ds.key}
                type="button"
                onClick={() => setActiveKey(ds.key)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  (activeDataset?.key === ds.key)
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {ds.label || ds.title}
              </button>
            ))}
          </div>
        )}

        {/* Active Chart Card */}
        {activeDataset && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {activeDataset.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                {activeDataset.description}
              </p>
            </div>

            {/* Interactive SVG Chart */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-6 shadow-2xs mb-6">
              <InteractiveChart dataset={activeDataset} />
            </div>

            {/* Source and Context Note */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                <Info size={14} className="text-teal-600 shrink-0" />
                <span>
                  Datenquelle: <strong className="text-slate-700">{activeDataset.source}</strong>
                </span>
              </div>
              <span className="text-slate-400">
                Einheit: {activeDataset.unit || 'Fälle'}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
