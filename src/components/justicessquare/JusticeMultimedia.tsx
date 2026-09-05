import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Video, 
  Play, 
  Headphones, 
  Film, 
  Mic, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  Calendar,
  Layers
} from 'lucide-react';
import { justiceMultimediaData, MultimediaItem } from '../../data/justiceSquareData';

export default function JusticeMultimedia() {
  const [selectedType, setSelectedType] = useState<'all' | 'documentary' | 'interview' | 'explainer' | 'audio'>('all');

  const filteredMedia = selectedType === 'all' 
    ? justiceMultimediaData 
    : justiceMultimediaData.filter((m) => m.type === selectedType);

  return (
    <section id="multimedia" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Video size={14} />
              <span>Multimedia-Dokumentation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              Recherchen, Expertenanalysen & Stimmen
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl text-base">
              Ausgewählte investigative Dokumentationen, juristische Expertenrunden, animierte Erklärformate 
              und Audio-Beiträge zur vertieften Auseinandersetzung.
            </p>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'all' 
                  ? 'bg-brand-navy text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Alle Formate
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('documentary')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedType === 'documentary' 
                  ? 'bg-brand-navy text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Film size={13} />
              <span>Dokumentationen</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('interview')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedType === 'interview' 
                  ? 'bg-brand-navy text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Mic size={13} />
              <span>Interviews</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('explainer')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedType === 'explainer' 
                  ? 'bg-brand-navy text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles size={13} />
              <span>Erklärvideos</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('audio')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedType === 'audio' 
                  ? 'bg-brand-navy text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Headphones size={13} />
              <span>Podcasts / Audio</span>
            </button>
          </div>
        </div>

        {/* Multimedia Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50/70 rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail with overlay & badge */}
                <div className="relative aspect-video bg-slate-800 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/75 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-xs">
                    <Clock size={11} />
                    <span>{item.duration}</span>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 text-brand-navy text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                    {item.type === 'documentary' ? 'Dokumentation' : item.type === 'interview' ? 'Experten-Talk' : item.type === 'explainer' ? 'Erklärvideo' : 'Audio-Podcast'}
                  </div>

                  {/* Play Icon Graphic */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-brand-navy flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-teal group-hover:text-white transition-all">
                      {item.type === 'audio' ? <Headphones size={20} /> : <Play size={20} className="translate-x-0.5" />}
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-700">{item.creator}</span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-brand-navy mb-3 group-hover:text-brand-teal transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 pt-0">
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-brand-navy hover:text-white text-brand-navy border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>{item.type === 'audio' ? 'Podcast anhören' : 'Beitrag ansehen'}</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}