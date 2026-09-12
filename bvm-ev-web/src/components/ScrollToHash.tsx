import { useEffect } from 'react';
import { useLocation } from 'react-router';

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Disable browser's automatic scroll restoration to prevent landing at old scroll offsets
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

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
      // Instantly scroll to top on standard page navigation
      window.scrollTo(0, 0);

      // Staggered scrolls to top to override any delayed layout shifts or image loading
      const scrollAttempts = [50, 150, 300, 500];
      const timers = scrollAttempts.map((delay) => {
        return setTimeout(() => {
          window.scrollTo(0, 0);
        }, delay);
      });

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [pathname, hash]);

  return null;
}
