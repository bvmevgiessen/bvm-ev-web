import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Anchor,
  ArrowLeft,
  Home,
  Landmark,
  BadgeCheck,
  Languages,
  Baby,
  Briefcase,
  Scale,
  Palette,
  Heart,
  ChevronDown,
  Mail,
  ExternalLink,
  Handshake,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router';
import PuzzleBackground from '../components/PuzzleBackground';
import ShareButtons from '../components/ShareButtons';

const CONTACT_EMAIL = 'bvmevgiessen@gmail.com';

const services = [
  {
    icon: Home,
    title: 'Wohnungssuche',
    items: [
      'Unterstützung bei der Suche nach einer passenden Wohnung',
      'Hilfe beim Ausfüllen von Formularen',
      'Begleitung zu Besichtigungen',
    ],
  },
  {
    icon: Landmark,
    title: 'Behördenbegleitung',
    items: [
      'Hilfe bei Terminen mit Behörden',
      'Unterstützung beim Ausfüllen von Dokumenten',
      'Begleitung zur Ausländerbehörde, Sozialamt, Jobcenter',
    ],
  },
  {
    icon: BadgeCheck,
    title: 'Integrationslots*innen',
    isNew: true,
    items: [
      'Mitglieder mit offizieller Integrationslots*innen-Karte',
      'Professionelle Begleitung von Geflüchteten und Migranten',
      'Unterstützung nach offiziellen Standards und Richtlinien',
    ],
  },
  {
    icon: Languages,
    title: 'Sprachförderung',
    items: [
      'Hilfe beim Finden von Sprachkursen',
      'Unterstützung beim Üben der Sprache (Sprachtandem, Lernrunden)',
      'Vorbereitung auf Sprachprüfungen',
    ],
  },
  {
    icon: Baby,
    title: 'Integration für Kinder',
    isNew: true,
    items: [
      'Integrationsunterricht für Kinder unserer Mitglieder, die neu in Deutschland sind',
      'Unterstützung bei Schulaufgaben',
      'Orientierung im deutschen Schulsystem',
      'Förderung sozialer Teilhabe (Freizeit, Vereine, Freundschaften)',
    ],
  },
  {
    icon: Briefcase,
    title: 'Job & Karriere',
    items: [
      'Hilfe bei der Jobsuche',
      'Unterstützung beim Schreiben von Bewerbungen',
      'Einblicke in den Arbeitsmarkt in Gießen und Umgebung',
      'Organisation von Karriere-Treffen und Infoabenden',
    ],
  },
  {
    icon: Scale,
    title: 'Asyl- & Rechtsberatung (informell)',
    items: [
      'Unterstützung beim Finden eines passenden Rechtsanwalts',
      'Begleitung zu Terminen',
      'Hilfe bei Übersetzungen und Dokumenten',
    ],
  },
  {
    icon: Palette,
    title: 'Wochenend-Kulturkurse',
    items: [
      'Organisation und Koordination der kulturellen Wochenendkurse',
      'Anmeldung, Raumplanung, Kommunikation mit Kursleitern',
    ],
  },
];

const partnerInstitutions = [
  'Freiwilligenzentrum Gießen',
  'Angekommen Gießen',
  'ZIBB e.V.',
  'Ausländerbehörde Gießen',
  'Ausländerbehörde Wetzlar',
  'Jobcenter Gießen',
  'Agentur für Arbeit Gießen',
  'VHS Gießen (Sprachkurse)',
];

const usefulLinks = [
  { name: 'Freiwilligenzentrum Gießen', url: 'https://freiwilligenzentrum-giessen.de' },
  { name: 'Angekommen Gießen', url: 'https://angekommen-giessen.de' },
  { name: 'ZIBB e.V.', url: 'https://zibb-giessen.de' },
  { name: 'Ausländerbehörde Gießen', url: 'https://www.giessen.de' },
  { name: 'Ausländerbehörde Wetzlar', url: 'https://www.wetzlar.de' },
  { name: 'Jobcenter Gießen', url: 'https://www.arbeitsagentur.de/vor-ort/jobcenter/jobcenter-giessen-giessen.html' },
  { name: 'VHS Gießen', url: 'https://www.vhs-giessen.de' },
  { name: 'Agentur für Arbeit Gießen', url: 'https://www.arbeitsagentur.de/vor-ort/giessen' },
];

