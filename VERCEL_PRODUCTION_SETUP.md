# Vercel Production Setup - Step by Step

## ✅ Step 1: Add Environment Variables to Vercel

You already have the database! Now add these to Vercel:

### Go to Vercel Dashboard

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add these variables:

### Required Variables:

```env
# Database (Use POSTGRES_PRISMA_URL from your Vercel Postgres)
DATABASE_URL=your-POSTGRES_PRISMA_URL-here

# Auth (REQUIRED)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app

# Email (Optional but recommended)
RESEND_API_KEY=re_8nxfHZsf_7CEMddJDPGtJtGx1ofEuSTEK
```

### Important Notes:

- **DATABASE_URL**: Use the `POSTGRES_PRISMA_URL` value from your Vercel Postgres
- **NEXTAUTH_SECRET**: Generate with: `openssl rand -base64 32` or use any random string
- **NEXTAUTH_URL**: Replace with your actual Vercel domain

---

## ✅ Step 2: Run Database Migrations

Now we need to create the database tables. Run these commands locally:

### Option A: Using Your Vercel Database URL

```bash
# Set the DATABASE_URL temporarily
$env:DATABASE_URL="your-POSTGRES_PRISMA_URL-here"

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Option B: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy
```

---

## ✅ Step 3: Seed the Database

After migrations, add initial data:

### A. Seed Categories

```bash
# Make sure DATABASE_URL is set
node scripts/seed-categories.mjs
```

This creates:
- Electronics
- Books & Stationery
- Furniture & Decor
- Sports & Fitness
- Musical Instruments
- Clothing & Accessories
- Kitchen & Appliances
- Lab Equipment
- Tools & Hardware
- Other

### B. Seed Colleges

```bash
# For Mangalore colleges
node scripts/seed-mangalore-colleges.mjs

# OR for general colleges
node scripts/seed-colleges.mjs
```

---

## ✅ Step 4: Redeploy Your App

After adding environment variables:

1. Go to Vercel Dashboard
2. Click **Deployments**
3. Click the **...** menu on latest deployment
4. Click **Redeploy**

OR just push to GitHub (auto-deploys):

```bash
git add .
git commit -m "Update environment variables"
git push origin main
```

---

## ✅ Step 5: Create Test User & Products

1. Go to your Vercel site: `https://your-app.vercel.app`
2. Click **Register**
3. Create a test account:
   - Name: Test User
   - Email: test@example.com
   - College: Select from dropdown
   - Upload ID proof image
4. Login with your account
5. Go to **List Your Items** or **My Products** → **Add Product**
6. Create a few test products

Now your catalog should show products! 🎉

---

## Quick Setup Script

Create a file `setup-vercel-db.bat`:

```batch
@echo off
echo Setting up Vercel Production Database...
echo.

REM Set your Vercel Postgres URL here
set DATABASE_URL=your-POSTGRES_PRISMA_URL-here

echo Step 1: Running migrations...
npx prisma migrate deploy

echo.
echo Step 2: Generating Prisma Client...
npx prisma generate

echo.
echo Step 3: Seeding categories...
node scripts/seed-categories.mjs

echo.
echo Step 4: Seeding colleges...
node scripts/seed-mangalore-colleges.mjs

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to your Vercel site
echo 2. Register a new account
echo 3. Add some products
echo 4. Test the catalog
echo.
pause
```

Run with:
```bash
setup-vercel-db.bat
```

---

## Verification Checklist

After setup, verify these work:

- [ ] Home page loads
- [ ] Register page works
- [ ] Login works
- [ ] Catalog shows products (after adding some)
- [ ] Cart works
- [ ] Checkout works
- [ ] My Products shows your items
- [ ] Borrowed items page works
- [ ] Order status updates work
- [ ] Reviews work

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
- Check DATABASE_URL is correct
- Use `POSTGRES_PRISMA_URL` (not `POSTGRES_URL`)
- Ensure it includes `?pgbouncer=true&connect_timeout=15`

### Issue: "Table does not exist"

**Solution:**
- Run migrations: `npx prisma migrate deploy`
- Check Prisma schema is correct

### Issue: "No categories in dropdown"

**Solution:**
- Seed categories: `node scripts/seed-categories.mjs`
- Check DATABASE_URL is set correctly

### Issue: "No colleges in dropdown"

**Solution:**
- Seed colleges: `node scripts/seed-mangalore-colleges.mjs`

### Issue: "Login doesn't work"

**Solution:**
- Check NEXTAUTH_SECRET is set in Vercel
- Check NEXTAUTH_URL matches your domain
- Redeploy after adding env vars

---

## Environment Variables Summary

### In Vercel Dashboard:

```env
# Database
DATABASE_URL=your-POSTGRES_PRISMA_URL

# Auth
NEXTAUTH_SECRET=generated-secret-key
NEXTAUTH_URL=https://your-app.vercel.app

# Email (optional)
RESEND_API_KEY=re_8nxfHZsf_7CEMddJDPGtJtGx1ofEuSTEK

# OpenAI (optional)
OPENAI_API_KEY=sk-proj-...
```

### Which Database URL to Use?

From your Vercel Postgres, use:
- ✅ **POSTGRES_PRISMA_URL** - For Prisma (recommended)
- ❌ POSTGRES_URL - For direct connections (not for Prisma)
- ❌ DATABASE_URL - Generic (use POSTGRES_PRISMA_URL instead)

---

## Testing Production

### 1. Check Database Connection

```bash
# Set DATABASE_URL
$env:DATABASE_URL="your-POSTGRES_PRISMA_URL"

# Test connection
npx prisma db pull
```

### 2. Check Tables

```bash
# Open Prisma Studio
npx prisma studio
```

### 3. Check Data

```sql
-- In Prisma Studio or SQL editor
SELECT COUNT(*) FROM "Category";
SELECT COUNT(*) FROM "College";
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Product";
```

---

## Summary

**What you have:**
✅ Vercel Postgres database  
✅ Database credentials  
✅ App deployed on Vercel

**What you need to do:**
1. Add DATABASE_URL to Vercel (use POSTGRES_PRISMA_URL)
2. Add NEXTAUTH_SECRET and NEXTAUTH_URL
3. Run migrations locally
4. Seed categories and colleges
5. Redeploy app
6. Create test user and products

**Time required:** 10-15 minutes

After this, your production site will work perfectly! 🚀
