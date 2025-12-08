# Final Vercel Setup - Complete These Steps

## ✅ What's Done

1. ✅ Neon database created
2. ✅ Database schema pushed (all tables created)
3. ✅ Local .env restored to SQLite

## 🔧 What You Need to Do Now

### Step 1: Set Environment Variables in Vercel

Go to: https://vercel.com/dashboard → Your Project → **Settings** → **Environment Variables**

Add these 3 variables:

#### Variable 1: DATABASE_URL
- **Name**: `DATABASE_URL`
- **Value**: 
  ```
  postgresql://neondb_owner:npg_vuZNQE0li3Dy@ep-noisy-mud-adj28nwi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15
  ```
- **Environments**: Check **ALL** (Production, Preview, Development)
- Click **Save**

#### Variable 2: NEXTAUTH_SECRET
- **Name**: `NEXTAUTH_SECRET`
- **Value**: 
  ```
  iNDvWUle9F4A+8RFoL/KOcYONkH2CwlCyexr3IJH594=
  ```
- **Environments**: Check **ALL** (Production, Preview, Development)
- Click **Save**

#### Variable 3: NEXTAUTH_URL
- **Name**: `NEXTAUTH_URL`
- **Value**: Your Vercel deployment URL (e.g., `https://college-rental-platform.vercel.app`)
  - Find this in your Vercel dashboard under Deployments
- **Environments**: Check **ONLY Production**
- Click **Save**

### Step 2: Trigger Redeploy

After adding all environment variables, trigger a new deployment:

**Option A: Push a commit**
```bash
git commit --allow-empty -m "Trigger redeploy with Neon database"
git push origin main
```

**Option B: Use Vercel dashboard**
1. Go to **Deployments** tab
2. Click three dots on latest deployment
3. Click **Redeploy**

### Step 3: Wait for Deployment

Wait 2-3 minutes for the deployment to complete. Watch the Deployments tab.

### Step 4: Test Your App

1. **Test database connection first:**
   ```
   https://your-vercel-url.vercel.app/api/test-db
   ```
   Should show: `"status": "success"`

2. **Test signup:**
   - Go to your Vercel URL
   - Click **Register**
   - Fill in the form with a valid email
   - Submit
   - ✅ Should work now!

3. **Test login:**
   - Use the credentials you just registered
   - Should log in successfully

---

## Environment Variables Summary

Copy these exactly into Vercel:

```bash
# DATABASE_URL (for all environments)
postgresql://neondb_owner:npg_vuZNQE0li3Dy@ep-noisy-mud-adj28nwi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15

# NEXTAUTH_SECRET (for all environments)
iNDvWUle9F4A+8RFoL/KOcYONkH2CwlCyexr3IJH594=

# NEXTAUTH_URL (for production only)
https://your-actual-vercel-url.vercel.app
```

---

## Checklist

Before testing, verify:

- [ ] DATABASE_URL is set in Vercel environment variables
- [ ] NEXTAUTH_SECRET is set in Vercel environment variables
- [ ] NEXTAUTH_URL is set in Vercel environment variables (with your actual URL)
- [ ] All variables have correct environments checked
- [ ] Triggered a new deployment
- [ ] Deployment completed successfully (check Deployments tab)

---

## If Something Goes Wrong

### Check Vercel Function Logs

1. Go to Vercel → Deployments
2. Click latest deployment
3. Click **Functions** tab
4. Find `/api/auth/register`
5. Click **View Logs**
6. Look for error messages

### Common Issues

**"Environment variable not found: DATABASE_URL"**
→ DATABASE_URL not set. Go back to Step 1.

**"NEXTAUTH_SECRET is not set"**
→ NEXTAUTH_SECRET not set. Go back to Step 1.

**"Invalid connection string"**
→ Check DATABASE_URL is copied correctly with `connect_timeout=15` at the end.

**Still getting errors?**
→ Make sure you triggered a redeploy AFTER adding the environment variables.

---

## What's Next

After login/signup works:

1. **Seed categories** (optional):
   ```bash
   # Temporarily set DATABASE_URL to Neon in .env
   node scripts/seed-categories.mjs
   # Restore .env to SQLite
   ```

2. **Create admin user** (optional):
   ```bash
   # Temporarily set DATABASE_URL to Neon in .env
   node scripts/make-admin.mjs your-email@example.com
   # Restore .env to SQLite
   ```

3. **Test all features:**
   - User registration and login
   - Product browsing
   - Cart functionality
   - Owner application
   - Admin panel

---

## Important Notes

- ✅ Database tables are already created (we ran `prisma db push`)
- ✅ Your local development still uses SQLite (file:./dev.db)
- ✅ Production on Vercel uses Neon PostgreSQL
- ⚠️ Don't commit the Neon credentials to git (they're in .env which is gitignored)
- ⚠️ The NEXTAUTH_SECRET I generated is secure - use it in production

---

## Success Criteria

Your app is working when:
- ✅ `/api/test-db` returns success
- ✅ You can register a new user
- ✅ You can login with that user
- ✅ You can browse products
- ✅ No "Internal Server Error" messages

Good luck! 🚀
