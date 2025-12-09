# Vercel Database Setup Guide

## Issue: Pages Not Displaying Data

If your Vercel site shows empty pages for Catalog, Cart, Borrowed Items, etc., it means:
- ✅ The app is deployed successfully
- ❌ The database is empty or not connected properly

---

## Solution: Set Up Production Database

### Step 1: Check Your Database Connection

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Check if `DATABASE_URL` is set

**If DATABASE_URL is missing or wrong:**
- Your app can't connect to the database
- All pages will be empty

---

### Step 2: Set Up Neon PostgreSQL (Recommended)

#### A. Create Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create a new project
4. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

#### B. Add to Vercel

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Click "Save"
4. Redeploy your app

---

### Step 3: Run Database Migrations

After adding DATABASE_URL, you need to create the database tables:

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
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

#### Option B: Using Prisma Studio

```bash
# Set your production DATABASE_URL temporarily
$env:DATABASE_URL="postgresql://user:password@..."

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

---

### Step 4: Seed the Database

After migrations, add initial data:

#### A. Seed Categories

```bash
node scripts/seed-categories.mjs
```

This creates categories like:
- Electronics
- Books
- Furniture
- Sports Equipment
- etc.

#### B. Seed Colleges

```bash
node scripts/seed-colleges.mjs
```

Or for Mangalore colleges specifically:
```bash
node scripts/seed-mangalore-colleges.mjs
```

---

### Step 5: Create Test User

1. Go to your Vercel site
2. Click "Register"
3. Create a test account
4. Verify email (if email is set up)

---

### Step 6: Add Test Products

1. Login to your test account
2. Go to "List Your Items" or "My Products" → "Add Product"
3. Create a few test products

Now your catalog should display products!

---

## Quick Checklist

- [ ] DATABASE_URL is set in Vercel environment variables
- [ ] Database migrations have been run (`prisma migrate deploy`)
- [ ] Categories have been seeded
- [ ] Colleges have been seeded
- [ ] At least one user is registered
- [ ] At least one product is created
- [ ] App has been redeployed after adding DATABASE_URL

---

## Common Issues

### Issue 1: "Cannot connect to database"

**Solution:**
- Check DATABASE_URL format
- Ensure it includes `?sslmode=require` at the end
- Verify Neon database is active

### Issue 2: "Table does not exist"

**Solution:**
- Run migrations: `npx prisma migrate deploy`
- Check Prisma schema is correct

### Issue 3: "No products in catalog"

**Solution:**
- Seed categories first
- Seed colleges
- Create a user account
- Add products through the UI

### Issue 4: "Login doesn't work"

**Solution:**
- Check NEXTAUTH_SECRET is set in Vercel
- Check NEXTAUTH_URL matches your Vercel domain
- Example: `NEXTAUTH_URL=https://your-app.vercel.app`

---

## Environment Variables Checklist

Make sure these are set in Vercel:

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://...

# Auth (REQUIRED)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app

# Email (Optional - for notifications)
RESEND_API_KEY=re_8nxfHZsf_7CEMddJDPGtJtGx1ofEuSTEK

# OpenAI (Optional - if using AI features)
OPENAI_API_KEY=sk-proj-...
```

---

## Testing After Setup

1. **Home Page**: Should load ✅
2. **Register**: Create account ✅
3. **Login**: Sign in ✅
4. **Catalog**: Should show products (after adding some)
5. **Cart**: Should work
6. **My Products**: Should show your products
7. **Borrowed**: Should show your orders

---

## Database Schema

Your database should have these tables:
- User
- OwnerProfile
- College
- Category
- Product
- CartItem
- RentalOrder
- OrderItem
- Review
- Address

Check with:
```bash
npx prisma studio
```

---

## Need Help?

### Check Vercel Logs

1. Go to Vercel Dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. Check "Build Logs" and "Function Logs"

### Check Database

1. Go to Neon dashboard
2. Check if tables exist
3. Check if data exists
4. Run SQL queries to verify

### Common SQL Queries

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Count products
SELECT COUNT(*) FROM "Product";

-- Count users
SELECT COUNT(*) FROM "User";

-- Count categories
SELECT COUNT(*) FROM "Category";

-- Check colleges
SELECT * FROM "College";
```

---

## Quick Fix Script

Create a file `setup-production.sh`:

```bash
#!/bin/bash

echo "Setting up production database..."

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed categories
node scripts/seed-categories.mjs

# Seed colleges
node scripts/seed-mangalore-colleges.mjs

echo "Done! Now create a user account and add products."
```

Run with:
```bash
bash setup-production.sh
```

---

## Summary

**The issue is**: Your production database is empty or not connected.

**The solution**:
1. Set up Neon PostgreSQL
2. Add DATABASE_URL to Vercel
3. Run migrations
4. Seed initial data
5. Create test user
6. Add test products

After this, all pages should display correctly!

---

## Next Steps

1. Follow Step 1-6 above
2. Test each page
3. If still not working, check Vercel logs
4. Share error messages for further help

Your app code is fine - it just needs data! 🚀


---

## ✅ SETUP COMPLETED - December 9, 2024

### Production Database Status

**Database:** Neon PostgreSQL  
**Connection:** ✅ Connected  
**Schema:** ✅ Synced  
**Migrations:** ✅ Applied  

### Seeded Data

✅ **Categories** (8 total):
- Electronics, Books, Furniture, Sports
- Musical Instruments, Appliances, Clothing, Tools

✅ **Colleges** (12 total):
- National Institute of Technology Karnataka (NITK)
- St. Aloysius College
- NITTE University
- Manipal College of Dental Sciences (MCODS)
- Kasturba Medical College (KMC), Mangalore
- A. B. Shetty Memorial Institute of Dental Sciences
- Yenepoya University
- St Joseph Engineering College (SJEC)
- AJ Institute of Dental Sciences
- Srinivas Institute of Dental Sciences
- Sahyadri College of Engineering & Management
- (1 additional college)

✅ **Demo Products** (11 total):
- 5 products from MIT demo lender
- 6 products from Sahyadri demo lender
- All products include contact numbers for WhatsApp/Call

### Local Environment Restored

✅ `.env` restored to SQLite configuration  
✅ `prisma/schema.prisma` restored to SQLite provider  
✅ `prisma/migrations/migration_lock.toml` restored to SQLite  

### Next Steps

1. **Test the deployment:**
   - Visit: https://college-rental-platform-94zu.vercel.app
   - Check catalog page for products
   - Test registration and login

2. **If issues persist:**
   - Check Vercel deployment logs
   - Verify all environment variables are set
   - Check browser console for errors

3. **Create admin user:**
   - Use `scripts/make-admin.mjs` to promote a user to admin
   - First register a user on the site
   - Then run: `node scripts/make-admin.mjs <user-email>`
