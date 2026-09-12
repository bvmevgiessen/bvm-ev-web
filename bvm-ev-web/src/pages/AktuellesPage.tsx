import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import {
  Newspaper,
  CalendarDays,
  BookOpen,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
  X,
  Users,
  Quote,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Card3D from '../components/aktuelles/Card3D';
import NewsPhotoGallery from '../components/NewsPhotoGallery';
import NewsShareButtons from '../components/NewsShareButtons';
import EventCountdownBadge from '../components/EventCountdownBadge';
import { useAktuelles, formatDate, type NewsItem } from '../data/aktuelles';

const TEAL = '#0d9488';
const NAVY = '#0f172a';

function UpdatedBadge({ iso, testid }: { iso?: string; testid?: string }) {
  return (
    <span
      data-testid={testid}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] text-slate-500"
    >
      <RefreshCw size={11} /> Letzte Aktualisierung: {formatDate(iso)}
    </span>
  );
}

export default function AktuellesPage() {
  const feeds = useAktuelles();
  const [openNews, setOpenNews] = useState<NewsItem | null>(null);
  const [slide, setSlide] = useState(0);

  const blogs = feeds.blogs;
  const nextSlide = () => setSlide((s) => (s + 1) % Math.max(blogs.length, 1));
  const prevSlide = () => setSlide((s) => (s - 1 + Math.max(blogs.length, 1)) % Math.max(blogs.length, 1));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ============================ HERO ============================ */}
      <section
        className="relative overflow-hidden pt-[72px] text-white"
        style={{ backgroundColor: NAVY }}
        data-testid="aktuelles-hero"
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #0d9488 0, transparent 40%), radial-gradient(circle at 80% 30%, #f97316 0, transparent 40%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] backdrop-blur">
                <Sparkles size={14} className="text-brand-orange" /> BVM e.V.
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Aktuelles aus dem Verein
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
                Alle Neuigkeiten auf einen Blick – Vereins‑News des letzten Monats mit Vorschau,
                aktuelle Veranstaltungen und frische Blogbeiträge, gebündelt und interaktiv.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#news" data-testid="cta-news" className="inline-flex items-center gap-2 rounded-full bg-brand-teal px-6 py-3 text-sm font-bold text-white transition-all hover:bg-teal-600 hover:shadow-lg active:scale-95">
                  <Newspaper size={16} /> Alle News anzeigen
                </a>
                <a href="#events" data-testid="cta-events" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-brand-orange hover:text-white hover:shadow-lg active:scale-95">
                  <CalendarDays size={16} /> Events im Überblick
                </a>
                <a href="#blogs" data-testid="cta-blogs" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95">
                  <BookOpen size={16} /> Blogbeiträge
                </a>
              </div>
            </motion.div>

            {/* 3D animierte Karten */}
            <div className="relative hidden h-[380px] lg:block" data-testid="hero-3d-cards">
              {[
                { icon: Newspaper, label: 'News', color: TEAL, rot: -8, x: 0, y: 40, z: 30 },
                { icon: CalendarDays, label: 'Events', color: '#f97316', rot: 4, x: 180, y: 0, z: 60 },
                { icon: BookOpen, label: 'Blogs', color: '#6366f1', rot: 12, x: 340, y: 90, z: 10 },
              ].map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 60, rotate: c.rot * 2 }}
                  animate={{ opacity: 1, y: c.y, rotate: c.rot }}
                  transition={{ delay: 0.15 * i, type: 'spring', stiffness: 60 }}
                  whileHover={{ y: c.y - 16, rotate: 0, scale: 1.05, zIndex: 40 }}
                  className="absolute flex h-56 w-44 flex-col justify-between rounded-3xl p-5 shadow-2xl"
                  style={{ left: c.x, background: c.color, zIndex: c.z }}
                >
                  <c.icon size={34} className="text-white" />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">Aktuelles</p>
                    <p className="text-2xl font-extrabold text-white">{c.label}</p>
                  </div>
                  <div className="h-1.5 w-12 rounded-full bg-white/40" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ NEWS ============================ */}
      <section id="news" className="scroll-mt-20 border-b border-slate-200 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-teal/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand-teal">
              <Newspaper size={13} /> Vereins-News
            </div>
            <UpdatedBadge iso={feeds.lastUpdated?.news} testid="news-updated" />
          </div>
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-brand-navy md:text-4xl">
            News des Vereins <span className="text-slate-400">– Rückblick & Vorschau</span>
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {feeds.news.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card3D data-testid={`news-card-${n.id}`} className="h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
                    <div className="relative h-52 overflow-hidden">
                      <img src={n.image} alt={n.title} loading="lazy" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 to-transparent" />
                      <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${n.category === 'Vorschau' ? 'bg-brand-orange text-white' : 'bg-white/95 text-brand-teal'}`}>
                          {n.category}
                        </span>
                        {n.isAutoGenerated && (
                          <span className="rounded-full bg-teal-900/80 backdrop-blur px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-200">
                            Event-Rückblick
                          </span>
                        )}
                        {n.gallery && n.gallery.length > 0 && (
                          <span className="rounded-full bg-white/90 backdrop-blur px-2.5 py-0.5 text-[9px] font-bold text-brand-navy">
                            {n.gallery.length} Fotos
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <time className="font-mono text-[11px] uppercase tracking-wide text-slate-400">{formatDate(n.date)}</time>
                      <h3 className="mt-1 text-xl font-extrabold leading-snug text-brand-navy">{n.title}</h3>
                      {n.location && (
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin size={12} className="text-brand-teal" /> {n.location}
                        </p>
                      )}
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">{n.shortText}</p>
                      
                      {/* Card Footer: Mehr erfahren + Teilen-Button */}
                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          data-testid={`news-more-${n.id}`}
                          onClick={() => setOpenNews(n)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal px-4 py-2 text-xs sm:text-sm font-bold text-white transition-all hover:gap-2.5 hover:bg-teal-600 active:scale-95"
                        >
                          Mehr erfahren <ArrowRight size={14} />
                        </button>
                        <NewsShareButtons
                          title={n.title}
                          shortText={n.shortText}
                          newsId={n.id}
                          variant="card"
                        />
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ EVENTS ============================ */}
      <section id="events" className="scroll-mt-20 border-b border-slate-200 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">
              <CalendarDays size={13} /> Aktuelle Events
            </div>
            <UpdatedBadge iso={feeds.lastUpdated?.events} testid="events-updated" />
          </div>
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy md:text-4xl">Veranstaltungen</h2>
            <Link to="/events" className="hidden items-center gap-1.5 text-sm font-bold text-brand-teal hover:gap-2.5 sm:inline-flex">
              Alle Events <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {feeds.events.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.07 }}
              >
                <Card3D data-testid={`event-card-${e.id}`} className="h-full">
                  <Link to={e.link} className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md group">
                    <div className="relative h-44 overflow-hidden">
                      <img src={e.image} alt={e.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-orange shadow-sm">
                        {e.category}
                      </span>
                      {/* Countdown Badge: noch X Tage */}
                      <EventCountdownBadge date={e.date} className="absolute right-4 top-4" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <time className="font-mono text-[11px] uppercase tracking-wide text-slate-400">{formatDate(e.date)}</time>
                      <h3 className="mt-1 text-lg font-extrabold leading-snug text-brand-navy group-hover:text-brand-teal transition-colors">{e.title}</h3>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin size={12} className="text-brand-teal" /> {e.location}
                      </p>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">{e.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal group-hover:gap-2.5 transition-all">
                        Details <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ BLOGS (3D-Slider) ============================ */}
      <section id="blogs" className="scroll-mt-20 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
              <BookOpen size={13} /> Aktuelle Blogbeiträge
            </div>
            <UpdatedBadge iso={feeds.lastUpdated?.blogs} testid="blogs-updated" />
          </div>
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy md:text-4xl">Aus dem Blog</h2>
            <div className="flex gap-2">
              <button type="button" data-testid="blog-prev" onClick={prevSlide} aria-label="Vorheriger Beitrag" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition-all hover:border-brand-teal hover:text-brand-teal active:scale-95">
                <ChevronLeft size={18} />
              </button>
              <button type="button" data-testid="blog-next" onClick={nextSlide} aria-label="Nächster Beitrag" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition-all hover:border-brand-teal hover:text-brand-teal active:scale-95">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="[perspective:1400px]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {blogs.map((b, i) => {
                const offset = ((i - slide) % blogs.length + blogs.length) % blogs.length;
                const featured = offset === 0;
                return (
                  <motion.div
                    key={b.id}
                    data-testid={`blog-card-${b.id}`}
                    animate={{
                      rotateY: featured ? 0 : offset === 1 ? -6 : 6,
                      scale: featured ? 1 : 0.96,
                      opacity: featured ? 1 : 0.85,
                    }}
                    transition={{ type: 'spring', stiffness: 80 }}
                    className={`overflow-hidden rounded-3xl border bg-white shadow-md [transform-style:preserve-3d] ${featured ? 'border-brand-teal ring-1 ring-brand-teal/30' : 'border-slate-200'}`}
                  >
                    <Link to={b.link} className="flex h-full flex-col">
                      <div className="relative h-44 overflow-hidden">
                        <img src={b.image} alt={b.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" referrerPolicy="no-referrer" />
                        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                          {b.category}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <time className="font-mono text-[11px] uppercase tracking-wide text-slate-400">{formatDate(b.date)}</time>
                        <h3 className="mt-1 text-lg font-extrabold leading-snug text-brand-navy">{b.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">von {b.author}</p>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">{b.excerpt}</p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal">
                          Weiterlesen <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ NEWS-MODAL ============================ */}
      <AnimatePresence>
        {openNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setOpenNews(null)}
            data-testid="news-modal"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              {/* Modal Header */}
              <div className="relative bg-brand-navy p-6 pb-5 text-white">
                <button
                  type="button"
                  data-testid="news-modal-close"
                  onClick={() => setOpenNews(null)}
                  aria-label="Schließen"
                  className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/90 transition-all hover:bg-white/20 active:scale-95"
                >
                  <X size={18} />
                </button>
                <div className="pr-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-teal px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                      {openNews.category}
                    </span>
                    <time className="font-mono text-[11px] uppercase tracking-wide text-white/70">
                      {formatDate(openNews.date)}
                    </time>
                  </div>
                  <h3 className="mt-2 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                    {openNews.title}
                  </h3>
                </div>
              </div>

              {/* Modal Scrollable Content */}
              <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8 space-y-6">
                {/* Foto-Galerie: Echte Fotos vom Treffen statt Symbolbild */}
                <NewsPhotoGallery
                  gallery={openNews.gallery}
                  fallbackImage={openNews.image}
                  title={openNews.title}
                />

                {openNews.location && (
                  <p className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                    <MapPin size={15} className="text-brand-teal" /> {openNews.location}
                  </p>
                )}

                <p className="text-base leading-relaxed text-slate-700">{openNews.shortText}</p>

                {openNews.highlights.length > 0 && (
                  <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-5">
                    <h4 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-widest text-brand-navy">
                      Wichtige Ergebnisse & Kernpunkte
                    </h4>
                    <ul className="space-y-2.5">
                      {openNews.highlights.map((h, i) => (
                        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-700">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {openNews.speech && (
                  <div className="rounded-2xl border-l-4 border-brand-teal bg-brand-teal/5 p-5">
                    <Quote size={20} className="text-brand-teal" />
                    <p className="mt-2 text-sm italic leading-relaxed text-slate-700">{openNews.speech}</p>
                  </div>
                )}

                {openNews.persons.length > 0 && (
                  <div>
                    <p className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-brand-navy">
                      <Users size={14} className="text-brand-teal" /> Delegation des BVM e.V.
                    </p>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {openNews.persons.map((p) => (
                        <div key={p.name} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <p className="text-sm font-bold text-brand-navy">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teilen-Button für WhatsApp & E-Mail */}
                <NewsShareButtons
                  title={openNews.title}
                  shortText={openNews.shortText}
                  newsId={openNews.id}
                  variant="modal"
                  className="mt-6"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
