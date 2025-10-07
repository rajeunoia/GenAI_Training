## Frontend — GenAI Training

What is included
- Static HTML pages at the repo root: `index.html`, `dashboard.html`, `GenAi_Training.html`, `how_to_take_training.html`, and others in `evaluation/`.
- These are simple static pages (no build pipeline). They are served by the Express app (see `api/index.js`) and also deployed as static assets on Vercel.

How the frontend is served
- Development: `api/index.js` uses `express.static` to serve files from the repository root. Start the server with `npm run dev` and open `http://localhost:3000`.
- Production (Vercel): Vercel serves HTML files via the static build entry in `vercel.json`. API routes are routed to `api/index.js`.

Adding/Updating pages
- Edit or add `.html` files in the project root or `evaluation/`.
- Keep assets (images, CSS, JS) in the repo root alongside the pages, or create an `assets/` folder and reference paths accordingly.

Typical frontend-to-backend interactions
- OAuth login: The frontend redirects users to `/api/auth/google` to start OAuth.
- Authenticated pages: `/dashboard` is protected; the server checks authentication and returns `dashboard.html` when the user has a valid JWT/session.
- Quizzes: Frontend calls API endpoints under `/api/quiz` to fetch questions and submit answers.

Notes for developers
- No frontend build step currently — changes to HTML are reflected immediately when the server restarts.
- If you add a modern frontend (React/Vue), update `vercel.json` and routing to build and serve the SPA correctly.
