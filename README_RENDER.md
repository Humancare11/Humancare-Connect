# Deploying Humancare-Connect to Render.com

This guide explains how to deploy the Humancare-Connect monorepo (separate `backend` Node API and `frontend` Vite React app) to Render.com. It covers creating two services: a Web Service for the backend and a Static Site (or Web Service) for the frontend. It also lists required environment variables and common troubleshooting tips.

---

## Overview

- Backend: Express + Socket.IO + MongoDB (folder: `backend`).
- Frontend: Vite + React (folder: `frontend`).
- We will deploy backend as a Render Web Service and frontend as a Render Static Site (recommended) or Web Service.

Important notes:

- The frontend uses Vite env vars at build time (`VITE_API_URL`, `VITE_SOCKET_URL`). Set these in the Render Static Site settings.
- The backend serves static frontend files when `NODE_ENV=production` and the frontend's build is placed at `frontend/dist` if you opt to deploy a single combined service — but recommended approach is two services.
- The backend writes uploaded files to `backend/uploads`. Render file system is ephemeral; use cloud storage (S3/Cloudinary) for persistent uploads in production.

---

## Prerequisites

- A Render account (https://render.com) and your repository connected (GitHub/GitLab).
- A MongoDB instance (MongoDB Atlas or another hosted Mongo). You will need the connection URI (`MONGO_URI`).
- (Optional) OAuth credentials (Google) if using Google Sign-In: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

---

## 1) Create Backend Service (Web Service)

1. In Render dashboard, click **New** → **Web Service**.
2. Fill in:
   - **Name:** `humancare-backend` (or your choice)
   - **Service Type / Environment:** `Node` / `Docker` or `Node` (default)
   - **Region:** choose nearest region
   - **Branch:** `main` (or branch you want to deploy)
   - **Root Directory:** `backend` (important — points Render to the backend folder)
   - **Build Command:** leave blank (Render will run `npm install` automatically) or `npm install`
   - **Start Command:** `npm run start:prod`
     - `start:prod` runs `NODE_ENV=production node server.js` (defined in `backend/package.json`).
3. Add Environment variables (Render -> Environment):
   - `MONGO_URI` = your mongo connection string (required)
   - `JWT_SECRET` = secure random secret for signing tokens (required)
   - `FRONTEND_URL` = URL of your frontend (set after frontend deploy, e.g. `https://your-frontend.onrender.com`)
   - `GOOGLE_CLIENT_ID` = (if used)
   - `GOOGLE_CLIENT_SECRET` = (if used)
   - (Optional) any other envs your project requires (check `backend` code for `process.env.*`).
4. Leave the default port setting — Render will provide a `PORT` env var and the app listens on `process.env.PORT`.
5. Create the service and wait for the first deploy.

Notes:

- If you need a specific Node version, add an `engines` entry in `backend/package.json` or set the build environment in Render.
- Logs are available in Render's dashboard under the service — use them to debug start failures.

---

## 2) Create Frontend Service (Static Site) — recommended

1. In Render dashboard, click **New** → **Static Site**.
2. Fill in:
   - **Name:** `humancare-frontend` (or your choice)
   - **Branch:** `main` (or your branch)
   - **Root Directory:** `frontend` (important)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. Add Environment variables (Static Sites allow env vars used at build time):
   - `VITE_API_URL` = backend base URL (e.g. `https://humancare-backend.onrender.com`)
   - `VITE_SOCKET_URL` = socket server URL (usually same as `VITE_API_URL`), e.g. `https://humancare-backend.onrender.com`
   - Any other `VITE_` prefixed envs used by the frontend.
4. Create the static site and wait for the build to finish. The site URL will be available (e.g., `https://humancare-frontend.onrender.com`).
5. Copy the frontend URL and put it into the backend `FRONTEND_URL` env variable (step 1) so CORS and socket origins match.

Important:

- Vite inlines `VITE_` env vars during build time. If you change the backend URL later, rebuild the frontend.

Alternate: Deploy frontend as a Web Service

- If you prefer a server to host the frontend (e.g., for SSR or special hosting), create a Web Service with `Root Directory: frontend`, Build Command `npm install && npm run build`, Start Command `npm run preview` or a small static server. Static Site is simpler and recommended.

---

## 3) Post-deploy checks & settings

- Backend health: visit `https://your-backend.onrender.com/api/health` — should return `API Running...`.
- Frontend: visit `https://your-frontend.onrender.com` and confirm UI loads.
- Socket.IO: ensure `VITE_SOCKET_URL` matches backend URL and backend `FRONTEND_URL` includes the frontend origin.
- Admin seeding: On first start backend auto-creates default admin accounts (`admin@gmail.com / admin123` and `superadmin@humancare.com / superadmin123`) — check backend logs to confirm.

---

## 4) Persistent uploads (important)

- `backend/uploads` is ephemeral on Render. For production you must use a cloud object storage service (S3, Cloudinary, etc.).
- Update upload endpoints to upload files to cloud storage and store URLs in the DB. Add required env vars (e.g., `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `CLOUDINARY_URL`, etc.) to the backend service settings.

---

## 5) Common environment variables checklist

Backend (`backend` service):

- `MONGO_URI` (required)
- `JWT_SECRET` (required)
- `FRONTEND_URL` (recommended)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (if using Google auth)
- Any email or storage credentials used by your app

Frontend (Static Site build envs):

- `VITE_API_URL` (e.g. `https://your-backend.onrender.com`)
- `VITE_SOCKET_URL` (usually same as `VITE_API_URL`)

---

## 6) Local testing before deploy

1. Backend locally (from `backend` folder):

```powershell
# install deps
cd backend
npm install
# start with a local env (.env) containing MONGO_URI and JWT_SECRET
npm run dev
```

2. Frontend locally (from `frontend` folder):

```powershell
cd frontend
npm install
# set VITE_API_URL in the environment before starting dev server
$env:VITE_API_URL = "http://localhost:3000"
npm run dev
```

---

## 7) Troubleshooting

- Deploy fails on build: open the service logs in Render; ensure `Root Directory` is set correctly and env vars are present.
- Frontend shows blank or wrong API URL: verify `VITE_API_URL` in Static Site settings and re-trigger deploy (rebuild required after changing Vite envs).
- Socket connection refused: confirm CORS in backend includes frontend URL (backend reads `FRONTEND_URL` for allowed origins). Check browser console for socket URL and errors.
- Uploads disappear after restart: migration to cloud object storage required.

---

## 8) Optional: Use Render Managed Databases

- Render offers managed PostgreSQL but not MongoDB. Prefer MongoDB Atlas for Mongo. If you add an external DB, ensure network access (allow Render IPs or use a proper connection string).

---

## 9) Security & production recommendations

- Use a strong `JWT_SECRET` and keep it secret.
- Do not store credentials in repo; always set them as Render Environment variables.
- Use HTTPS (Render provides TLS automatically for Render domains).
- Replace local file uploads with cloud storage for compliance and reliability.

---

If you want, I can:

- Create a `.env.example` listing all required env var names.
- Prepare Render service configuration screenshots or a sample Render YAML file for `render.yaml` to automate deployment.
