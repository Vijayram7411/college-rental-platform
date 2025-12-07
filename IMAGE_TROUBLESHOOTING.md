# Image Display Troubleshooting Guide

## 🖼️ Issue: Images Not Showing on Owner Products Page

### Quick Fixes:

## 1. Restart the Server

**Option A: Use the restart script**
```bash
# Double-click this file:
restart-server.bat
```

**Option B: Manual restart**
```bash
# Stop any running Next.js processes
# Press Ctrl+C in the terminal running npm run dev

# Then start again
npm run dev
```

**Option C: Kill port 3000 processes**
```bash
# Find processes on port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /F /PID <PID>

# Start server
npm run dev
```

---

## 2. Check Image URLs

Make sure your image URLs are:
- ✅ Publicly accessible
- ✅ Direct image links (not webpage links)
- ✅ Using HTTPS (recommended)

### Test Your Image URL:
1. Copy the image URL
2. Paste it in a new browser tab
3. If the image loads, the URL is good!

### Good Image URL Examples:
```
✅ https://i.imgur.com/abc123.jpg
✅ https://drive.google.com/uc?id=FILE_ID
✅ https://example.com/images/product.png
```

### Bad Image URL Examples:
```
❌ https://imgur.com/abc123 (webpage, not direct image)
❌ file:///C:/Users/... (local file path)
❌ Private Google Drive link without proper sharing
```

---

## 3. Upload Images to Imgur (Recommended)

### Step-by-Step:

1. **Go to Imgur**
   - Visit: https://imgur.com/upload

2. **Upload Your Image**
   - Click "New post"
   - Drag and drop your image
   - Or click "Browse" to select file

3. **Get Direct Link**
   - After upload, right-click the image
   - Select "Copy image address"
   - This gives you the direct link like: `https://i.imgur.com/abc123.jpg`

4. **Paste in Form**
   - Use this link in the "Product Images" field

---

## 4. Check Browser Console

1. Open your browser (Chrome/Edge/Firefox)
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Look for any errors related to images
5. Common errors:
   - CORS errors → Image host doesn't allow embedding
   - 404 errors → Image URL is broken
   - Mixed content → Using HTTP image on HTTPS site

---

## 5. Verify Next.js Config

The `next.config.ts` should have:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
```

This allows loading images from any domain.

---

## 6. Check if Products Exist

### Using Prisma Studio:
```bash
npx prisma studio
```

1. Open the `Product` table
2. Check if products exist
3. Look at the `images` field
4. It should contain a JSON array like: `["url1", "url2", "url3"]`

### Using SQLite:
```bash
sqlite3 dev.db
SELECT id, title, images FROM Product;
.quit
```

---

## 7. Test with Sample Product

Add a test product with known working images:

```javascript
// Sample image URLs that should work:
const testImages = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500"
];
```

Use these URLs when adding a product to test if images work.

---

## 8. Clear Browser Cache

Sometimes cached data causes issues:

1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page (`Ctrl + F5`)

---

## 9. Check Server Logs

Look at the terminal running `npm run dev`:

```bash
# Look for errors like:
❌ Error loading image
❌ Failed to fetch
❌ CORS policy error
```

If you see errors, they'll tell you what's wrong.

---

## 10. Alternative: Use Placeholder Images

If images still don't work, the page will show:
- 📦 Box emoji as placeholder
- Gray gradient background
- Product info still displays correctly

---

## 🔍 Common Issues & Solutions

### Issue: "Images not loading"
**Solution:** 
- Check if server is running on http://localhost:3000
- Verify image URLs are accessible
- Clear browser cache

### Issue: "Page shows 'No products yet'"
**Solution:**
- Make sure you're logged in as ADMIN or OWNER
- Add a product using the "Add Product" button
- Check database with `npx prisma studio`

### Issue: "Can't access /owner/products/add"
**Solution:**
- Make yourself admin: `node scripts/make-admin.mjs your-email@example.com`
- Or apply to become owner at `/owner/apply`
- Logout and login again

### Issue: "Images show broken icon"
**Solution:**
- Image URL is invalid or inaccessible
- Try uploading to Imgur and use that URL
- Test URL in browser first

---

## ✅ Quick Checklist

Before asking for help, verify:

- [ ] Server is running (`npm run dev`)
- [ ] You're logged in as ADMIN or OWNER
- [ ] Products exist in database
- [ ] Image URLs are publicly accessible
- [ ] Browser console shows no errors
- [ ] You've cleared browser cache
- [ ] Next.js config allows remote images

---

## 🆘 Still Not Working?

1. **Check the exact error message** in browser console
2. **Take a screenshot** of the issue
3. **Check server logs** in the terminal
4. **Verify database** has products with valid image URLs

---

## 📞 Quick Test

Visit: http://localhost:3000/owner/products

You should see:
- ✅ "Your Products" heading
- ✅ "+ ADD PRODUCT" button
- ✅ Product cards (if you've added products)
- ✅ Images loading (if URLs are valid)

If you see "No products yet", click "Add Your First Product" to add one!

---

**Need more help? Check the server logs or browser console for specific error messages!** 🚀
