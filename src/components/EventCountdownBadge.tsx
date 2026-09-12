import React from 'react';
import { Timer, Clock, CheckCircle2 } from 'lucide-react';
import { getEventCountdown } from '../data/aktuelles';

interface EventCountdownBadgeProps {
  date: string;
  className?: string;
  variant?: 'compact' | 'prominent';
}

export default function EventCountdownBadge({
  date,
  className = '',
  variant = 'compact',
}: EventCountdownBadgeProps) {
  const countdown = getEventCountdown(date);
  if (!countdown) return null;

  if (countdown.status === 'today') {
    return (
      <span
        data-testid="countdown-badge-today"
        className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 font-mono text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/20 animate-pulse ${className}`}
      >
        <Timer size={13} className="shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
        Heute!
      </span>
    );
  }

  if (countdown.status === 'tomorrow') {
    return (
      <span
        data-testid="countdown-badge-tomorrow"
        className={`inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 font-mono text-[11px] font-black uppercase tracking-wider text-white shadow-md shadow-orange-500/20 ${className}`}
      >
        <Clock size={12} className="shrink-0" />
        Morgen!
      </span>
    );
  }

  if (countdown.status === 'upcoming') {
    const isSoon = countdown.days <= 7;
    return (
      <span
        data-testid="countdown-badge-upcoming"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-black uppercase tracking-wider text-white shadow-md ${
          isSoon
            ? 'bg-brand-orange shadow-orange-500/20'
            : 'bg-brand-teal shadow-teal-700/20'
        } ${className}`}
      >
        <Clock size={12} className="shrink-0" />
        {countdown.label}
      </span>
    );
  }

  // Event in the past
  return (
    <span
      data-testid="countdown-badge-past"
      className={`inline-flex items-center gap-1.5 rounded-full bg-slate-700/90 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-slate-200 backdrop-blur ${className}`}
    >
      <CheckCircle2 size={11} className="shrink-0 text-slate-300" />
      Rückblick
    </span>
  );
}