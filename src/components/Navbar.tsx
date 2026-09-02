import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Über uns', href: isHome ? '#about' : '/#about' },
    { name: 'Events', href: '/events' },
    { name: 'Blog', href: '/blog' },
    { name: 'Kontakt', href: isHome ? '#contact' : '/#contact' },
    { name: 'Spenden', href: '/spenden' },
  ];

  const platforms = [
    { name: 'Jugend', href: '/jugend' },
    { name: 'Dialog', href: '/dialog' },
    { name: 'Integration', href: '/integration' },
  ];

  const newsletterHref = isHome ? '#newsletter' : '/#newsletter';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Logo className="scale-90 origin-left" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="relative group">
            <button 
              className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-brand-teal transition-colors"
              onMouseEnter={() => setShowPlatforms(true)}
              onMouseLeave={() => setShowPlatforms(false)}
            >
              Plattformen <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {showPlatforms && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onMouseEnter={() => setShowPlatforms(true)}
                  onMouseLeave={() => setShowPlatforms(false)}
                  className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-2xl border border-slate-100 py-4 mt-2"
                >
                  {platforms.map((p) => (
                    <Link
                      key={p.name}
                      to={p.href}
                      className="block px-6 py-2 text-sm text-slate-600 hover:text-brand-teal hover:bg-slate-50 transition-colors"
                    >
                      {p.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.map((link) => (
            link.href.startsWith('#') ? (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-brand-teal transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-brand-teal transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
          {newsletterHref.startsWith('#') ? (
            <a
              href={newsletterHref}
              aria-label="Newsletter abonnieren – zur aktuellen Ausgabe"
              className="newsletter-cta"
            >
              <Mail size={16} aria-hidden="true" />
              Newsletter
            </a>
          ) : (
            <Link
              to={newsletterHref}
              aria-label="Newsletter abonnieren – zur aktuellen Ausgabe"
              className="newsletter-cta"
            >
              <Mail size={16} aria-hidden="true" />
              Newsletter
            </Link>
          )}
          <Link
            to="/mitmachen"
            data-testid="mitmachen-cta-desktop"
            className="btn-primary py-2 px-5 text-sm"
          >
            Mitmachen
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-900"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menü öffnen oder schließen"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plattformen</p>
                {platforms.map((p) => (
                  <Link
                    key={p.name}
                    to={p.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-lg font-semibold text-slate-900 hover:text-brand-teal"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
              <div className="h-px bg-slate-100" />
              {navLinks.map((link) => (
                link.href.startsWith('#') ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-semibold text-slate-900 hover:text-brand-teal"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-semibold text-slate-900 hover:text-brand-teal"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              {newsletterHref.startsWith('#') ? (
                <a
                  href={newsletterHref}
                  onClick={() => setIsOpen(false)}
                  aria-label="Newsletter abonnieren – zur aktuellen Ausgabe"
                  className="newsletter-cta w-full justify-center"
                >
                  <Mail size={18} aria-hidden="true" />
                  Newsletter abonnieren
                </a>
              ) : (
                <Link
                  to={newsletterHref}
                  onClick={() => setIsOpen(false)}
                  aria-label="Newsletter abonnieren – zur aktuellen Ausgabe"
                  className="newsletter-cta w-full justify-center"
                >
                  <Mail size={18} aria-hidden="true" />
                  Newsletter abonnieren
                </Link>
              )}
              <Link
                to="/mitmachen"
                onClick={() => setIsOpen(false)}
                data-testid="mitmachen-cta-mobile"
                className="btn-primary w-full text-center"
              >
                Mitmachen
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
