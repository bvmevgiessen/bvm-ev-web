import React, { useState } from 'react';
import { ImageOff, Users2, GraduationCap, Globe, Calendar, Newspaper, Heart } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  referrerPolicy?: any;
  fallbackType?: 'team' | 'community' | 'youth' | 'avatar' | 'event' | 'blog' | 'default';
  fallbackIcon?: React.ReactNode;
}

export default function SafeImage({ 
  src, 
  alt, 
  className, 
  fallbackType = 'default',
  fallbackIcon,
  ...props 
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    const getFallbackStyles = () => {
      switch (fallbackType) {
        case 'team':
          return {
            bg: 'bg-gradient-to-br from-brand-teal/10 via-brand-navy/5 to-brand-orange/10',
            iconColor: 'text-brand-teal',
            Icon: Users2,
            subtitle: 'BVM Giessen Team'
          };
        case 'community':
          return {
            bg: 'bg-gradient-to-br from-brand-teal/10 via-slate-50 to-brand-teal/5',
            iconColor: 'text-brand-teal',
            Icon: Globe,
            subtitle: 'Gemeinschaft & Vielfalt'
          };
        case 'youth':
          return {
            bg: 'bg-gradient-to-br from-brand-orange/10 via-slate-50 to-brand-teal/5',
            iconColor: 'text-brand-orange',
            Icon: GraduationCap,
            subtitle: 'Jugend & Bildung'
          };
        case 'avatar':
          return {
            bg: 'bg-gradient-to-br from-brand-teal/20 to-brand-navy/30',
            iconColor: 'text-white',
            Icon: Heart,
            subtitle: ''
          };
        case 'event':
          return {
            bg: 'bg-gradient-to-br from-slate-100 to-brand-teal/10',
            iconColor: 'text-brand-teal',
            Icon: Calendar,
            subtitle: 'BVM Event'
          };
        case 'blog':
          return {
            bg: 'bg-gradient-to-br from-slate-100 to-brand-orange/10',
            iconColor: 'text-brand-orange',
            Icon: Newspaper,
            subtitle: 'Blog Beitrag'
          };
        default:
          return {
            bg: 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200',
            iconColor: 'text-slate-400',
            Icon: ImageOff,
            subtitle: alt || 'Bild'
          };
      }
    };

    const config = getFallbackStyles();
    const IconComponent = config.Icon;

    if (fallbackType === 'avatar') {
      return (
        <div className={`w-full h-full ${config.bg} flex items-center justify-center text-white font-extrabold text-sm select-none`}>
          {alt ? alt.substring(0, 2).toUpperCase() : 'BVM'}
        </div>
      );
    }

    return (
      <div className={`w-full h-full min-h-[200px] ${config.bg} flex flex-col items-center justify-center p-8 text-center border border-slate-100/50 rounded-[inherit] absolute inset-0`}>
        <div className={`p-4 bg-white rounded-2xl shadow-md mb-4 ${config.iconColor}`}>
          {fallbackIcon || <IconComponent size={32} />}
        </div>
        <p className="font-extrabold text-brand-navy text-lg mb-1 leading-snug">{alt || config.subtitle}</p>
        <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">BVM e.V. Gießen</p>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)}
      {...props}
    />
  );
}
