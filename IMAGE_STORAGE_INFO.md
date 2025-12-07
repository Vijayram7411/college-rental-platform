# Image Storage Information

## 📦 How Images Are Stored

Images are now stored **directly in the database** as base64-encoded strings.

---

## ✅ Advantages

### No External Dependencies:
- ✅ No need for Imgur or other services
- ✅ No API keys required
- ✅ No rate limits
- ✅ Works offline
- ✅ 100% reliable

### Simple & Fast:
- ✅ Instant upload (no network delay)
- ✅ No external API calls
- ✅ Images stored with product data
- ✅ Easy backup (just backup database)

### Privacy:
- ✅ Images stay on your server
- ✅ No third-party access
- ✅ Full control over data

---

## 📊 Technical Details

### Storage Format:
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...
```

### Database Field:
- **Field:** `images` (TEXT)
- **Format:** JSON array of base64 strings
- **Example:** `["data:image/jpeg;base64,...", "data:image/png;base64,..."]`

### File Size Limits:
- **Per Image:** 5MB recommended
- **Total:** No hard limit (database dependent)
- **SQLite:** Can handle large base64 strings

---

## 🎯 How It Works

### Upload Process:
1. User selects images from computer
2. Browser reads files
3. Files converted to base64
4. Base64 strings sent to API
5. Stored in database as JSON array
6. Retrieved and displayed as `<img src="data:image/..."/>`

### Display Process:
1. Fetch product from database
2. Parse `images` JSON field
3. Extract base64 strings
4. Display directly in `<img>` tags
5. Browser renders images instantly

---

## ⚠️ Considerations

### Database Size:
- Base64 encoding increases size by ~33%
- 1MB image → ~1.33MB in database
- Monitor database size for many products

### Performance:
- ✅ Fast for small-medium images (<2MB)
- ⚠️ Slower for very large images (>5MB)
- ✅ No network latency
- ✅ Instant display

### Recommendations:
1. **Compress images** before upload
2. **Keep under 2MB** per image for best performance
3. **Use JPG** for photos (smaller than PNG)
4. **Optimize images** with tools like TinyPNG

---

## 🔄 Migration to Cloud Storage (Optional)

If you want to use cloud storage later:

### Option 1: Cloudinary
```typescript
// Install: npm install cloudinary
const cloudinary = require('cloudinary').v2;

cloudinary.uploader.upload(file, (error, result) => {
  console.log(result.secure_url);
});
```

### Option 2: AWS S3
```typescript
// Install: npm install @aws-sdk/client-s3
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });
await s3.send(new PutObjectCommand({
  Bucket: "my-bucket",
  Key: "image.jpg",
  Body: file
}));
```

### Option 3: Vercel Blob
```typescript
// Install: npm install @vercel/blob
import { put } from '@vercel/blob';

const blob = await put('image.jpg', file, {
  access: 'public',
});
console.log(blob.url);
```

---

## 📈 Scaling Considerations

### For Small Projects (<100 products):
- ✅ Base64 in database works great
- ✅ Simple and reliable
- ✅ No additional costs

### For Medium Projects (100-1000 products):
- ⚠️ Consider cloud storage
- ⚠️ Database size may grow
- ✅ Still manageable with SQLite

### For Large Projects (>1000 products):
- ❌ Move to cloud storage (Cloudinary, S3)
- ❌ Use PostgreSQL instead of SQLite
- ❌ Implement CDN for faster delivery

---

## 🛠️ Optimization Tips

### Compress Images:
```bash
# Use online tools:
- TinyPNG: https://tinypng.com
- Squoosh: https://squoosh.app
- ImageOptim: https://imageoptim.com
```

### Resize Images:
```javascript
// Recommended dimensions:
- Thumbnail: 400x400px
- Product: 800x800px
- Detail: 1200x1200px
```

### Convert Format:
```
- Photos → JPG (smaller file size)
- Graphics → PNG (better quality)
- Modern browsers → WEBP (best compression)
```

---

## 🔍 Monitoring

### Check Database Size:
```bash
# SQLite
ls -lh dev.db

# Or in code
SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();
```

### Check Image Count:
```bash
node scripts/check-products.mjs
```

---

## ✅ Current Setup Summary

- **Storage:** Base64 in SQLite database
- **Max per image:** 5MB
- **Max images:** 10 per product
- **Format:** JPG, PNG, WEBP
- **Encoding:** Base64
- **Retrieval:** Direct from database
- **Display:** Native browser support

---

**This setup is perfect for development and small-to-medium projects!** 🎉

For production with many products, consider migrating to cloud storage.
