import React from 'react';
import { motion } from 'motion/react';
import { Users, Heart, Handshake } from 'lucide-react';
import PartnerLogo from './PartnerLogo';

export default function CommunityPulse() {
  const partners = [
    { 
      name: 'Forum für Interkulturellen Dialog e.V.', 
      fallback: 'FID',
      logo: 'https://wsrv.nl/?url=https://static.wixstatic.com/media/2d6f92_4fbacb17f90f4b1e9d9267509d322be9~mv2.png/v1/fill/w_406,h_144,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Fid%20Logo.png&w=400&fit=contain'
    },
    { 
      name: 'LDK e.V.', 
      fallback: 'LDK',
      logo: 'https://wsrv.nl/?url=https://ldk-ev.de/wp-content/uploads/2024/05/cropped-HomeLogo-1536x231aa.png&w=400&fit=contain'
    },
    { 
      name: 'Time to Help e.V.', 
      fallback: 'TTH',
      logo: 'https://wsrv.nl/?url=https://timetohelp.eu/wp-content/uploads/2020/06/tth-logo-1a.png&w=400&fit=contain'
    },
    { 
      name: 'Stiftung Dialog und Bildung', 
      fallback: 'SDB',
      logo: 'https://wsrv.nl/?url=https://sdub.de/wp-content/uploads/2022/09/sdub-logo.svg&w=400&fit=contain'
    },
    { 
      name: 'Stiftung House of One', 
      fallback: 'HOO',
      logo: 'https://wsrv.nl/?url=https://house-of-one.org/favicon.ico&w=200&output=png'
    },
    { 
      name: 'Avicenna e.V.', 
      fallback: 'AVICENNA',
      logo: 'https://wsrv.nl/?url=https://www.avicenna-ev.de/favicon.ico&w=200&output=png'
    },
    { 
      name: 'Maximum e.V.', 
      fallback: 'MAXIMUM',
      logo: 'https://wsrv.nl/?url=https://www.maximum-ev.de/-_-/res/2364335b-4369-42e2-bf92-35c3a702aac2/images/files/2364335b-4369-42e2-bf92-35c3a702aac2/61353cfe-a284-4159-a6b4-88504d8be30d/160-43/880805c8f2cba4885ec84ed9eb8bd2b08a91adf2&w=400&fit=contain'
    },
    { 
      name: 'Rumi Kultur e.V. (Frankfurt)', 
      fallback: 'RUMIORG',
      logo: 'https://wsrv.nl/?url=https://rumikultur.org/wp-content/uploads/2023/06/RUMI-Logo-320-300x171-fotor-bg-remover-2023061614919.png&w=200&output=png'
    },
    { 
      name: 'Rumi Kulturzentrum e.V. (Kassel)', 
      fallback: 'RUMIK',
      logo: 'https://wsrv.nl/?url=https://rumi-kulturzentrum.de/wp-content/uploads/2023/12/Rumi-Logo-G.png&w=200&output=png'
    },
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
              <PartnerLogo name={partner.name} fallback={partner.fallback} logoUrl={partner.logo} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
