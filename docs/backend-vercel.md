## Backend (Express) and Vercel deployment

Overview
- The backend is an Express app at `api/index.js`. It handles authentication (Google OAuth via Passport), session management, and API routes under `/api/*`.
- Vercel configuration is in `vercel.json` and routes API traffic to `api/index.js`.

Key files
- `api/index.js` — server entry point, middleware, static serving, and route mounting.
- `api/config/database.js` — MongoDB connection helper using Mongoose.
- `api/config/passport.js` — Passport Google OAuth strategy and session serialization.
- `api/routes/*.js` — API route handlers (`auth`, `user`, `quiz`, `test`).
- `api/middleware/*.js` — authentication helpers (`auth.js`, `jwt-auth.js`, `mock-auth.js`).

Environment variables
Refer to `.env.example` for placeholders. The app expects at minimum:
- `MONGODB_URI` — MongoDB connection string.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — for Google OAuth.
- `SESSION_SECRET` — secret for `express-session`.
- `NODE_ENV` — `development` or `production` (affects CORS and session cookie settings).

API endpoints (summary)
- GET /api/health — health check

Auth
- GET /api/auth/google — start OAuth flow
- GET /api/auth/google/callback — OAuth callback (sets JWT cookie and redirects to `/dashboard`)
- POST /api/auth/logout — logout and clear cookie
- GET /api/auth/status — check auth status
- GET /api/auth/debug — debug information about OAuth and recent users

User
- GET /api/user/profile — get current user's profile (requires authentication)
- GET /api/user/progress — overall progress (requires authentication)
- GET /api/user/progress/:weekNumber — progress for a given week
- GET /api/user/history — quiz attempt history

Quiz
- GET /api/quiz/:weekNumber/questions — fetch questions for a week (auth required)
- POST /api/quiz/:weekNumber/submit — submit quiz answers (auth required)
- GET /api/quiz/:weekNumber/progress — progress for a week (auth required)

Sessions and JWT
- The app uses `express-session` with `connect-mongo` to persist sessions in MongoDB (session name: `genai.session`).
- A separate JWT cookie (`authToken`) is used for API authentication (see `api/middleware/jwt-auth.js`).
- For protected endpoints the middleware `authenticateToken` and `isAuthenticated` are used; in development there's a `mock-auth` fallback.

Vercel deployment notes
- `vercel.json` contains builds and routes. Important points:
  - `api/index.js` is set as the Vercel Node server for API routes.
  - Static HTML files are served by the static builder.
  - The `env` key in `vercel.json` sets `NODE_ENV` to `production` during build/deploy.

Setting environment variables on Vercel
1. Go to your Vercel project dashboard.
2. Add the following Environment Variables (Production/Preview/Development as appropriate):
   - `MONGODB_URI`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `SESSION_SECRET`
   - `BASE_URL` (if you use it in any server logic)

Redirect URI for Google
- In Google Cloud Console set the OAuth callback to:
  - Production: `https://<your-vercel-domain>/api/auth/google/callback`
  - Development: `http://localhost:3000/api/auth/google/callback`

Troubleshooting
- If sessions are not persisting, check `MONGODB_URI` and network access to MongoDB.
- If OAuth fails, ensure the `GOOGLE_CLIENT_ID`/`SECRET` are correctly set and redirect URIs match exactly.
- Check server logs in Vercel and the debug endpoint `/api/auth/debug` for runtime diagnostics.
