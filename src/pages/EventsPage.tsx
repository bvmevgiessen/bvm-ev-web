import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import Navbar from '../components/Navbar';
import EventCountdownBadge from '../components/EventCountdownBadge';
import EventLanguageToggle from '../components/EventLanguageToggle';
import eventsData from '../data/events.json';
import { parseDateSafe } from '../utils/date';
import {
  EventLanguage,
  eventUiStrings,
  getSavedEventsLanguage,
  saveEventsLanguage,
  getLocalizedEvent
} from '../utils/eventLocalization';

interface StreamInfo {
  name: string;
  nameTr: string;
  description: string;
  descriptionTr: string;
}

const streams: StreamInfo[] = [
  { 
    name: "Festive Events", 
    nameTr: "Bayramlar & Kültürel Kutlamalar",
    description: "Religiös & Kulturell", 
    descriptionTr: "Dini ve Kültürel Buluşmalar" 
  },
  { 
    name: "Community Days", 
    nameTr: "Topluluk Günleri & Buluşmalar",
    description: "Soziales Miteinander", 
    descriptionTr: "Sosyal Dayanışma ve Kaynaşma" 
  },
  { 
    name: "Youth & Education", 
    nameTr: "Gençlik & Eğitim",
    description: "Jugend & Bildung", 
    descriptionTr: "Gelecek, Atölye ve Öğrenim" 
  },
  { 
    name: "Interreligiöser Austausch", 
    nameTr: "Dinlerarası Diyalog",
    description: "Dialog & Begegnung", 
    descriptionTr: "Birlikte Yaşam ve Ortak Değerler" 
  }
];

export default function EventsPage() {
  const [globalLang, setGlobalLang] = useState<EventLanguage>(() => getSavedEventsLanguage());
  const [cardLangOverrides, setCardLangOverrides] = useState<Record<string, EventLanguage>>({});

  const handleGlobalLangChange = (newLang: EventLanguage) => {
    setGlobalLang(newLang);
    saveEventsLanguage(newLang);
    // Reset individual overrides so the whole page uniformly adopts the selected language
    setCardLangOverrides({});
  };

  const handleCardLangToggle = (eventKey: string, lang: EventLanguage) => {
    setCardLangOverrides(prev => ({
      ...prev,
      [eventKey]: lang
    }));
  };

  const strings = eventUiStrings[globalLang];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="section-padding">
          <header className="mb-12 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-brand-navy mb-6">
              {strings.pageTitlePrefix} <span className="text-brand-teal">{strings.pageTitleHighlight}</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-8">
              {strings.pageSubtitle}
            </p>

            {/* Global Language Selector Bar - Highly Visible */}
            <div className="inline-flex items-center gap-3 bg-white p-2 md:p-2.5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs md:text-sm font-bold text-slate-700 pl-3">
                {globalLang === 'de' ? 'Sprache für alle Events:' : 'Tüm etkinlikler için dil:'}
              </span>
              <EventLanguageToggle
                currentLang={globalLang}
                onLanguageChange={handleGlobalLangChange}
                size="md"
                theme="light"
              />
            </div>
          </header>

          <div className="space-y-24">
            {streams.map((stream) => {
              const streamEvents = [...eventsData]
                .filter(event => event.stream === stream.name)
                .sort((a, b) => parseDateSafe(b.date).getTime() - parseDateSafe(a.date).getTime());

              if (streamEvents.length === 0) return null;

              const streamTitle = globalLang === 'tr' ? stream.nameTr : stream.name;
              const streamDesc = globalLang === 'tr' ? stream.descriptionTr : stream.description;
              
              return (
              <section key={stream.name}>
                <div className="mb-10 border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-brand-navy">{streamTitle}</h2>
                    <p className="text-brand-teal font-medium">{streamDesc}</p>
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    {streamEvents.length} {globalLang === 'tr' ? 'Etkinlik' : 'Veranstaltungen'}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {streamEvents.map((rawEvent, index) => {
                    const eventKey = `${rawEvent.id}-${rawEvent.date}`;
                    const cardLang = cardLangOverrides[eventKey] || globalLang;
                    const event = getLocalizedEvent(rawEvent, cardLang)!;
                    const cardStrings = eventUiStrings[cardLang];
                    const dateLocale = cardLang === 'tr' ? 'tr-TR' : 'de-DE';

                    const isPast = parseDateSafe(event.date).getTime() < new Date().getTime();
                    const isCancelled = event.badge?.toLowerCase().includes('abgesagt') || 
                      event.badge?.toLowerCase().includes('iptal') || 
                      (event as any).notice?.type === 'cancel';

                    return (
                      <motion.div
                        key={`${rawEvent.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-slate-100 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                              <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-brand-teal uppercase tracking-[0.2em]">
                                {event.category}
                              </span>
                              <EventCountdownBadge date={event.date} />
                            </div>

                            {/* Badge Notice */}
                            {(event.badge || (event as any).notice) && (
                              <div className={`absolute bottom-4 left-4 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                                isCancelled
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-amber-500 text-white animate-pulse'
                              }`}>
                                {event.badge || (cardLang === 'tr' ? 'Ertelendi' : 'Verschoben')}
                              </div>
                            )}

                            {/* Per-Event Visible Language Toggle on top right */}
                            <div className="absolute top-4 right-4 z-10">
                              <EventLanguageToggle
                                currentLang={cardLang}
                                onLanguageChange={(newLang) => handleCardLangToggle(eventKey, newLang)}
                                size="sm"
                                theme="glass"
                              />
                            </div>
                          </div>
                          
                          <div className="p-8">
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="text-xs font-semibold text-brand-teal/80">
                                {cardLang === 'tr' ? 'Türkçe İçerik' : 'Deutscher Inhalt'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCardLangToggle(eventKey, cardLang === 'de' ? 'tr' : 'de')}
                                className="text-[11px] font-bold text-slate-500 hover:text-brand-teal transition-colors underline cursor-pointer"
                                title={cardStrings.switchLanguageTooltip}
                              >
                                {cardLang === 'de' ? '🇹🇷 Türkçe göster' : '🇩🇪 Auf Deutsch'}
                              </button>
                            </div>

                            <h3 className="text-xl font-bold text-brand-navy mb-4 group-hover:text-brand-teal transition-colors line-clamp-2">
                              {event.title}
                            </h3>
                            
                            <div className="space-y-3 mb-8">
                              <div className="flex items-center gap-3 text-slate-500 text-sm">
                                <Calendar size={16} className="text-brand-teal shrink-0" />
                                <span>{parseDateSafe(event.date).toLocaleDateString(dateLocale, { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center gap-3 text-slate-500 text-sm">
                                <MapPin size={16} className="text-brand-teal shrink-0" />
                                <span className="line-clamp-1">{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="px-8 pb-8 pt-0">
                          <Link 
                            to={`/events/${event.id}?lang=${cardLang}`}
                            className="inline-flex items-center gap-2 font-bold text-brand-teal hover:gap-3 transition-all"
                          >
                            {isPast || isCancelled
                              ? cardStrings.viewDetails
                              : (event as any).requiresRegistration === false || event.badge?.toLowerCase().includes('ohne anmeldung') || event.badge?.toLowerCase().includes('kayıt gerekmez')
                                ? cardStrings.detailsAndInfo
                                : cardStrings.detailsAndRegister} <ArrowRight size={18} />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

