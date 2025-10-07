## GenAI Training — Developer Guide

This repository contains the GenAI Training platform: a small Node/Express backend with static frontend pages served from the project root and a MongoDB database for persistence. Use the `docs/` folder for focused guidance on the frontend, backend (Vercel) deployment, and the MongoDB schema and maintenance.

Files added:
- `docs/frontend.md` — frontend structure and how to run/extend the static UI
- `docs/backend-vercel.md` — backend architecture, API endpoints, Vercel deploy notes, environment variables
- `docs/database.md` — MongoDB models, indexes, and run/maintenance tips
- `.env.example` — example environment variables (placeholders only)

Quick start (local):

1. Copy `.env.example` to `.env` and fill the values with your secrets.
2. Install dependencies:

```bash
npm install
```

3. Start the server (development):

```bash
npm run dev
```

4. Open http://localhost:3000

Where to look next:
- Backend entry: `api/index.js`
- Routes: `api/routes/*.js`
- Models: `api/models/*.js`
- Frontend static pages: `*.html` in repo root and `evaluation/*.html`

NPM scripts
- `npm run dev` — start server (node api/index.js). Use `nodemon` if you prefer auto-restart in dev.
- `npm start` — start server in production mode (same as dev script here).
- `npm run build` — placeholder build script (no frontend build currently).
- `npm run test:api` — runs a simple API test script `test-api-simple.js`.
- Playwright tests: `npm run test:playwright` and `npm run test:playwright:ui`.

Quick troubleshooting
- Server won't start: ensure Node >= 18 is installed (see `engines` in `package.json`) and `npm install` was run.
- MongoDB connection errors: confirm `MONGODB_URI` is set and reachable. For Atlas check IP access and user credentials.
- OAuth errors: confirm `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in environment variables and callback URIs configured in Google Cloud Console.
- Sessions not persisting: check `SESSION_SECRET` and that your `MONGODB_URI` allows connections; `connect-mongo` stores sessions in the DB.

Contacts and next steps
- Project owner: check repository owner/commit history for the main maintainer.
- Suggested next improvements: add CI (GitHub Actions) for lint/tests, add a frontend build pipeline if moving to an SPA, add migration tooling for schema changes.

---
End of developer guide.


If you need further onboarding help (live walkthrough, adding CI, or database access), add a ticket to the repo or reach out to the project owner.

---
See `docs/` for full details.
