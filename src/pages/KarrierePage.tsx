import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import {
  Briefcase,
  Clock,
  MapPin,
  CalendarDays,
  FileText,
  Euro,
  ClipboardList,
  Handshake,
  Users,
  Palette,
  CheckCircle2,
  Globe,
  Lightbulb,
  Heart,
  GraduationCap,
  Mail,
  User,
  CalendarCheck,
  Download,
} from 'lucide-react';

const quickFacts = [
  { icon: Clock, label: 'Wochenarbeitszeit', value: '30 Stunden' },
  { icon: MapPin, label: 'Arbeitsort', value: 'Siemensstr. 18, 35394 Gießen' },
  { icon: FileText, label: 'Anstellungsart', value: 'Teilzeit (30 Std./Woche)' },
  { icon: CalendarDays, label: 'Befristung', value: 'Befristet bis 06. Juni 2027' },
];

const taskGroups = [
  {
    icon: ClipboardList,
    title: 'Büroorganisation & Verwaltung',
    items: [
      'Mitgliederverwaltung',
      'Korrespondenz (Post, E-Mail, Telefon)',
      'Finanzvorbereitung (Vorkontierung, Belegverwaltung)',
      'Dokumentation & Archivierung',
    ],
  },
  {
    icon: Handshake,
    title: 'Koordination & Schnittstellenarbeit',
    items: [
      'Terminmanagement',
      'Projektkoordination',
      'Ansprechpartner für Mitglieder, Ehrenamtliche, Partner, Behörden',
      'Veranstaltungsorganisation (Logistik, Räume, Catering)',
    ],
  },
  {
    icon: Users,
    title: 'Personalverwaltung & Weiteres',
    items: [
      'Unterstützung beim Onboarding',
      'Mitwirkung bei Fördermittelbeantragung',
      'Optionale Unterstützung bei Website/Newsletter',
    ],
  },
];

const profileItems = [
  { icon: Globe, text: 'Muttersprache Türkisch, Deutsch auf Verhandlungssicherungsniveau (mindestens B1)' },
  { icon: GraduationCap, text: 'Kaufmännische Ausbildung oder vergleichbare Qualifikation' },
  { icon: Heart, text: 'Erfahrung im Vereins- oder Non-Profit-Bereich wünschenswert' },
  { icon: CheckCircle2, text: 'Strukturierte, selbstständige Arbeitsweise' },
  { icon: CheckCircle2, text: 'Sehr gute Kommunikationsfähigkeiten' },
  { icon: CheckCircle2, text: 'Sicherer Umgang mit MS Office und ggf. Vereinssoftware' },
  { icon: CheckCircle2, text: 'Identifikation mit den Werten des Vereins' },
];

const benefits = [
  { icon: Clock, title: 'Flexible Arbeitszeiten' },
  { icon: Lightbulb, title: 'Sinnstiftende Tätigkeit', text: 'Mit Raum für eigene Ideen' },
  { icon: Heart, title: 'Wertschätzendes, familiäres Team' },
  { icon: GraduationCap, title: 'Optionale Zusatzleistungen', text: 'Fortbildung, Fahrtkostenzuschuss, Home-Office' },
];

