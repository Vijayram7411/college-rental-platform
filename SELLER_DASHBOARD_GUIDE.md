# Seller Dashboard Guide

## 🎯 Overview

The Seller Dashboard allows **ADMIN** and **OWNER** users to add and manage rental products on the platform.

## 🔐 Access Requirements

### Who Can Add Products?
- ✅ **ADMIN** users (full access)
- ✅ **OWNER** users (approved sellers)
- ❌ Regular **USER** accounts (cannot add products)

### How to Become an Owner?
1. Register as a regular user
2. Go to `/owner/apply`
3. Fill in the application form:
   - Phone number
   - College name
   - Document URL (ID verification)
4. Wait for admin approval
5. Once approved, you become an OWNER

### How to Become an Admin?
Run this command (replace with your email):
```bash
node scripts/make-admin.mjs your-email@example.com
```

---

## 📦 Adding Products

### Access the Add Product Page
1. Login as ADMIN or OWNER
2. Go to **Owner Products** in the header menu
3. Click **"+ ADD PRODUCT"** button
4. Or directly visit: `http://localhost:3000/owner/products/add`

### Product Form Fields

#### 1. **Product Title** (Required)
- Clear, descriptive name
- Example: "iPhone 13 Pro Max 256GB"

#### 2. **Description** (Required)
- Detailed product information
- Condition, features, specifications
- Any terms or conditions

#### 3. **Category** (Required)
Choose from 8 categories:
- 📱 Electronics
- 📚 Books
- 🛋️ Furniture
- ⚽ Sports
- 🎸 Musical Instruments
- 🔌 Appliances
- 👕 Clothing
- 🔧 Tools

#### 4. **Rental Price per Month** (Required)
- Base monthly rental price in ₹
- Example: 500

#### 5. **Original Price** (Optional)
- Show discount if higher than rental price
- Example: 800 (shows 37% OFF)

#### 6. **Minimum Rental Days** (Required)
- Shortest rental period allowed
- Default: 1 day

#### 7. **Maximum Rental Days** (Required)
- Longest rental period allowed
- Default: 30 days

#### 8. **Product Images** (Required - Minimum 3)
- At least 3 image URLs required
- Can add more images (unlimited)
- First image used as thumbnail if not specified

**How to Upload Images:**
1. **Imgur** (Recommended):
   - Go to https://imgur.com/upload
   - Upload your image
   - Copy the direct link
   - Example: `https://i.imgur.com/abc123.jpg`

2. **Google Drive**:
   - Upload to Drive
   - Right-click → Get link
   - Set to "Anyone with link can view"
   - Copy the link

3. **Other Services**:
   - Dropbox
   - OneDrive
   - Any image hosting with public URLs

#### 9. **Thumbnail URL** (Optional)
- Leave empty to use first image
- Or specify a different thumbnail

---

## 🎨 Features

### ✅ What's Included:

1. **Category Selection** - Visual category picker with icons
2. **Pricing Options** - Base price + optional original price for discounts
3. **Rental Duration** - Set min/max rental days
4. **Multiple Images** - Minimum 3, can add unlimited
5. **Image Preview** - See how products will look
6. **Validation** - Form validates all required fields
7. **Error Handling** - Clear error messages
8. **Flipkart Design** - Matches platform UI

### 🎯 Product Display:

Products show:
- Product image
- Title
- Category badge
- Price per month
- Discount percentage (if applicable)
- Active/Inactive status

---

## 🔒 Security & Permissions

### API Endpoint: `/api/owner/products`

**POST** - Add new product
- Requires authentication
- Only ADMIN and OWNER roles allowed
- Validates all fields
- Creates category if doesn't exist
- Stores images as JSON array

**GET** - List user's products
- Returns only products owned by logged-in user
- Includes category information

---

## 📱 User Flow

### For Admins:
1. Login as ADMIN
2. Go to Owner Products
3. Click "Add Product"
4. Fill form and submit
5. Product appears in catalog immediately

### For Owners:
1. Apply to become owner (`/owner/apply`)
2. Wait for admin approval
3. Once approved, access Owner Products
4. Add products same as admin

### For Regular Users:
- Cannot access add product page
- Must apply to become owner first
- Or admin can manually upgrade their role

---

## 🎯 Next Steps

### Recommended Enhancements:

1. **File Upload** - Direct image upload instead of URLs
2. **Product Editing** - Edit existing products
3. **Product Deletion** - Remove products
4. **Bulk Upload** - Add multiple products at once
5. **Image Gallery** - Better image management
6. **Stock Management** - Track available quantity
7. **Product Analytics** - Views, rentals, revenue

---

## 🐛 Troubleshooting

### "Unauthorized" Error
- Make sure you're logged in
- Check if you're ADMIN or OWNER role
- Run: `node scripts/make-admin.mjs your-email@example.com`

### "At least 3 images required"
- Fill in at least 3 image URL fields
- Make sure URLs are valid and accessible

### Category Not Showing
- Categories are auto-created if they don't exist
- Check database with: `npx prisma studio`

### Images Not Loading
- Verify image URLs are publicly accessible
- Use direct image links (not webpage links)
- Test URL in browser first

---

## 📊 Database Schema

Products are stored with:
```typescript
{
  id: string
  title: string
  description: string
  categoryId: string
  basePricePerMonth: number
  originalPricePerMonth: number | null
  thumbnailUrl: string
  images: string (JSON array)
  ownerId: string
  isActive: boolean
  rating: number | null
  ratingCount: number | null
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## 🚀 Quick Start

```bash
# 1. Make yourself admin
node scripts/make-admin.mjs your-email@example.com

# 2. Start server
npm run dev

# 3. Login and go to
http://localhost:3000/owner/products/add

# 4. Fill form and add product!
```

---

**Happy Selling! 🎉**
