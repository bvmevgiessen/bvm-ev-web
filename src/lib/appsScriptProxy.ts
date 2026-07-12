/**
 * Shared utility helper to post data to a Google Apps Script Web App URL.
 * It first tries to send via the server-side Express proxy (to bypass Content Security Policy
 * restrictions in environments like the AI Studio iframe/preview).
 * If that fails or is not available (e.g. running on GitHub Pages as a static site),
 * it falls back to a direct client-side fetch.
 */
export async function postToAppsScript(url: string, payload: any, signal?: AbortSignal) {
  // 1. Try to send via the local Express server-side proxy
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
    console.warn("Express server proxy not available or failed. Falling back to direct client-side fetch.", err);
  }

  // 2. Direct client-side fetch fallback (useful on static hosting like GitHub Pages)
  return await fetch(url, {
    method: 'POST',
    mode: 'no-cors', // standard workaround for Google Apps Script Web App redirects
    headers: {
      'Content-Type': 'text/plain;charset=utf-8' // bypasses CORS preflight
    },
    body: JSON.stringify(payload),
    signal
  });
}
