import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          action?: string;
          size?: 'invisible' | 'normal' | 'compact';
          theme?: 'auto' | 'light' | 'dark';
          callback?: (token: string) => void;
          'error-callback'?: (errorCode?: string) => void;
          'expired-callback'?: () => void;
          'timeout-callback'?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export interface TurnstileWidgetProps {
  id?: string;
  siteKey: string;
  action?: string;
  size?: 'invisible' | 'normal' | 'compact';
  theme?: 'auto' | 'light' | 'dark';
  onSuccess?: (token: string) => void;
  onExpire?: () => void;
  onError?: (errorCode?: string) => void;
}

let scriptLoadPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.turnstile) {
    return Promise.resolve();
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
    if (existingScript) {
      if (window.turnstile) {
        resolve();
      } else {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => reject(new Error('Turnstile script failed to load')));
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Turnstile script failed to load'));
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

export default function TurnstileWidget({
  id,
  siteKey,
  action,
  size = 'invisible',
  theme = 'auto',
  onSuccess,
  onExpire,
  onError
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadTurnstileScript()
      .then(() => {
        if (!isMounted || !containerRef.current || !window.turnstile) return;

        // Clean up any previous widget in this container
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }

        try {
          const widgetId = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            action,
            size,
            theme,
            callback: (token: string) => {
              if (isMounted && onSuccess) {
                onSuccess(token);
              }
            },
            'expired-callback': () => {
              if (isMounted && onExpire) {
                onExpire();
              }
            },
            'error-callback': (errorCode?: string) => {
              if (isMounted && onError) {
                onError(errorCode);
              }
            }
          });
          widgetIdRef.current = widgetId;
        } catch (renderError) {
          console.warn('[TurnstileWidget] Render exception caught:', renderError);
          onError?.(String(renderError));
        }
      })
      .catch((err) => {
        console.warn('[TurnstileWidget] Script load error:', err);
        onError?.(String(err));
      });

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, action, size, theme, onSuccess, onExpire, onError]);

  return <div id={id} ref={containerRef} className="turnstile-container" />;
}