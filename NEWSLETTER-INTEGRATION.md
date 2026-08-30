# Integration in bvmevgiessen/bvm-ev-web (bvm-ev.de)

Newsletter API Backend & Frontend Integration.

## 1. `Newsletter.tsx` → `src/components/Newsletter.tsx`

Connects directly to the BVM Newsletter API on Render:
- `POST https://bvm-newsletter-api.onrender.com/api/newsletter/subscribe` — Double-Opt-In confirmation email via Resend (`newsletter@bvm-ev.de`) with automatic issue delivery upon confirmation.
- `GET https://bvm-newsletter-api.onrender.com/api/newsletter/download` — Live generated quarterly report with current events, blogs, and editorial.

### Configuration

Set the environment variable in `.env` or your GitHub Pages / hosting build settings:

```env
VITE_NEWSLETTER_API=https://bvm-newsletter-api.onrender.com
```

If not provided, it defaults to `https://bvm-newsletter-api.onrender.com`.

## 2. GitHub Action Workflow → `.github/workflows/newsletter-pdf.yml`

Runs on the 1st of each month (and manually via **Actions → Run workflow**):
Rebuilds the issue, downloads the PDF to `public/newsletter-latest.pdf` and `public/assets/pdf/newsletter-latest.pdf`, commits it, and optionally mails it to all confirmed subscribers.

Repository secrets to configure in GitHub (**Settings → Secrets and variables → Actions**):

- `NEWSLETTER_API`: `https://bvm-newsletter-api.onrender.com`
- `NEWSLETTER_SEND`: `true` (optional, if you want automatic monthly mail-out)

Also enable **Settings → Actions → General → Workflow permissions** -> *Read and write permissions*.
