# Fix Vercel Login/Signup Server Error

## Problem
You're seeing a "server configuration error" when trying to login or signup on Vercel. This is because:

1. **Missing DATABASE_URL** - Vercel doesn't have access to your database
2. **Missing NEXTAUTH_SECRET** - Required for NextAuth to work
3. **Missing NEXTAUTH_URL** - Required for authentication callbacks
4. **SQLite incompatibility** - Vercel's serverless environment doesn't support SQLite

## Solution: Set Up Production Database

### Step 1: Create Vercel Postgres Database (Recommended)

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project: `college-rental-platform`
3. Click on the **"Storage"** tab
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Choose a name (e.g., `college-rental-db`)
7. Select a region (choose closest to your users)
8. Click **"Create"**

Vercel will automatically add these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` (use this one for DATABASE_URL)
- `POSTGRES_URL_NON_POOLING`

### Step 2: Update Prisma Schema for PostgreSQL

You need to change the database provider from SQLite to PostgreSQL:

**File: `prisma/schema.prisma`**

Change this:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

To this:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 3: Set Environment Variables on Vercel

Go to: **Settings → Environment Variables**

Add these variables:

#### 1. DATABASE_URL
- **Value**: Use the `POSTGRES_PRISMA_URL` that Vercel created (or copy from Storage tab)
- **Environments**: Production, Preview, Development (check all)

#### 2. NEXTAUTH_SECRET
Generate a secure secret:
```bash
openssl rand -base64 32
```
Copy the output and add it as `NEXTAUTH_SECRET`
- **Environments**: Production, Preview, Development (check all)

#### 3. NEXTAUTH_URL
- **Value**: Your Vercel deployment URL (e.g., `https://your-project.vercel.app`)
- **Environments**: Production only

For Preview and Development, you can use:
- Preview: `https://$VERCEL_URL` (Vercel will auto-replace this)
- Development: `http://localhost:3000`

### Step 4: Push Database Schema to Production

After setting up the database and environment variables:

1. **Update your local .env file** with the production DATABASE_URL temporarily:
   ```bash
   # Copy POSTGRES_PRISMA_URL from Vercel
   DATABASE_URL="postgresql://..."
   ```

2. **Push the schema to production database**:
   ```bash
   npx prisma db push
   ```

3. **Restore your local .env** back to SQLite for local development:
   ```bash
   DATABASE_URL="file:./dev.db"
   ```

### Step 5: Commit and Deploy

1. **Commit the Prisma schema change**:
   ```bash
   git add prisma/schema.prisma
   git commit -m "Update Prisma schema to use PostgreSQL for production"
   git push origin main
   ```

2. Vercel will automatically redeploy

### Step 6: Seed Production Database (Optional)

If you need initial data (categories, colleges, etc.):

1. **Temporarily set production DATABASE_URL in your local .env**
2. **Run seed scripts**:
   ```bash
   node scripts/seed-categories.mjs
   node scripts/seed-colleges.mjs
   ```
3. **Restore local .env**

## Alternative: Use Environment-Specific Database

If you want to keep SQLite for local development and PostgreSQL for production, you can use different connection strings:

**Local .env**:
```bash
DATABASE_URL="file:./dev.db"
```

**Vercel Environment Variables**:
```bash
DATABASE_URL="postgresql://..."
```

Prisma will use the appropriate database based on the environment.

## Verification Checklist

After completing the steps above, verify:

- [ ] Vercel Postgres database is created
- [ ] `DATABASE_URL` environment variable is set (using POSTGRES_PRISMA_URL)
- [ ] `NEXTAUTH_SECRET` environment variable is set (generated securely)
- [ ] `NEXTAUTH_URL` environment variable is set (your Vercel URL)
- [ ] Prisma schema updated to use PostgreSQL
- [ ] Database schema pushed to production (`npx prisma db push`)
- [ ] Changes committed and pushed to GitHub
- [ ] Vercel deployment completed successfully
- [ ] Test login/signup on your Vercel URL

## Common Issues

### Issue: "Environment variable not found: DATABASE_URL"
**Solution**: Make sure DATABASE_URL is set in Vercel environment variables and redeploy

### Issue: "Invalid connection string"
**Solution**: Use `POSTGRES_PRISMA_URL` from Vercel Storage, not `POSTGRES_URL`

### Issue: "Table does not exist"
**Solution**: Run `npx prisma db push` with production DATABASE_URL to create tables

### Issue: "NEXTAUTH_SECRET is not set"
**Solution**: Generate with `openssl rand -base64 32` and add to Vercel environment variables

### Issue: Still getting errors after setting variables
**Solution**: Trigger a new deployment (push a commit or click "Redeploy" in Vercel)

## Quick Setup Commands

```bash
# 1. Update Prisma schema (change sqlite to postgresql)
# Edit prisma/schema.prisma manually

# 2. Set production DATABASE_URL temporarily
# Copy POSTGRES_PRISMA_URL from Vercel and update .env

# 3. Push schema to production
npx prisma db push

# 4. Restore local .env
# Change DATABASE_URL back to "file:./dev.db"

# 5. Commit and push
git add prisma/schema.prisma
git commit -m "Update to PostgreSQL for production"
git push origin main
```

## Need Help?

If you're still experiencing issues:
1. Check Vercel deployment logs: Project → Deployments → Click latest → View Function Logs
2. Check Vercel runtime logs for specific error messages
3. Verify all environment variables are set correctly
4. Make sure the database schema was pushed successfully
