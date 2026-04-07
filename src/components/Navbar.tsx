import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
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
    { name: 'Startseite', href: isHome ? '#home' : import.meta.env.BASE_URL },
    { name: 'Über uns', href: isHome ? '#about' : `${import.meta.env.BASE_URL}#about` },
    { name: 'Impact', href: isHome ? '#impact' : `${import.meta.env.BASE_URL}#impact` },
    { name: 'Events', href: '/events' },
    { name: 'Kontakt', href: isHome ? '#contact' : `${import.meta.env.BASE_URL}#contact` },
  ];

  const platforms = [
    { name: 'Jugend', href: '/jugend' },
    { name: 'Dialog', href: '/dialog' },
    { name: 'Integration', href: '/integration' },
  ];

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
          <button className="btn-primary py-2 px-5 text-sm">
            Mitmachen
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-900"
          onClick={() => setIsOpen(!isOpen)}
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
              <button className="btn-primary w-full">
                Mitmachen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
