import React from 'react';
import { 
  Globe, 
  BookOpen, 
  Heart, 
  Compass, 
  Home, 
  TrendingUp, 
  Flower2, 
  HelpCircle, 
  Users, 
  Award, 
  Sparkles, 
  Network
} from 'lucide-react';

interface PartnerLogoProps {
  name: string;
  fallback: string;
  logoUrl?: string;
  className?: string;
}

export default function PartnerLogo({ name, fallback, logoUrl, className = '' }: PartnerLogoProps) {
  const [hasError, setHasError] = React.useState(false);

  // If we have a logoUrl and it hasn't errored out, try to render the real image logo
  if (logoUrl && !hasError) {
    return (
      <div className={`flex items-center justify-center w-full h-16 p-2 bg-white rounded-2xl ${className}`}>
        <img 
          src={logoUrl} 
          alt={name} 
          className="max-h-full max-w-full object-contain filter hover:brightness-105 transition-all duration-300"
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Normalize key to match specific brands
  const key = fallback.toUpperCase();

  // Custom vector layouts with beautiful, authentic colors & shapes
  switch (key) {
    case 'SDB': // Stiftung Dialog und Bildung
      return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-200">
            <BookOpen size={24} className="animate-pulse" />
          </div>
          <div className="text-left font-sans">
            <div className="text-sm font-black text-slate-800 tracking-tight leading-none">STIFTUNG</div>
            <div className="text-xs font-bold text-brand-orange leading-tight">Dialog & Bildung</div>
          </div>
        </div>
      );

    case 'FID': // Forum für Interkulturellen Dialog
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-teal to-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-100">
            <Globe size={24} />
          </div>
          <div className="text-left">
            <div className="text-base font-black text-brand-navy tracking-tighter leading-none">FID</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Forum Dialog</div>
          </div>
        </div>
      );

    case 'TTH': // Time to Help e.V.
      return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-100">
            <Heart size={24} fill="white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-red-600 uppercase tracking-wide leading-none">TIME TO</div>
            <div className="text-xs font-bold text-slate-700 leading-tight">Help e.V.</div>
          </div>
        </div>
      );

    case 'HOO': // Stiftung House of One
      return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-700 to-yellow-600 flex items-center justify-center text-white shadow-md shadow-amber-100">
            <Compass size={24} />
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-slate-800 tracking-tight leading-none">HOUSE OF</div>
            <div className="text-xs font-bold text-amber-600 leading-tight">One Foundation</div>
          </div>
        </div>
      );

    case 'LDK': // LDK e.V.
      return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-brand-teal flex items-center justify-center text-white shadow-md shadow-sky-100">
            <Network size={24} />
          </div>
          <div className="text-left">
            <div className="text-sm font-extrabold text-brand-navy tracking-tight leading-none">LDK e.V.</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Integration</div>
          </div>
        </div>
      );

    case 'LBE': // LBE-BW e.V.
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Award size={20} />
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-slate-800 leading-none">LBE-BW</div>
            <div className="text-[9px] font-semibold text-slate-400">Ehrenamt</div>
          </div>
        </div>
      );

    case 'DS': // Dialogue Society
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center text-white shadow-sm">
            <Users size={20} />
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-slate-800 leading-none">DIALOGUE</div>
            <div className="text-[9px] font-bold text-pink-600 uppercase tracking-wider">Society</div>
          </div>
        </div>
      );

    case 'AFSV': // Alliance for Shared Values
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-sm">
            <Globe size={20} />
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-slate-800 leading-none">AFSVs</div>
            <div className="text-[9px] font-semibold text-slate-400">Alliance</div>
          </div>
        </div>
      );

    case 'MAXIMUM': // Maximum e.V.
      return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-md shadow-red-100">
            <TrendingUp size={24} />
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-red-600 tracking-tight leading-none">MAXIMUM</div>
            <div className="text-xs font-bold text-slate-700 leading-tight">Bildung e.V.</div>
          </div>
        </div>
      );

    case 'AVICENNA': // Avicenna e.V.
      return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-brand-teal flex items-center justify-center text-white shadow-md shadow-emerald-100">
            <Sparkles size={24} />
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-emerald-600 tracking-tight leading-none">AVICENNA</div>
            <div className="text-xs font-bold text-slate-700 leading-tight">Akademie e.V.</div>
          </div>
        </div>
      );

    case 'MOSAIK': // Mosaik e.V.
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-orange-500 to-indigo-500 flex items-center justify-center text-white shadow-sm">
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
              <div className="bg-white/40 rounded-sm" />
              <div className="bg-white/80 rounded-sm" />
              <div className="bg-white/90 rounded-sm" />
              <div className="bg-white/60 rounded-sm" />
            </div>
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-slate-800 leading-none">MOSAIK</div>
            <div className="text-[9px] font-semibold text-slate-400">Kulturverein</div>
          </div>
        </div>
      );

    case 'FORUM': // Forum Dialog e.V.
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-sm">
            <Globe size={20} />
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-slate-800 leading-none">FORUM</div>
            <div className="text-[9px] font-semibold text-slate-400">Dialog e.V.</div>
          </div>
        </div>
      );

    case 'RUMIK': // Rumi Kulturzentrum e.V. (Kassel)
      return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md shadow-amber-100">
            <Flower2 size={24} className="rotate-45" />
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-amber-700 tracking-tight leading-none">RUMI KULTUR</div>
            <div className="text-xs font-bold text-slate-700 leading-tight">Zentrum Kassel</div>
          </div>
        </div>
      );

    case 'RUMIORG': // Rumi Kultur e.V. (Frankfurt)
      return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-red-500/10">
            <Flower2 size={24} />
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-amber-600 tracking-tight leading-none">RUMI KULTUR</div>
            <div className="text-xs font-bold text-slate-700 leading-tight">Frankfurt e.V.</div>
          </div>
        </div>
      );

    case 'RUMIDE': // Rumi Kultur e.V. (Bad Nauheim)
      return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-100">
            <Flower2 size={24} className="rotate-12" />
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-amber-700 tracking-tight leading-none">RUMI KULTUR</div>
            <div className="text-xs font-bold text-slate-700 leading-tight">Bad Nauheim</div>
          </div>
        </div>
      );

    default:
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
            <HelpCircle size={20} />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-slate-800 leading-none">{name}</div>
            <div className="text-[9px] font-semibold text-slate-400">Partner</div>
          </div>
        </div>
      );
  }
}
