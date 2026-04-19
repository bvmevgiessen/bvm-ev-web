/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Jugend from './pages/Jugend';
import Dialog from './pages/Dialog';
import Integration from './pages/Integration';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
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
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:blogId" element={<BlogDetailPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

