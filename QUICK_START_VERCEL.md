# Quick Start - Vercel Production

## 🚀 5-Minute Setup

### Step 1: Add Environment Variables to Vercel (2 min)

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these 3 variables:

```env
DATABASE_URL = your-POSTGRES_PRISMA_URL-from-vercel
NEXTAUTH_SECRET = any-random-string-here
NEXTAUTH_URL = https://your-app.vercel.app
```

**Where to find POSTGRES_PRISMA_URL?**
- It's in the list you shared (starts with `postgresql://`)
- Look for the one labeled `POSTGRES_PRISMA_URL`

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Or just use: `your-super-secret-key-change-in-production-123456`

---

### Step 2: Run Setup Script (3 min)

1. **Edit the setup script:**
   - Open `setup-vercel-production.bat`
   - Replace `REPLACE_WITH_YOUR_POSTGRES_PRISMA_URL` with your actual URL
   - Save the file

2. **Run the script:**
   ```bash
   setup-vercel-production.bat
   ```

This will:
- ✅ Create database tables
- ✅ Add categories
- ✅ Add colleges

---

### Step 3: Redeploy (1 min)

**Option A: Push to GitHub**
```bash
git add .
git commit -m "Configure production"
git push origin main
```

**Option B: Manual Redeploy**
- Go to Vercel Dashboard
- Click **Deployments**
- Click **...** → **Redeploy**

---

### Step 4: Test Your Site

1. Visit: `https://your-app.vercel.app`
2. Click **Register**
3. Create an account
4. Add a product
5. Check catalog - it should show your product! 🎉

---

## That's It!

Your production site is now fully functional! 🚀

---

## Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL in Vercel is correct
- Use POSTGRES_PRISMA_URL (not POSTGRES_URL)

### "No categories in dropdown"
- Run: `node scripts/seed-categories.mjs`

### "Login doesn't work"
- Check NEXTAUTH_SECRET is set in Vercel
- Check NEXTAUTH_URL matches your domain
- Redeploy after adding env vars

---

## Need Help?

See detailed guides:
- `VERCEL_PRODUCTION_SETUP.md` - Full setup guide
- `VERCEL_DATABASE_SETUP.md` - Database troubleshooting
- `PROJECT_TEST_REPORT.md` - Test results
