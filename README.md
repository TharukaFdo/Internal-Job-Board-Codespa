# Internal Job Board (MERN)

Full-stack slice for posting and browsing internal job openings. Backend: Express + MongoDB (Mongoose). Frontend: Vite + React + Tailwind CSS.

## Prerequisites
- Node.js 18+
- MongoDB running locally or a connection string (e.g., Atlas)

## Backend (`/server`)
1. Copy `.env.example` to `.env` and set `MONGO_URI` and (optionally) `PORT`:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/internal-job-board
   PORT=4000
   ```
2. Install dependencies:
   ```bash
   cd server
   npm install
   ```
3. Start the API:
   ```bash
   npm run dev   # nodemon
   # or
   npm start
   ```
4. API endpoints:
   - `GET /api/jobs` — list jobs (newest first)
   - `POST /api/jobs` — create job (requires non-empty title + department)
   - `GET /health` — health check

## Frontend (`/client`)
1. Copy `.env.example` to `.env` and point to the API:
   ```env
   VITE_API_BASE_URL=http://localhost:4000
   ```
2. Install dependencies (if not already):
   ```bash
   cd client
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
   Vite will print the local URL (default `http://localhost:5173`). Ensure the backend above is running.
4. Run UI tests:
   ```bash
   npm test
   ```

## Project Structure
- `server/` — Express API, Mongo connection, job model/routes.
- `client/` — Vite + React UI with Tailwind styling and Vitest tests.

## Notes
- The backend owns the DB connection; the frontend communicates via REST only.
- Jobs are fetched on load with loading and error states; new posts are prepended after a successful create.
