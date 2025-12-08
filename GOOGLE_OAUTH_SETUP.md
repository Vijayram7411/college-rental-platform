# Google OAuth Setup Guide

I've added "Sign in with Google" to your login and register pages! Now you need to set up Google OAuth credentials.

## Step 1: Create Google OAuth Credentials

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create a New Project (or select existing)
- Click on the project dropdown at the top
- Click "New Project"
- Name it: "College Rental Platform"
- Click "Create"

### 3. Enable Google+ API
- In the left sidebar, go to "APIs & Services" → "Library"
- Search for "Google+ API"
- Click on it and click "Enable"

### 4. Configure OAuth Consent Screen
- Go to "APIs & Services" → "OAuth consent screen"
- Select "External" (unless you have a Google Workspace)
- Click "Create"

**Fill in the form:**
- App name: `College Rental Platform`
- User support email: Your email
- Developer contact email: Your email
- Click "Save and Continue"

**Scopes:**
- Click "Add or Remove Scopes"
- Select:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
- Click "Update" then "Save and Continue"

**Test users (for development):**
- Add your email address
- Click "Save and Continue"

### 5. Create OAuth 2.0 Credentials
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth client ID"
- Application type: "Web application"
- Name: "College Rental Platform Web"

**Authorized JavaScript origins:**
```
http://localhost:3000
https://college-rental-platform-3rxf.vercel.app
```
(Add your actual Vercel URL)

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://college-rental-platform-3rxf.vercel.app/api/auth/callback/google
```
(Add your actual Vercel URL)

- Click "Create"

### 6. Copy Your Credentials
You'll see a popup with:
- **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abc123xyz`)

**Copy both of these!**

---

## Step 2: Add Environment Variables

### Local Development (.env file)

Add these to your `.env` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

### Vercel Production

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these 2 new variables:

**Variable 1: GOOGLE_CLIENT_ID**
- Key: `GOOGLE_CLIENT_ID`
- Value: Your Client ID from Google Console
- Environments: Check ALL (Production, Preview, Development)
- Click Save

**Variable 2: GOOGLE_CLIENT_SECRET**
- Key: `GOOGLE_CLIENT_SECRET`
- Value: Your Client Secret from Google Console
- Environments: Check ALL (Production, Preview, Development)
- Click Save

---

## Step 3: Deploy

```bash
git add .
git commit -m "Add Google OAuth sign-in"
git push origin main
```

Wait for Vercel to deploy (2-3 minutes).

---

## Step 4: Test

### Test Locally:
1. Make sure you added the credentials to `.env`
2. Restart your dev server: `npm run dev`
3. Go to http://localhost:3000/login
4. Click "Continue with Google"
5. Sign in with your Google account
6. Should redirect back and log you in!

### Test on Vercel:
1. Go to your Vercel URL
2. Click Login
3. Click "Continue with Google"
4. Sign in with Google
5. Should work!

---

## How It Works

When a user signs in with Google:

1. **First time users:**
   - Account is automatically created
   - College is assigned based on email domain
   - User is logged in

2. **Returning users:**
   - Existing account is used
   - Logged in immediately

3. **College Assignment:**
   - Email domain is extracted (e.g., `@stanford.edu`)
   - College is found or created automatically
   - User is assigned to that college

---

## Features Added

✅ "Continue with Google" button on login page  
✅ "Continue with Google" button on register page  
✅ Automatic college assignment based on email domain  
✅ Works alongside existing email/password login  
✅ Google profile picture is saved  
✅ Seamless user experience  

---

## Troubleshooting

### "Error: redirect_uri_mismatch"
**Solution:** Make sure you added the correct redirect URI in Google Console:
```
https://your-vercel-url.vercel.app/api/auth/callback/google
```

### "Error: invalid_client"
**Solution:** Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set correctly in Vercel environment variables.

### Google button doesn't appear
**Solution:** Make sure you redeployed after adding the environment variables.

### User created but no college assigned
**Solution:** The email domain might not be recognized. Check that the user's email has a valid domain (e.g., @college.edu).

---

## Security Notes

- ✅ Client Secret is kept secure (never exposed to browser)
- ✅ OAuth flow is handled server-side by NextAuth
- ✅ User data is stored in your Neon database
- ✅ Google only provides email and profile info
- ⚠️ Never commit GOOGLE_CLIENT_SECRET to git (it's in .env which is gitignored)

---

## Summary

1. Create Google OAuth credentials in Google Cloud Console
2. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env and Vercel
3. Deploy the changes
4. Test Google sign-in on both local and production

Your users can now sign in with Google! 🎉
