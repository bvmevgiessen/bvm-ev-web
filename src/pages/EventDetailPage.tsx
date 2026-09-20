import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, ArrowLeft, CheckCircle2, Users, Info, Sparkles, XCircle } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import Navbar from '../components/Navbar';
import ShareButtons from '../components/ShareButtons';
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

export default function EventDetailPage() {
  const { eventId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawEvent = eventsData.find(e => e.id === eventId);
  const [state, handleSubmit] = useForm('xbdpbjkb');
  const [attendeeCount, setAttendeeCount] = useState(1);

  // Initialize language from URL query (?lang=tr or ?lang=de) or saved preference
  const [currentLang, setCurrentLang] = useState<EventLanguage>(() => {
    const urlLang = searchParams.get('lang');
    if (urlLang === 'tr' || urlLang === 'de') return urlLang;
    return getSavedEventsLanguage();
  });

  // Sync language with URL and storage
  const handleLanguageChange = (newLang: EventLanguage) => {
    setCurrentLang(newLang);
    saveEventsLanguage(newLang);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('lang', newLang);
      return next;
    }, { replace: true });
  };

  useEffect(() => {
    const urlLang = searchParams.get('lang');
    if (urlLang === 'tr' || urlLang === 'de') {
      if (urlLang !== currentLang) {
        setCurrentLang(urlLang);
        saveEventsLanguage(urlLang);
      }
    }
  }, [searchParams]);

  if (!rawEvent) {
    const fallbackStrings = eventUiStrings[currentLang];
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-navy mb-4">{fallbackStrings.eventNotFound}</h1>
          <Link to="/events" className="text-brand-teal font-bold hover:underline">{fallbackStrings.backToOverview}</Link>
        </div>
      </div>
    );
  }

  const event = getLocalizedEvent(rawEvent, currentLang)!;
  const strings = eventUiStrings[currentLang];
  const dateLocale = currentLang === 'tr' ? 'tr-TR' : 'de-DE';

  const isPastEvent = parseDateSafe(event.date).getTime() < new Date().getTime();
  const isCancelled = event.badge?.toLowerCase().includes('abgesagt') || 
    event.badge?.toLowerCase().includes('iptal') || 
    (event as any).notice?.type === 'cancel';
  const isNoRegistration = (event as any).requiresRegistration === false || 
    event.badge?.toLowerCase().includes('ohne anmeldung') || 
    event.badge?.toLowerCase().includes('keine anmeldung') ||
    event.badge?.toLowerCase().includes('kayıt gerekmez');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent" />
          
          <div className="absolute inset-0 flex items-end pb-12 md:pb-16">
            <div className="section-padding w-full">
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <Link 
                  to="/events" 
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"
                >
                  <ArrowLeft size={18} /> {strings.backToOverview}
                </Link>

                {/* Visible language switch in hero */}
                <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 flex items-center gap-2">
                  <span className="text-white/80 text-xs font-semibold hidden sm:inline">
                    {currentLang === 'de' ? 'Sprache:' : 'Dil:'}
                  </span>
                  <EventLanguageToggle
                    currentLang={currentLang}
                    onLanguageChange={handleLanguageChange}
                    size="sm"
                    theme="glass"
                  />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="bg-brand-teal px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] inline-block shadow-sm">
                    {event.category}
                  </span>
                  {(event.badge || (event as any).notice) && (
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm inline-block ${
                      isCancelled 
                        ? 'bg-rose-600 text-white' 
                        : 'bg-amber-500 text-white animate-pulse'
                    }`}>
                      {event.badge || (currentLang === 'tr' ? 'Ertelendi' : 'Verschoben')}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl">
                  {event.title}
                </h1>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="section-padding">
            {/* Prominent Language Switcher Banner above content */}
            <div className="mb-12 p-4 md:p-5 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold text-lg shrink-0">
                  {currentLang === 'tr' ? '🇹🇷' : '🇩🇪'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy">
                    {currentLang === 'tr' ? 'İçerik Dili: Türkçe' : 'Inhaltssprache: Deutsch'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {currentLang === 'tr' 
                      ? 'Bu etkinliğin detaylarını dilerseniz Almanca olarak da görüntüleyebilirsiniz.' 
                      : 'Sie können die Details dieser Veranstaltung wahlweise auf Deutsch oder Türkisch lesen.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <EventLanguageToggle
                  currentLang={currentLang}
                  onLanguageChange={handleLanguageChange}
                  size="md"
                  theme="light"
                  showLabel={true}
                  label={strings.languageLabel}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-12">
                {event.notice && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-3xl shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="bg-amber-500 text-white p-2 rounded-2xl shrink-0 mt-0.5 animate-pulse">
                        <Info size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-amber-900 mb-1">
                          {event.notice.title}
                        </h3>
                        <p className="text-amber-800 leading-relaxed text-sm font-medium">
                          {event.notice.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">{strings.whatToExpect}</h2>
                  <p className="text-slate-600 text-lg mb-8 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                  {event.wasErwartetSie && event.wasErwartetSie.length > 0 && (
                    <ul className="grid md:grid-cols-2 gap-4">
                      {event.wasErwartetSie.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <CheckCircle2 className="text-brand-teal shrink-0 mt-1" size={20} />
                          <span className="text-slate-700 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {event.fuerWen && (
                  <div className="bg-brand-teal/5 p-8 rounded-[2rem] border border-brand-teal/10">
                    <h2 className="text-2xl font-bold text-brand-navy mb-4">{strings.whoIsThisFor}</h2>
                    <p className="text-slate-700 leading-relaxed">
                      {event.fuerWen}
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                  <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <Calendar className="text-brand-teal mb-3" size={32} />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{strings.dateLabel}</span>
                    <span className="font-bold text-brand-navy">
                      {parseDateSafe(event.date).toLocaleDateString(dateLocale, { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <Clock className="text-brand-teal mb-3" size={32} />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{strings.timeLabel}</span>
                    <span className="font-bold text-brand-navy">
                      {parseDateSafe(event.date).toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' })} {strings.timeSuffix}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <MapPin className="text-brand-teal mb-3" size={32} />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{strings.locationLabel}</span>
                    <span className="font-bold text-brand-navy">{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Registration / Info Box */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-brand-navy">
                      {isCancelled ? strings.registrationStatus : isNoRegistration ? strings.participation : strings.registration}
                    </h2>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      isCancelled
                        ? 'text-rose-700 bg-rose-100'
                        : isPastEvent 
                          ? 'text-slate-500 bg-slate-100' 
                          : isNoRegistration
                            ? 'text-emerald-700 bg-emerald-100'
                            : 'text-brand-orange bg-brand-orange/10'
                    }`}>
                      {isCancelled 
                        ? strings.cancelled 
                        : isPastEvent 
                          ? strings.pastEvent 
                          : isNoRegistration 
                            ? strings.openToAll 
                            : strings.requestQuery}
                    </span>
                  </div>
                  
                  {isCancelled ? (
                    <div className="text-center py-8 bg-rose-50/60 rounded-2xl border border-rose-100 p-6 space-y-4">
                      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                        <XCircle size={32} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-brand-navy mb-1.5">{strings.cancelledNoticeTitle}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {strings.cancelledNoticeText}
                        </p>
                      </div>
                    </div>
                  ) : isPastEvent ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="text-slate-500" size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-brand-navy mb-2">{strings.eventFinished}</h3>
                      <p className="text-slate-500 text-sm px-4">
                        {strings.eventFinishedText}
                      </p>
                    </div>
                  ) : isNoRegistration ? (
                    <div className="text-center py-8 bg-emerald-50/50 rounded-2xl border border-emerald-100 p-6 space-y-4">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <Sparkles size={30} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-brand-navy mb-1.5">{strings.noRegistrationNeeded}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {strings.noRegistrationText}
                        </p>
                      </div>
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white px-4 py-2 rounded-xl border border-emerald-200/60 shadow-sm">
                          <CheckCircle2 size={15} className="text-emerald-600" /> {strings.freeAdmission}
                        </span>
                      </div>
                    </div>
                  ) : state.succeeded ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-brand-teal" size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-brand-navy mb-2">{strings.thankYouTitle}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {strings.thankYouText}
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Hidden fields for event context */}
                      <input type="hidden" name="eventTitle" value={event.title} />
                      <input type="hidden" name="eventDate" value={event.date} />
                      <input type="hidden" name="location" value={event.location} />
                      <input type="hidden" name="language" value={currentLang} />
                      <input type="hidden" name="_subject" value={`Anmeldung (${currentLang.toUpperCase()}): ${event.title}`} />

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          {strings.contactPersonName}
                        </label>
                        <input 
                          required
                          name="name"
                          type="text" 
                          placeholder={strings.namePlaceholder}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                        />
                        <ValidationError prefix="Name" field="name" errors={state.errors} className="text-[10px] text-red-500 mt-1 ml-1" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          {strings.emailLabel}
                        </label>
                        <input 
                          required
                          name="email"
                          type="email" 
                          placeholder={strings.emailPlaceholder}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                        />
                        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-[10px] text-red-500 mt-1 ml-1" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          {strings.attendeeCountLabel}
                        </label>
                        <div className="relative">
                          <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <select 
                            name="attendees"
                            value={attendeeCount}
                            onChange={(e) => setAttendeeCount(parseInt(e.target.value))}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all appearance-none cursor-pointer"
                          >
                            {[1, 2, 3, 4, 5].map(num => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? strings.personSingle : strings.personPlural}
                              </option>
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
                                  {strings.attendeeNameLabel} {i + 2}
                                </label>
                                <input 
                                  required
                                  name={`attendee_name_${i + 2}`}
                                  type="text" 
                                  placeholder={`${strings.attendeeNameLabel} ${i + 2}`}
                                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                                />
                                <ValidationError prefix={`Teilnehmer ${i + 2}`} field={`attendee_name_${i + 2}`} errors={state.errors} className="text-[10px] text-red-500 mt-1 ml-1" />
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          {strings.specialNotesLabel}
                        </label>
                        <textarea 
                          name="notes"
                          placeholder={strings.specialNotesPlaceholder}
                          rows={3}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all resize-none"
                        />
                        <ValidationError prefix="Notes" field="notes" errors={state.errors} className="text-[10px] text-red-500 mt-1 ml-1" />
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-brand-orange/5 rounded-2xl border border-brand-orange/10 mb-2">
                        <Info className="text-brand-orange shrink-0 mt-0.5" size={16} />
                        <p className="text-[10px] text-slate-600 leading-relaxed">
                          {strings.nonBindingNotice}
                        </p>
                      </div>

                      <button 
                        type="submit"
                        disabled={state.submitting}
                        className="w-full py-5 bg-brand-teal text-white font-black rounded-2xl hover:bg-brand-navy transition-all shadow-lg shadow-brand-teal/20 disabled:opacity-50 cursor-pointer"
                      >
                        {state.submitting ? strings.submitting : strings.submitRequest}
                      </button>
                      
                      {state.errors && !state.succeeded && (
                        <p className="text-[10px] text-red-500 text-center px-4 mt-2">
                          {strings.submissionError}
                        </p>
                      )}

                      <p className="text-[10px] text-slate-400 text-center px-4">
                        {strings.privacyNote}
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