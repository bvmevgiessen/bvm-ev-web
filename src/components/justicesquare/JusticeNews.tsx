import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Search, Filter, Calendar } from 'lucide-react';
import { FEEDS_FALLBACK, FEEDS_URL, NewsItem } from '../../data/justiceSquare';

export default function JusticeNews() {
  const [news, setNews] = useState<NewsItem[]>(FEEDS_FALLBACK.news || []);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Alle');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadFeeds() {
      try {
        setLoading(true);
        const res = await fetch(FEEDS_URL);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.news && Array.isArray(data.news) && data.news.length > 0) {
            setNews(data.news);
          }
        }
      } catch (e) {
        // Fallback already pre-set
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadFeeds();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['Alle', ...Array.from(new Set(news.map(n => n.category).filter(Boolean)))];

  const filteredNews = news.filter(item => {
    const matchesCategory = categoryFilter === 'Alle' || item.category === categoryFilter;
    const matchesSearch = !search || 
      item.title.toLowerCase().includes(search.toLowerCase()) || 
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.source.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="news" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-teal mb-2">
              <Newspaper size={15} />
              <span>Verifizierte Berichterstattung</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Aktuelle Meldungen & Presse
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Ausgewählte, faktengeprüfte Meldungen aus internationalen und Exil-Medien zur Menschenrechtssituation.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Thema oder Quelle suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter size={13} />
              Kategorie:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* News Cards Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-sm">
            Keine Meldungen für diese Suchkriterien gefunden.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-brand-teal px-2 py-0.5 bg-teal-50 border border-teal-100 rounded-md">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar size={13} />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-2 line-clamp-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-teal transition-colors"
                  >
                    {item.title}
                  </a>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-grow line-clamp-3">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 text-xs mt-auto">
                  <span className="font-medium text-slate-500">
                    Quelle: <strong className="text-slate-700">{item.source}</strong>
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-teal hover:text-teal-700 font-semibold transition-colors"
                  >
                    <span>Original lesen</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
