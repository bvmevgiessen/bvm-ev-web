import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Newspaper, 
  Search, 
  ExternalLink, 
  Calendar, 
  Tag, 
  Scale, 
  Globe2, 
  Radio, 
  Clock, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { justiceNewsData, JusticeNewsItem, feedMetadata } from '../../data/justiceSquareData';
import { filterNewsItems, extractUniqueNewsTags } from '../../utils/justiceSummaryEngine';

export default function JusticeNews() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'international' | 'exile' | 'court'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tags = useMemo(() => extractUniqueNewsTags(justiceNewsData), []);

  const filteredNews = useMemo(() => {
    return filterNewsItems(justiceNewsData, {
      sourceType: selectedCategory,
      selectedTag: selectedTag,
      searchQuery: searchQuery
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  return (
    <section id="news" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-wider mb-3">
              <Newspaper size={14} />
              <span>Medienspiegel & Urteile</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              Aktuelle Berichterstattung & Rechtsprechung
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl text-base">
              Faktenbasierte Kurzzusammenfassungen aus führenden internationalen Qualitätsmedien, 
              unabhängiger Exil-Presse und bindenden Entscheidungen europäischer Gerichtshöfe.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
            <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-brand-teal" />
              <span>Urheberrechtskonform: 3–4 Sätze & Originalquellen</span>
            </div>
            <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span title={feedMetadata.lastUpdatedFormatted}>Feed synchronisiert ({feedMetadata.totalEntries} Einträge)</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setSelectedCategory('all'); setSelectedTag('all'); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Alle Quellen ({justiceNewsData.length})
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory('court')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'court'
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Scale size={14} className="text-brand-teal" />
                <span>Gerichtsurteile (EGMR/EuGH)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory('international')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'international'
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Globe2 size={14} className="text-brand-teal" />
                <span>Internationale Presse (NYT, Guardian, DW, BBC)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory('exile')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'exile'
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Radio size={14} className="text-brand-teal" />
                <span>Exil-Medien (TR724, Bold Medya)</span>
              </button>
            </div>

            {/* Keyword Search Input */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Stichwort suchen (z. B. Yalçınkaya, KHK)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Tag Pills */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold flex items-center gap-1">
              <Tag size={12} /> Themenfilter:
            </span>
            <button
              type="button"
              onClick={() => setSelectedTag('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedTag === 'all' ? 'bg-brand-teal/15 text-brand-teal font-bold' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Alle Themen
            </button>
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTag(selectedTag === t ? 'all' : t)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedTag === t ? 'bg-brand-teal text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>

        {/* News Cards Grid */}
        {filteredNews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Newspaper size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-brand-navy">Keine Treffer für diese Filterkriterien</h3>
            <p className="text-sm text-slate-500 mt-1">Bitte passen Sie Ihren Suchbegriff oder die Kategorieauswahl an.</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('all'); setSelectedTag('all'); setSearchQuery(''); }}
              className="mt-4 btn-primary py-2 px-4 text-xs cursor-pointer"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => {
              const isCourt = item.sourceType === 'court';
              const isExile = item.sourceType === 'exile';

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header meta */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isCourt 
                          ? 'bg-purple-100 text-purple-800' 
                          : isExile 
                          ? 'bg-amber-100 text-amber-900' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isCourt ? <Scale size={12} /> : <Globe2 size={12} />}
                        {item.categoryLabel}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} />
                        {item.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-brand-navy leading-snug hover:text-brand-teal transition-colors">
                      {item.title}
                    </h3>

                    {/* Date and Source */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2.5 mb-4 pb-3 border-b border-slate-100">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">{item.source}</span>
                    </div>

                    {/* Summary (3-4 sentences fact-based) */}
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Footer & Tags */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-500 font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <a
                      href={item.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between w-full text-xs font-bold text-brand-teal hover:text-teal-800 transition-colors py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100/70"
                    >
                      <span>Originalquelle öffnen</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}