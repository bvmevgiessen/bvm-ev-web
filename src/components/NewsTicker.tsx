import React from 'react';
import { Link } from 'react-router-dom';
import eventsData from '../data/events.json';
import blogsData from '../data/blogs.json';
import { Calendar, FileText } from 'lucide-react';
import { parseDateSafe } from '../utils/date';
import { motion } from 'framer-motion';

export default function NewsTicker() {
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
    <div className="bg-brand-navy text-white overflow-hidden py-3 border-y border-white/10 relative z-20">
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div 
          className="flex w-max"
          animate={{ x: ["0%", "-33.3333%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => {
            const dateObj = parseDateSafe(item.date);
            const formattedDate = dateObj 
              ? dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
              : '';
              
            return (
              <Link
                key={`${item.id}-${index}`}
                to={item.link}
                className="flex items-center space-x-3 px-8 text-sm font-medium hover:text-brand-teal transition-colors"
                title={item.title}
              >
                {item.type === 'event' ? (
                  <Calendar className="w-4 h-4 text-brand-teal" />
                ) : (
                  <FileText className="w-4 h-4 text-[#ffb800]" />
                )}
                <span>
                  <span className="opacity-75 mr-2">{formattedDate}</span>
                  {item.title}
                </span>
                <span className="px-8 text-white/30">•</span>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
