# Fix Internal Server Error - Do These Steps NOW

## The Problem
You're getting "Internal Server Error" because either:
1. Environment variables aren't set in Vercel, OR
2. Database tables don't exist yet

## Test First - Find the Exact Problem

After the deployment finishes (wait 2 minutes), visit this URL:
```
https://your-vercel-url.vercel.app/api/test-db
```

Replace `your-vercel-url` with your actual Vercel URL.

### What You'll See:

**If you see: "Environment variable not found: DATABASE_URL"**
→ Go to Solution A below

**If you see: "Table 'User' does not exist"**
→ Go to Solution B below

**If you see: "Database connection successful"**
→ Go to Solution C below

---

## Solution A: Environment Variables Not Set

### Do This:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add these 3 variables:**

#### Variable 1: DATABASE_URL
- Click **Add New**
- Name: `DATABASE_URL`
- Value: Go to **Storage** tab → Click your database → Copy **POSTGRES_PRISMA_URL**
- Environments: Check **ALL** boxes
- Click **Save**

#### Variable 2: NEXTAUTH_SECRET
- Click **Add New**
- Name: `NEXTAUTH_SECRET`
- Value: Open terminal and run:
  ```bash
  openssl rand -base64 32
  ```
  Copy the output and paste here
- Environments: Check **ALL** boxes
- Click **Save**

#### Variable 3: NEXTAUTH_URL
- Click **Add New**
- Name: `NEXTAUTH_URL`
- Value: Your Vercel URL (e.g., `https://college-rental-platform.vercel.app`)
- Environments: Check **ONLY Production**
- Click **Save**

5. **Redeploy:**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

6. **Wait 2 minutes, then test signup again**

---

## Solution B: Database Tables Don't Exist

### Do This:

1. **Get your production DATABASE_URL:**
   - Go to Vercel → Storage tab
   - Click your database
   - Copy **POSTGRES_PRISMA_URL**

2. **Open `.env` file in your project**

3. **Temporarily replace DATABASE_URL:**
   ```bash
   # Change from:
   DATABASE_URL="file:./dev.db"
   
   # Change to (paste your POSTGRES_PRISMA_URL):
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
   ```

4. **Open terminal in your project folder and run:**
   ```bash
   npx prisma db push
   ```

5. **Wait for success message:**
   ```
   ✔ Generated Prisma Client
   Your database is now in sync with your Prisma schema.
   ```

6. **Change `.env` back to local:**
   ```bash
   DATABASE_URL="file:./dev.db"
   ```

7. **Test signup again** (no need to redeploy)

---

## Solution C: Database Works But Signup Still Fails

If the test endpoint shows "Database connection successful" but signup still fails:

1. **Check Vercel Function Logs:**
   - Go to Vercel → Deployments
   - Click latest deployment
   - Click **Functions** tab
   - Find `/api/auth/register`
   - Click **View Logs**
   - Look for the actual error message

2. **Common issues:**
   - **"NEXTAUTH_SECRET is not set"** → Add NEXTAUTH_SECRET environment variable
   - **"Invalid connection string"** → Use POSTGRES_PRISMA_URL, not POSTGRES_URL
   - **"Cannot find module"** → Redeploy to rebuild with new dependencies

---

## Quick Verification Checklist

Before testing signup, verify:

- [ ] Vercel Postgres database exists (check Storage tab)
- [ ] DATABASE_URL environment variable is set (check Settings)
- [ ] NEXTAUTH_SECRET environment variable is set
- [ ] NEXTAUTH_URL environment variable is set
- [ ] All variables have "Production" checked
- [ ] Ran `npx prisma db push` successfully
- [ ] Latest deployment is complete (check Deployments tab)

---

## Test Your Fix

1. **Visit test endpoint first:**
   ```
   https://your-app.vercel.app/api/test-db
   ```
   Should show: `"status": "success"`

2. **Try signup:**
   - Go to your Vercel URL
   - Click Register
   - Fill in the form
   - Submit

3. **If it works:**
   - ✅ You should see "Registration successful" or be redirected
   - ✅ Try logging in with the same credentials

4. **If it still fails:**
   - Check Vercel function logs (see Solution C above)
   - Share the error message from the logs

---

## Most Common Mistake

**Not running `npx prisma db push`!**

The database exists, but it's empty. You MUST run this command to create the tables. This is the #1 reason for "Internal Server Error" during signup.

---

## Need More Help?

1. Visit the test endpoint: `/api/test-db`
2. Check what error it shows
3. Check Vercel function logs for `/api/auth/register`
4. Share the specific error message

The error message will tell us exactly what's wrong!
