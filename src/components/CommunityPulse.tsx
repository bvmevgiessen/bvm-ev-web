import React from 'react';
import { motion } from 'motion/react';
import { Users, Heart, Handshake } from 'lucide-react';

export default function CommunityPulse() {
  const partners = [
    { name: 'FID', logo: 'https://picsum.photos/seed/fid/100/100' },
    { name: 'LDK', logo: 'https://picsum.photos/seed/ldk/100/100' },
    { name: 'Time to Help', logo: 'https://picsum.photos/seed/tth/100/100' },
    { name: 'Stiftung Dialog und Bildung', logo: 'https://picsum.photos/seed/sdb/100/100' },
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

        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner) => (
            <img 
              key={partner.name}
              src={partner.logo} 
              alt={partner.name} 
              className="h-12 md:h-16 object-contain"
              referrerPolicy="no-referrer"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
