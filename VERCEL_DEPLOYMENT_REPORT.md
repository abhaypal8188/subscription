# Vercel Deployment Readiness Report

## Status

Ready for a single-project Vercel deployment once environment variables are added.

## Verified

- `api/index.js` uses the Express app as a serverless entrypoint
- `vercel.json` routes `/api/*` to the API and falls back SPA routes to `client/dist/index.html`
- `client/src/services/api.js` defaults to `/api`
- MongoDB is initialized lazily for serverless usage
- CORS allows configured origins, localhost, and Vercel preview domains
- uploads work locally and require Cloudinary on Vercel

## Required Variables

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=long-random-secret
JWT_REFRESH_SECRET=long-random-secret
CLIENT_URL=https://your-project.vercel.app
VITE_API_URL=/api
```

## Strongly Recommended

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CRON_SECRET=...
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=...
```

## Notes

- Deep links like `/subscriptions` should now load correctly after refresh.
- Logo uploads on Vercel require Cloudinary.
- The reminder cron endpoint is configured, but it still depends on valid email and database setup.
