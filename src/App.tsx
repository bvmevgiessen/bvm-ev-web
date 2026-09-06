/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Home from './pages/Home';
import Jugend from './pages/Jugend';
import Dialog from './pages/Dialog';
import Integration from './pages/Integration';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import MitmachenPage from './pages/MitmachenPage';
import SpendenPage from './pages/SpendenPage';
import KarrierePage from './pages/KarrierePage';
import TaetigkeitsberichtPage from './pages/TaetigkeitsberichtPage';
import JusticeSquarePage from './pages/JusticeSquarePage';
import AboBestaetigtPage from './pages/AboBestaetigtPage';
import LegalPage from './pages/LegalPage';
import Footer from './components/Footer';
import ScrollToHash from './components/ScrollToHash';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToHash />
      <div className="min-h-screen bg-slate-50 selection:bg-brand-teal/30 selection:text-brand-navy">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jugend" element={<Jugend />} />
          <Route path="/dialog" element={<Dialog />} />
          <Route path="/integration" element={<Integration />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:blogId" element={<BlogDetailPage />} />
          <Route path="/mitmachen" element={<MitmachenPage />} />
          <Route path="/spenden" element={<SpendenPage />} />
          <Route path="/karriere" element={<KarrierePage />} />
          <Route path="/taetigkeitsbericht" element={<TaetigkeitsberichtPage />} />
          <Route path="/justicesquare" element={<JusticeSquarePage />} />
          <Route path="/abo-bestaetigt" element={<AboBestaetigtPage />} />
          <Route path="/newsletter/confirm" element={<AboBestaetigtPage />} />
          <Route path="/confirm" element={<AboBestaetigtPage />} />
          <Route path="/api/newsletter/confirm" element={<AboBestaetigtPage />} />
          <Route path="/api/newsletter/unsubscribe" element={<AboBestaetigtPage />} />
          <Route path="/unsubscribe" element={<AboBestaetigtPage />} />
          <Route path="/impressum" element={<LegalPage defaultType="impressum" />} />
          <Route path="/datenschutz" element={<LegalPage defaultType="privacy" />} />
          <Route path="/privacy" element={<LegalPage defaultType="privacy" />} />
          <Route path="/satzung" element={<LegalPage defaultType="satzung" />} />
          <Route path="/spendenbescheinigung" element={<LegalPage defaultType="donation" />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}