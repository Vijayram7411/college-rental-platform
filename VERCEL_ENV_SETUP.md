# Vercel Environment Variables Setup Guide

## 🔗 Quick Links

### 1. Vercel Dashboard
**Main Dashboard:** https://vercel.com/dashboard

**Your Project Settings:**
1. Go to: https://vercel.com/dashboard
2. Click on: `college-rental-platform` (or your project name)
3. Click: **Settings** tab
4. Click: **Environment Variables** in left sidebar

### 2. Get Database URL (Vercel Postgres)
**Option A - If you already have Vercel Postgres:**
1. Go to: https://vercel.com/dashboard
2. Click **Storage** tab
3. Click your Postgres database
4. Copy the connection string from **Quickstart** section
5. Look for: `POSTGRES_URL` or `DATABASE_URL`

**Option B - Create New Vercel Postgres:**
1. Go to: https://vercel.com/dashboard/stores
2. Click **Create Database**
3. Select **Postgres**
4. Choose region (closest to your users)
5. Click **Create**
6. Copy the `POSTGRES_URL` connection string

**Alternative - Use Neon (Free PostgreSQL):**
1. Go to: https://neon.tech
2. Sign up/Login
3. Create new project
4. Copy connection string
5. Your connection string from .env:
   ```
   postgresql://neondb_owner:npg_vuZNQE0li3Dy@ep-noisy-mud-adj28nwi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15
   ```

### 3. Get OpenAI API Key
**Link:** https://platform.openai.com/api-keys

**Steps:**
1. Go to: https://platform.openai.com/api-keys
2. Sign in to your OpenAI account
3. Click **+ Create new secret key**
4. Name it: "College Rental Platform - Production"
5. Copy the key (starts with `sk-proj-...`)
6. **Important:** Save it immediately - you can't see it again!

**Note:** You need to add credits to your OpenAI account for the API to work.

---

## 📋 Environment Variables to Add

### Copy these exact values to Vercel:

### 1. DATABASE_URL
```
Name: DATABASE_URL
Value: [Get from Vercel Postgres or Neon - see links above]
Environment: ✅ Production ✅ Preview ✅ Development
```

**Example Value (Neon):**
```
postgresql://neondb_owner:npg_vuZNQE0li3Dy@ep-noisy-mud-adj28nwi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15
```

**Example Value (Vercel Postgres):**
```
postgres://default:xxxxx@ep-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb
```

---

### 2. AUTH_SECRET
```
Name: AUTH_SECRET
Value: HB2sqiNNQtTy4sxVtAI/HKBuwWV/11psm0Zx2w5+5zE=
Environment: ✅ Production ✅ Preview ✅ Development
```

**Generated for you:** `HB2sqiNNQtTy4sxVtAI/HKBuwWV/11psm0Zx2w5+5zE=`

---

### 3. NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://college-rental-platform.vercel.app
Environment: ✅ Production only
```

**How to get your Vercel URL:**
1. Go to your project in Vercel
2. Look at the **Domains** section
3. Copy your `.vercel.app` domain
4. Add `https://` before it

**Example:** `https://college-rental-platform-git-main-vijayram7411.vercel.app`

---

### 4. OPENAI_API_KEY
```
Name: OPENAI_API_KEY
Value: sk-proj-[your-key-here]
Environment: ✅ Production ✅ Preview ✅ Development
```

**Get from:** https://platform.openai.com/api-keys

---

### 5. RESEND_API_KEY (Optional - for emails)
```
Name: RESEND_API_KEY
Value: re_8nxfHZsf_7CEMddJDPGtJtGx1ofEuSTEK
Environment: ✅ Production ✅ Preview ✅ Development
```

**Your current key:** `re_8nxfHZsf_7CEMddJDPGtJtGx1ofEuSTEK`

---

## 🚀 Step-by-Step Setup

### Step 1: Open Vercel Settings
1. Go to: https://vercel.com/dashboard
2. Click your project: `college-rental-platform`
3. Click **Settings** tab
4. Click **Environment Variables**

### Step 2: Add Each Variable
For each variable above:

1. Click **Add New** button
2. Enter the **Name** (e.g., `DATABASE_URL`)
3. Enter the **Value** (copy from above)
4. Select environments:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. Click **Save**

### Step 3: Redeploy
After adding all variables:

1. Go to **Deployments** tab
2. Find the latest failed deployment
3. Click the three dots (...) menu
4. Click **Redeploy**
5. Wait 2-3 minutes for build to complete

---

## ✅ Checklist

Before redeploying, make sure you have:

- [ ] DATABASE_URL (from Vercel Postgres or Neon)
- [ ] AUTH_SECRET (use generated value above)
- [ ] NEXTAUTH_URL (your Vercel domain with https://)
- [ ] OPENAI_API_KEY (from OpenAI platform)
- [ ] RESEND_API_KEY (optional, for emails)

---

## 🔍 Troubleshooting

### "Missing OPENAI_API_KEY" error
- Make sure you added the key to Vercel
- Check it starts with `sk-proj-` or `sk-`
- Verify you selected all environments

### "Database connection failed"
- Check DATABASE_URL is correct
- For Neon: Make sure `?sslmode=require` is at the end
- For Vercel Postgres: Use the pooled connection string

### "Invalid AUTH_SECRET"
- Use the generated value: `HB2sqiNNQtTy4sxVtAI/HKBuwWV/11psm0Zx2w5+5zE=`
- Don't use the local dev value in production

### Build still failing?
- Check all variables are saved
- Make sure you clicked "Redeploy" after adding variables
- Check deployment logs for specific errors

---

## 📞 Need Help?

**Vercel Documentation:**
- Environment Variables: https://vercel.com/docs/projects/environment-variables
- Postgres: https://vercel.com/docs/storage/vercel-postgres

**OpenAI Documentation:**
- API Keys: https://platform.openai.com/docs/quickstart

**Neon Documentation:**
- Connection Strings: https://neon.tech/docs/connect/connect-from-any-app

---

## 🎯 Quick Copy-Paste Values

```bash
# AUTH_SECRET (Generated for you)
HB2sqiNNQtTy4sxVtAI/HKBuwWV/11psm0Zx2w5+5zE=

# RESEND_API_KEY (Your current key)
re_8nxfHZsf_7CEMddJDPGtJtGx1ofEuSTEK

# DATABASE_URL (Neon - from your .env)
postgresql://neondb_owner:npg_vuZNQE0li3Dy@ep-noisy-mud-adj28nwi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15
```

**Note:** You still need to get:
- Your OPENAI_API_KEY from: https://platform.openai.com/api-keys
- Your NEXTAUTH_URL from your Vercel project domains

---

## ✨ After Setup

Once all variables are added and deployment succeeds:

1. Your app will be live at: `https://your-project.vercel.app`
2. Test registration with ID verification
3. Check if database is working
4. Verify all features work

Good luck! 🚀
