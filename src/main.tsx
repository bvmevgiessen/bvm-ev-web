import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against third-party cross-origin "Script error." and benign widget challenges
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // If message is opaque cross-origin Script error from external script/iframe
    if (event.message === 'Script error.' || !event.filename) {
      console.warn('[BVM App] Handled cross-origin script error.');
      event.preventDefault?.();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason === 'string' && event.reason.includes('Turnstile')) {
      console.warn('[BVM App] Handled Turnstile rejection:', event.reason);
      event.preventDefault?.();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);