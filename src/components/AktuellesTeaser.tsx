import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Newspaper, CalendarDays, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import Card3D from './aktuelles/Card3D';
import { useAktuelles, formatDate } from '../data/aktuelles';

/**
 * Kompakter "Aktuelles"-Teaser für die Startseite (erstes Element).
 * Zeigt die neueste News, das nächste Event und den neuesten Blogbeitrag als 3D-Karten.
 */
export default function AktuellesTeaser() {
  const feeds = useAktuelles();
  const news = feeds.news[0];
  const event = feeds.events[0];
  const blog = feeds.blogs[0];

  const cards = [
    news && {
      key: 'news',
      to: '/aktuelles#news',
      icon: Newspaper,
      tag: 'News',
      color: '#0d9488',
      date: news.date,
      title: news.title,
      text: news.shortText,
      image: news.image,
    },
    event && {
      key: 'event',
      to: event.link,
      icon: CalendarDays,
      tag: 'Event',
      color: '#f97316',
      date: event.date,
      title: event.title,
      text: event.description,
      image: event.image,
    },
    blog && {
      key: 'blog',
      to: blog.link,
      icon: BookOpen,
      tag: 'Blog',
      color: '#6366f1',
      date: blog.date,
      title: blog.title,
      text: blog.excerpt,
      image: blog.image,
    },
  ].filter(Boolean) as any[];

  return (
    <section id="aktuelles-teaser" data-testid="home-aktuelles-teaser" className="relative bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-teal/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand-teal">
              <Sparkles size={13} /> Aktuelles aus dem Verein
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy md:text-4xl">
              Das Neueste auf einen Blick
            </h2>
          </div>
          <Link
            to="/aktuelles"
            data-testid="teaser-all-link"
            className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-bold text-white transition-all hover:bg-brand-teal hover:shadow-lg active:scale-95"
          >
            Zur Aktuelles-Seite <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card3D data-testid={`teaser-card-${c.key}`} className="h-full">
                <Link to={c.to} className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
                  <div className="relative h-40 overflow-hidden">
                    <img src={c.image} alt={c.title} loading="lazy" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white" style={{ background: c.color }}>
                      <c.icon size={11} /> {c.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <time className="font-mono text-[11px] uppercase tracking-wide text-slate-400">{formatDate(c.date)}</time>
                    <h3 className="mt-1 text-lg font-extrabold leading-snug text-brand-navy line-clamp-2">{c.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">{c.text}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal">
                      Ansehen <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
