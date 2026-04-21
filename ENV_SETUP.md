# Environment Configuration Guide

## Quick Start

### Local Development (Localhost)
```bash
# Frontend - Terminal 1
cd frontend
npm run dev
# Server runs on http://localhost:5173
# API connects to http://localhost:5000

# Backend - Terminal 2
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Production Build
```bash
# Frontend build for production
cd frontend
npm run build:prod
# Creates optimized build ready for AWS deployment

# Backend production
cd backend
NODE_ENV=production npm start:prod
# Server runs with production environment variables
```

## Environment Files

### Frontend

**`.env` (Default/Production)**
```
VITE_GOOGLE_CLIENT_ID=421932945264-mnhqt5q9ud7so3ajaf99uidq3qceuo67.apps.googleusercontent.com
```

**`.env.local` (Local Development - AUTO LOADED)**
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=421932945264-mnhqt5q9ud7so3ajaf99uidq3qceuo67.apps.googleusercontent.com
```

**`.env.production` (Production - Used for build)**
```
VITE_API_URL=http://107.23.161.249:5000
VITE_SOCKET_URL=http://107.23.161.249:5000
VITE_GOOGLE_CLIENT_ID=421932945264-mnhqt5q9ud7so3ajaf99uidq3qceuo67.apps.googleusercontent.com
```

### Backend

**`.env` (Local Development)**
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://testuser:humancare@...
JWT_SECRET=supersecretkey
GOOGLE_CLIENT_ID=421932945264-mnhqt5q9ud7so3ajaf99uidq3qceuo67.apps.googleusercontent.com
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

**`.env.production` (Production)**
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://testuser:humancare@...
JWT_SECRET=supersecretkey
GOOGLE_CLIENT_ID=421932945264-mnhqt5q9ud7so3ajaf99uidq3qceuo67.apps.googleusercontent.com
FRONTEND_URL=http://107.23.161.249:3000
BACKEND_URL=http://107.23.161.249:5000
```

## How It Works

### Development Flow
1. **npm run dev** in frontend loads `.env.local` (Vite automatically prioritizes `.env.local`)
2. Frontend makes API calls to `http://localhost:5000` (from VITE_API_URL)
3. Socket.io connects to `http://localhost:5000` (from VITE_SOCKET_URL)
4. Backend uses `.env` with local URLs
5. CORS allows requests from `http://localhost:3000`

### Production Flow
1. **npm run build:prod** uses `.env.production` during build
2. Built assets contain hardcoded URLs for `http://107.23.161.249:5000`
3. Backend runs with `.env.production`
4. CORS allows requests from `http://107.23.161.249:3000`
5. Socket.io configured for production IP

## File Locations

```
vite-project/
├── frontend/
│   ├── .env                    # Default (production URLs)
│   ├── .env.local             # Local dev (localhost)
│   ├── .env.production        # Production (AWS IP)
│   ├── vite.config.js         # Environment-aware config
│   └── src/
│       └── socket.js          # Uses import.meta.env.VITE_SOCKET_URL
│
└── backend/
    ├── .env                   # Local dev
    ├── .env.production        # Production AWS config
    ├── server.js              # Uses process.env.FRONTEND_URL & process.env.BACKEND_URL
    └── package.json           # npm scripts for dev/prod
```

## NPM Scripts

### Frontend
- `npm run dev` - Start dev server (uses .env.local)
- `npm run build` - Build for development
- `npm run build:prod` - Build for production (uses .env.production)
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start with nodemon (development)
- `npm start` - Start with NODE_ENV=development
- `npm start:prod` - Start with NODE_ENV=production

## Deployment Checklist

- [ ] Update AWS IP address in `backend/.env.production`
- [ ] Update AWS IP address in `frontend/.env.production`
- [ ] Ensure FRONTEND_URL and BACKEND_URL point to correct AWS IPs
- [ ] Run `npm run build:prod` before deploying frontend
- [ ] Deploy with `NODE_ENV=production npm start:prod` for backend
- [ ] Test Socket.io connections in production
- [ ] Verify CORS settings allow production domain

## Troubleshooting

### API calls return 404
- Check if backend is running on correct port
- Verify VITE_API_URL matches backend URL
- Check console for actual endpoint being called

### Socket.io connection fails
- Verify VITE_SOCKET_URL is correct
- Check backend Socket.io CORS settings
- Ensure ws/wss ports are accessible

### "Cannot GET /"
- Backend may need to serve frontend in production
- Check if frontend dist is in correct location
- Verify NODE_ENV is set to production

### Wrong environment variables loading
- Delete `node_modules` and reinstall
- Clear browser cache and restart dev server
- Confirm file names: `.env.local` vs `.env.development`
