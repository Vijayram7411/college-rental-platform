# OpenAI ID Verification Setup

Your platform now automatically verifies that uploaded student IDs match the selected college using GPT-4o Vision!

## How It Works:

1. **Student signs up** → Selects college from dropdown
2. **Uploads student ID** → Front and back images
3. **AI analyzes ID** → GPT-4o Vision extracts college name from ID
4. **Automatic verification** → Compares extracted name with selected college
5. **Result**:
   - ✅ **Match** → Account created immediately
   - ❌ **Mismatch** → Error shown, signup blocked

## Setup Instructions:

### Step 1: Add API Key to Local .env

Open your `.env` file and replace the placeholder:

```bash
OPENAI_API_KEY="sk-proj-your-actual-api-key-here"
```

### Step 2: Add API Key to Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add new variable:
- **Key**: `OPENAI_API_KEY`
- **Value**: Your OpenAI API key (starts with `sk-proj-...`)
- **Environments**: Check ALL (Production, Preview, Development)
- Click **Save**

### Step 3: Redeploy

```bash
git commit --allow-empty -m "Trigger redeploy with OpenAI verification"
git push origin main
```

## Features:

### ✅ Smart Verification
- Handles different ID formats
- Recognizes college name variations
- Works with abbreviations (e.g., "MIT" vs "Massachusetts Institute of Technology")
- Understands context

### ✅ Confidence Levels
- **High confidence**: Clear match, auto-approved
- **Medium confidence**: Likely match, auto-approved
- **Low confidence**: Unclear image or mismatch, rejected

### ✅ Fail-Safe Design
- If OpenAI API is down → Allows signup (doesn't block users)
- If image is unclear → Shows helpful error message
- If verification fails → Clear explanation of why

## Cost:

- **Free tier**: $5 credit for 3 months (plenty for testing)
- **After free tier**: ~$0.01 per image
- **Per signup**: ~$0.02 (2 images: front + back)
- **Very affordable**: 500 signups = $10

## Example Verification Flow:

### Scenario 1: Correct College ✅
```
User selects: "Stanford University"
ID shows: "STANFORD UNIVERSITY"
Result: ✅ Match! Account created.
```

### Scenario 2: Wrong College ❌
```
User selects: "MIT"
ID shows: "Harvard University"
Result: ❌ Mismatch! Error: "The college name on your ID (Harvard University) 
does not match the selected college (MIT)."
```

### Scenario 3: Abbreviation ✅
```
User selects: "Massachusetts Institute of Technology"
ID shows: "MIT"
Result: ✅ Match! (AI recognizes MIT = Massachusetts Institute of Technology)
```

## Testing:

### Test Locally:
1. Add your OpenAI API key to `.env`
2. Run: `npm run dev`
3. Go to: http://localhost:3000/register
4. Try signing up with a student ID
5. Watch the verification in action!

### Test on Vercel:
1. Add API key to Vercel environment variables
2. Deploy the changes
3. Test signup on your Vercel URL

## Troubleshooting:

### "ID verification failed"
**Cause**: College name on ID doesn't match selected college
**Solution**: 
- Make sure you selected the correct college
- Upload a clear, readable ID image
- Ensure the ID shows your college name

### "Verification unavailable"
**Cause**: OpenAI API error or missing API key
**Solution**:
- Check that OPENAI_API_KEY is set correctly
- Verify API key is valid
- Check OpenAI API status

### "Image is unclear"
**Cause**: Poor image quality
**Solution**:
- Take a clearer photo
- Ensure good lighting
- Make sure text is readable
- Try a different angle

## Security:

✅ **API key is secure** - Never exposed to browser
✅ **Server-side only** - Verification happens on backend
✅ **Images not stored permanently** - Only used for verification
✅ **Privacy-focused** - AI only extracts college name, nothing else

## Benefits:

1. **Prevents fraud** - Students can't join wrong college
2. **Maintains isolation** - Ensures college marketplace integrity
3. **Automatic** - No manual admin review needed
4. **Fast** - Verification takes 2-3 seconds
5. **Accurate** - AI understands context and variations
6. **User-friendly** - Clear error messages if something's wrong

## What Happens After Verification:

✅ **Successful verification**:
- Account created immediately
- User can browse, rent, and list items
- Assigned to correct college
- Owner profile auto-created

❌ **Failed verification**:
- Signup blocked
- Clear error message shown
- User can try again with correct college or better image

---

Your platform now has enterprise-grade ID verification powered by AI! 🎉
