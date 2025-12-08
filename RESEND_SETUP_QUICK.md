# Quick Resend Email Setup (5 Minutes)

## ✅ Code is Ready!

The email system is now integrated with Resend. Just follow these steps to activate it:

---

## Step 1: Get Your Resend API Key

1. **Go to [resend.com](https://resend.com)** and sign up (free, no credit card)

2. **After signup, click "API Keys"** in the left sidebar

3. **Click "Create API Key"** button

4. **Copy the key** - it starts with `re_` (example: `re_abc123xyz...`)

---

## Step 2: Add API Key Locally

Open your `.env` file and replace the placeholder:

```env
RESEND_API_KEY="re_your_actual_key_here"
```

**Save the file!**

---

## Step 3: Add API Key to Vercel (Production)

1. Go to [vercel.com](https://vercel.com) → Your Project

2. Click **Settings** → **Environment Variables**

3. Add new variable:
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_your_actual_key_here`
   - **Environments:** Check all (Production, Preview, Development)

4. Click **Save**

5. **Redeploy** your project (Vercel → Deployments → Click "..." → Redeploy)

---

## Step 4: Test It!

### Local Testing:
```bash
npm run dev
```

1. Sign up as two users from the same college
2. User A lists an item
3. User B borrows the item
4. Check your email inboxes! 📧

### Check if it's working:
- Look at your terminal - you should see: `✅ Email sent successfully to: user@example.com`
- Check spam folder if you don't see the email

---

## 🎉 That's It!

Your email notifications are now live! Both owners and borrowers will receive emails when orders are placed.

---

## Free Tier Limits

Resend free tier includes:
- ✅ **3,000 emails per month**
- ✅ **100 emails per day**
- ✅ No credit card required
- ✅ Perfect for testing and small deployments

For a college platform, this should be plenty to start!

---

## Troubleshooting

**Not receiving emails?**

1. **Check API key is correct:**
   - Should start with `re_`
   - No extra spaces or quotes

2. **Check environment variables:**
   - Local: `.env` file has `RESEND_API_KEY`
   - Vercel: Environment Variables section has it

3. **Check spam folder**

4. **Check server logs:**
   - Local: Terminal where `npm run dev` is running
   - Vercel: Deployments → Functions → Logs

5. **Verify email addresses:**
   - Make sure users have valid email addresses in their profiles

**Still not working?**
- Check Resend dashboard for delivery logs
- Look for error messages in console
- Make sure you redeployed after adding the environment variable

---

## Using Your Own Domain (Optional)

By default, emails come from `onboarding@resend.dev`. To use your own domain:

1. Go to Resend dashboard → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records they provide
5. Wait for verification (usually 5-10 minutes)
6. Update `src/lib/email.ts`:
   ```typescript
   from: 'College Rentals <noreply@yourdomain.com>',
   ```

This makes emails look more professional!

---

## Need Help?

- Resend Docs: https://resend.com/docs
- Check `EMAIL_SETUP.md` for more details
- Ask me for help!
