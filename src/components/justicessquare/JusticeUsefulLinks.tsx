import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  ExternalLink, 
  BookmarkCheck, 
  Compass, 
  Building, 
  Scale, 
  FileText 
} from 'lucide-react';
import { usefulLinksData } from '../../data/justiceSquareData';

export default function JusticeUsefulLinks() {
  return (
    <section id="links" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Globe size={14} />
            <span>Internationale Portale & Datenbanken</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Nützliche Links & Primärquellen
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            Direkter Zugang zu den offiziellen Portalen der maßgeblichen Menschenrechtsorganisationen, 
            internationalen Gerichtshöfe und unabhängigen Recherchemedien zur vertiefenden Recherche.
          </p>
        </div>

        {/* 10 Requested Links as Clickable Cards/Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {usefulLinksData.map((link, idx) => (
            <motion.a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-brand-teal/50 transition-all flex flex-col justify-between group cursor-pointer text-left"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-brand-teal/10 group-hover:text-brand-teal transition-colors">
                    {link.category}
                  </span>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-brand-teal transition-colors" />
                </div>

                <h3 className="text-sm font-bold text-brand-navy group-hover:text-brand-teal transition-colors leading-snug mb-2">
                  {link.name}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {link.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-brand-teal transition-colors">
                <span>{link.focusArea}</span>
                <span>Öffnen →</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}