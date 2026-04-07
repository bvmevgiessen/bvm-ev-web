import { motion } from 'motion/react';

export default function Partners() {
  const partners = [
    { 
      name: 'Stiftung Dialog und Bildung', 
      location: 'Berlin',
      logo: 'https://images.weserv.nl/?url=https://www.sdub.de/wp-content/uploads/2021/05/sdub-logo.png&w=400',
      url: 'https://www.sdub.de/',
      fallback: 'SDB'
    },
    { 
      name: 'Forum für Interkulturellen Dialog', 
      location: 'Frankfurt',
      logo: 'https://images.weserv.nl/?url=https://fidev.org/wp-content/uploads/2020/06/fid-logo.png&w=400',
      url: 'https://fidev.org/',
      fallback: 'FID'
    },
    { 
      name: 'Time to Help e.V.', 
      location: 'Offenbach',
      logo: 'https://images.weserv.nl/?url=https://www.timetohelp.eu/wp-content/uploads/2021/03/TTH-Logo-2021.png&w=400',
      url: 'https://www.timetohelp.eu/',
      fallback: 'TTH'
    },
    { 
      name: 'LDK e.V.', 
      location: 'Dillenburg',
      logo: 'https://images.weserv.nl/?url=https://ldk-ev.de/wp-content/uploads/2021/05/ldk-logo.png&w=400',
      url: 'https://ldk-ev.de/',
      fallback: 'LDK'
    },
  ];

  return (
    <section className="bg-white py-24 border-t border-slate-100">
      <div className="section-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">Gemeinsam Stark</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Unser Netzwerk aus starken Partnern unterstützt uns bei unserer Mission in Mittelhessen.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {partners.map((partner, index) => (
            <motion.a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-slate-50/50 p-10 rounded-[2rem] border border-slate-100 hover:border-brand-teal/20 hover:bg-white hover:shadow-xl transition-all duration-500 text-center block"
            >
              <div className="h-20 flex items-center justify-center mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="hidden text-3xl font-black text-brand-teal/20 group-hover:text-brand-teal/40 transition-colors">
                  {partner.fallback}
                </div>
              </div>
              <h3 className="font-bold text-brand-navy mb-1 leading-tight text-sm md:text-base">{partner.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{partner.location}</p>
              
              {/* External Link Icon */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-brand-teal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
