import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Scale,
  FileText,
  BarChart3,
  Video,
  ExternalLink,
  ShieldCheck,
  Globe,
  Newspaper,
  Gavel,
  Radio,
  PlayCircle,
  Headphones,
  Film,
  Info,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import InteractiveChart from '../components/justicesquare/InteractiveChart';
import {
  usefulLinks,
  heroStats,
  FEEDS_FALLBACK,
  FEEDS_URL,
  type JusticeFeeds,
  type NewsItem,
} from '../data/justiceSquare';

const NAVY = '#0F2942';

const sectionNav = [
  { id: 'news', label: 'Aktuelle News', icon: Newspaper },
  { id: 'reports', label: 'Berichte & Analysen', icon: FileText },
  { id: 'infografiken', label: 'Infografiken', icon: BarChart3 },
  { id: 'multimedia', label: 'Multimedia', icon: Video },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

function formatDate(iso?: string) {
  if (!iso) return '–';
  try {
    return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return '–';
  }
}

function UpdatedBadge({ iso }: { iso?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] text-slate-500"
      data-testid="last-updated-badge"
    >
      <RefreshCw size={11} /> Letzte Aktualisierung: {formatDate(iso)}
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  updated,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  updated?: string;
}) {
  return (
    <motion.div {...fadeUp} className="mb-10 max-w-3xl">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#0F2942]/8 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F2942]">
          <Icon size={13} /> {eyebrow}
        </div>
        {updated && <UpdatedBadge iso={updated} />}
      </div>
      <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-slate-600">{subtitle}</p>
    </motion.div>
  );
}

const newsCategoryStyle: Record<string, string> = {
  'Internationale Medien': 'bg-blue-50 text-blue-700 border-blue-200',
  'Exil-Medien': 'bg-amber-50 text-amber-700 border-amber-200',
  Gerichtsurteil: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const mediaTypeIcon: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Experten-Interview': Radio,
  Dokumentation: Film,
  Erklärvideo: PlayCircle,
  'Audio-Statement': Headphones,
};

