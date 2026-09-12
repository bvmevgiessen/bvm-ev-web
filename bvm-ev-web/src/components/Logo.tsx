import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  light?: boolean;
}

export default function Logo({ className = "", showText = true, light = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative w-12 h-12 ${light ? 'bg-white' : 'bg-[#2b4b8c]'} flex items-end p-1.5 overflow-hidden shrink-0 shadow-sm`}>
        {/* Diagonal bars in top right */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          <div className={`absolute top-1 right-2 w-10 h-1.5 ${light ? 'bg-[#2b4b8c]' : 'bg-white'} rotate-45 transform origin-center translate-x-1/2 -translate-y-1/2`} />
          <div className={`absolute top-4 right-2 w-10 h-1.5 ${light ? 'bg-[#2b4b8c]' : 'bg-white'} rotate-45 transform origin-center translate-x-1/2 -translate-y-1/2`} />
        </div>
        <span className={`font-bold text-sm leading-none z-10 ${light ? 'text-[#2b4b8c]' : 'text-white'}`}>BVM</span>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-[1.1]">
          <span className={`font-bold text-lg whitespace-nowrap ${light ? 'text-white' : 'text-[#2b4b8c]'}`}>
            Bildung und Verständigung
          </span>
          <span className={`font-medium text-base whitespace-nowrap ${light ? 'text-white/90' : 'text-[#a12b32]'}`}>
            Mittelhessen e.V.
          </span>
        </div>
      )}
    </div>
  );
}
