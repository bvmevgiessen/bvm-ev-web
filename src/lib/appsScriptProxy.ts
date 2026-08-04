/**
 * Shared utility helper to post data to a Google Apps Script Web App URL.
 * 1. Checks if a backend Express proxy is available (bypasses CORS & iframe restrictions in dev/container).
 * 2. On static hosting (like bvm-ev.de or GitHub Pages), or if proxy fails, attempts direct fetch.
 * 3. If direct fetch is blocked by Content Security Policy (connect-src directive),
 *    falls back to submitting via a hidden HTML form targeting a hidden iframe (form-action directive).
 */

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

    const jsonStr = typeof payload === 'string' ? payload : JSON.stringify(payload);

    // Provide the JSON string under multiple common parameter names expected by various Apps Script implementations:
    // e.parameter.postData, e.parameter.payload, e.parameter.data, e.parameter.content
    ['postData', 'payload', 'data', 'content'].forEach((paramName) => {
      const textarea = document.createElement('textarea');
      textarea.name = paramName;
      textarea.value = jsonStr;
      form.appendChild(textarea);
    });

    document.body.appendChild(form);

    let cleanedUp = false;
    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      setTimeout(() => {
        try { document.body.removeChild(form); } catch (e) {}
        try { document.body.removeChild(iframe); } catch (e) {}
      }, 1000);
      resolve({ status: 'success' });
    };

    // Listen for iframe load event when Google Apps Script responds
    iframe.onload = () => {
      console.log('[AppsScriptProxy] Hidden iframe completed submission to Google Apps Script.');
      cleanup();
    };

    iframe.onerror = () => {
      console.warn('[AppsScriptProxy] Hidden iframe error event.');
      cleanup();
    };

    // Safety timeout (45s) to allow large attachments (PDFs/Images) to complete uploading
    setTimeout(() => {
      console.log('[AppsScriptProxy] Hidden iframe fallback timeout reached (45s).');
      cleanup();
    }, 45000);

    form.submit();
  });
}

export async function postToAppsScript(url: string, payload: any, signal?: AbortSignal) {
  const cleanUrl = url.trim();

  // 1. Try server-side proxy endpoint if Express server is available
  try {
    const proxyResponse = await fetch('/api/proxy-apps-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: cleanUrl, payload }),
      signal
    });
    
    if (proxyResponse.ok) {
      return await proxyResponse.json();
    } else {
      const errData = await proxyResponse.json().catch(() => ({}));
      if (errData.error) {
        throw new Error(errData.error);
      }
    }
  } catch (err: any) {
    if (err.message && err.message.includes('Google Apps Script')) {
      throw err;
    }
    console.warn("[AppsScriptProxy] Express server proxy error, attempting direct connection fallback.", err);
  }

  // 2. Direct client-side fetch (with CSP error catch)
  try {
    const res = await fetch(cleanUrl, {
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
    console.warn("[AppsScriptProxy] Direct fetch to Google Apps Script failed (likely CSP connect-src restriction). Falling back to hidden HTML form submission.", err);
    // 3. Fallback: Submit via hidden HTML form to bypass connect-src CSP directive
    return await submitViaHiddenForm(cleanUrl, payload);
  }
}

