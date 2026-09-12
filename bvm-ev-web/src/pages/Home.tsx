  import React from 'react';
  import Navbar from '../components/Navbar';
  import Hero from '../components/Hero';
  import NewsTicker from '../components/NewsTicker';
  import Impact from '../components/Impact';
  import About from '../components/About';
  import CommunityPulse from '../components/CommunityPulse';
  import Events from '../components/Events';
  import Blog from '../components/Blog';
  import Partners from '../components/Partners';
  import PuzzleBackground from '../components/PuzzleBackground';
  import Newsletter from '../components/Newsletter';

  export default function Home() {
    return (
      <div className="min-h-screen bg-slate-50 selection:bg-brand-teal/30 selection:text-brand-navy relative">
        <PuzzleBackground color="#0D9488" />
        <Navbar />
        <main className="relative z-10 pt-[72px]">
          <NewsTicker />
          <Hero />
          <Impact />
          <About />
          <CommunityPulse />
          <Events />
          <Newsletter />
          <Blog />
          <Partners />
        </main>
      </div>
    );
  }
