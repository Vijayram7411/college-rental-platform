# Diagnose Your Vercel Setup Issue

## Quick Diagnosis

The "Internal Server Error" during signup means one of these is missing:

### Check 1: Are Environment Variables Set?

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. You should see these 3 variables:
   - ✅ `DATABASE_URL`
   - ✅ `NEXTAUTH_SECRET`
   - ✅ `NEXTAUTH_URL`

**If any are missing, add them now!**

### Check 2: Did You Create the Database?

1. Go to **Storage** tab in your Vercel project
2. You should see a Postgres database listed
3. If not, create one:
   - Click **Create Database**
   - Choose **Postgres**
   - Click **Create**

### Check 3: Did You Push the Database Schema?

This is the most commonly missed step! You need to create the tables in your production database.

**Do this now:**

```bash
# 1. Copy your POSTGRES_PRISMA_URL from Vercel Storage tab
# It looks like: postgresql://user:pass@host/db?sslmode=require

# 2. Open .env file and TEMPORARILY replace DATABASE_URL with production URL
# Change from: DATABASE_URL="file:./dev.db"
# Change to: DATABASE_URL="postgresql://your-production-url-here"

# 3. Run this command to create all tables
npx prisma db push

# 4. You should see output like:
# ✔ Generated Prisma Client
# Your database is now in sync with your Prisma schema.

# 5. Change .env BACK to local SQLite
# DATABASE_URL="file:./dev.db"
```

### Check 4: Did You Redeploy After Adding Variables?

Environment variables only take effect after a new deployment.

**Trigger a redeploy:**

```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

Or in Vercel dashboard:
1. Go to **Deployments** tab
2. Click three dots on latest deployment
3. Click **Redeploy**

## Step-by-Step Fix (If Still Not Working)

### Step 1: Verify Database Exists

Go to Vercel → Your Project → **Storage** tab

**If no database exists:**
1. Click **Create Database**
2. Select **Postgres**
3. Name: `college-rental-db`
4. Click **Create**
5. Wait for it to finish (30 seconds)

### Step 2: Get Database Connection String

1. Click on your database in Storage tab
2. Scroll to **Connection String** section
3. Find **POSTGRES_PRISMA_URL**
4. Click **Copy** (the copy icon)
5. Save this somewhere - you'll need it twice

### Step 3: Set Environment Variables

Go to **Settings** → **Environment Variables**

**Add Variable 1:**
- Name: `DATABASE_URL`
- Value: Paste the POSTGRES_PRISMA_URL you copied
- Environments: Check **ALL** (Production, Preview, Development)
- Click **Save**

**Add Variable 2:**
- Name: `NEXTAUTH_SECRET`
- Value: Run this in your terminal and copy the output:
  ```bash
  openssl rand -base64 32
  ```
- Environments: Check **ALL**
- Click **Save**

**Add Variable 3:**
- Name: `NEXTAUTH_URL`
- Value: Your Vercel URL (e.g., `https://college-rental-platform-git-main-vijayram7411.vercel.app`)
- Environments: Check **ONLY Production**
- Click **Save**

### Step 4: Create Database Tables

**This is critical - the tables don't exist yet!**

1. Open `.env` file in your project
2. Find the line: `DATABASE_URL="file:./dev.db"`
3. Replace it with the POSTGRES_PRISMA_URL you copied earlier
4. Save the file
5. Open terminal in your project folder
6. Run:
   ```bash
   npx prisma db push
   ```
7. Wait for success message
8. **Important:** Change `.env` back to `DATABASE_URL="file:./dev.db"`
9. Save the file

### Step 5: Force Redeploy

```bash
git commit --allow-empty -m "Redeploy with database configured"
git push origin main
```

### Step 6: Wait and Test

1. Wait 2-3 minutes for deployment to complete
2. Go to your Vercel URL
3. Try to register a new user
4. Should work now!

## Still Getting Error?

### View the Actual Error Message

1. Go to Vercel dashboard
2. Click **Deployments**
3. Click your latest deployment
4. Click **Functions** tab
5. Find the `/api/auth/register` function
6. Click **View Logs**
7. Look for error messages

Common errors and fixes:

**"Environment variable not found: DATABASE_URL"**
→ Environment variable not set. Go back to Step 3.

**"Can't reach database server"**
→ Wrong DATABASE_URL. Make sure you used POSTGRES_PRISMA_URL, not POSTGRES_URL.

**"Table 'User' does not exist"**
→ Database tables not created. Go back to Step 4 and run `npx prisma db push`.

**"Invalid NEXTAUTH_SECRET"**
→ NEXTAUTH_SECRET not set or invalid. Generate a new one and add it.

## Verification Commands

Run these locally to verify your setup:

```bash
# Check if Prisma can connect to production database
# (After temporarily setting production DATABASE_URL in .env)
npx prisma db pull

# This should show your database schema
# If it fails, your DATABASE_URL is wrong
```

## Quick Checklist

Before testing again, verify:

- [ ] Vercel Postgres database exists (check Storage tab)
- [ ] DATABASE_URL is set in Vercel (check Settings → Environment Variables)
- [ ] NEXTAUTH_SECRET is set in Vercel
- [ ] NEXTAUTH_URL is set in Vercel
- [ ] All variables have "Production" environment checked
- [ ] Ran `npx prisma db push` with production DATABASE_URL
- [ ] Saw success message from prisma db push
- [ ] Triggered a new deployment after adding variables
- [ ] Waited for deployment to complete (check Deployments tab)

If all boxes are checked and it still doesn't work, check the Vercel function logs for the specific error message.
