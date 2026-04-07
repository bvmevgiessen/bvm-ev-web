/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Jugend from './pages/Jugend';
import Dialog from './pages/Dialog';
import Integration from './pages/Integration';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-slate-50 selection:bg-brand-teal/30 selection:text-brand-navy">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jugend" element={<Jugend />} />
          <Route path="/dialog" element={<Dialog />} />
          <Route path="/integration" element={<Integration />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

