import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Newspaper,
  CalendarDays,
  BookOpen,
  ArrowRight,
  Clock,
  Building2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles
} from 'lucide-react';
import EventCountdownBadge from './EventCountdownBadge';
import { useAktuelles, formatDate } from '../data/aktuelles';

export interface UnifiedFeedItem {
  category: 'news' | 'event' | 'blog';
  title: string;
  summary: string;
  date: string;
  image: string;
  link: string;
  author?: string;
  location?: string;
  sourceId?: string;
}

const AUTOPLAY_INTERVAL_MS = 5000;

export default function HomeAktuellesHeader() {
  const feeds = useAktuelles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Normalisiert Asset-URLs (z.B. relative Bilder in /assets/...)
  const normalizeAssetUrl = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('//')) {
      return url;
    }
    const base = import.meta.env.BASE_URL || '/';
    const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${prefix}${path}`;
  };

  // Erzeuge die strukturierte Liste gemäß USER_REQUEST:
  // - Top 3 News, Top 3 Events, Top 3 Blogs (innerhalb von ~1 Monat davor bis danach)
  // - Abwechselnde Reihenfolge: News -> Events -> Blog -> wieder News
  const items: UnifiedFeedItem[] = useMemo(() => {
    const rawNews = feeds.news || [];
    const rawEvents = feeds.events || [];
    const rawBlogs = feeds.blogs || [];

    // Hilfsfunktion: Veranstalter für Events ermitteln (Vereinsplattform / Kooperationspartner)
    const getEventOrganizer = (e: any): string => {
      if (e.organizer && typeof e.organizer === 'string') return e.organizer;
      if (e.veranstalter && typeof e.veranstalter === 'string') return e.veranstalter;
      const combined = `${e.title || ''} ${e.description || ''}`.toLowerCase();
      if (combined.includes('philippusgemeinde')) {
        return 'BVM e.V. & Evangelische Philippusgemeinde';
      }
      if (e.category === 'DIALOG' || (e.stream && e.stream.includes('Dialog')) || combined.includes('interreligiös') || combined.includes('dialog')) {
        return 'BVM e.V. Dialogplattform';
      }
      if (e.category === 'JUGEND' || (e.stream && e.stream.includes('Youth')) || combined.includes('jugend')) {
        return 'BVM e.V. Jugendplattform';
      }
      if (e.category === 'FRAUEN' || combined.includes('frauen') || combined.includes('matinée')) {
        return 'BVM e.V. Frauenplattform';
      }
      if (combined.includes('sprachcafé') || combined.includes('seniorenhaus')) {
        return 'BVM e.V. Soziales & Community';
      }
      return 'BVM e.V.';
    };

    // Hilfsfunktion: Verein für Blogs ermitteln
    const getBlogVerein = (b: any): string => {
      if (b.partnerName && typeof b.partnerName === 'string') return b.partnerName;
      if (b.author && typeof b.author === 'string') return b.author;
      return 'BVM e.V.';
    };

    // Strikte Filterung: Events und Blogs müssen innerhalb von einem Monat vor und nach heute liegen (±31 Tage)
    const ONE_MONTH_MS = 31 * 24 * 60 * 60 * 1000;
    const nowMs = Date.now();
    const isWithinOneMonth = (dateStr?: string): boolean => {
      if (!dateStr) return false;
      const t = new Date(dateStr).getTime();
      if (isNaN(t)) return false;
      return t >= nowMs - ONE_MONTH_MS && t <= nowMs + ONE_MONTH_MS;
    };

    const validEvents = rawEvents.filter((e) => isWithinOneMonth(e.date));
    const validBlogs = rawBlogs.filter((b) => isWithinOneMonth(b.date));

    // 1. News aufbereiten (bis zu 3) - Alle News sind vom BVM e.V.
    const newsList: UnifiedFeedItem[] = rawNews.slice(0, 3).map((n) => ({
      category: 'news',
      title: n.title,
      summary: n.shortText || (n.highlights && n.highlights[0]) || '',
      date: n.date,
      image: normalizeAssetUrl(n.image),
      link: '/aktuelles#news',
      author: 'BVM e.V.',
      location: n.location,
      sourceId: n.id,
    }));

    // 2. Events aufbereiten (bis zu 3) - Veranstalter (nur innerhalb von 1 Monat)
    const eventsList: UnifiedFeedItem[] = validEvents.slice(0, 3).map((e) => ({
      category: 'event',
      title: e.title,
      summary: e.description || '',
      date: e.date,
      image: normalizeAssetUrl(e.image),
      link: e.link || `/events/${e.id}`,
      author: getEventOrganizer(e),
      location: e.location,
      sourceId: e.id,
    }));

    // 3. Blogs aufbereiten (bis zu 3) - Verein aus dem der Blog stammt (nur innerhalb von 1 Monat)
    const blogsList: UnifiedFeedItem[] = validBlogs.slice(0, 3).map((b) => ({
      category: 'blog',
      title: b.title,
      summary: b.excerpt || '',
      date: b.date,
      image: normalizeAssetUrl(b.image),
      link: b.link || `/blog/${b.id}`,
      author: getBlogVerein(b),
      sourceId: b.id,
    }));

    // Verschachtelte Reihenfolge gemäß Spezifikation: News -> Event -> Blog -> News -> Event -> Blog ...
    const interleaved: UnifiedFeedItem[] = [];
    const maxLen = Math.max(newsList.length, eventsList.length, blogsList.length);
    for (let i = 0; i < maxLen; i++) {
      if (newsList[i]) interleaved.push(newsList[i]);
      if (eventsList[i]) interleaved.push(eventsList[i]);
      if (blogsList[i]) interleaved.push(blogsList[i]);
    }

    return interleaved.length > 0 ? interleaved : newsList;
  }, [feeds]);

  // Automatische Weiterschaltung alle 5 Sekunden
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  const activeItem = items[currentIndex] || items[0];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleSelect = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  if (!activeItem) return null;

  // Design-Spezifikationen nach Kategorie (Vereinsfarben: Orange, Blau/Navy, Teal, Weiß)
  const categoryConfig = {
    news: {
      label: 'Vereinsnachricht',
      badgeColor: 'bg-teal-600 text-white',
      badgeBorder: 'border-teal-400/40',
      accentColor: 'text-teal-600',
      pillBg: 'bg-teal-50',
      icon: Newspaper,
    },
    event: {
      label: 'Veranstaltung',
      badgeColor: 'bg-amber-600 text-white',
      badgeBorder: 'border-amber-400/40',
      accentColor: 'text-amber-600',
      pillBg: 'bg-amber-50',
      icon: CalendarDays,
    },
    blog: {
      label: 'Blogbeitrag',
      badgeColor: 'bg-blue-700 text-white',
      badgeBorder: 'border-blue-400/40',
      accentColor: 'text-blue-700',
      pillBg: 'bg-blue-50',
      icon: BookOpen,
    },
  }[activeItem.category] || {
    label: 'Aktuelles',
    badgeColor: 'bg-teal-600 text-white',
    badgeBorder: 'border-teal-400/40',
    accentColor: 'text-teal-600',
    pillBg: 'bg-teal-50',
    icon: Sparkles,
  };

  const IconComponent = categoryConfig.icon;

  // Letzte Aktualisierung
  const lastUpdatedString = feeds.generatedAt ? formatDate(feeds.generatedAt) : formatDate(activeItem.date);

  return (
    <section
      id="aktuelles-header"
      data-testid="home-aktuelles-header"
      aria-label="Aktuelles News-Header"
      className="relative w-full bg-slate-900 text-white overflow-hidden border-b border-slate-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtiles Hintergrund-Dekor mit Vereinsfarben */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-teal rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-brand-orange rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Top-Bar: Badge & Steuerung */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-teal-300 border border-white/10 backdrop-blur-sm">
              <Sparkles size={13} className="text-teal-400" />
              Aktuelles Live-Ticker
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline-block">
              Letzte Aktualisierung: <span className="text-slate-200 font-medium">{lastUpdatedString}</span>
            </span>
          </div>

          {/* Steuerung: Pause/Play, Vor/Zurück & Direktlink */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors text-xs"
              title={isPaused ? 'Automatischen Wechsel fortsetzen' : 'Automatischen Wechsel anhalten'}
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
            </button>

            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Vorheriger Inhalt"
              aria-label="Vorheriger Beitrag"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Nächster Inhalt"
              aria-label="Nächster Beitrag"
            >
              <ChevronRight size={16} />
            </button>

            <Link
              to="/aktuelles"
              className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-xs font-bold text-white transition-all border border-white/15 hover:border-white/30"
            >
              Alle anzeigen <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Zweiteiliger interaktiver Header-Bereich (Links: Bild/Illustration, Rechts: Text/Autor/Teaser) */}
        <div className="relative min-h-[360px] md:min-h-[380px] lg:min-h-[420px] rounded-3xl bg-slate-800/80 border border-slate-700/80 overflow-hidden shadow-2xl backdrop-blur-md">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 h-full min-h-[360px] md:min-h-[380px] lg:min-h-[420px]"
            >
              {/* Linke Seite: Bild/Illustration mit 3D-Look, Tiefenschatten und Kategorie-Badge */}
              <div className="lg:col-span-6 relative h-64 sm:h-72 lg:h-full overflow-hidden bg-slate-950 group">
                <img
                  src={activeItem.image || 'https://images.unsplash.com/photo-1577214407836-1f3a0604ecb2?q=80&w=1200'}
                  alt={activeItem.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-900/30 lg:to-slate-900/90" />

                {/* Kategorie-Badge über dem Bild */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${categoryConfig.badgeColor}`}
                  >
                    <IconComponent size={13} /> {categoryConfig.label}
                  </span>

                  {activeItem.category === 'event' && (
                    <EventCountdownBadge date={activeItem.date} className="shadow-md" />
                  )}
                </div>

                {/* Bild-Untertitel / Datum auf Mobile */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300 lg:hidden">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {formatDate(activeItem.date)}
                  </span>
                  {activeItem.author && (
                    <span className="truncate max-w-[55%] text-right font-medium text-slate-200 inline-flex items-center justify-end gap-1">
                      <Building2 size={11} className="text-teal-400 shrink-0" />
                      <span className="truncate">{activeItem.author}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Rechte Seite: Text / Autor / Teaser & Call-to-Action */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-slate-900/90">
                <div>
                  {/* Metadaten: Kategorie, Datum, Autor */}
                  <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 mb-3 font-mono">
                    <span className={`font-bold uppercase tracking-wider ${categoryConfig.accentColor}`}>
                      {categoryConfig.label}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {formatDate(activeItem.date)}
                    </span>
                    {activeItem.author && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1.5 text-slate-300 truncate max-w-[260px]">
                          <Building2 size={12} className="text-teal-400 shrink-0" />
                          <span>{activeItem.author}</span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Titel */}
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug line-clamp-2 hover:text-teal-300 transition-colors">
                    <Link to={activeItem.link}>{activeItem.title}</Link>
                  </h3>

                  {/* Kurztext (max. 2–3 Zeilen wie gewünscht) */}
                  <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-3">
                    {activeItem.summary}
                  </p>

                  {/* Standort oder Zusatzinfo falls vorhanden */}
                  {activeItem.location && (
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
                      <span>Ort:</span> <strong className="font-semibold">{activeItem.location}</strong>
                    </div>
                  )}
                </div>

                {/* Footer-Bereich der Card: Mehr-erfahren-Button & Mini-Pagination */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    to={activeItem.link}
                    data-testid="header-card-cta"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-orange hover:bg-amber-600 text-white px-5 py-2.5 text-sm font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                  >
                    Mehr erfahren <ArrowRight size={15} />
                  </Link>

                  {/* Fortschritts-Indikatoren / Mini-Tabs */}
                  <div className="flex items-center gap-1.5">
                    {items.map((item, idx) => {
                      const isActive = idx === currentIndex;
                      const CatIcon = item.category === 'news' ? Newspaper : item.category === 'event' ? CalendarDays : BookOpen;
                      return (
                        <button
                          key={`${item.category}-${item.sourceId || idx}`}
                          type="button"
                          onClick={() => handleSelect(idx)}
                          className={`group relative h-2.5 transition-all rounded-full ${
                            isActive ? 'w-8 bg-teal-400' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                          }`}
                          aria-label={`Gehe zu Eintrag ${idx + 1}: ${item.title}`}
                          title={`${item.category.toUpperCase()}: ${item.title}`}
                        >
                          {/* Fortschrittsbalken-Animation bei aktivem Element */}
                          {isActive && !isPaused && (
                            <motion.span
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: AUTOPLAY_INTERVAL_MS / 1000, ease: 'linear' }}
                              className="absolute inset-0 bg-white/40 rounded-full"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Vorschau-Leiste der 3 nächsten Items unten (Desktop) */}
        <div className="mt-4 hidden md:grid md:grid-cols-3 gap-3">
          {items.slice(0, 3).map((item, idx) => {
            const isActive = idx === currentIndex;
            const CatIcon = item.category === 'news' ? Newspaper : item.category === 'event' ? CalendarDays : BookOpen;
            return (
              <button
                key={`thumb-${item.category}-${item.sourceId || idx}`}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                  isActive
                    ? 'bg-slate-800 border-teal-400/50 shadow-md ring-1 ring-teal-400/30'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 relative bg-slate-800">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1577214407836-1f3a0604ecb2?q=80&w=200'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-teal-400 uppercase tracking-wide">
                    <CatIcon size={11} />
                    <span>{item.category}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{formatDate(item.date)}</span>
                  </div>
                  <div className="text-xs font-bold text-white truncate mt-0.5">{item.title}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}