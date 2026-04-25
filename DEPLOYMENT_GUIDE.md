# Vercel Deployment Guide

This project is set up to deploy to Vercel as one fullstack app.

## Architecture

- `client/` builds the Vite frontend
- `api/index.js` exposes the Express app as a Vercel serverless function
- frontend requests use `/api`
- SPA routes fall back to `client/dist/index.html`

## Required Vercel Environment Variables

Add these in the Vercel dashboard for Preview and Production:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=generate-a-long-random-secret
JWT_REFRESH_SECRET=generate-another-long-random-secret
CLIENT_URL=https://your-project.vercel.app
VITE_API_URL=/api
```

## Recommended Environment Variables

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CRON_SECRET=generate-a-random-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=app-password
SMTP_FROM=Smart Subscription Manager <you@example.com>
```

Important:

- Logo uploads on Vercel require Cloudinary.
- Without Cloudinary, uploads are rejected in production because Vercel storage is ephemeral.
- `CRON_SECRET` protects the reminder cron endpoint.

## Deploy

From the repository root:

```bash
npm install
vercel
vercel --prod
```

## Verify

Check:

- `https://your-project.vercel.app/`
- `https://your-project.vercel.app/api/health`

Expected health response:

```json
{
  "status": "ok",
  "service": "subscription-manager-api"
}
```

## Cron

`vercel.json` already includes a reminder cron entry:

```json
{
  "path": "/api/cron/reminders",
  "schedule": "0 9 * * *"
}
```

For it to work correctly:

- set `CRON_SECRET`
- configure SMTP variables if you want email reminders
- verify the cron query matches your subscription fields and reminder logic

## Troubleshooting

- MongoDB connection errors usually mean the Atlas URI is wrong or Atlas network access is not open.
- CORS errors usually mean `CLIENT_URL` does not match your deployed frontend URL.
- Upload failures on Vercel usually mean Cloudinary variables are missing.
- Refresh token failures usually mean JWT secrets changed between deployments.
