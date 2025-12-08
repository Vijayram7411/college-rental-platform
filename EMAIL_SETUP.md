# Email Notifications Setup Guide

Email notifications are now implemented for rental orders! When a student borrows an item, both the owner and borrower receive email notifications.

## Current Status

✅ **Email system is ready** - Currently logs to console for testing
🔧 **Production setup needed** - Choose an email service provider below

## What Gets Sent

### 1. **Owner Notification Email**
When someone borrows their item, the owner receives:
- Borrower's name, email, and phone
- Item details (name, quantity, duration)
- Total rental amount
- Pickup point location
- Link to view order details

### 2. **Borrower Confirmation Email**
When placing an order, the borrower receives:
- Order confirmation
- Item details
- Owner's contact information
- Pickup point
- Link to view borrowed items

## Email Service Options

### Option 1: Resend (Recommended) ⭐

**Why Resend:**
- ✅ Free tier: 3,000 emails/month
- ✅ Easy setup (5 minutes)
- ✅ Great for Next.js
- ✅ No credit card required for free tier

**Setup Steps:**

1. **Sign up at [resend.com](https://resend.com)**

2. **Get your API key:**
   - Go to API Keys section
   - Create new API key
   - Copy the key (starts with `re_`)

3. **Install Resend:**
   ```bash
   npm install resend
   ```

4. **Add to `.env`:**
   ```env
   RESEND_API_KEY=re_your_api_key_here
   ```

5. **Add to Vercel Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `RESEND_API_KEY` = `re_your_api_key_here`

6. **Update `src/lib/email.ts`:**
   ```typescript
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);

   export async function sendEmail({ to, subject, html }: EmailOptions) {
     try {
       const { data, error } = await resend.emails.send({
         from: 'College Rentals <noreply@yourdomain.com>',
         to,
         subject,
         html,
       });

       if (error) {
         console.error('Email error:', error);
         return { success: false, error };
       }

       return { success: true, data };
     } catch (error) {
       console.error('Email send failed:', error);
       return { success: false, error };
     }
   }
   ```

7. **Verify domain (optional but recommended):**
   - Add your domain in Resend dashboard
   - Add DNS records they provide
   - Use `noreply@yourdomain.com` instead of default

---

### Option 2: SendGrid

**Why SendGrid:**
- ✅ Free tier: 100 emails/day
- ✅ Reliable and popular
- ✅ Good documentation

**Setup Steps:**

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API key
3. Install: `npm install @sendgrid/mail`
4. Add to `.env`: `SENDGRID_API_KEY=your_key`
5. Update email.ts with SendGrid code

---

### Option 3: Gmail SMTP (For Testing)

**Why Gmail:**
- ✅ Free
- ✅ Quick setup
- ⚠️ Limited to 500 emails/day
- ⚠️ Not recommended for production

**Setup Steps:**

1. Enable 2-factor authentication on Gmail
2. Generate App Password
3. Install: `npm install nodemailer`
4. Add to `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

---

## Testing Emails Locally

Currently, emails are logged to the console. To test:

1. **Place a test order:**
   - Sign up as two users from the same college
   - User A lists an item
   - User B borrows the item
   - Check the server console for email logs

2. **Check console output:**
   ```
   📧 Email Notification:
   To: owner@example.com
   Subject: 🎉 New Rental Order for iPhone 13
   Body: [HTML content]
   ```

## Production Checklist

Before going live:

- [ ] Choose email service (Resend recommended)
- [ ] Sign up and get API key
- [ ] Install email service package
- [ ] Update `src/lib/email.ts` with real implementation
- [ ] Add API key to `.env` and Vercel
- [ ] Test with real email addresses
- [ ] Verify domain (optional but professional)
- [ ] Set up email templates (already done!)
- [ ] Monitor email delivery rates

## Email Templates

The email templates are already created with:
- ✅ Professional design
- ✅ Mobile responsive
- ✅ Clear call-to-action buttons
- ✅ All order details included
- ✅ Contact information for both parties

## Troubleshooting

**Emails not sending?**
1. Check API key is correct
2. Verify environment variables are set
3. Check console for error messages
4. Ensure email service account is active

**Emails going to spam?**
1. Verify your domain with email service
2. Set up SPF and DKIM records
3. Use a professional "from" address
4. Avoid spam trigger words

## Cost Estimate

**Resend Free Tier:**
- 3,000 emails/month = FREE
- Enough for ~1,500 orders/month (2 emails per order)

**If you exceed free tier:**
- Resend: $20/month for 50,000 emails
- SendGrid: $15/month for 40,000 emails

## Next Steps

1. Choose Resend (recommended)
2. Follow setup steps above
3. Test with real email
4. Deploy to Vercel
5. Monitor email delivery

Need help? Check the email service documentation or ask for assistance!
