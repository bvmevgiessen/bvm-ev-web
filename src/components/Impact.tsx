import { motion } from 'motion/react';
import { Globe, Users, Rocket, ArrowRight, Heart, MapPin, LayoutGrid, Calendar } from 'lucide-react';

export default function Impact() {
  const stats = [
    {
      label: 'Engagierte Familien',
      value: '100',
      description: 'Das Herzstück unseres Vereins.',
      icon: <Heart className="text-brand-orange" size={24} fill="currentColor" />,
    },
    {
      label: 'Aktive Städte',
      value: '2',
      description: 'Stolz in Mittelhessen verwurzelt.',
      icon: <MapPin className="text-brand-teal" size={24} />,
    },
    {
      label: 'Spezialisierte Plattformen',
      value: '3',
      description: 'Jugend, Dialog und Integration.',
      icon: <LayoutGrid className="text-brand-navy" size={24} />,
    },
    {
      label: 'Seit 2019',
      value: '5+',
      description: 'Kulturelle Brücken in Mittelhessen.',
      icon: <Calendar className="text-brand-teal" size={24} />,
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
    },
    {
      title: 'Dialogplattform',
      subtitle: 'Respekt & Verständnis',
      description: 'Begegnung schaffen durch das "Iftar der Begegnung", Sprachcafés und interreligiöse Veranstaltungen.',
      features: ['Iftar der Begegnung', 'Sprachcafés', 'Interreligiöse Events'],
      icon: <Globe className="text-brand-orange" size={32} />,
      color: 'bg-orange-50',
      accent: 'bg-brand-orange',
    },
    {
      title: 'Integrationsplattform',
      subtitle: 'Zentraler Ankerpunkt',
      description: 'Orientierungshilfe für das Leben in Deutschland, Mentoring für Erwachsene und Sprachunterstützung.',
      features: ['Orientierungshilfe', 'Erwachsenen-Mentoring', 'Sprachförderung'],
      icon: <Users className="text-brand-navy" size={32} />,
      color: 'bg-slate-100',
      accent: 'bg-brand-navy',
    },
  ];

  return (
    <section id="impact" className="bg-slate-50 py-24 overflow-hidden">
      <div className="section-padding">
        {/* Heartbeat Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
                {stat.icon}
              </div>
              <div className="text-4xl font-extrabold text-brand-navy mb-2">{stat.value}</div>
              <div className="text-sm font-bold text-brand-teal uppercase tracking-widest mb-2">{stat.label}</div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-[150px] mx-auto">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6"
          >
            Unsere drei <span className="text-brand-teal">Kernplattformen</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 max-w-2xl mx-auto text-lg"
          >
            Maßgeschneiderte Programme für eine inklusive und starke Gemeinschaft in Mittelhessen.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative p-10 rounded-[2.5rem] border border-slate-200 hover:border-brand-teal/20 hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden"
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
              
              <button className="w-full py-4 rounded-2xl bg-slate-50 text-brand-navy font-bold flex items-center justify-center gap-2 group-hover:bg-brand-teal group-hover:text-white transition-all duration-300">
                Details ansehen <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

