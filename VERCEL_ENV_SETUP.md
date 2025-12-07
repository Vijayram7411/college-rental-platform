# Vercel Environment Variables Setup

## Required Environment Variables

Your Vercel deployment needs these environment variables configured:

### 1. DATABASE_URL
For production, you need a hosted database. SQLite (file:./dev.db) won't work on Vercel.

**Options:**
- **Vercel Postgres** (Recommended): Built-in, easy setup
- **Neon**: Free PostgreSQL hosting
- **PlanetScale**: MySQL-compatible serverless database
- **Supabase**: PostgreSQL with additional features

**For Vercel Postgres:**
1. Go to your Vercel project dashboard
2. Click "Storage" tab
3. Create a new Postgres database
4. Vercel will automatically add DATABASE_URL to your environment variables

**For other providers:**
Set `DATABASE_URL` to your database connection string, e.g.:
```
postgresql://user:password@host:5432/database
```

### 2. NEXTAUTH_SECRET
Generate a secure random string for production:

```bash
openssl rand -base64 32
```

Set this value in Vercel environment variables.

### 3. NEXTAUTH_URL
Set to your Vercel deployment URL:
```
https://your-project.vercel.app
```

## How to Set Environment Variables on Vercel

### Method 1: Via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add each variable:
   - Variable name: `DATABASE_URL`
   - Value: Your database connection string
   - Environment: Production, Preview, Development (select all)
5. Click "Save"
6. Repeat for `NEXTAUTH_SECRET` and `NEXTAUTH_URL`

### Method 2: Via Vercel CLI
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

## Important Notes

1. **Database Schema**: After setting up your production database, you need to push the Prisma schema:
   ```bash
   # Set DATABASE_URL to production database locally
   npx prisma db push
   ```

2. **Redeploy**: After adding environment variables, trigger a new deployment:
   - Push a new commit, or
   - Click "Redeploy" in Vercel dashboard

3. **SQLite Limitation**: Vercel's serverless environment doesn't support SQLite file databases. You must use a hosted database for production.

## Quick Setup Checklist

- [ ] Choose a database provider (Vercel Postgres recommended)
- [ ] Set DATABASE_URL environment variable
- [ ] Generate and set NEXTAUTH_SECRET
- [ ] Set NEXTAUTH_URL to your Vercel domain
- [ ] Push Prisma schema to production database
- [ ] Trigger a new deployment
- [ ] Test the deployment

## Current Build Status

✅ Build compiles successfully
✅ Prisma Client generates correctly
⚠️ Missing DATABASE_URL environment variable
⚠️ Next.js security vulnerability (upgrading to 15.1.3)
