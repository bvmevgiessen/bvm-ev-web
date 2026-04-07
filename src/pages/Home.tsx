import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Impact from '../components/Impact';
import About from '../components/About';
import Events from '../components/Events';
import Partners from '../components/Partners';
import CommunityPulse from '../components/CommunityPulse';
import PuzzleBackground from '../components/PuzzleBackground';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-teal/30 selection:text-brand-navy relative">
      <PuzzleBackground color="#0D9488" />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Impact />
        <About />
        <CommunityPulse />
        <Events />
        <Partners />
      </main>
    </div>
  );
}
