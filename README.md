# Smart Subscription Manager

A production-style MERN SaaS starter for tracking subscriptions, reminders, analytics, and savings insights.

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
```

## Quick Start

1. Install dependencies in the root workspace:

```bash
npm install
```

2. Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Start development:

```bash
npm run dev
```

## Highlights

- JWT access + refresh token auth
- Subscription CRUD with logo uploads
- Dashboard summary, charts, spending forecast, and AI-style savings tips
- Reminder job scaffolding with email support
- Admin overview endpoints and UI
- PWA manifest + responsive SaaS layout

## Deployment

- Frontend: Vercel
- Backend: Render / Railway
- Database: MongoDB Atlas

