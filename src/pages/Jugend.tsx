import React from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Target, 
  MapPin, 
  ArrowLeft, 
  GraduationCap, 
  Compass, 
  Heart, 
  Users, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Activity, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  UserCheck,
  Smile
} from 'lucide-react';
import { Link } from 'react-router';
import Navbar from '../components/Navbar';
import PuzzleBackground from '../components/PuzzleBackground';
import ShareButtons from '../components/ShareButtons';

export default function Jugend() {
  const offerings = [
    {
      title: 'Jugend-Mentoring & Begleitung',
      description: 'Durch unser Mentoring-Programm erhältst Du persönliche Unterstützung, Orientierung und Inspiration, um Deinen Weg erfolgreich zu gehen.',
      icon: <Target className="text-brand-teal" size={28} />,
      badge: 'Zukunft',
      bgGradient: 'from-teal-500/10 to-emerald-500/10'
    },
    {
      title: 'Dialog- & Spielabende',
      description: 'Lust auf neue Leute und Spaß? Bei unserem Internationalen Spieleabend spielen wir Brettspiele, lernen uns kennen und quatschen ganz ungezwungen in gemütlicher Wohnzimmer-Atmosphäre.',
      icon: <Users className="text-brand-teal" size={28} />,
      badge: 'Gemeinschaft',
      bgGradient: 'from-indigo-500/10 to-blue-500/10'
    },
    {
      title: 'Stadttouren & Exkursionen',
      description: 'Entdecke Gießen, Wetzlar und ganz Mittelhessen! Wir machen coole Touren durch die Region, erkunden neue Orte und knüpfen neue Kontakte.',
      icon: <MapPin className="text-brand-teal" size={28} />,
      badge: 'Abenteuer',
      bgGradient: 'from-amber-500/10 to-orange-500/10'
    },
    {
      title: 'Museumsbesuche',
      description: 'Spannende Einblicke in Kunst, Kultur und Wissenschaft. Wir machen Kultur lebendig, verständlich und für jeden zugänglich.',
      icon: <Compass className="text-brand-teal" size={28} />,
      badge: 'Kultur',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      title: 'Ferienprogramme',
      description: 'Ferienzeit ist Actionzeit! Wir organisieren abwechslungsreiche Programme, Ausflüge und Freizeitaktivitäten in den Ferien, bei denen garantiert keine Langeweile aufkommt.',
      icon: <Calendar className="text-brand-teal" size={28} />,
      badge: 'Ferien',
      bgGradient: 'from-sky-500/10 to-blue-500/10'
    },
    {
      title: 'Freizeitaktivitäten',
      description: 'Sport, Action oder einfach nur zusammen abhängen. Bei unseren vielfältigen Aktivitäten steht die Freude am gemeinsamen Erleben im Mittelpunkt.',
      icon: <Activity className="text-brand-teal" size={28} />,
      badge: 'Spaß',
      bgGradient: 'from-rose-500/10 to-orange-500/10'
    },
    {
      title: 'Feriencamps',
      description: 'Ein unvergessliches Abenteuer in der Natur! Unsere Camps (mit und ohne Übernachtung) in gemütlichen Jugendherbergen bieten Dir Action, Sport und die Chance, Dich selbst auszuprobieren.',
      icon: <Sparkles className="text-brand-teal" size={28} />,
      badge: 'Highlight',
      bgGradient: 'from-emerald-500/10 to-teal-500/10'
    },
    {
      title: 'Kreativ- & Kunst-Workshops',
      description: 'Lass Deiner Kreativität freien Lauf! In unseren Workshops fördern wir Deine schöpferischen Talente, Deinen Teamgeist und lernen voneinander.',
      icon: <Smile className="text-brand-teal" size={28} />,
      badge: 'Kreativität',
      bgGradient: 'from-violet-500/10 to-purple-500/10'
    },
    {
      title: 'Bildungs- & Kulturreisen',
      description: 'Erweitere Deinen Horizont auf unseren gemeinsamen Reisen. Lerne unterschiedliche Lebensweisen kennen und erlebe interkulturelle Begegnung hautnah.',
      icon: <Globe className="text-brand-teal" size={28} />,
      badge: 'Horizont',
      bgGradient: 'from-cyan-500/10 to-sky-500/10'
    },
    {
      title: 'Nachhilfe & Hausaufgabenbetreuung',
      description: 'Wir lassen Dich in der Schule nicht allein. Erhalte gezielte, verständliche Unterstützung und Nachhilfe, um Deine schulischen Kompetenzen und Dein Selbstvertrauen zu stärken.',
      icon: <BookOpen className="text-brand-teal" size={28} />,
      badge: 'Bildung',
      bgGradient: 'from-emerald-500/10 to-sky-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-brand-teal/30 selection:text-brand-navy">
      <PuzzleBackground color="#0D9488" className="opacity-40" />
      <Navbar />

      {/* Main Content Wrapper to offset fixed Navbar */}
      <main className="relative z-10 pt-[72px]">
        
        {/* Modern, High-Impact Hero Section */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1920" 
              alt="Jugendgruppe lachend" 
              className="w-full h-full object-cover opacity-15"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-slate-50" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <Link to="/" className="inline-flex items-center gap-2 text-brand-teal font-bold mb-8 group hover:text-brand-teal/80 transition-all">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Zurück zur Startseite
            </Link>
            
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl lg:col-span-7"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/10 text-brand-teal font-extrabold text-xs uppercase tracking-wider mb-6">
                  <Rocket size={14} className="animate-bounce" /> Jugendplattform BVM
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-navy mb-6 leading-[1.1] tracking-tight">
                  Deine Zukunft,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-teal-600">Deine Bühne! 🚀</span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium mb-8">
                  Seit 2019 setzen wir uns als <span className="font-bold text-brand-navy">Bildung und Verständigung Mittelhessen e. V. (BVM)</span> mit voller Energie für Kinder, Jugendliche und junge Erwachsene ein. Bei unseren Angeboten haben bereits zahlreiche junge Menschen im Alter von <span className="text-brand-teal font-bold">12 bis 27 Jahren</span> teilgenommen.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#angebote" className="btn-primary text-center py-4 px-8 text-base shadow-lg shadow-brand-teal/10">
                    Unsere Angebote entdecken
                  </a>
                  <a href="#mitwirken" className="bg-white hover:bg-slate-50 text-brand-navy font-bold py-4 px-8 rounded-full border border-slate-200 text-center transition-all">
                    Direkt Mitwirken & Gestalten
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
                  Zielgruppe: 12-27 Jahre!
                </div>
                <h3 className="text-xl font-extrabold text-brand-navy mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-brand-orange" /> Unser Ziel für Dich
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium mb-6">
                  Deine Fähigkeiten fördern – wir wollen Dir Raum bieten, Deine Kreativität zu entfalten und gemeinsam Perspektiven zu entwickeln.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CheckCircle2 size={18} className="text-brand-teal shrink-0" /> Vielfalt erleben
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CheckCircle2 size={18} className="text-brand-teal shrink-0" /> Selbstvertrauen gewinnen
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CheckCircle2 size={18} className="text-brand-teal shrink-0" /> Gemeinsam die Welt entdecken
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Wer wir sind, Vision & Werte */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-6 relative">
                <div className="absolute -inset-4 bg-teal-50 rounded-[3rem] -rotate-2 -z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000" 
                  alt="Jugendliche im Feriencamp" 
                  className="rounded-[2.5rem] shadow-xl w-full h-[450px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="lg:col-span-6 space-y-8">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-brand-teal">Wer wir sind</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mt-2 mb-6">Die Jugendplattform des BVM e. V.</h2>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Wir sehen eine Gesellschaft, in der jeder junge Mensch, unabhängig von Herkunft oder Hintergrund, sein volles Potenzial entfalten kann. Unsere Vision ist eine starke, selbstbewusste Jugend, die durch gegenseitiges Verständnis und interkulturellen Austausch zu aktiven und verantwortungsbewussten Gestalter:innen ihrer Zukunft wird.
                  </p>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <h4 className="text-lg font-bold text-brand-navy mb-3">Ort des Wachsens & Erlebens</h4>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">
                    Die Jugendplattform ist der Ort, an dem junge Menschen wachsen und Grenzen überwinden. Wir bieten ein ganzheitliches Unterstützungssystem, das auf die individuellen Bedürfnisse Jugendlicher mit und ohne Migrationshintergrund und Fluchterfahrung zugeschnitten ist.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                    <div className="text-2xl font-black text-brand-teal">Seit 2019</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Aktiv vor Ort</div>
                  </div>
                  <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                    <div className="text-2xl font-black text-brand-orange">12-27</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Zielgruppe Alter</div>
                  </div>
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <div className="text-2xl font-black text-indigo-600">100%</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Mitgestaltung</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coole Highlights Box */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-r from-brand-navy to-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-teal font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles size={12} /> Darum lohnt es sich!
                  </div>
                  <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">Erlebe Gemeinschaft, stärke Dein Selbstvertrauen & entfalte Deine Kreativität!</h3>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                    Wir glauben fest an Deine Fähigkeiten. BVM gibt Dir die Orientierung, Begleitung und das Netzwerk, um gemeinsam über uns hinauszuwachsen und neue Perspektiven zu entwickeln.
                  </p>
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <a href="#angebote" className="btn-primary w-full md:w-auto text-center py-4 px-8 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-full font-bold transition-all shadow-lg shadow-brand-teal/20">
                    Jetzt durchstarten
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Angebote Sektion */}
        <section id="angebote" className="py-24 bg-slate-50 relative scroll-mt-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange">Alles auf einen Blick</span>
              <h2 className="text-3xl md:text-5xl font-black text-brand-navy">Coole Aktionen & Programme</h2>
              <p className="text-slate-600 max-w-2xl mx-auto font-medium">
                Dafür bieten wir coole Aktionen wie Jugend-Mentoring-Programme, Dialogabende, Museumsbesuche, Stadttouren und Ferienprogramme an. Finde das passende Programm für Dich!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offerings.map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-8 rounded-[2rem] border border-slate-200/70 shadow-sm hover:shadow-xl hover:border-brand-teal/30 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-teal-50 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all duration-300 shadow-sm">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                        {item.badge}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-brand-navy leading-tight group-hover:text-brand-teal transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 mt-6 flex items-center justify-between text-xs font-bold text-brand-teal group-hover:text-brand-navy transition-colors">
                    <span>Erfahre mehr</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Unsere Mentor:innen */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-brand-teal font-extrabold text-xs uppercase tracking-wider">
                  <UserCheck size={14} /> Starker Support
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-brand-navy leading-tight">Unsere Mentor:innen</h2>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Unsere Mentor:innen sind engagiert und bringen jede Menge Erfahrung in der Arbeit mit Jugendlichen mit. Sie begleiten Dich auf Augenhöhe, hören Dir zu, unterstützen Dich bei Deinen Herausforderungen und helfen Dir, Deine ganz persönlichen Ziele zu verwirklichen.
                </p>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-navy">Erfahrene Begleitung</h4>
                      <p className="text-slate-500 text-sm font-medium">Praktische Tipps für Ausbildung, Studium und Schule.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-navy">Vertrauensvolles Umfeld</h4>
                      <p className="text-slate-500 text-sm font-medium">Offene Ohren für alle Lebenslagen und Pläne.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="absolute -inset-4 bg-orange-50 rounded-[3rem] rotate-2 -z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1000" 
                  alt="Mentor mit Jugendlichen" 
                  className="rounded-[2.5rem] shadow-xl w-full h-[450px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mitwirken & Engagement */}
        <section id="mitwirken" className="py-24 bg-slate-50 relative scroll-mt-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200/70 p-12 md:p-16 shadow-lg relative overflow-hidden">
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl" />
              
              <div className="grid lg:grid-cols-12 gap-12 relative z-10 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-brand-orange font-extrabold text-xs uppercase tracking-wider">
                    <Users size={14} /> Mitreden & Gestalten
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-brand-navy leading-tight">Mitwirken: Deine Ideen, Dein Projekt!</h2>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed">
                    Bei uns kannst Du mitreden, mitentscheiden und selbst aktiv werden. Wir möchten Dir den Raum geben, Deine eigenen Ideen einzubringen, Verantwortung zu übernehmen und Projekte mitzugestalten, die Dir und anderen wichtig sind.
                  </p>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Du kannst bei unseren regelmäßigen oder projektbezogenen Treffen und Aktionen dabei sein – oder sogar selbst mitorganisieren.
                  </p>
                </div>

                <div className="lg:col-span-5 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                  <h4 className="font-extrabold text-brand-navy text-xl">So kannst Du starten:</h4>
                  <ul className="space-y-4 font-semibold text-slate-700 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-brand-teal flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                      <span>Komm einfach zu einem unserer nächsten Treffen</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-brand-teal flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                      <span>Schlag Dein eigenes Projekt vor (z.B. Sportturnier, Dialogabend)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-brand-teal flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                      <span>Werde Mentor:in oder bringe Dich in Ferienprogrammen ein</span>
                    </li>
                  </ul>
                  <a href="#contact" className="btn-primary block text-center w-full py-4 text-sm mt-6">
                    Jetzt Kontakt aufnehmen
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emotionale Mission Callout */}
        <section className="py-24 bg-brand-navy text-white relative overflow-hidden">
          <PuzzleBackground color="#ffffff" className="opacity-10" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
            <Heart className="text-brand-teal mx-auto animate-pulse" size={56} fill="currentColor" />
            <h2 className="text-3xl md:text-5xl font-black leading-tight italic">
              "Gemeinsam Grenzen überwinden, Potenziale entfalten und starke Brücken bauen."
            </h2>
            <p className="text-slate-300 font-medium max-w-2xl mx-auto text-base">
              Lass uns zusammen etwas verändern. Wir freuen uns riesig auf Dich!
            </p>
            <div className="w-24 h-1.5 bg-brand-teal mx-auto rounded-full" />
          </div>
        </section>

        {/* Share Section */}
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
            <ShareButtons title="BVM e.V. Jugendplattform - Identität & Potenzial entfalten" className="items-center" />
          </div>
        </section>
      </main>
    </div>
  );
}
