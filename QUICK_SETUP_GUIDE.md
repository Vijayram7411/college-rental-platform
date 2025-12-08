# Quick Setup Guide - Production Database

## You Have Vercel Postgres! ✅

I can see you have all the database credentials. Let's set it up in 5 minutes.

---

## Step 1: Add Environment Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

### Required Variables:

```env
DATABASE_URL=<your POSTGRES_PRISMA_URL>
```
**Important**: Use `POSTGRES_PRISMA_URL` value, NOT `POSTGRES_URL`

```env
NEXTAUTH_SECRET=<generate random string>
```
Generate with: `openssl rand -base64 32` or use any random 32+ character string

```env
NEXTAUTH_URL=https://your-app-name.vercel.app
```
Replace with your actual Vercel domain

```env
RESEND_API_KEY=re_8nxfHZsf_7CEMddJDPGtJtGx1ofEuSTEK
```

### Optional (if using):
```env
OPENAI_API_KEY=sk-proj-...
```

---

## Step 2: Run Database Migrations

Open your terminal and run these commands:

### Option A: Using the Setup Script (Easiest)

```bash
# Run the setup script
setup-production-db.bat

# When prompted, paste your POSTGRES_PRISMA_URL
```

### Option B: Manual Commands

```bash
# Set the DATABASE_URL temporarily
set DATABASE_URL=<your POSTGRES_PRISMA_URL>

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed categories
node scripts/seed-categories.mjs

# Seed colleges
node scripts/seed-mangalore-colleges.mjs
```

---

## Step 3: Redeploy on Vercel

After adding environment variables:

1. Go to Vercel Dashboard
2. Click **Deployments**
3. Click **...** on latest deployment
4. Click **Redeploy**

Or just push to GitHub (auto-deploys):
```bash
git add .
git commit -m "Update environment variables"
git push origin main
```

---

## Step 4: Create Test Data

1. Go to your Vercel site: `https://your-app.vercel.app`
2. Click **Register** and create an account
3. Login with your new account
4. Click **List Your Items** or **My Products** → **Add Product**
5. Create a few test products

---

## Step 5: Verify Everything Works

Visit these pages on your Vercel site:

- ✅ **Home** - Should load
- ✅ **Catalog** - Should show products (after adding some)
- ✅ **Cart** - Should work
- ✅ **My Products** - Should show your products
- ✅ **Borrowed** - Should show your orders

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Check**:
1. DATABASE_URL is set in Vercel
2. Using POSTGRES_PRISMA_URL (not POSTGRES_URL)
3. Redeployed after adding env vars

### Issue: "Table does not exist"

**Solution**:
```bash
# Run migrations again
set DATABASE_URL=<your POSTGRES_PRISMA_URL>
npx prisma migrate deploy
```

### Issue: "No products in catalog"

**Solution**:
1. Check categories are seeded: `node scripts/seed-categories.mjs`
2. Check colleges are seeded: `node scripts/seed-mangalore-colleges.mjs`
3. Create a user account
4. Add products through the UI

---

## Quick Checklist

- [ ] Added DATABASE_URL to Vercel (use POSTGRES_PRISMA_URL)
- [ ] Added NEXTAUTH_SECRET to Vercel
- [ ] Added NEXTAUTH_URL to Vercel
- [ ] Added RESEND_API_KEY to Vercel
- [ ] Ran `npx prisma migrate deploy`
- [ ] Ran `node scripts/seed-categories.mjs`
- [ ] Ran `node scripts/seed-mangalore-colleges.mjs`
- [ ] Redeployed on Vercel
- [ ] Created test user account
- [ ] Added test products
- [ ] Verified catalog shows products

---

## Database Connection Strings Explained

You have multiple connection strings. Here's which to use:

| Variable | Use For |
|----------|---------|
| `POSTGRES_PRISMA_URL` | ✅ **Use this for DATABASE_URL** |
| `POSTGRES_URL` | ❌ Don't use (connection pooling issues) |
| `DATABASE_URL` | ❌ Don't use (generic) |
| `DATABASE_URL_UNPOOLED` | ❌ Don't use (no pooling) |

**Always use `POSTGRES_PRISMA_URL` for Prisma!**

---

## Expected Results

After setup:

1. **Database Tables Created**: 11 tables
   - User, OwnerProfile, College, Category, Product, CartItem, RentalOrder, OrderItem, Review, Address, Account

2. **Initial Data Seeded**:
   - 10+ categories (Electronics, Books, etc.)
   - 5+ colleges (Mangalore colleges)

3. **App Working**:
   - Registration works
   - Login works
   - Can add products
   - Catalog shows products
   - Cart works
   - Orders work

---

## Need Help?

### Check Vercel Logs

1. Vercel Dashboard → Your Project
2. Click **Deployments**
3. Click latest deployment
4. Check **Function Logs**

### Check Database

1. Vercel Dashboard → Storage → Your Database
2. Click **Query**
3. Run: `SELECT * FROM "Category";`
4. Should show categories

### Still Not Working?

Check:
1. All environment variables are set
2. Redeployed after adding env vars
3. Migrations ran successfully
4. Categories and colleges are seeded
5. Created a user account
6. Added at least one product

---

## Summary

**What you need to do**:
1. Add 4 environment variables to Vercel
2. Run migrations locally (connects to production DB)
3. Seed categories and colleges
4. Redeploy
5. Create user and add products

**Time required**: 5-10 minutes

**Result**: Fully working production site! 🚀

---

## Next Steps After Setup

Once everything is working:

1. **Optional**: Set up Cloudinary for image optimization
2. **Optional**: Configure email notifications
3. **Optional**: Add more colleges
4. **Optional**: Customize categories

See other guides for details!
