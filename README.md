# Cloud POS – Starter App

Multi-tenant, offline-first Cloud POS & Pay-at-the-Table starter built with:

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Dark / Light mode** (`next-themes`)
- **i18n**: English / Amharic (አማርኛ) / Afaan Oromoo (`react-i18next`)
- Clean industrial high-contrast UI

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel (Recommended)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the GitHub repo
4. Click **Deploy**

That’s it. Vercel will automatically build and host it.

## Features Included

- Persistent top header with language switcher (EN / AM / OM)
- Light / Dark mode toggle (saved in localStorage)
- Fully translated UI (no hardcoded strings)
- Ready for expansion (orders, tables, payments, etc.)

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI (Header, Providers…)
├── i18n/             # Translation files (en, am, om)
└── lib/              # Utility functions (future)
```

## Next Steps (from the full system prompt)

- Add Orders & Tables pages
- Connect Supabase (PostgreSQL multi-tenant)
- Offline SQLite sync layer
- ETHQR + USSD Push payment flows
- Tauri/Electron desktop register
- Flutter waiter mobile app

---

Built following the Enterprise Cloud POS architecture guidelines.
