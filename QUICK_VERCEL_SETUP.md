# Quick Vercel Setup Guide

## The Problem
Your app works locally but fails on Vercel with login/signup errors because:
- ❌ No production database configured
- ❌ Missing environment variables
- ❌ SQLite doesn't work on Vercel (serverless)

## The Solution (5 Minutes)

### 1️⃣ Create Vercel Postgres Database

1. Open: https://vercel.com/dashboard
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Name it: `college-rental-db`
6. Click **Create**

✅ Vercel automatically creates `POSTGRES_PRISMA_URL` for you

### 2️⃣ Set Environment Variables

Go to: **Settings → Environment Variables**

Add these 3 variables:

| Variable | Value | Where to Get It |
|----------|-------|-----------------|
| `DATABASE_URL` | Copy from Storage tab | Use the `POSTGRES_PRISMA_URL` value |
| `NEXTAUTH_SECRET` | Generate new | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL | e.g., `https://your-app.vercel.app` |

**Important**: Check all environments (Production, Preview, Development) for each variable

### 3️⃣ Push Database Schema

The schema has been updated to use PostgreSQL. Now push it to your production database:

```bash
# 1. Temporarily update your local .env with production DATABASE_URL
# Copy the POSTGRES_PRISMA_URL from Vercel Storage tab
# Edit .env and replace DATABASE_URL with the production URL

# 2. Push schema to production
npx prisma db push

# 3. Restore .env back to local SQLite
# Change DATABASE_URL back to: file:./dev.db
```

### 4️⃣ Deploy Changes

```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push origin main
```

Vercel will automatically redeploy (takes ~2 minutes)

### 5️⃣ Test Your App

1. Go to your Vercel URL
2. Try to register a new user
3. Try to login
4. ✅ Should work now!

## What Changed?

- ✅ Prisma schema now uses PostgreSQL instead of SQLite
- ✅ Production database is configured
- ✅ Environment variables are set
- ✅ Database tables are created

## Still Having Issues?

### Check Vercel Logs
1. Go to your project on Vercel
2. Click **Deployments**
3. Click the latest deployment
4. Click **View Function Logs**
5. Look for error messages

### Common Fixes

**"Environment variable not found"**
→ Make sure all 3 environment variables are set in Vercel

**"Invalid connection string"**
→ Use `POSTGRES_PRISMA_URL`, not `POSTGRES_URL`

**"Table does not exist"**
→ Run `npx prisma db push` with production DATABASE_URL

**Changes not taking effect**
→ Trigger a new deployment (push a commit or click "Redeploy")

## Environment Variables Summary

```bash
# Vercel Production Environment Variables
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="https://your-app.vercel.app"
```

## Local Development

Your local `.env` should remain:
```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

This way you can develop locally with SQLite and deploy to production with PostgreSQL.