const faqs = [
  {
    q: 'Sind die Integrationsangebote kostenlos?',
    a: 'Ja. Alle Angebote unseres Vereins — von der Behördenbegleitung bis zur Sprachförderung — sind für Ratsuchende kostenlos und werden ehrenamtlich sowie über Fördermittel getragen.',
  },
  {
    q: 'Brauche ich einen Termin für die Beratung?',
    a: 'Ein Termin ist nicht immer nötig, aber hilfreich. Schreiben Sie uns einfach eine E-Mail an ' + CONTACT_EMAIL + ' oder kommen Sie während unserer Veranstaltungen persönlich vorbei — wir finden gemeinsam einen Termin.',
  },
  {
    q: 'In welchen Sprachen unterstützen wir?',
    a: 'Wir beraten auf Deutsch, Türkisch und Englisch. Für weitere Sprachen organisieren wir über unser Netzwerk geeignete Übersetzer*innen und Integrationslots*innen.',
  },
  {
    q: 'Wer kann die Angebote nutzen?',
    a: 'Alle Menschen mit Migrations- und Fluchterfahrung in Gießen, Wetzlar und der Region Mittelhessen — unabhängig von einer Vereinsmitgliedschaft. Eine Mitgliedschaft freut uns natürlich trotzdem.',
  },
  {
    q: 'Wie werden die Integrationslots*innen ausgebildet?',
    a: 'Unsere Integrationslots*innen verfügen über die offizielle Integrationslots*innen-Karte und sind nach anerkannten Standards und Richtlinien geschult. Sie begleiten professionell, diskret und auf Augenhöhe.',
  },
];

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.q}
            className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-brand-navy">{faq.q}</span>
              <ChevronDown
                size={20}
                className={`text-brand-teal shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="px-6 pb-6 text-slate-600 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function Integration() {
  const mailtoLink =
    'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Beratungsanfrage: Integration & Unterstützung');

  return (
    <div className="min-h-screen bg-white">
      <PuzzleBackground color="#1E293B" />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/integration-mentor/1920/1080"
            alt="Integration"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brand-navy font-bold mb-8 hover:gap-4 transition-all"
          >
            <ArrowLeft size={20} /> Zurück zur Startseite
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-sm mb-6">
              <Anchor size={16} /> Integrationsplattform
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-brand-navy mb-6 leading-tight">
              Integration &amp; <span className="text-brand-teal">Unterstützung</span> in Gießen
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-10">
              Unser Verein begleitet Menschen mit Migrationserfahrung auf ihrem Weg in ein
              selbstbestimmtes Leben — aktiv, professionell und strukturiert.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#kontakt" className="btn-primary flex items-center gap-2">
                <Mail size={18} /> Beratung anfragen
              </a>
              <a href="#links" className="btn-secondary flex items-center gap-2">
                <ExternalLink size={18} /> Nützliche Links
              </a>
              <a href={mailtoLink} className="btn-secondary flex items-center gap-2">
                <Users size={18} /> Kontakt aufnehmen
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Unsere Integrationsangebote */}
      <section id="angebote" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange font-bold text-sm mb-6">
              <Handshake size={16} /> Unsere Angebote
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6">
              Unsere Integrationsangebote
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Von der Wohnungssuche bis zur Sprachförderung — wir sind in allen Lebenslagen
              an Ihrer Seite.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: (index % 4) * 0.08 }}
                whileHover={{ y: -8 }}
                className="p-7 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 bg-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal">
                    <service.icon size={28} />
                  </div>
                  {service.isNew && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-orange text-white rounded-full px-2.5 py-1">
                      Neu
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-4">{service.title}</h3>
                <ul className="space-y-2.5">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed"
                    >
                      <CheckCircle2 size={15} className="text-brand-teal shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner & Vernetzung */}
      <section id="partner" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-sm mb-6">
              <Handshake size={16} /> Vernetzung
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6">
              Unsere Partner &amp; Vernetzung
            </h2>
          </div>

          <div className="max-w-3xl mx-auto mb-12 text-center">
            <div className="flex items-start gap-4 p-7 rounded-[2rem] bg-brand-teal/5 border border-brand-teal/15">
              <Landmark className="text-brand-teal shrink-0 mt-1" size={28} />
              <p className="text-slate-600 leading-relaxed text-left">
                Wir arbeiten eng mit der <strong className="text-brand-navy">Ausländerbehörde Gießen</strong>{' '}
                zusammen — Mitglieder der Ausländerbehörde sind Teil unseres Netzwerks. So
                gewährleisten wir einen direkten, offiziellen Draht zu den relevanten Stellen.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {partnerInstitutions.map((name, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 4) * 0.07 }}
                className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4"
              >
                <MapPin size={18} className="text-brand-orange shrink-0" />
                <span className="text-sm font-semibold text-brand-navy leading-snug">{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nützliche Links */}
      <section id="links" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange font-bold text-sm mb-6">
              <ExternalLink size={16} /> Linkliste
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6">
              Nützliche Links
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Direkte Zugänge zu den wichtigsten Anlaufstellen in Gießen und Wetzlar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {usefulLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 2) * 0.08 }}
                className="group flex items-center justify-between gap-4 bg-white border border-slate-100 rounded-2xl px-6 py-5 shadow-sm hover:border-brand-teal/40 hover:shadow-md transition-all"
              >
                <span className="font-semibold text-brand-navy group-hover:text-brand-teal transition-colors">
                  {link.name}
                </span>
                <ExternalLink
                  size={18}
                  className="text-slate-400 group-hover:text-brand-teal transition-colors shrink-0"
                />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6">
              Häufige Fragen
            </h2>
            <p className="text-slate-600">Die wichtigsten Antworten auf einen Blick.</p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* Kontakt & Terminvereinbarung */}
      <section id="kontakt" className="py-24 bg-brand-navy relative overflow-hidden scroll-mt-24">
        <PuzzleBackground color="#ffffff" className="opacity-10" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-teal/20 rounded-2xl text-brand-teal mb-8">
            <Heart size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Kontakt &amp; Terminvereinbarung
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-10">
            Wir sind für Sie da – persönlich, respektvoll und engagiert.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href={mailtoLink}
              className="btn-primary inline-flex items-center gap-2 py-4 px-8"
            >
              <Mail size={18} /> Beratung anfragen
            </a>
            <a
              href={'mailto:' + CONTACT_EMAIL}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full transition-all"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-10 border-t border-white/10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
                Ansprechpartner
              </p>
              <p className="font-semibold text-white">Serdar Gülec</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
                E-Mail
              </p>
              <p className="font-semibold text-white break-all">{CONTACT_EMAIL}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <ShareButtons
            title="BVM e.V. Integrationsplattform - Integration & Unterstützung in Gießen"
            className="items-center"
          />
        </div>
      </section>
    </div>
  );
}
