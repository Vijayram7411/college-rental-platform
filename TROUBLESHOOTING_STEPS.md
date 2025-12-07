# Troubleshooting Steps

## Issue: Catalog shows products without images, Product detail shows "Product unavailable"

### Step 1: Verify Products in Database
```bash
node scripts/check-image-status.mjs
```
**Expected**: Should show 2 products (iPhone with base64 images, Laptop with Google Drive links)

### Step 2: Restart Dev Server
The dev server is currently running on port 3000 (PID 10556).

**Option A: Use the restart script**
```bash
restart-server.bat
```

**Option B: Manual restart**
1. Press `Ctrl+C` in the terminal running `npm run dev`
2. Wait for it to stop
3. Run `npm run dev` again

### Step 3: Clear Browser Cache
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

OR

1. Press `Ctrl+Shift+Delete`
2. Clear cached images and files
3. Refresh the page

### Step 4: Test the Pages

#### Test Catalog
```
URL: http://localhost:3000/catalog
```
**Expected**:
- Page loads successfully
- Shows 2 products
- iPhone has images
- Laptop shows 📦 icon

#### Test iPhone Product Detail
```
URL: http://localhost:3000/products/cmivt0p5a0001r9sj8ia2kxcm
```
**Expected**:
- Page loads successfully
- Shows 3 images in gallery
- Can click thumbnails to change image
- Shows full product details

#### Test Laptop Product Detail
```
URL: http://localhost:3000/products/cmivrhs7x0004g4owvagrjjfw
```
**Expected**:
- Page loads successfully
- Shows 📦 icon (no images)
- Shows full product details

### Step 5: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any errors (red text)
4. Share the error messages if any

### Step 6: Check Server Terminal
Look at the terminal running `npm run dev`:
- Any compilation errors?
- Any runtime errors?
- Share the error messages if any

## Common Issues

### Issue: "Product unavailable" error
**Cause**: Product doesn't exist or server error
**Solution**: 
1. Verify product exists: `node scripts/check-products.mjs`
2. Check server terminal for errors
3. Restart dev server

### Issue: Images not showing
**Cause**: 
- Google Drive links (not direct image URLs)
- Browser caching old version
- Image parsing error

**Solution**:
1. Check image type: `node scripts/check-image-status.mjs`
2. Clear browser cache
3. For Google Drive links: Delete and re-upload with actual files

### Issue: Page shows old version
**Cause**: Browser cache or Next.js cache
**Solution**:
1. Hard refresh: `Ctrl+Shift+R` or `Ctrl+F5`
2. Clear browser cache
3. Restart dev server
4. Delete `.next` folder and restart: `rmdir /s /q .next & npm run dev`

## Quick Fixes

### Delete Laptop Product (has broken images)
```bash
node scripts/delete-product.mjs cmivrhs7x0004g4owvagrjjfw
```

### Re-upload Laptop with Real Images
1. Go to: http://localhost:3000/owner/products/add
2. Upload 3+ actual image files (JPG, PNG, WEBP)
3. Fill in details
4. Submit

### Check All Products
```bash
node scripts/check-products.mjs
```

### Check Image Status
```bash
node scripts/check-image-status.mjs
```

## If Nothing Works

### Nuclear Option: Full Reset
```bash
# Stop dev server (Ctrl+C)

# Delete Next.js cache
rmdir /s /q .next

# Delete node_modules (if needed)
rmdir /s /q node_modules
npm install

# Restart dev server
npm run dev
```

Then:
1. Clear browser cache completely
2. Close and reopen browser
3. Visit the pages again

## Need More Help?

Share these details:
1. Output of: `node scripts/check-image-status.mjs`
2. Browser console errors (F12 → Console tab)
3. Server terminal errors
4. Which page is not working (catalog or product detail)
5. Which product ID you're trying to view
