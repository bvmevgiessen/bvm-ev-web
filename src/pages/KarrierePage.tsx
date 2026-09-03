import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import {
  Briefcase,
  Clock,
  MapPin,
  CalendarDays,
  FileText,
  ClipboardList,
  CheckCircle2,
  Globe,
  Lightbulb,
  Heart,
  GraduationCap,
  Mail,
  User,
  CalendarCheck,
  Download,
  BookOpen,
  Sparkles,
  Award,
} from 'lucide-react';

const quickFacts = [
  { icon: Clock, label: 'Wochenarbeitszeit', value: '30 Stunden' },
  { icon: MapPin, label: 'Arbeitsort', value: 'Siemensstr. 18, 35394 Gießen' },
  { icon: FileText, label: 'Anstellungsart', value: 'Festanstellung (30 Std./Woche)' },
  { icon: CalendarDays, label: 'Befristung', value: 'Befristet bis 29. September 2028' },
];

const tasks = [
  'Sozialpädagogische Betreuung und Begleitung von Kindern, Jugendlichen und Erwachsenen',
  'Planung, Organisation und Durchführung von Bildungs-, Kultur- und Freizeitangeboten',
  'Durchführung von Türkischunterricht für Kinder, Jugendliche und Erwachsene',
  'Planung und Durchführung von Projekten, Workshops und Ferienprogrammen',
  'Dokumentation der pädagogischen Arbeit sowie Erstellung von Berichten',
  'Mitwirkung bei der Weiterentwicklung unserer Bildungs- und Integrationsangebote',
];

const profileItems = [
  {
    icon: GraduationCap,
    text: 'Abgeschlossenes Studium oder eine abgeschlossene Ausbildung im pädagogischen, sozialen oder sprachlichen Bereich oder eine vergleichbare Qualifikation',
  },
  {
    icon: Globe,
    text: 'Sehr gute Türkischkenntnisse in Wort und Schrift',
  },
  {
    icon: BookOpen,
    text: 'Erfahrung im Unterricht sowie in der sozial- oder kulturpädagogischen Arbeit ist von Vorteil',
  },
  {
    icon: Heart,
    text: 'Interkulturelle Kompetenz und Freude an der Arbeit mit Menschen verschiedener Herkunft',
  },
  {
    icon: CheckCircle2,
    text: 'Selbstständige, strukturierte und verantwortungsbewusste Arbeitsweise',
  },
  {
    icon: Sparkles,
    text: 'Teamfähigkeit, Kommunikationsstärke und Engagement',
  },
  {
    icon: Award,
    text: 'Sicherer Umgang mit den gängigen MS-Office-Anwendungen',
  },
];

const benefits = [
  { icon: Briefcase, title: 'Abwechslungsreiche Tätigkeit', text: 'Verantwortungsvolle Aufgaben mit echtem Mehrwert' },
  { icon: Clock, title: '30 Wochenstunden', text: 'Geregelte Anstellung mit  pro Woche' },
  { icon: Heart, title: 'Motiviertes & wertschätzendes Team', text: 'Familiäre Atmosphäre und offener Austausch' },
  { icon: GraduationCap, title: 'Weiterbildung', text: 'Möglichkeiten zur fachlichen und persönlichen Qualifizierung' },
  { icon: Lightbulb, title: 'Eigene Ideen & Projekte', text: 'Viel Gestaltungsspielraum und Raum für Innovation' },
  { icon: Globe, title: 'Sinnstiftendes Umfeld', text: 'Engagement in einem lebendigen interkulturellen Arbeitsumfeld' },
];

export default function KarrierePage() {
  const mailtoLink =
    'mailto:bvmevgiessen@gmail.com?subject=' +
    encodeURIComponent('Bewerbung: Sozial- und kulturpädagogische Betreuung sowie Kultur- und Sprachunterricht (m/w/d)');

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
              Stellenausschreibung
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy mb-6 leading-tight">
              Arbeiten bei <span className="text-brand-teal">BVM e.V.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Gestalten Sie Bildung, Sprache und interkulturellen Austausch aktiv mit — für eine gerechtere und integrativere Gesellschaft in Mittelhessen.
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
                <span className="inline-block px-3 py-1 bg-brand-teal/10 text-brand-teal text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                  30 Stunden pro Woche
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3 leading-snug">
                  Sozial- und kulturpädagogische Betreuung sowie Kultur- und Sprachunterricht (m/w/d)
                </h2>
                <p className="text-sm font-semibold text-brand-teal mb-4">
                  BVM e.V. – Bildung und Verständigung Mittelhessen e.V.
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

            {/* Über uns */}
            <section className="mb-10 bg-brand-teal/5 border border-brand-teal/15 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-brand-navy mb-3 flex items-center gap-2">
                <Heart size={20} className="text-brand-teal" />
                Über uns
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Seit unserer Gründung setzen wir uns als <strong>BVM e.V.</strong> für eine gerechtere und integrativere Gesellschaft ein. Wir verstehen kulturelle Vielfalt als Bereicherung und schaffen Begegnungsräume, in denen Menschen unabhängig von Herkunft, Religion oder sozialem Hintergrund voneinander lernen, sich austauschen und gemeinsam wachsen können.
              </p>
              <p className="text-slate-700 font-medium leading-relaxed">
                Zur Verstärkung unseres Teams suchen wir zum nächstmöglichen Zeitpunkt eine engagierte Persönlichkeit für die sozial- und kulturpädagogische Betreuung sowie den Kultur- und Sprachunterricht im Umfang von <strong>30 Stunden pro Woche</strong>.
              </p>
            </section>

            {/* Aufgaben */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal shrink-0">
                  <ClipboardList size={20} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy">Ihre Aufgaben</h3>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <ul className="space-y-3.5">
                  {tasks.map((task) => (
                    <li key={task} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                      <CheckCircle2 size={18} className="text-brand-teal shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
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
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                {profileItems.map((item) => (
                  <div key={item.text} className="flex items-start gap-3.5">
                    <div className="w-8 h-8 bg-brand-teal/10 rounded-lg flex items-center justify-center text-brand-teal shrink-0 mt-0.5">
                      <item.icon size={16} />
                    </div>
                    <p className="text-slate-700 leading-relaxed pt-0.5">{item.text}</p>
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
                <h3 className="text-xl font-bold text-brand-navy">Wir bieten</h3>
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
                    <p className="font-semibold text-white">Hakan Dönmez</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarCheck size={18} className="text-brand-teal shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/50">Befristung</p>
                    <p className="font-semibold text-white">29. September 2028</p>
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
