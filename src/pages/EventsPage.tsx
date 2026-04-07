import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import eventsData from '../data/events.json';

const streams = [
  { name: "Festive Events", description: "Religiös & Kulturell" },
  { name: "Community Days", description: "Soziales Miteinander" },
  { name: "Youth & Education", description: "Jugend & Bildung" }
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="section-padding">
          <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-brand-navy mb-6">
              Unsere <span className="text-brand-teal">Veranstaltungen</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Entdecken Sie unser vielfältiges Angebot in Gießen und Wetzlar. 
              Von kulturellen Festen bis hin zu Bildungsworkshops – bei uns ist jeder willkommen.
            </p>
          </header>

          <div className="space-y-24">
            {streams.map((stream) => (
              <section key={stream.name}>
                <div className="mb-10 border-b border-slate-200 pb-4">
                  <h2 className="text-3xl font-bold text-brand-navy">{stream.name}</h2>
                  <p className="text-brand-teal font-medium">{stream.description}</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {eventsData
                    .filter(event => event.stream === stream.name)
                    .map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-slate-100"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-brand-teal uppercase tracking-[0.2em]">
                            {event.category}
                          </div>
                        </div>
                        
                        <div className="p-8">
                          <h3 className="text-xl font-bold text-brand-navy mb-4 group-hover:text-brand-teal transition-colors">
                            {event.title}
                          </h3>
                          
                          <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-slate-500 text-sm">
                              <Calendar size={16} className="text-brand-teal" />
                              <span>{new Date(event.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 text-sm">
                              <MapPin size={16} className="text-brand-teal" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          <Link 
                            to={`/events/${event.id}`}
                            className="inline-flex items-center gap-2 font-bold text-brand-teal hover:gap-3 transition-all"
                          >
                            Details & Anmeldung <ArrowRight size={18} />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
