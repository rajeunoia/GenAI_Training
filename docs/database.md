## Database (MongoDB) — GenAI Training

Overview
- Mongoose is used to define and interact with MongoDB models. The app expects a MongoDB connection string in `MONGODB_URI`.
- Connection helper: `api/config/database.js` which calls `mongoose.connect(...)`.

Models

1) User (`api/models/User.js`)
- Fields: `googleId` (unique), `email` (unique), `name`, `avatar`, `createdAt`, `lastLogin`, `isActive`.

2) QuizAttempt (`api/models/QuizAttempt.js`)
- Tracks per-attempt details: `userId`, `weekNumber`, `attemptNumber`, `questionsShown`, `userResponses`, `score`, `timeSpent`, `submittedAt`, `ipAddress`.
- Index: `{ userId: 1, weekNumber: 1, attemptNumber: 1 }` for efficient lookup.

3) UserProgress (`api/models/UserProgress.js`)
- Tracks per-user per-week progress: `userId`, `weekNumber`, `completed`, `completedAt`, `bestScore`, `totalAttempts`, `lastAttemptAt`.
- Compound unique index: `{ userId: 1, weekNumber: 1 }` to ensure only one progress record per user per week.

Indexes and performance
- The repository defines the most important indexes in the schema files. For production scale, consider:
  - Indexing `QuizAttempt.submittedAt` if you query by time ranges frequently.
  - Monitoring slow queries via MongoDB Atlas Performance Advisor and adding indexes as needed.

Backup and maintenance
- Recommended: use MongoDB Atlas with automated backups and monitoring.
- If self-hosting, schedule regular mongodump exports and store them securely.

Local development setup
1. Create a free Atlas cluster or run a local MongoDB instance.
2. Set `MONGODB_URI` in `.env` with your connection string.
3. Start the server (`npm run dev`) — the DB connector logs the connected host on success.

Security
- Do NOT commit connection strings with credentials to the repository. Use environment variables and secrets storage (Vercel environment variables, Vault, or similar).
- Use least-privilege DB users (e.g., a user limited to the `genai-training` database).

Data migration and schema changes
- Mongoose does not handle migrations automatically. For non-trivial schema changes, use a migration tool (e.g., `migrate-mongo`, `umzug` for Node) and store migrations in `migrations/`.

Accessing the DB from Vercel
- Ensure your MongoDB Atlas IP whitelist allows Vercel's outbound IP ranges or use VPC peering or a connection string with SRV that uses TLS.
