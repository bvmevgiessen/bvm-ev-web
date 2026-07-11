import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);

      if (element) {
        // Scroll immediately to start the animation
        element.scrollIntoView({ behavior: 'smooth' });

        // Staggered scroll checks to handle any layout shifts (lazy images, state changes, React animations)
        const scrollAttempts = [100, 300, 600, 1000];
        const timers = scrollAttempts.map((delay) => {
          return setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, delay);
        });

        return () => {
          timers.forEach((timer) => clearTimeout(timer));
        };
      }
    } else {
      // Smoothly scroll to top on standard page navigation
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}
