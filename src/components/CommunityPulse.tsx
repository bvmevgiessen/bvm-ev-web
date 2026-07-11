import React from 'react';
import { motion } from 'motion/react';
import { Users, Heart, Handshake } from 'lucide-react';
import PartnerLogo from './PartnerLogo';

export default function CommunityPulse() {
  const partners = [
    { name: 'Forum für Interkulturellen Dialog e.V.', fallback: 'FID' },
    { name: 'LDK e.V.', fallback: 'LDK' },
    { name: 'Time to Help e.V.', fallback: 'TTH' },
    { name: 'Stiftung Dialog und Bildung', fallback: 'SDB' },
    { name: 'Stiftung House of One', fallback: 'HOO' },
    { name: 'Avicenna e.V.', fallback: 'AVICENNA' },
    { name: 'Maximum e.V.', fallback: 'MAXIMUM' },
    { name: 'Rumi Kultur e.V. (Frankfurt)', fallback: 'RUMIORG' },
    { name: 'Rumi Kulturzentrum e.V. (Kassel)', fallback: 'RUMIK' },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-sm mb-6"
          >
            <Heart size={16} fill="currentColor" /> Community Pulse
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6">
            Unser <span className="text-brand-teal">Netzwerk</span> der Stärke
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Gemeinsam mit über 100 Familien und unseren Partnern bauen wir Brücken für eine bessere Zukunft.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
              <Users className="text-brand-teal" size={32} />
            </div>
            <div className="text-4xl font-black text-brand-navy mb-2">100+</div>
            <div className="text-slate-500 font-medium">Engagierte Familien</div>
          </div>
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
              <Handshake className="text-brand-orange" size={32} />
            </div>
            <div className="text-4xl font-black text-brand-navy mb-2">15+</div>
            <div className="text-slate-500 font-medium">Partner-Organisationen</div>
          </div>
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
              <Heart className="text-brand-teal" size={32} />
            </div>
            <div className="text-4xl font-black text-brand-navy mb-2">500+</div>
            <div className="text-slate-500 font-medium">Unterstützte Personen</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {partners.map((partner) => (
            <motion.div 
              key={partner.name}
              whileHover={{ scale: 1.03, y: -2 }}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-teal/20 hover:bg-white hover:shadow-xl transition-all duration-300 min-w-[200px]"
            >
              <PartnerLogo name={partner.name} fallback={partner.fallback} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
