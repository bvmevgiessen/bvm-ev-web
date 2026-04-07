import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function Events() {
  const events = [
    {
      title: 'Interkulturelles Sommerfest 2026',
      date: '15. Juni 2026',
      time: '14:00 - 20:00',
      location: 'Stadtpark Giessen',
      image: 'https://picsum.photos/seed/summer/800/600',
      category: 'Kultur',
    },
    {
      title: 'Workshop: Integration & Beruf',
      date: '22. April 2026',
      time: '18:30 - 21:00',
      location: 'BVM Zentrum, Giessen',
      image: 'https://picsum.photos/seed/workshop/800/600',
      category: 'Bildung',
    },
    {
      title: 'Jugend-Fußballturnier',
      date: '05. Mai 2026',
      time: '10:00 - 16:00',
      location: 'Sportplatz West',
      image: 'https://picsum.photos/seed/sports/800/600',
      category: 'Jugend',
    },
  ];

  return (
    <section id="events" className="bg-slate-50 py-24">
      <div className="section-padding">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-4">
              Aktuelle <span className="text-brand-teal">Veranstaltungen</span>
            </h2>
            <p className="text-slate-600 max-w-xl text-lg">
              Bleiben Sie auf dem Laufenden über unsere kommenden Treffen, Workshops und Feste.
            </p>
          </div>
          <button className="flex items-center gap-2 font-bold text-brand-teal hover:gap-3 transition-all">
            Alle Events ansehen <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group ${index === 0 ? 'md:col-span-2 md:row-span-1 flex flex-col md:flex-row' : ''}`}
            >
              <div className={`relative overflow-hidden ${index === 0 ? 'md:w-1/2 h-64 md:h-auto' : 'h-48'}`}>
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-teal uppercase tracking-wider">
                  {event.category}
                </div>
              </div>
              
              <div className={`p-6 ${index === 0 ? 'md:w-1/2 flex flex-col justify-center' : ''}`}>
                <h3 className={`${index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'} font-bold text-brand-navy mb-4 leading-tight group-hover:text-brand-teal transition-colors`}>
                  {event.title}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <Calendar size={16} className="text-brand-teal" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <Clock size={16} className="text-brand-teal" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <MapPin size={16} className="text-brand-teal" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <button className="w-full py-3 border border-slate-100 rounded-2xl font-bold text-slate-700 hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all">
                  Details & Anmeldung
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
