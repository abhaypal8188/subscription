# Smart Subscription Manager

A production-style MERN app for tracking subscriptions, reminders, analytics, and savings insights.

## Stack

- React + Vite + Tailwind + Framer Motion
- Node.js + Express + MongoDB + Mongoose
- JWT auth with refresh tokens
- Zustand state management
- Recharts analytics
- Nodemailer reminder scaffolding

## Structure

```text
/client
/server
/api
```

## Quick Start

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

## Highlights

- JWT access + refresh token auth
- Subscription CRUD with logo uploads
- Dashboard analytics and savings insights
- Admin overview endpoints and UI
- Reminder job scaffolding with email support
- PWA manifest + responsive layout

## Deployment

### Fullstack Vercel Deployment

This repo is configured for a single Vercel project:

- the frontend builds from `client/`
- the backend runs from `api/index.js`
- frontend API calls default to `/api`
- SPA routes like `/subscriptions` fall back correctly on refresh

Deploy from the repo root:

```bash
npm install
vercel
vercel --prod
```

Required Vercel environment variables:

| Variable | Notes |
|----------|-------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random secret |
| `JWT_REFRESH_SECRET` | Long random secret |
| `CLIENT_URL` | Your production Vercel URL |
| `VITE_API_URL` | Use `/api` for same-project deployment |

Recommended for production:

| Variable | Notes |
|----------|-------|
| `CLOUDINARY_CLOUD_NAME` | Required for logo uploads on Vercel |
| `CLOUDINARY_API_KEY` | Cloudinary credential |
| `CLOUDINARY_API_SECRET` | Cloudinary credential |
| `CRON_SECRET` | Protects the reminder cron endpoint |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Needed for reminder emails |

Full instructions: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Separate Deployment

- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: MongoDB Atlas
