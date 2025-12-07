# Debug Images Not Showing

## Step 1: Check if products exist in database

Run this command:
```bash
node scripts/check-products.mjs
```

This will show you:
- How many products exist
- Their image URLs
- If images are stored correctly

---

## Step 2: Check browser console

1. Open the page: http://localhost:3000/owner/products
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for errors

Common errors:
- `Failed to load resource` - Image URL is broken
- `CORS error` - Image host blocks embedding
- `Mixed content` - HTTP image on HTTPS site

---

## Step 3: Test image URLs directly

1. Copy an image URL from your product
2. Paste it in a new browser tab
3. If it doesn't load → URL is broken

---

## Step 4: Check the Debug Info

On the product card, click "Debug Info" to see:
- Thumbnail URL
- Number of images
- If there's an image error

---

## Step 5: Verify Next.js config

Check `next.config.ts` has:
```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**",
    },
  ],
}
```

---

## Step 6: Use working test images

When adding a product, use these URLs (guaranteed to work):

```
https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500
https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500
https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500
```

---

## Step 7: Clear everything and restart

```bash
# Stop server (Ctrl+C)

# Clear Next.js cache
rmdir /s /q .next

# Restart
npm run dev
```

---

## What the new ProductCard component does:

✅ Better error handling
✅ Shows placeholder if image fails
✅ Lazy loading for performance
✅ Debug info in development mode
✅ Safer JSON parsing

---

## Quick Test:

1. Make sure server is running
2. Go to: http://localhost:3000/owner/products/add
3. Add a product with the test URLs above
4. Go to: http://localhost:3000/owner/products
5. You should see the product with images!

If you still see 📦 box:
- Click "Debug Info" on the card
- Check what it says
- Share that info for more help

---

## Still not working?

Run these commands and share the output:

```bash
# Check products
node scripts/check-products.mjs

# Check if server is running
netstat -ano | findstr :3000
```

Then check browser console (F12) for errors!
