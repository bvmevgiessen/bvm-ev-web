import React, { useState } from 'react';
import { Link } from 'react-router';
import eventsData from '../data/events.json';
import blogsData from '../data/blogs.json';
import { Calendar, FileText, Sparkles, Pause, Play } from 'lucide-react';
import { parseDateSafe } from '../utils/date';
import { motion } from 'framer-motion';

export default function NewsTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const now = new Date();
  
  // Filter upcoming events
  const upcomingEvents = eventsData
    .filter(event => {
      const eventDate = parseDateSafe(event.date);
      return eventDate && eventDate >= now;
    })
    .sort((a, b) => {
      const dateA = parseDateSafe(a.date);
      const dateB = parseDateSafe(b.date);
      return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
    });

  // Get latest 3 blog posts
  const latestBlogs = [...blogsData]
    .sort((a, b) => {
      const dateA = parseDateSafe(a.date);
      const dateB = parseDateSafe(b.date);
      return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
    })
    .slice(0, 3);

  // Combine items to show in ticker
  const tickerItems = [
    ...upcomingEvents.map(event => ({
      id: `event-${event.id}`,
      type: 'event' as const,
      title: event.title,
      link: `/events/${event.id}`,
      date: event.date
    })),
    ...latestBlogs.map(blog => ({
      id: `blog-${blog.id}`,
      type: 'blog' as const,
      title: blog.title,
      link: `/blog/${blog.id}`,
      date: blog.date
    }))
  ];

  if (tickerItems.length === 0) return null;

  return (
    <aside 
      role="region" 
      aria-label="Aktuelle Meldungen und Veranstaltungen"
      className="bg-brand-navy text-white overflow-hidden py-2.5 border-y border-white/10 relative z-20 shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center">
        {/* Static Badge on the left */}
        <div className="hidden sm:flex items-center gap-2 pl-6 pr-4 shrink-0 bg-brand-navy z-30 font-bold text-xs uppercase tracking-wider text-brand-teal border-r border-white/10">
          <Sparkles size={14} aria-hidden="true" />
          <span>Aktuelles</span>
        </div>

        {/* Scrolling ticker track */}
        <div className="flex-1 overflow-hidden">
          <motion.div 
            className="flex w-max"
            animate={isPaused ? false : { x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
          >
            {/* Primary group: Fully accessible to screen readers and keyboard navigation */}
            <div className="flex items-center">
              {tickerItems.map((item) => {
                const dateObj = parseDateSafe(item.date);
                const formattedDate = dateObj 
                  ? dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : '';
                  
                return (
                  <Link
                    key={`accessible-${item.id}`}
                    to={item.link}
                    className="flex items-center space-x-3 px-6 text-sm font-medium hover:text-brand-teal transition-colors focus:outline-none focus:text-brand-teal"
                  >
                    {item.type === 'event' ? (
                      <Calendar className="w-4 h-4 text-brand-teal shrink-0" aria-hidden="true" />
                    ) : (
                      <FileText className="w-4 h-4 text-[#ffb800] shrink-0" aria-hidden="true" />
                    )}
                    <span>
                      <span className="opacity-75 mr-2">{formattedDate}</span>
                      {item.title}
                    </span>
                    <span className="px-6 text-white/30" aria-hidden="true">•</span>
                  </Link>
                );
              })}
            </div>

            {/* Secondary duplicate group: Excluded from accessibility tree and tab order */}
            <div className="flex items-center" aria-hidden="true">
              {tickerItems.map((item) => {
                const dateObj = parseDateSafe(item.date);
                const formattedDate = dateObj 
                  ? dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : '';
                  
                return (
                  <Link
                    key={`duplicate-${item.id}`}
                    to={item.link}
                    tabIndex={-1}
                    className="flex items-center space-x-3 px-6 text-sm font-medium hover:text-brand-teal transition-colors"
                  >
                    {item.type === 'event' ? (
                      <Calendar className="w-4 h-4 text-brand-teal shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-[#ffb800] shrink-0" />
                    )}
                    <span>
                      <span className="opacity-75 mr-2">{formattedDate}</span>
                      {item.title}
                    </span>
                    <span className="px-6 text-white/30">•</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Pause/Play control button for accessibility (WCAG 2.2.2) */}
        <div className="px-3 shrink-0 bg-brand-navy z-30 border-l border-white/10 flex items-center">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Laufschrift starten" : "Laufschrift anhalten"}
            title={isPaused ? "Laufschrift starten" : "Laufschrift anhalten"}
            className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        </div>
      </div>
    </aside>
  );
}