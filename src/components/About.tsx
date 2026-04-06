import { motion } from 'motion/react';
import { Target, Eye, ShieldCheck, Users, Heart, Flower, Gamepad2, Stars } from 'lucide-react';

export default function About() {
  const activities = [
    {
      title: 'Generationenarbeit',
      description: 'Besuche in lokalen Altenheimen, um Freude und Blumen zu den Senioren zu bringen.',
      icon: <Flower className="text-brand-orange" size={24} />,
      color: 'bg-orange-50',
    },
    {
      title: 'Soziale Vernetzung',
      description: 'Internationale Spieleabende, um lokale Jugendliche und Studenten zu verbinden.',
      icon: <Gamepad2 className="text-brand-teal" size={24} />,
      color: 'bg-teal-50',
    },
    {
      title: 'Frauen-Empowerment',
      description: 'Feier des Weltfrauentags und Muttertags mit speziellen lokalen Veranstaltungen.',
      icon: <Stars className="text-brand-navy" size={24} />,
      color: 'bg-slate-100',
    },
  ];

  return (
    <section id="about" className="bg-white py-24 overflow-hidden">
      <div className="section-padding">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-square md:aspect-[4/3]">
              <img
                src="https://picsum.photos/seed/about/1200/900"
                alt="BVM Giessen Team"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-teal/10 mix-blend-multiply" />
            </div>
            
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl z-20 hidden md:block border border-slate-100">
              <div className="text-4xl font-extrabold text-brand-teal mb-1">2019</div>
              <div className="text-slate-500 font-bold uppercase text-xs tracking-widest">Seit Gründung aktiv</div>
            </div>
            
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-orange/10 rounded-full -z-10 blur-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-8">
              Über <span className="text-brand-teal whitespace-nowrap">BVM e.V.</span>
            </h2>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Wir sind ein gemeinnütziger Verein, der sich der Förderung von Bildung, Integration und interkulturellem Dialog in der Region Mittelhessen verschrieben hat.
            </p>

            <div className="space-y-8">
              <div id="vision" className="flex gap-6 scroll-mt-24">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Target className="text-brand-teal" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">Unsere Vision</h3>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                    Eine inklusive Gesellschaft in Mittelhessen, in der kulturelle Vielfalt als Gewinn betrachtet wird.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Eye className="text-brand-orange" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">Unsere Mission</h3>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                    Brücken zwischen Menschen unterschiedlicher Herkunft bauen und Vorurteile durch Begegnung abbauen.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Community Activities */}
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Gemeinschaft erleben</h2>
              <p className="text-slate-400 max-w-xl mx-auto">Das soziale Gefüge unseres Vereins wird durch vielfältige Aktivitäten gestärkt.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${activity.color}`}>
                    {activity.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-brand-teal transition-colors">{activity.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{activity.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

