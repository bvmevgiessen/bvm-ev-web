import React, { useRef, useState } from 'react';

/**
 * Interaktive 3D-Tilt-Karte (abhängigkeitsfrei).
 * Neigt sich zur Maus (perspective + rotateX/Y), mit sanftem Glanz-Overlay.
 * Respektiert prefers-reduced-motion.
 */
export default function Card3D({
  children,
  className = '',
  intensity = 10,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  [key: string]: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glare, setGlare] = useState<React.CSSProperties>({ opacity: 0 });

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * intensity;
    const ry = (px - 0.5) * intensity;
    setStyle({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`,
      transition: 'transform 80ms ease-out',
    });
    setGlare({
      opacity: 0.35,
      background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.55), transparent 55%)`,
    });
  };

  const reset = () => {
    setStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 400ms ease',
    });
    setGlare({ opacity: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`group relative [transform-style:preserve-3d] ${className}`}
      style={style}
      {...rest}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={glare}
      />
    </div>
  );
}
