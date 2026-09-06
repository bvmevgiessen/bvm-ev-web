import React, { useMemo, useState } from 'react';
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
} from 'lucide-react';
import Navbar from '../components/Navbar';
import InteractiveChart from '../components/justicesquare/InteractiveChart';
import {
  newsItems,
  reportItems,
  infographicDatasets,
  mediaItems,
  usefulLinks,
  heroStats,
  type NewsCategory,
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

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <motion.div {...fadeUp} className="mb-10 max-w-3xl">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#0F2942]/8 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F2942]">
        <Icon size={13} /> {eyebrow}
      </div>
      <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-slate-600">{subtitle}</p>
    </motion.div>
  );
}

const newsCategoryStyle: Record<NewsCategory, string> = {
  'Internationale Medien': 'bg-blue-50 text-blue-700 border-blue-200',
  'Exil-Medien': 'bg-amber-50 text-amber-700 border-amber-200',
  Gerichtsurteil: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const mediaTypeIcon = {
  'Experten-Interview': Radio,
  Dokumentation: Film,
  Erklärvideo: PlayCircle,
  'Audio-Statement': Headphones,
} as const;

export default function JusticeSquarePage() {
  const [newsFilter, setNewsFilter] = useState<'Alle' | NewsCategory>('Alle');
  const [reportFilter, setReportFilter] = useState<string>('Alle');
  const [chartKey, setChartKey] = useState(infographicDatasets[0].key);
  const [mediaFilter, setMediaFilter] = useState<string>('Alle');

  const newsCats: ('Alle' | NewsCategory)[] = ['Alle', 'Internationale Medien', 'Exil-Medien', 'Gerichtsurteil'];
  const filteredNews = useMemo(
    () => (newsFilter === 'Alle' ? newsItems : newsItems.filter((n) => n.category === newsFilter)),
    [newsFilter]
  );

  const reportInstitutions = ['Alle', ...Array.from(new Set(reportItems.map((r) => r.institution)))];
  const filteredReports = useMemo(
    () => (reportFilter === 'Alle' ? reportItems : reportItems.filter((r) => r.institution === reportFilter)),
    [reportFilter]
  );

  const activeDataset = infographicDatasets.find((d) => d.key === chartKey)!;

  const mediaTypes = ['Alle', ...Array.from(new Set(mediaItems.map((m) => m.type)))];
  const filteredMedia = useMemo(
    () => (mediaFilter === 'Alle' ? mediaItems : mediaItems.filter((m) => m.type === mediaFilter)),
    [mediaFilter]
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
        {/* subtle grid */}
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
              Dokumentation von Menschenrechtsverletzungen gegen die Gülen‑Bewegung – faktenbasiert,
              strukturiert und journalistisch sauber. Wir bündeln Gerichtsurteile, UN‑Berichte,
              NGO‑Analysen und seriöse Medienberichterstattung.
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

          {/* stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3"
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
            title="Aktuelle Nachrichten & Gerichtsurteile"
            subtitle="Kuratierte Kurz‑Zusammenfassungen aus internationalen Medien, türkischen Exil‑Medien und aktuellen Gerichtsentscheidungen. Volltexte werden aus Urheberrechtsgründen nicht wiedergegeben – jede Karte verlinkt die Originalquelle."
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
                  <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${newsCategoryStyle[n.category]}`}>
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
        </div>
      </section>

      {/* ============================ REPORTS ============================ */}
      <section id="reports" className="scroll-mt-20 border-b border-slate-200 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Reports"
            icon={FileText}
            title="Berichte internationaler Institutionen"
            subtitle="Strukturierte Zusammenfassungen führender Menschenrechtsinstitutionen – mit Kernaussagen, Relevanz für die Gülen‑Bewegung und Link zum Originalbericht."
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
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F2942] text-white">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="font-serif text-base font-bold text-slate-900">{r.institution}</p>
                      <p className="font-mono text-[11px] uppercase tracking-wide text-slate-500">{r.year}</p>
                    </div>
                  </div>
                </div>

                <h3 className="font-serif text-xl font-semibold leading-snug text-slate-900">{r.title}</h3>

                <p className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Wichtigste Erkenntnisse
                </p>
                <ul className="mt-2 space-y-2">
                  {r.keyFindings.map((f, idx) => (
                    <li key={idx} className="flex gap-2.5 text-sm leading-relaxed text-slate-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-xl border-l-4 border-[#0F2942] bg-white p-4">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#0F2942]">
                    Relevanz für die Gülen‑Bewegung
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{r.relevance}</p>
                </div>

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
            eyebrow="Infografiken"
            icon={BarChart3}
            title="Interaktive Daten & Diagramme"
            subtitle="Datengestützte Visualisierungen zu zentralen Fragestellungen. Fahren Sie mit der Maus über die Diagramme, um Detailwerte anzuzeigen."
          />

          <div className="mb-6 flex flex-wrap gap-2" data-testid="infographic-tabs">
            {infographicDatasets.map((d) => (
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
        </div>
      </section>

      {/* ============================ MULTIMEDIA ============================ */}
      <section id="multimedia" className="scroll-mt-20 border-b border-slate-200 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Multimedia"
            icon={Video}
            title="Interviews, Dokumentationen & Audio"
            subtitle="Experteninterviews, Dokumentationen, Erklärvideos und Audio‑Statements. Die Inhalte öffnen sich in einem neuen Tab bei der jeweiligen Quelle."
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
              const TypeIcon = mediaTypeIcon[m.type];
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
            subtitle="Direkter Zugang zu den Portalen führender Institutionen und Urteilsdatenbanken für die eigene Weiterrecherche."
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

          {/* Editorial guideline */}
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
              wahren. Angegebene Zahlen sind aggregierte Richtwerte auf Basis der zitierten Institutionen.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