export default function JusticeSquarePage() {
  const [feeds, setFeeds] = useState<JusticeFeeds>(FEEDS_FALLBACK);

  useEffect(() => {
    let active = true;
    fetch(FEEDS_URL, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: JusticeFeeds) => {
        if (active && data && Array.isArray(data.news)) setFeeds(data);
      })
      .catch(() => {
        /* Build-Fallback bleibt aktiv */
      });
    return () => {
      active = false;
    };
  }, []);

  const [newsFilter, setNewsFilter] = useState<string>('Alle');
  const [reportFilter, setReportFilter] = useState<string>('Alle');
  const [chartKey, setChartKey] = useState<string>(feeds.infographics[0]?.key ?? '');
  const [mediaFilter, setMediaFilter] = useState<string>('Alle');

  useEffect(() => {
    if (!feeds.infographics.find((d) => d.key === chartKey)) {
      setChartKey(feeds.infographics[0]?.key ?? '');
    }
  }, [feeds, chartKey]);

  const newsCats = ['Alle', 'Internationale Medien', 'Exil-Medien', 'Gerichtsurteil'];
  const filteredNews: NewsItem[] = useMemo(
    () => (newsFilter === 'Alle' ? feeds.news : feeds.news.filter((n) => n.category === newsFilter)),
    [feeds, newsFilter]
  );

  const reportInstitutions = ['Alle', ...Array.from(new Set(feeds.reports.map((r) => r.institution)))];
  const filteredReports = useMemo(
    () => (reportFilter === 'Alle' ? feeds.reports : feeds.reports.filter((r) => r.institution === reportFilter)),
    [feeds, reportFilter]
  );

  const activeDataset = feeds.infographics.find((d) => d.key === chartKey) ?? feeds.infographics[0];

  const mediaTypes = ['Alle', ...Array.from(new Set(feeds.multimedia.map((m) => m.type)))];
  const filteredMedia = useMemo(
    () => (mediaFilter === 'Alle' ? feeds.multimedia : feeds.multimedia.filter((m) => m.type === mediaFilter)),
    [feeds, mediaFilter]
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* ============================ HERO ============================ */}
      <section
        className="relative overflow-hidden pt-[72px] text-white"
        style={{ backgroundColor: NAVY }}
        data-testid="justicesquare-hero"
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${NAVY} 30%, rgba(15,41,66,0.75) 100%)` }} />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] backdrop-blur">
              <Scale size={14} className="text-amber-400" /> Menschenrechtsinitiative
            </div>
            <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              JusticeSquare
            </h1>
            <p className="mt-3 font-serif text-xl font-medium text-amber-300 sm:text-2xl">
              Menschenrechte, Freiheit &amp; Gerechtigkeit
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-200">
              Dokumentation von Menschenrechtsverletzungen gegen die Gülen‑/Hizmet‑Bewegung – faktenbasiert,
              strukturiert und journalistisch sauber. Wir bündeln Gerichtsurteile, UN‑Berichte,
              NGO‑Analysen und seriöse Medienberichterstattung – automatisiert aktualisiert.
            </p>

            <div className="mt-8 flex flex-wrap gap-3" data-testid="hero-section-nav">
              {sectionNav.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  data-testid={`hero-nav-${s.id}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0F2942] transition-all hover:bg-amber-400 hover:shadow-lg active:scale-95"
                >
                  <s.icon size={16} />
                  {s.label}
                  <ArrowUpRight size={14} className="opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {heroStats.map((st) => (
              <div
                key={st.id}
                data-testid={`hero-stat-${st.id}`}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur"
              >
                <p className="font-serif text-2xl font-bold text-white">{st.value}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{st.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================ NEWS ============================ */}
      <section id="news" className="scroll-mt-20 border-b border-slate-200 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="News"
            icon={Newspaper}
            title="Aktuelle News"
            subtitle="Automatisch aktualisierte Kurz‑Zusammenfassungen aus internationalen Medien, türkischen Exil‑Medien und aktuellen Gerichtsentscheidungen. Volltexte werden aus Urheberrechtsgründen nicht wiedergegeben – jede Karte verlinkt exakt die Originalquelle."
            updated={feeds.lastUpdated?.news}
          />

          <div className="mb-8 flex flex-wrap gap-2" data-testid="news-filters">
            {newsCats.map((c) => (
              <button
                key={c}
                data-testid={`news-filter-${c}`}
                onClick={() => setNewsFilter(c)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  newsFilter === c
                    ? 'border-[#0F2942] bg-[#0F2942] text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-[#0F2942]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {filteredNews.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500" data-testid="news-empty">
              Aktuell keine Einträge in dieser Kategorie.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNews.map((n, i) => (
                <motion.article
                  key={n.id}
                  data-testid={`news-card-${n.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.06 }}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${newsCategoryStyle[n.category] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                      {n.category === 'Gerichtsurteil' && <Gavel size={10} className="mr-1 inline" />}
                      {n.category}
                    </span>
                    <time className="font-mono text-[11px] text-slate-400">
                      {new Date(n.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </time>
                  </div>
                  <h3 className="font-serif text-lg font-semibold leading-snug text-slate-900">{n.title}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-[#0F2942]">{n.source}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{n.summary}</p>
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`news-link-${n.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F2942] transition-all hover:gap-2.5"
                  >
                    Zur Originalquelle <ExternalLink size={14} />
                  </a>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================ REPORTS ============================ */}
      <section id="reports" className="scroll-mt-20 border-b border-slate-200 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Reports"
            icon={FileText}
            title="Berichte & Analysen"
            subtitle="Strukturierte Zusammenfassungen führender Menschenrechtsinstitutionen, NGOs und Monitoring-Projekte – mit Titel, Datum, Institution, Kurz‑Zusammenfassung und Link zum Originalbericht."
            updated={feeds.lastUpdated?.reports}
          />

          <div className="mb-8 flex flex-wrap gap-2" data-testid="report-filters">
            {reportInstitutions.map((inst) => (
              <button
                key={inst}
                data-testid={`report-filter-${inst}`}
                onClick={() => setReportFilter(inst)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  reportFilter === inst
                    ? 'border-[#0F2942] bg-[#0F2942] text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-[#0F2942]'
                }`}
              >
                {inst}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {filteredReports.map((r, i) => (
              <motion.article
                key={r.id}
                data-testid={`report-card-${r.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.08 }}
                className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/60 p-7 transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F2942] text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="font-serif text-base font-bold text-slate-900">{r.institution}</p>
                    <p className="font-mono text-[11px] uppercase tracking-wide text-slate-500">{formatDate(r.date)}</p>
                  </div>
                </div>

                <h3 className="font-serif text-xl font-semibold leading-snug text-slate-900">{r.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">{r.summary}</p>

                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`report-link-${r.id}`}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#0F2942] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#163B61] hover:shadow-md active:scale-95"
                >
                  Originalbericht öffnen <ExternalLink size={14} />
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ INFOGRAFIKEN ============================ */}
      <section id="infografiken" className="scroll-mt-20 border-b border-slate-200 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Statistiken"
            icon={BarChart3}
            title="Interaktive Infografiken & Statistiken"
            subtitle="Datengestützte Visualisierungen zu zentralen Fragestellungen. Fahren Sie mit der Maus über die Diagramme, um Detailwerte anzuzeigen."
            updated={feeds.lastUpdated?.infographics}
          />

          {activeDataset && (
            <>
              <div className="mb-6 flex flex-wrap gap-2" data-testid="infographic-tabs">
                {feeds.infographics.map((d) => (
                  <button
                    key={d.key}
                    data-testid={`infographic-chart-tab-${d.key}`}
                    onClick={() => setChartKey(d.key)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                      chartKey === d.key
                        ? 'border-[#0F2942] bg-[#0F2942] text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-[#0F2942]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <motion.div
                key={activeDataset.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 gap-6 lg:grid-cols-3"
              >
                <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
                  <h3 className="font-serif text-xl font-semibold text-slate-900">{activeDataset.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">Angabe in: {activeDataset.unit}</p>
                  <div className="mt-4">
                    <InteractiveChart dataset={activeDataset} />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <p className="text-sm leading-relaxed text-slate-700">{activeDataset.description}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-6" style={{ backgroundColor: NAVY }}>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-300">
                      Höchstwert im Datensatz
                    </p>
                    <p className="mt-1 font-serif text-3xl font-bold text-white">
                      {Math.max(...activeDataset.data.map((d) => d.value)).toLocaleString('de-DE')}
                    </p>
                    <p className="text-xs text-slate-300">{activeDataset.unit}</p>
                  </div>
                  <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <Info size={16} className="mt-0.5 shrink-0 text-amber-600" />
                    <p className="text-xs leading-relaxed text-amber-800">
                      <strong>Quelle:</strong> {activeDataset.source} Werte sind aggregierte Richtwerte zur
                      Größenordnung.
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* ============================ MULTIMEDIA ============================ */}
      <section id="multimedia" className="scroll-mt-20 border-b border-slate-200 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Multimedia"
            icon={Video}
            title="Multimedia"
            subtitle="Experteninterviews, Dokumentationen, Erklärvideos und Audio‑Statements. Die Inhalte öffnen sich in einem neuen Tab bei der jeweiligen Quelle."
            updated={feeds.lastUpdated?.multimedia}
          />

          <div className="mb-8 flex flex-wrap gap-2" data-testid="multimedia-filters">
            {mediaTypes.map((t) => (
              <button
                key={t}
                data-testid={`multimedia-filter-${t}`}
                onClick={() => setMediaFilter(t)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  mediaFilter === t
                    ? 'border-[#0F2942] bg-[#0F2942] text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-[#0F2942]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMedia.map((m, i) => {
              const TypeIcon = mediaTypeIcon[m.type] ?? PlayCircle;
              return (
                <motion.a
                  key={m.id}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`multimedia-card-${m.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.06 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={m.thumbnail}
                      alt={m.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F2942]/70 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle size={52} className="text-white/90 drop-shadow-lg transition-transform group-hover:scale-110" />
                    </div>
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#0F2942]">
                      <TypeIcon size={11} /> {m.type}
                    </span>
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 font-mono text-[11px] text-white">
                      {m.duration}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-base font-semibold leading-snug text-slate-900 group-hover:text-[#0F2942]">
                      {m.title}
                    </h3>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-slate-500">{m.source}</p>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{m.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F2942]">
                      Ansehen / Anhören <ExternalLink size={13} />
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ USEFUL LINKS ============================ */}
      <section id="links" className="scroll-mt-20 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Ressourcen"
            icon={Globe}
            title="Nützliche Links & Datenbanken"
            subtitle="Direkter Zugang zu den Portalen führender Institutionen, NGOs und Urteilsdatenbanken für die eigene Weiterrecherche."
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {usefulLinks.map((l, i) => (
              <motion.a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`useful-link-button-${l.id}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 5) * 0.04 }}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#0F2942] hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F2942]/8 text-[#0F2942]">
                    <Globe size={16} />
                  </div>
                  <ArrowUpRight size={16} className="text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0F2942]" />
                </div>
                <div>
                  <p className="font-serif text-sm font-semibold leading-snug text-slate-900">{l.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{l.description}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            {...fadeUp}
            className="mt-14 rounded-2xl border border-slate-200 bg-white p-7"
            data-testid="editorial-guideline"
          >
            <div className="flex items-center gap-2 text-[#0F2942]">
              <Scale size={18} />
              <h3 className="font-serif text-lg font-bold">Redaktionelle Leitlinie</h3>
            </div>
            <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600">
              JusticeSquare informiert neutral, faktenbasiert und journalistisch sauber. Wir verzichten auf
              politische Parolen und trennen klar zwischen Fakten, Analysen und Meinungen. Der Fokus liegt auf
              Menschenrechten, Rechtsstaatlichkeit und internationalen Standards. Quellenangaben sind stets
              sichtbar; es werden ausschließlich Kurz‑Zusammenfassungen bereitgestellt, um das Urheberrecht zu
              wahren. News werden wöchentlich, Berichte, Statistiken und Multimedia monatlich über einen
              automatisierten Workflow aktualisiert. Angegebene Zahlen sind aggregierte Richtwerte auf Basis
              der zitierten Institutionen.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
