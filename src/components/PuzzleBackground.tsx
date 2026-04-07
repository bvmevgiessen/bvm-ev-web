import React from 'react';

interface PuzzleBackgroundProps {
  className?: string;
  color?: string;
}

export default function PuzzleBackground({ className = '', color = 'currentColor' }: PuzzleBackgroundProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none opacity-5 overflow-hidden ${className}`}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="puzzle-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path 
              d="M30,30 h40 v40 h-40 z M50,20 a10,10 0 1,1 0,20 a10,10 0 1,1 0,-20 M80,50 a10,10 0 1,1 -20,0 a10,10 0 1,1 20,0" 
              fill={color}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#puzzle-pattern)" />
      </svg>
    </div>
  );
}
