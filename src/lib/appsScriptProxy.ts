/**
 * Shared utility helper to post data to a Google Apps Script Web App URL.
 * 1. Checks if a backend Express proxy is available (bypasses CORS & iframe restrictions in dev/container).
 * 2. On static hosting (like bvm-ev.de or GitHub Pages), or if proxy fails, attempts direct fetch.
 * 3. If direct fetch is blocked by Content Security Policy (connect-src directive),
 *    falls back to submitting via a hidden HTML form targeting a hidden iframe (form-action directive).
 */

function sanitizeAppsScriptUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl.trim());
    const allowedHosts = new Set(['script.google.com', 'script.googleusercontent.com']);
    if (parsed.protocol !== 'https:') return null;
    if (!allowedHosts.has(parsed.hostname)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function submitViaHiddenForm(url: string, payload: any): Promise<{ status: string }> {
  return new Promise((resolve) => {
    const iframeName = 'gas_hidden_iframe_' + Date.now();
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = iframeName;
    form.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'postData';
    input.value = typeof payload === 'string' ? payload : JSON.stringify(payload);
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      try { document.body.removeChild(form); } catch (e) {}
      try { document.body.removeChild(iframe); } catch (e) {}
      resolve({ status: 'success' });
    }, 1500);
  });
}

export async function postToAppsScript(url: string, payload: any, signal?: AbortSignal) {
  const sanitizedUrl = sanitizeAppsScriptUrl(url);
  if (!sanitizedUrl) {
    throw new Error('Invalid Google Apps Script URL.');
  }

  const isStaticSite = typeof window !== 'undefined' && 
    (window.location.hostname === 'bvm-ev.de' || window.location.hostname === 'github.io' || window.location.hostname.endsWith('.github.io'));

  // 1. Try server-side proxy if not on a pure static site host
  if (!isStaticSite) {
    try {
      const proxyResponse = await fetch('/api/proxy-apps-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, payload }),
        signal
      });
      
      if (proxyResponse.ok) {
        return await proxyResponse.json();
      }
    } catch (err) {
      console.warn("Express server proxy not available. Falling back to direct connection.", err);
    }
  }

  // 2. Direct client-side fetch (with CSP error catch)
  try {
    const res = await fetch(sanitizedUrl, {
      method: 'POST',
      mode: 'no-cors', // standard workaround for Google Apps Script Web App redirects
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload),
      signal
    });
    return res;
  } catch (err) {
    console.warn("Direct fetch to Google Apps Script failed (likely CSP connect-src restriction). Falling back to hidden HTML form submission.", err);
    // 3. Fallback: Submit via hidden HTML form to bypass connect-src CSP directive
    return await submitViaHiddenForm(sanitizedUrl, payload);
  }
}

