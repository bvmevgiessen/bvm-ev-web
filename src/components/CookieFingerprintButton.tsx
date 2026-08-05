import React, { useState } from 'react';
import { Fingerprint } from 'lucide-react';
import CookieSettingsModal from './CookieSettingsModal';

interface CookieFingerprintButtonProps {
  onOpenPrivacyPolicy?: () => void;
}

export default function CookieFingerprintButton({ onOpenPrivacyPolicy }: CookieFingerprintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Fingerprint Cookie Trigger Button in Bottom Left Corner */}
      <div className="fixed bottom-5 left-5 z-40 group">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2.5 bg-brand-navy/90 hover:bg-brand-navy text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Cookie-Einstellungen verwalten"
          title="Cookie-Einstellungen (BVM e.V.)"
        >
          {/* Fingerprint Icon with subtle teal pulse */}
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-25 animate-ping group-hover:opacity-40" />
            <Fingerprint className="text-brand-teal relative z-10" size={22} />
          </div>

          <span className="hidden sm:inline-block text-xs font-extrabold text-slate-100 tracking-wide pr-1">
            Cookie-Einstellungen
          </span>

          {/* Badge Tooltip for mobile / small screen hover */}
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center px-3 py-1.5 bg-brand-navy text-white text-[11px] font-bold rounded-xl whitespace-nowrap shadow-lg border border-white/10 pointer-events-none sm:hidden">
            Cookie-Einstellungen
          </div>
        </button>
      </div>

      {/* Cookie Settings Dialog */}
      <CookieSettingsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onOpenPrivacyPolicy={onOpenPrivacyPolicy}
      />
    </>
  );
}
