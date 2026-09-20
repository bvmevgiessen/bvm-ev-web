import React from 'react';
import { Globe } from 'lucide-react';
import { EventLanguage } from '../utils/eventLocalization';

interface EventLanguageToggleProps {
  currentLang: EventLanguage;
  onLanguageChange: (lang: EventLanguage) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
  theme?: 'light' | 'dark' | 'glass';
}

export default function EventLanguageToggle({
  currentLang,
  onLanguageChange,
  size = 'md',
  showLabel = false,
  label = 'Sprache / Dil',
  className = '',
  theme = 'light'
}: EventLanguageToggleProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  // Styles based on theme
  const containerClasses = {
    light: 'bg-slate-100 border border-slate-200/80 p-1 rounded-xl shadow-xs',
    dark: 'bg-brand-navy/90 border border-white/15 p-1 rounded-xl shadow-md',
    glass: 'bg-white/15 backdrop-blur-md border border-white/30 p-1 rounded-xl shadow-md'
  }[theme];

  const activeBtnClasses = {
    light: 'bg-brand-teal text-white shadow-xs font-bold ring-1 ring-brand-teal/20',
    dark: 'bg-brand-teal text-white shadow-xs font-bold',
    glass: 'bg-white text-brand-navy shadow-xs font-bold'
  }[theme];

  const inactiveBtnClasses = {
    light: 'text-slate-600 hover:text-brand-navy hover:bg-white/60 font-medium',
    dark: 'text-white/70 hover:text-white hover:bg-white/10 font-medium',
    glass: 'text-white/80 hover:text-white hover:bg-white/20 font-medium'
  }[theme];

  const paddingClasses = isSm 
    ? 'px-2.5 py-1 text-xs' 
    : isLg 
      ? 'px-4 py-2 text-sm' 
      : 'px-3 py-1.5 text-xs md:text-sm';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className={`inline-flex items-center gap-1.5 font-semibold text-xs tracking-wide ${
          theme === 'light' ? 'text-slate-500' : 'text-white/80'
        }`}>
          <Globe size={14} className={theme === 'light' ? 'text-brand-teal' : 'text-white/90'} />
          <span>{label}</span>
        </span>
      )}

      <div 
        role="group" 
        aria-label="Eventsprache auswählen / Etkinlik dilini seçin"
        className={`inline-flex items-center gap-1 ${containerClasses}`}
      >
        {/* German option */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLanguageChange('de');
          }}
          aria-pressed={currentLang === 'de'}
          aria-label="Inhalt auf Deutsch anzeigen"
          title="Inhalt auf Deutsch anzeigen"
          className={`inline-flex items-center gap-1.5 rounded-lg transition-all cursor-pointer select-none ${paddingClasses} ${
            currentLang === 'de' ? activeBtnClasses : inactiveBtnClasses
          }`}
        >
          <span className="text-sm leading-none" aria-hidden="true">🇩🇪</span>
          <span className="tracking-wide">
            {isSm ? 'DE' : 'Deutsch'}
          </span>
        </button>

        {/* Turkish option */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLanguageChange('tr');
          }}
          aria-pressed={currentLang === 'tr'}
          aria-label="İçeriği Türkçe görüntüle"
          title="İçeriği Türkçe görüntüle"
          className={`inline-flex items-center gap-1.5 rounded-lg transition-all cursor-pointer select-none ${paddingClasses} ${
            currentLang === 'tr' ? activeBtnClasses : inactiveBtnClasses
          }`}
        >
          <span className="text-sm leading-none" aria-hidden="true">🇹🇷</span>
          <span className="tracking-wide">
            {isSm ? 'TR' : 'Türkçe'}
          </span>
        </button>
      </div>
    </div>
  );
}
