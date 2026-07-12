import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Users, 
  Sparkles, 
  BookOpen, 
  Coffee, 
  Activity, 
  Map, 
  Compass, 
  Scale, 
  Shield, 
  Info, 
  UserCheck, 
  ArrowRight,
  Smile,
  HeartHandshake
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PuzzleBackground from '../components/PuzzleBackground';
import ShareButtons from '../components/ShareButtons';

export default function Dialog() {
  const principles = [
    {
      title: 'Wissen teilen, Horizonte öffnen',
      description: 'Wir glauben daran, dass Bildung der Schlüssel zu Verständnis und Respekt ist. Durch gezielte Lernangebote, Workshops und Austauschformate schaffen wir Zugänge zu neuem Wissen, fördern kritisches Denken und helfen dabei, Vorurteile abzubauen. So entsteht ein Fundament, auf dem echter Dialog wachsen kann.',
      icon: <BookOpen className="text-brand-orange" size={24} />,
    },
    {
      title: 'Orte für echten Austausch gestalten',
      description: 'Wir schaffen geschützte Räume, in denen Menschen sich offen, respektvoll und auf Augenhöhe begegnen können. Diese Begegnungsorte ermöglichen ehrliche Gespräche, stärken Vertrauen und fördern ein Miteinander, das Vielfalt wertschätzt und Unterschiede respektiert.',
      icon: <Shield className="text-brand-orange" size={24} />,
    },
    {
      title: 'Herausforderungen gemeinsam überwinden',
      description: 'Konflikte sehen wir als Chancen für Entwicklung. Wir gehen Herausforderungen aktiv und vermittelnd an, suchen nach gemeinsamen Wegen und fördern konstruktive Lösungen. Unser Ziel ist es, Brücken zu bauen und Dialog auch dort zu ermöglichen, wo Meinungen auseinandergehen.',
      icon: <HeartHandshake className="text-brand-orange" size={24} />,
    },
  ];

  const offerings = [
    {
      category: 'Begegnung & Austausch',
      color: 'border-orange-500/20 bg-orange-500/5',
      items: [
        {
          title: 'Regelmäßige Sprachcafés',
          description: 'Entspanntes Deutschlernen, nettes Plaudern bei Kaffee und Kuchen in ungezwungener Atmosphäre.',
          icon: <Coffee className="text-brand-orange shrink-0" size={20} />,
        },
        {
          title: 'Tandem-Programme',
          description: 'Gezielte 1-zu-1 Partnerschaften für den interkulturellen Austausch und das gemeinsame Sprachenlernen.',
          icon: <Users className="text-brand-orange shrink-0" size={20} />,
        },
        {
          title: 'Internationale Spieleabende',
          description: 'Gemeinsames Spielen, Lachen und Kennenlernen für Jugendliche, Studierende und Junggebliebene.',
          icon: <Smile className="text-brand-orange shrink-0" size={20} />,
        },
        {
          title: 'Interkulturelle Begegnungen',
          description: 'Vielfältige Anlässe im Alltag, um Menschen unterschiedlicher Herkunft direkt miteinander zu verbinden.',
          icon: <Heart className="text-brand-orange shrink-0" size={20} />,
        },
      ],
    },
    {
      category: 'Dialog & Feste',
      color: 'border-teal-500/20 bg-teal-500/5',
      items: [
        {
          title: 'Gesprächsrunden',
          description: 'Moderierte Gesprächskreise über gesellschaftliche, philosophische und existenzielle Fragestellungen.',
          icon: <MessageSquare className="text-brand-teal shrink-0" size={20} />,
        },
        {
          title: 'Interreligiöse Veranstaltungen',
          description: 'Offene Diskursangebote zwischen Angehörigen verschiedener Religionen für ein besseres Kennenlernen.',
          icon: <Globe className="text-brand-teal shrink-0" size={20} />,
        },
        {
          title: 'Feste & Feiertage gemeinsam erleben',
          description: 'Kulturelle Feierlichkeiten wie das gemeinsame Iftar (Fastenbrechen), Zuckerfest, Opferfest, Aschura-Tag sowie Aktionen zum Weltfrauentag und Muttertag.',
          icon: <Sparkles className="text-brand-teal shrink-0" size={20} />,
        },
        {
          title: 'Gemeinsame Konferenzen',
          description: 'Akademische und gesellschaftliche Tagungen mit Expert*innen zu Themen des Dialogs und der Integration.',
          icon: <BookOpen className="text-brand-teal shrink-0" size={20} />,
        },
      ],
    },
    {
      category: 'Bildung, Kultur & Soziales',
      color: 'border-indigo-500/20 bg-indigo-500/5',
      items: [
        {
          title: 'Interkulturelle Seminare & Workshops',
          description: 'Kompetenztrainings zur Sensibilisierung und Stärkung des interkulturellen Verständnisses.',
          icon: <Compass className="text-indigo-600 shrink-0" size={20} />,
        },
        {
          title: 'Bildungs- und Kulturreisen',
          description: 'Exkursionen zu historischen, kulturellen und religiösen Stätten, um Horizonte nachhaltig zu erweitern.',
          icon: <Map className="text-indigo-600 shrink-0" size={20} />,
        },
        {
          title: 'Kunst- & Musikworkshops',
          description: 'Gemeinsames schöpferisches Tun, Handwerk, Musik und Malerei als universelle Dialog-Brücken.',
          icon: <Sparkles className="text-indigo-600 shrink-0" size={20} />,
        },
        {
          title: 'Besuche in Altenheimen & Soziales',
          description: 'Brücken zwischen den Generationen bauen und gesellschaftliche Fürsorge aktiv mitleben.',
          icon: <HeartHandshake className="text-indigo-600 shrink-0" size={20} />,
        },
        {
          title: 'Sportliche Aktivitäten',
          description: 'Teambuilding und Spaß an Bewegung im gemeinsamen sportlichen Spiel.',
          icon: <Activity className="text-indigo-600 shrink-0" size={20} />,
        },
      ],
    },
  ];

  const valueHighlights = [
    {
      title: 'Abbau von Vorurteilen',
      description: 'Wer miteinander spricht, spricht nicht übereinander. Direkte Kontakte bauen Barrieren in den Köpfen am effektivsten ab.',
    },
    {
      title: 'Förderung von Respekt',
      description: 'Vielfalt bereichert uns. Wir achten die Würde und die individuellen Überzeugungen jedes einzelnen Menschen.',
    },
    {
      title: 'Stärkung des Zusammenhalts',
      description: 'Durch Verständnis füreinander schaffen wir ein festes soziales Netz und ein friedliches Miteinander in Mittelhessen.',
    },
    {
      title: 'Sichere Räume des Austauschs',
      description: 'Freiheit und Vertrauen stehen bei uns an erster Stelle, um auch schwierige Themen konstruktiv anzusprechen.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-brand-orange/30 selection:text-brand-navy">
      <PuzzleBackground color="#F97316" className="opacity-40" />
      <Navbar />

      {/* Main Content Wrapper to offset fixed Navbar */}
      <main className="relative z-10 pt-[72px]">
        
        {/* Modern, High-Impact Hero Section */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1920" 
              alt="Gemeinschaftlicher Dialog" 
              className="w-full h-full object-cover opacity-15"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-slate-50" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <Link to="/" className="inline-flex items-center gap-2 text-brand-orange font-bold mb-8 group hover:text-brand-orange/80 transition-all">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Zurück zur Startseite
            </Link>
            
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl lg:col-span-7"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange font-extrabold text-xs uppercase tracking-wider mb-6">
                  <Globe size={14} className="animate-pulse" /> Dialogplattform BVM
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-navy mb-6 leading-[1.1] tracking-tight">
                  Brücken bauen,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-600">Dialog leben! 🤝</span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium mb-8">
                  Seit unserer Gründung im Jahr 2019 setzen wir uns als <span className="font-bold text-brand-navy">BVM e. V.</span> leidenschaftlich für Verständigung, Respekt und interkulturelle Begegnung in Mittelhessen ein. Wir schaffen Räume für ein friedliches und bereicherndes Miteinander aller Kulturen und Religionen.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#angebote" className="btn-primary text-center py-4 px-8 text-base shadow-lg shadow-brand-orange/10 !bg-brand-orange hover:!bg-orange-600 text-white border-none">
                    Dialogangebote entdecken
                  </a>
                  <a href="/#contact" className="bg-white hover:bg-slate-50 text-brand-navy font-bold py-4 px-8 rounded-full border border-slate-200 text-center transition-all">
                    Kontakt aufnehmen
                  </a>
                </div>
              </motion.div>

              {/* Dynamic Highlight Card on Hero */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-100 relative"
              >
                <div className="absolute -top-4 -right-4 bg-brand-orange text-white text-xs font-extrabold uppercase px-4 py-2 rounded-2xl rotate-6 shadow-md">
                  Aktiv seit 2019
                </div>
                <h3 className="text-xl font-extrabold text-brand-navy mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-brand-orange animate-spin-slow" /> Unsere Mission
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium mb-6">
                  Wir wollen Vorurteile abbauen, den interreligiösen Diskurs stärken und die Vielfalt in Gießen, Wetzlar und ganz Mittelhessen als gemeinsame Stärke begreifen.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Users size={18} className="text-brand-orange shrink-0" /> Für alle Hintergründe & Kulturen
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <MessageSquare size={18} className="text-brand-orange shrink-0" /> Begegnung auf Augenhöhe
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Scale size={18} className="text-brand-orange shrink-0" /> Freiheit & Gleichheit als Basis
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Wer wir sind (Vereinsprofil & Dialogplattform-Identität) */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-6 relative">
                <div className="absolute -inset-4 bg-orange-50 rounded-[3rem] -rotate-2 -z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1000" 
                  alt="Dialogrunde BVM" 
                  className="rounded-[2.5rem] shadow-xl w-full h-[450px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="lg:col-span-6 space-y-8">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-brand-orange">Wer wir sind</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mt-2 mb-6">Gemeinsam Brücken bauen in Mittelhessen</h2>
                  <p className="text-slate-600 leading-relaxed font-medium mb-4">
                    <span className="font-bold text-brand-navy">Bildung und Verständigung Mittelhessen (BVM) e. V.</span> ist ein gemeinnütziger Verein, der sich leidenschaftlich der Förderung von Bildung, gelungener Integration und nachhaltigem interkulturellen Dialog verschrieben hat. Ein besonderes Anliegen ist uns zudem der dauerhafte und tiefgehende interkulturelle und interreligiöse Austausch.
                  </p>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Unser übergeordnetes Ziel ist es, mit unserer <span className="text-brand-orange font-bold">Dialogplattform</span> aktiv auf ein friedliches und harmonisches Zusammenleben in Deutschland hinzuwirken. Wir bringen Menschen mit ganz unterschiedlichen Überzeugungen, Lebensentwürfen und Herkunftsgeschichten zusammen – in Gesprächsrunden, kreativen Workshops, Konferenzen und einer Vielzahl an farbenfrohen Kulturveranstaltungen.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                    <div className="text-2xl font-black text-brand-orange">Dialog</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Interkulturell & Interreligiös</div>
                  </div>
                  <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                    <div className="text-2xl font-black text-brand-teal">Mittelhessen</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Gießen, Wetzlar & Region</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Selbstverständnis & Die 3 Prinzipien */}
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange">Unser Selbstverständnis</span>
              <h2 className="text-3xl md:text-5xl font-black text-brand-navy">Werte, die unser Handeln leiten</h2>
              <p className="text-slate-600 max-w-3xl mx-auto font-medium text-lg leading-relaxed">
                "Wir wollen mit Menschen aktiv ins Gespräch kommen. Kunst, Musik, Handwerk und Kultur bringen Menschen zusammen und bilden robuste Brücken zur Förderung eines direkten, offenen und sensiblen Dialogs."
              </p>
            </div>

            {/* Principles Bento Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {principles.map((p, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                    {p.icon}
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-4">{p.title}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>

            {/* UN Human Rights Declaration Note */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200/60 shadow-sm max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                  <Scale className="text-brand-orange" size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-navy mb-2">Menschenrechte als universelles Fundament</h4>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Als ideelle Grundlage all unseres Handelns verstehen wir die Werte der Freiheit, Gerechtigkeit und Gleichheit, die sich in der <strong>„Allgemeinen Erklärung der Menschenrechte der Vereinten Nationen“</strong> ausdrücken. Als offene Plattform der Begegnung möchten wir täglich einen praktischen Beitrag zur Verwirklichung und Festigung dieser universellen Gedanken leisten.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Geschichte (Our History) */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-black uppercase tracking-widest text-brand-orange">Unsere Geschichte</span>
                <h2 className="text-3xl md:text-5xl font-black text-brand-navy leading-tight">Wie alles begann</h2>
                
                <p className="text-slate-600 font-medium leading-relaxed">
                  BVM wurde im Jahr 2019 in Gießen überwiegend von engagierten Menschen aus der Türkei gegründet. Die Gründungsmitglieder waren Teil der internationalen <strong>Hizmet-Bewegung</strong> und empfanden eine große ideelle Nähe zum muslimischen Gelehrten <strong>Fethullah Gülen</strong>, welcher sich zeitlebens explizit und nachdrücklich für interkulturellen Frieden, Bildung und den Dialog ausgesprochen hat.
                </p>
                
                <p className="text-slate-600 font-medium leading-relaxed">
                  Von Beginn an hat sich unser Verein das klare Ziel gesetzt, einen wertvollen und dauerhaften Beitrag zu einem friedlichen Zusammenleben in Deutschland zu leisten. Dies geschieht vor allem durch das gezielte Anstoßen, Begleiten und Etablieren des interreligiösen und interkulturellen Dialogs. Deswegen bietet der Verein völlig unabhängig von Glauben, weltanschaulicher Prägung und nationaler Herkunft ein offenes, tolerantes Forum für alle interessierten Menschen.
                </p>

                <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-md">
                  <Info className="text-brand-orange shrink-0" size={24} />
                  <p className="text-xs text-slate-500 font-medium">
                    Bei uns steht der Mensch im Mittelpunkt. Jede Stimme zählt, jede Perspektive ist eine Bereicherung.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="absolute -inset-4 bg-teal-50 rounded-[3rem] rotate-2 -z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000" 
                  alt="Gemeinsamer Austausch Geschichte" 
                  className="rounded-[2.5rem] shadow-xl w-full h-[450px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Was wir anbieten (All Offerings combined) */}
        <section id="angebote" className="py-24 bg-slate-50 relative scroll-mt-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange">Unser Programm</span>
              <h2 className="text-3xl md:text-5xl font-black text-brand-navy">Was wir anbieten</h2>
              <p className="text-slate-600 max-w-2xl mx-auto font-medium">
                Unsere Aktivitäten sind so bunt und vielfältig wie die Menschen, die sie gestalten. Wir laden Dich herzlich ein, unsere Angebote kennenzulernen und mitzumachen!
              </p>
            </div>

            {/* Dynamic Grid of Categories */}
            <div className="space-y-12">
              {offerings.map((cat, idx) => (
                <div key={idx} className={`p-8 md:p-12 rounded-[2.5rem] border ${cat.color} bg-white shadow-sm space-y-8`}>
                  <h3 className="text-2xl font-black text-brand-navy border-b border-slate-100 pb-4">{cat.category}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {cat.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50/50 transition-all">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 h-fit">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-brand-navy text-base mb-1">{item.title}</h4>
                          <p className="text-slate-500 font-medium text-xs leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Warum Dialog wichtig ist (Why Dialog matters) */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange">Gesellschaftlicher Beitrag</span>
              <h2 className="text-3xl md:text-5xl font-black text-brand-navy">Warum Dialog wichtig ist</h2>
              <p className="text-slate-600 max-w-2xl mx-auto font-medium">
                Dialog ist kein Selbstzweck – er ist das Rückgrat einer funktionierenden, demokratischen und friedlichen Stadtgesellschaft.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valueHighlights.map((val, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <span className="text-3xl font-black text-brand-orange/20 block mb-4">0{idx + 1}</span>
                  <h4 className="font-extrabold text-brand-navy text-lg mb-2">{val.title}</h4>
                  <p className="text-slate-500 font-medium text-xs leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Zielgruppen Sektion */}
        <section className="py-24 bg-brand-navy text-white relative overflow-hidden">
          <PuzzleBackground color="#ffffff" className="opacity-10" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-black uppercase tracking-widest text-brand-teal">Für wen wir da sind</span>
                <h2 className="text-3xl md:text-5xl font-black">Unsere Zielgruppen</h2>
                <p className="text-lg text-slate-300 font-medium leading-relaxed">
                  Die Dialogplattform Mittelhessen ist ein offenes Forum für alle interessierten Köpfe in der Region.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-6 pt-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-2 text-base">Menschen aller Hintergründe</h4>
                    <p className="text-slate-400 text-xs">Völlig unabhängig von Religion, Kultur, Herkunft, Bildungsweg oder Alter.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-2 text-base">Lokale Gemeinschaft</h4>
                    <p className="text-slate-400 text-xs">Aktive Bürger*innen und Interessierte aus Gießen, Wetzlar und ganz Mittelhessen.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6 text-center">
                <div className="w-16 h-16 bg-brand-teal/20 text-brand-teal rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-bold">Gemeinsam Großes bewirken</h3>
                <p className="text-slate-300 text-xs font-medium leading-relaxed">
                  Egal, ob du einfach mal reinschnuppern möchtest, dich ehrenamtlich einbringen willst oder ein eigenes Dialogprojekt vorschlagen möchtest: Du bist herzlich willkommen!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action (CTA) */}
        <section id="mitwirken" className="py-24 bg-slate-50 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200/70 p-12 md:p-16 shadow-lg relative overflow-hidden">
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl" />
              
              <div className="grid lg:grid-cols-12 gap-12 relative z-10 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-brand-orange font-extrabold text-xs uppercase tracking-wider">
                    <HeartHandshake size={14} /> Mach mit!
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-brand-navy leading-tight">Werde Teil der Dialoggemeinschaft</h2>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed">
                    Deine Ideen und dein Engagement bereichern unsere Plattform. Komm mit uns ins Gespräch und lass uns gemeinsam Brücken für die Zukunft bauen.
                  </p>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Wir freuen uns auf ein Kennenlernen in einer unserer Gesprächsrunden, beim Sprachcafé oder dem nächsten internationalen Spieleabend!
                  </p>
                </div>

                <div className="lg:col-span-5 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 space-y-4">
                  <h4 className="font-extrabold text-brand-navy text-xl">Deine nächsten Schritte:</h4>
                  
                  <div className="space-y-4">
                    <a 
                      href="/events" 
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-brand-orange/40 transition-all group"
                    >
                      <div className="flex gap-3 items-center">
                        <Calendar className="text-brand-orange shrink-0" size={18} />
                        <span className="font-bold text-sm text-brand-navy">Termine & Events prüfen</span>
                      </div>
                      <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <a 
                      href="/#contact" 
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-brand-orange/40 transition-all group"
                    >
                      <div className="flex gap-3 items-center">
                        <MessageSquare className="text-brand-orange shrink-0" size={18} />
                        <span className="font-bold text-sm text-brand-navy">Kontakt aufnehmen</span>
                      </div>
                      <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <a 
                      href="/mitmachen" 
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-brand-orange/40 transition-all group"
                    >
                      <div className="flex gap-3 items-center">
                        <UserCheck className="text-brand-orange shrink-0" size={18} />
                        <span className="font-bold text-sm text-brand-navy">Jetzt Mitglied werden</span>
                      </div>
                      <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emotionale Mission Callout */}
        <section className="py-24 bg-brand-navy text-white relative overflow-hidden">
          <PuzzleBackground color="#ffffff" className="opacity-10" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
            <Heart className="text-brand-orange mx-auto animate-pulse" size={56} fill="currentColor" />
            <h2 className="text-3xl md:text-5xl font-black leading-tight italic">
              "Gemeinsam Vielfalt gestalten, gegenseitigen Respekt verankern und dauerhafte Brücken bauen."
            </h2>
            <p className="text-slate-300 font-medium max-w-2xl mx-auto text-base">
              Lass uns gemeinsam an einer verständnisvollen Gesellschaft arbeiten. Wir freuen uns auf dich!
            </p>
            <div className="w-24 h-1.5 bg-brand-orange mx-auto rounded-full" />
          </div>
        </section>

        {/* Share Section */}
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
            <ShareButtons title="BVM e.V. Dialogplattform - Vielfalt, Respekt & Dialog leben" className="items-center" />
          </div>
        </section>
      </main>
    </div>
  );
}