export default function KarrierePage() {
  const mailtoLink =
    'mailto:bvmevgiessen@gmail.com?subject=' +
    encodeURIComponent('Bewerbung: Vereinskoordination & Büromanagement');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-0 -ml-32 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Hero */}
          <div className="text-center mb-12">
            <span className="inline-block py-2 px-4 bg-brand-orange/10 text-brand-orange font-bold rounded-full mb-6 tracking-wide uppercase text-sm">
              Karriere
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
              Arbeiten bei <span className="text-brand-teal">BVM Mittelhessen</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Werden Sie Teil unseres engagierten Teams und gestalten Sie die Vereinsarbeit
              aktiv mit — für Bildung, Verständigung und ein starkes Miteinander in Mittelhessen.
            </p>
          </div>

          {/* Job posting card */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 mb-8"
          >
            {/* Job header */}
            <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
              <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal shrink-0">
                <Briefcase size={32} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">
                  Mitarbeiter (m/w/d) Vereinskoordination &amp; Büromanagement
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Der Bildung und Verständigung Mittelhessen e.V. sucht zum nächstmöglichen
                  Zeitpunkt eine engagierte Persönlichkeit für die Vereinskoordination und das
                  Büromanagement.
                </p>
              </div>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4"
                >
                  <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal shrink-0">
                    <fact.icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {fact.label}
                    </p>
                    <p className="font-semibold text-brand-navy">{fact.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mindestlohn */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange shrink-0">
                  <Euro size={20} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy">
                  Mindestlohn &amp; Vergütung (MiLoG-konform)
                </h3>
              </div>
              <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-2xl p-6 md:p-8">
                <p className="text-slate-600 leading-relaxed mb-6">
                  Gemäß dem gesetzlichen Mindestlohngesetz (MiLoG) gilt ab 2026 ein{' '}
                  <span className="font-bold text-brand-navy">Mindestlohn von 13,90 € brutto pro Stunde</span>.
                  Für eine Teilzeitstelle mit 30 Wochenstunden ergibt sich folgende Mindestvergütung:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-5 text-center border border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Monatliche Arbeitsstunden
                    </p>
                    <p className="font-bold text-brand-navy leading-snug">
                      30 Std./Woche × 4,333
                    </p>
                    <p className="text-2xl font-bold text-brand-teal mt-1">≈ 130 Std.</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 text-center border border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Stundensatz
                    </p>
                    <p className="font-bold text-brand-navy leading-snug">MiLoG 2026</p>
                    <p className="text-2xl font-bold text-brand-teal mt-1">13,90 €</p>
                  </div>
                  <div className="bg-brand-navy rounded-xl p-5 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                      Gesetzliche Mindestvergütung
                    </p>
                    <p className="font-semibold text-white/90 leading-snug">130 Std. × 13,90 €</p>
                    <p className="text-2xl font-bold text-brand-teal mt-1">≈ 1.807 € brutto/Monat</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-5 leading-relaxed">
                  Diese Angabe stellt die gesetzliche Mindestvergütung dar. Eine höhere Vergütung
                  ist möglich und abhängig von Qualifikation und Erfahrung.
                </p>
              </div>
            </section>

            {/* Aufgaben */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal shrink-0">
                  <ClipboardList size={20} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy">Ihre Aufgaben</h3>
              </div>
              <div className="space-y-4">
                {taskGroups.map((group, index) => (
                  <div
                    key={group.title}
                    className="bg-slate-50 border border-slate-100 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-8 h-8 bg-brand-teal text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-brand-navy flex items-center gap-2">
                        <group.icon size={18} className="text-brand-teal" />
                        {group.title}
                      </h4>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-slate-600 text-sm leading-relaxed">
                          <CheckCircle2 size={16} className="text-brand-teal shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {/* NEU: Wochenend-Kulturkurse */}
                <div className="bg-brand-orange/5 border border-brand-orange/25 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      4
                    </span>
                    <h4 className="font-bold text-brand-navy flex items-center gap-2">
                      <Palette size={18} className="text-brand-orange" />
                      Wochenend-Kulturkurse
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-orange text-white rounded-full px-2.5 py-1">
                      Neu
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {[
                      'Organisation und Koordination der kulturellen Wochenendkurse im Verein',
                      'Abstimmung mit Kursleitern, Teilnehmern und Räumlichkeiten',
                      'Sicherstellung eines reibungslosen Ablaufs und Dokumentation',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-slate-600 text-sm leading-relaxed">
                        <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Profil */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal shrink-0">
                  <User size={20} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy">Ihr Profil</h3>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {profileItems.map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-teal/10 rounded-lg flex items-center justify-center text-brand-teal shrink-0">
                      <item.icon size={16} />
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Benefits */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange shrink-0">
                  <Heart size={20} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy">Was wir bieten</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="bg-brand-teal/5 border border-brand-teal/15 rounded-2xl p-5 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal shrink-0">
                      <benefit.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-brand-navy">{benefit.title}</p>
                      {benefit.text && (
                        <p className="text-sm text-slate-600 mt-0.5">{benefit.text}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.article>

          {/* Kontakt & Bewerbung */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-brand-navy rounded-3xl shadow-xl shadow-brand-navy/20 p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-teal/20 rounded-2xl flex items-center justify-center text-brand-teal shrink-0">
                  <Mail size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Kontakt &amp; Bewerbung</h3>
              </div>
              <p className="text-slate-300 leading-relaxed mb-8">
                Wir freuen uns auf Ihre Bewerbung! Bitte senden Sie Ihre vollständigen Unterlagen
                (Anschreiben, Lebenslauf, Zeugnisse) als{' '}
                <span className="font-semibold text-white">eine PDF-Datei</span> an:
              </p>

              <a
                href={mailtoLink}
                className="inline-flex items-center gap-2 bg-brand-teal hover:bg-teal-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-brand-teal/20 hover:-translate-y-0.5"
              >
                <Download size={18} />
                Jetzt bewerben
              </a>
              <p className="text-brand-teal/90 text-sm mt-3 font-medium break-all">
                bvmevgiessen@gmail.com
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-brand-teal shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/50">Ansprechpartner</p>
                    <p className="font-semibold text-white">Serdar Gülec</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarCheck size={18} className="text-brand-teal shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/50">Bewerbungsfrist</p>
                    <p className="font-semibold text-white">29.06.2026</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
