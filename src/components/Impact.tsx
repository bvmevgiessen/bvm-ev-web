import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'motion/react';
import { Globe, Users, Rocket, ArrowRight, Heart, MapPin, LayoutGrid, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import PuzzleBackground from './PuzzleBackground';

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue}{suffix}</span>;
}

export default function Impact() {
  const stats = [
    {
      label: 'Engagierte Familien',
      value: 100,
      suffix: '+',
      description: 'Das lebendige Herzstück unseres Vereins in der Region.',
      icon: <Heart className="text-brand-teal" size={24} fill="currentColor" />,
      color: 'text-brand-teal',
    },
    {
      label: 'Lokale Ankerpunkte',
      value: 2,
      description: 'Aktiv verwurzelt in Gießen und Wetzlar.',
      icon: <MapPin className="text-brand-navy" size={24} />,
      color: 'text-brand-navy',
    },
    {
      label: 'Fachplattformen',
      value: 3,
      description: 'Gezielte Förderung in den Bereichen Jugend, Dialog und Integration.',
      icon: <LayoutGrid className="text-brand-orange" size={24} />,
      color: 'text-brand-orange',
    },
    {
      label: 'Jahre Brückenbau',
      value: 7,
      description: 'Seit unserer Gründung im Jahr 2019 ein verlässlicher Partner für Integration.',
      icon: <Calendar className="text-brand-teal" size={24} />,
      color: 'text-brand-teal',
    },
  ];

  const platforms = [
    {
      title: 'Jugendplattform',
      subtitle: 'Identität & Potenzial',
      description: 'Wir stärken die nächste Generation durch Mentoring, gezielte Nachhilfe und unvergessliche Feriencamps.',
      features: ['Mentoring', 'Nachhilfe', 'Feriencamps'],
      icon: <Rocket className="text-brand-teal" size={32} />,
      color: 'bg-teal-50',
      accent: 'bg-brand-teal',
      link: '/jugend'
    },
    {
      title: 'Dialogplattform',
      subtitle: 'Respekt & Verständnis',
      description: 'Begegnung schaffen durch das "Iftar der Begegnung", Sprachcafés und interreligiöse Veranstaltungen.',
      features: ['Iftar der Begegnung', 'Sprachcafés', 'Interreligiöse Events'],
      icon: <Globe className="text-brand-orange" size={32} />,
      color: 'bg-orange-50',
      accent: 'bg-brand-orange',
      link: '/dialog'
    },
    {
      title: 'Integrationsplattform',
      subtitle: 'Zentraler Ankerpunkt',
      description: 'Orientierungshilfe für das Leben in Deutschland, Mentoring für Erwachsene und Sprachunterstützung.',
      features: ['Orientierungshilfe', 'Erwachsenen-Mentoring', 'Sprachförderung'],
      icon: <Users className="text-brand-navy" size={32} />,
      color: 'bg-slate-100',
      accent: 'bg-brand-navy',
      link: '/integration'
    },
  ];

  return (
    <section id="impact" className="relative bg-slate-50 py-20 overflow-hidden">
      <PuzzleBackground color="#0D9488" className="opacity-[0.03]" />
      
      <div className="section-padding relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6"
          >
            Gemeinsam Zeichen setzen: <span className="text-brand-teal">BVM in Zahlen</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 max-w-2xl mx-auto text-lg"
          >
            Seit 2019 bauen wir Brücken zwischen Kulturen und Generationen in Gießen und Wetzlar.
          </motion.p>
        </div>

        {/* Heartbeat Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {stat.icon}
              </div>
              <div className={`text-4xl font-extrabold ${stat.color} mb-2`}>
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-bold text-brand-navy uppercase tracking-widest mb-3">{stat.label}</div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-[180px] mx-auto">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-extrabold text-brand-navy mb-4"
          >
            Unsere drei <span className="text-brand-teal">Kernplattformen</span>
          </motion.h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group relative p-10 rounded-[2.5rem] border border-slate-200 hover:border-brand-teal/20 hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm overflow-hidden"
            >
              {/* Puzzle Metaphor Background Accent */}
              <div className={`absolute top-0 right-0 w-40 h-40 ${platform.color} rounded-bl-[5rem] -z-10 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center`}>
                <svg viewBox="0 0 100 100" className={`w-20 h-20 opacity-20 ${platform.accent.replace('bg-', 'text-')}`}>
                  <path 
                    fill="currentColor" 
                    d="M30,30 h40 v40 h-40 z M50,20 a10,10 0 1,1 0,20 a10,10 0 1,1 0,-20 M80,50 a10,10 0 1,1 -20,0 a10,10 0 1,1 20,0" 
                  />
                </svg>
              </div>
              
              {/* Hover Background Shift */}
              <div className={`absolute inset-0 ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-20`} />
              
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-16 h-16 ${platform.color} rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform`}>
                  {platform.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-brand-navy leading-tight">
                    {platform.title}
                  </h3>
                  <p className="text-brand-teal font-bold text-sm uppercase tracking-wider">{platform.subtitle}</p>
                </div>
              </div>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                {platform.description}
              </p>

              <div className="space-y-3 mb-10">
                {platform.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <div className={`w-1.5 h-1.5 rounded-full ${platform.accent}`} />
                    {feature}
                  </div>
                ))}
              </div>
              
              <Link 
                to={platform.link}
                className="w-full py-4 rounded-2xl bg-slate-50 text-brand-navy font-bold flex items-center justify-center gap-2 group-hover:bg-brand-teal group-hover:text-white transition-all duration-300"
              >
                Details ansehen <ArrowRight size={18} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

