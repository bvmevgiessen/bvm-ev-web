import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, ArrowLeft, CheckCircle2, Users, Info } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import Navbar from '../components/Navbar';
import ShareButtons from '../components/ShareButtons';
import eventsData from '../data/events.json';

export default function EventDetailPage() {
  const { eventId } = useParams();
  const event = eventsData.find(e => e.id === eventId);
  const [state, handleSubmit] = useForm('xbdpbjkb');
  const [attendeeCount, setAttendeeCount] = useState(1);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-navy mb-4">Event nicht gefunden</h1>
          <Link to="/events" className="text-brand-teal font-bold hover:underline">Zurück zur Übersicht</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
          
          <div className="absolute inset-0 flex items-end pb-16">
            <div className="section-padding w-full">
              <Link 
                to="/events" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft size={20} /> Zurück zur Übersicht
              </Link>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="bg-brand-teal px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4 inline-block">
                  {event.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight max-w-4xl">
                  {event.title}
                </h1>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24">
          <div className="section-padding">
            <div className="grid lg:grid-cols-3 gap-16">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">Was erwartet Sie?</h2>
                  <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    {event.description}
                  </p>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {event.wasErwartetSie.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <CheckCircle2 className="text-brand-teal shrink-0 mt-1" size={20} />
                        <span className="text-slate-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-brand-teal/5 p-8 rounded-[2rem] border border-brand-teal/10">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">Für wen ist dieses Angebot?</h2>
                  <p className="text-slate-700 leading-relaxed">
                    {event.fuerWen}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-3xl">
                    <Calendar className="text-brand-teal mb-3" size={32} />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Datum</span>
                    <span className="font-bold text-brand-navy">
                      {new Date(event.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-3xl">
                    <Clock className="text-brand-teal mb-3" size={32} />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Uhrzeit</span>
                    <span className="font-bold text-brand-navy">
                      {new Date(event.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-3xl">
                    <MapPin className="text-brand-teal mb-3" size={32} />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ort</span>
                    <span className="font-bold text-brand-navy">{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-brand-navy">Anmeldung</h2>
                    <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full uppercase tracking-wider">
                      Anfrage
                    </span>
                  </div>
                  
                  {state.succeeded ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-brand-teal" size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-brand-navy mb-2">Vielen Dank!</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Wir haben Ihre Anmeldung erhalten. Da unsere Plätze begrenzt sind, prüfen wir derzeit die Kapazität und senden Ihnen in Kürze eine verbindliche Bestätigung per E-Mail.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Hidden fields for event context */}
                      <input type="hidden" name="eventTitle" value={event.title} />
                      <input type="hidden" name="eventDate" value={event.date} />
                      <input type="hidden" name="location" value={event.location} />
                      <input type="hidden" name="_subject" value={`Anmeldung (Prüfung ausstehend): ${event.title}`} />

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Vollständiger Name (Kontaktperson)</label>
                        <input 
                          required
                          name="name"
                          type="text" 
                          placeholder="Ihr Name"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                        />
                        <ValidationError prefix="Name" field="name" errors={state.errors} className="text-[10px] text-red-500 mt-1 ml-1" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">E-Mail Adresse</label>
                        <input 
                          required
                          name="email"
                          type="email" 
                          placeholder="beispiel@mail.de"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                        />
                        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-[10px] text-red-500 mt-1 ml-1" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Anzahl Personen</label>
                        <div className="relative">
                          <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <select 
                            name="attendees"
                            value={attendeeCount}
                            onChange={(e) => setAttendeeCount(parseInt(e.target.value))}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all appearance-none"
                          >
                            {[1, 2, 3, 4, 5].map(num => (
                              <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'Personen'}</option>
                            ))}
                          </select>
                        </div>
                        <ValidationError prefix="Attendees" field="attendees" errors={state.errors} className="text-[10px] text-red-500 mt-1 ml-1" />
                      </div>

                      <AnimatePresence>
                        {attendeeCount > 1 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 overflow-hidden"
                          >
                            {Array.from({ length: attendeeCount - 1 }).map((_, i) => (
                              <div key={i}>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                  Name von Teilnehmer {i + 2}
                                </label>
                                <input 
                                  required
                                  name={`attendee_name_${i + 2}`}
                                  type="text" 
                                  placeholder={`Name Teilnehmer ${i + 2}`}
                                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                                />
                                <ValidationError prefix={`Teilnehmer ${i + 2}`} field={`attendee_name_${i + 2}`} errors={state.errors} className="text-[10px] text-red-500 mt-1 ml-1" />
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Besondere Hinweise</label>
                        <textarea 
                          name="notes"
                          placeholder="z.B. Allergien, vegetarisch, medizinische Hinweise..."
                          rows={3}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all resize-none"
                        />
                        <ValidationError prefix="Notes" field="notes" errors={state.errors} className="text-[10px] text-red-500 mt-1 ml-1" />
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-brand-orange/5 rounded-2xl border border-brand-orange/10 mb-2">
                        <Info className="text-brand-orange shrink-0 mt-0.5" size={16} />
                        <p className="text-[10px] text-slate-600 leading-relaxed">
                          Dies ist eine unverbindliche Anfrage. Wir prüfen die Kapazitäten und senden Ihnen eine Bestätigung.
                        </p>
                      </div>

                      <button 
                        type="submit"
                        disabled={state.submitting}
                        className="w-full py-5 bg-brand-teal text-white font-black rounded-2xl hover:bg-brand-navy transition-all shadow-lg shadow-brand-teal/20 disabled:opacity-50"
                      >
                        {state.submitting ? 'Wird gesendet...' : 'Anfrage senden'}
                      </button>
                      
                      {state.errors && !state.succeeded && (
                        <p className="text-[10px] text-red-500 text-center px-4 mt-2">
                          Es gab ein Problem bei der Anmeldung. Bitte versuchen Sie es später erneut.
                        </p>
                      )}

                      <p className="text-[10px] text-slate-400 text-center px-4">
                        Mit der Anmeldung stimmen Sie unseren Datenschutzbestimmungen zu.
                      </p>
                    </form>
                  )}

                  <div className="mt-12 pt-12 border-t border-slate-100">
                    <ShareButtons title={event.title} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
