import React from 'react';
import { Globe, ExternalLink, Bookmark } from 'lucide-react';
import { usefulLinks } from '../../data/justiceSquare';

export default function JusticeUsefulLinks() {
  return (
    <section id="links" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
            <Globe size={15} />
            <span>Recherche & Weiterführende Quellen</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Nützliche Links & Archive
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Wichtige Anlaufstellen, Datenbanken des Europäischen Gerichtshofs (HUDOC), Exil-Medien und juristische Falldatenbanken.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {usefulLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:border-teal-400 hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    {link.description}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {link.name}
                </h4>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-teal-600 font-semibold">
                <span>Webseite öffnen</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
