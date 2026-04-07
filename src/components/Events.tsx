import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, ArrowRight, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import eventsData from '../data/events.json';

// Countdown component
const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-3 text-white">
      <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
        <span className="text-lg font-black leading-none">{timeLeft.days}</span>
        <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Tage</span>
      </div>
      <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
        <span className="text-lg font-black leading-none">{timeLeft.hours}</span>
        <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Std</span>
      </div>
      <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
        <span className="text-lg font-black leading-none">{timeLeft.minutes}</span>
        <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Min</span>
      </div>
    </div>
  );
};

export default function Events() {
  // Get the next 3 upcoming events
  const upcomingEvents = [...eventsData]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter(e => new Date(e.date).getTime() > new Date().getTime())
    .slice(0, 3);

  return (
    <section id="events" className="bg-white py-32 overflow-hidden">
      <div className="section-padding">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/10 rounded-full text-brand-teal text-xs font-black uppercase tracking-[0.2em] mb-6"
            >
              <Calendar size={14} /> Aktuelle Termine
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-brand-navy mb-6 leading-tight">
              Aktuelle <span className="text-brand-teal">Veranstaltungen</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
              Verpassen Sie keine unserer kommenden Veranstaltungen in Gießen und Wetzlar. 
              Hier finden Sie die nächsten Highlights aus unserem Programm.
            </p>
          </div>
          <Link 
            to="/events"
            className="group flex items-center gap-3 font-black text-brand-navy hover:text-brand-teal transition-all text-lg"
          >
            Alle Events ansehen 
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-all">
              <ArrowRight size={20} />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 bg-white
                ${index === 0 ? 'md:col-span-8 md:h-[600px]' : 'md:col-span-4 md:h-[600px]'}
              `}
            >
              {/* Image Layer */}
              <div className="absolute inset-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
              </div>

              {/* Content Layer */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
                    {event.category}
                  </div>
                  {index === 0 && (
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest">
                        <Timer size={12} /> Nächstes Event in:
                      </div>
                      <Countdown targetDate={event.date} />
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className={`font-extrabold text-white leading-tight group-hover:translate-x-2 transition-transform duration-500
                      ${index === 0 ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}
                    `}>
                      {event.title}
                    </h3>
                    
                    {/* Hover Snippet */}
                    <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-500 ease-in-out">
                      <p className="text-white/70 text-sm md:text-base line-clamp-2 pt-2">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 text-white/80 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-brand-teal" />
                      <span>{new Date(event.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-brand-teal" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Link 
                    to={`/events/${event.id}`}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-navy font-black rounded-2xl hover:bg-brand-teal hover:text-white transition-all shadow-xl shadow-black/10"
                  >
                    Details & Anmeldung <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
