import { motion } from 'motion/react';

export default function Partners() {
  const partners = [
    { name: 'Stiftung Dialog und Bildung', location: 'Berlin' },
    { name: 'Forum für Interkulturellen Dialog', location: 'Frankfurt' },
    { name: 'Time to Help e.V.', location: 'Offenbach' },
    { name: 'LDK e.V.', location: 'Dillenburg' },
  ];

  return (
    <section className="bg-slate-50 py-24 border-t border-slate-200">
      <div className="section-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">Gemeinsam Stark</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Unser Netzwerk aus starken Partnern unterstützt uns bei unserer Mission in Mittelhessen.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group"
            >
              <div className="w-16 h-16 bg-brand-teal/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-teal/10 transition-colors">
                <span className="text-2xl font-black text-brand-teal opacity-40 group-hover:opacity-100 transition-opacity">
                  {partner.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-bold text-brand-navy mb-1 leading-tight">{partner.name}</h3>
              <p className="text-xs font-bold text-brand-orange uppercase tracking-widest">{partner.location}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
