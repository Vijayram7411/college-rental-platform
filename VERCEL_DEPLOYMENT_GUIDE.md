# 🚀 Vercel Deployment Guide - College Rental Platform

## Issue Detected

Vercel is showing a pull request for "feat: Adding chat generation" which is NOT part of your project. This suggests:
1. You might have connected the wrong repository
2. There's an old branch/PR that needs to be closed
3. The deployment is pointing to the wrong branch

---

## Solution: Clean Deployment

### Step 1: Close the Pull Request on GitHub

1. Go to: https://github.com/Vijayram7411/college-rental-platform/pulls
2. Find PR #53417 "feat: Adding chat generation"
3. Click on it
4. Click "Close pull request" (DO NOT merge it)
5. This PR is not part of your college rental platform

### Step 2: Verify Your Main Branch

1. Go to: https://github.com/Vijayram7411/college-rental-platform
2. Make sure you're on the "main" branch
3. Verify your files are there (README.md, src/, prisma/, etc.)

### Step 3: Deploy to Vercel (Fresh Setup)

#### Option A: Deploy via Vercel Dashboard

1. Go to: https://vercel.com
2. Click "Add New" → "Project"
3. Import your repository: `Vijayram7411/college-rental-platform`
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build` (or leave default)
   - **Output Directory:** .next (or leave default)
   - **Install Command:** `npm install --legacy-peer-deps`

5. Add Environment Variables:
   ```
   DATABASE_URL=file:./dev.db
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

---

## Important: Environment Variables for Vercel

You need to set these in Vercel Dashboard → Settings → Environment Variables:

### Required Variables:

```env
# Database (Use PostgreSQL for production, not SQLite)
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-app-name.vercel.app

# Optional: If using Stripe
STRIPE_SECRET_KEY=your-stripe-key
```

### Generate NEXTAUTH_SECRET:

Run this in PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## ⚠️ Important: Database for Production

**SQLite won't work on Vercel!** You need to use a cloud database.

### Recommended Options:

#### 1. Vercel Postgres (Easiest)
```bash
# In Vercel Dashboard
1. Go to Storage tab
2. Create → Postgres
3. Connect to your project
4. DATABASE_URL will be added automatically
```

#### 2. Supabase (Free tier available)
1. Go to: https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Add to Vercel environment variables

#### 3. Railway (Free tier available)
1. Go to: https://railway.app
2. Create PostgreSQL database
3. Copy connection string
4. Add to Vercel environment variables

---

## Update Prisma for PostgreSQL

If using PostgreSQL, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

Then run migrations:
```bash
npx prisma migrate deploy
```

---

## Vercel Build Settings

### Build Command:
```bash
npm run build
```

### Install Command (Important!):
```bash
npm install --legacy-peer-deps
```

### Output Directory:
```
.next
```

### Root Directory:
```
./
```

---

## Post-Deployment Steps

### 1. Run Database Migrations

After deploying, you need to set up the database:

```bash
# Connect to your production database
npx prisma migrate deploy

# Seed colleges
node scripts/seed-colleges.mjs

# Seed categories
node scripts/seed-categories.mjs
```

### 2. Update NEXTAUTH_URL

In Vercel Dashboard → Settings → Environment Variables:
```
NEXTAUTH_URL=https://your-actual-app-name.vercel.app
```

Then redeploy.

### 3. Test Your Deployment

1. Visit your Vercel URL
2. Try to register a new user
3. Test login
4. Check if products load
5. Verify college isolation works

---

## Troubleshooting Vercel Deployment

### Issue: Build Fails

**Check:**
- Install command uses `--legacy-peer-deps`
- All environment variables are set
- DATABASE_URL is correct

### Issue: Database Connection Error

**Solution:**
- SQLite doesn't work on Vercel
- Use PostgreSQL (Vercel Postgres, Supabase, or Railway)
- Update prisma/schema.prisma to use postgresql
- Run migrations: `npx prisma migrate deploy`

### Issue: NextAuth Error

**Solution:**
- Make sure NEXTAUTH_SECRET is set
- Make sure NEXTAUTH_URL matches your Vercel URL
- Redeploy after changing environment variables

### Issue: Images Not Loading

**Solution:**
- Base64 images should work fine
- Check if images are too large (5MB limit)
- Verify image data is in database

---

## Clean Up Wrong Branch/PR

If you see the wrong PR or branch:

### Delete the Wrong Branch:

```bash
# List all branches
git branch -a

# Delete local branch
git branch -D vijayram7411/feature

# Delete remote branch
git push origin --delete vijayram7411/feature
```

### Close Pull Request on GitHub:

1. Go to: https://github.com/Vijayram7411/college-rental-platform/pulls
2. Click on the PR
3. Click "Close pull request"
4. Do NOT merge it

---

## Recommended Deployment Flow

1. ✅ Close any wrong PRs on GitHub
2. ✅ Verify main branch has your code
3. ✅ Set up PostgreSQL database (Vercel Postgres recommended)
4. ✅ Update prisma/schema.prisma to use postgresql
5. ✅ Deploy to Vercel
6. ✅ Add environment variables
7. ✅ Run migrations
8. ✅ Seed data
9. ✅ Test the deployment

---

## Quick Vercel Deployment Checklist

- [ ] GitHub repository is correct
- [ ] Main branch has latest code
- [ ] Wrong PRs are closed
- [ ] Vercel project created
- [ ] Install command: `npm install --legacy-peer-deps`
- [ ] Environment variables added:
  - [ ] DATABASE_URL (PostgreSQL)
  - [ ] NEXTAUTH_SECRET
  - [ ] NEXTAUTH_URL
- [ ] Database migrations run
- [ ] Data seeded (colleges, categories)
- [ ] Deployment successful
- [ ] App tested and working

---

## Your Vercel App URL

After deployment, your app will be at:
```
https://college-rental-platform.vercel.app
```
(or whatever name Vercel assigns)

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Prisma with Vercel:** https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel

---

**Important:** Make sure to close that wrong PR first, then do a fresh deployment from your main branch!
