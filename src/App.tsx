/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Impact from './components/Impact';
import Events from './components/Events';
import About from './components/About';
import Partners from './components/Partners';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-teal/30 selection:text-brand-navy">
      <Navbar />
      <main>
        <Hero />
        <Impact />
        <About />
        <Events />
        <Partners />
      </main>
      <Footer />
    </div>
  );
}

