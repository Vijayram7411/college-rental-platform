# Role Selection Feature - BORROWER vs LENDER

## Overview

After signup/login, users now choose between two roles:
- **BORROWER** - Rent items from others
- **LENDER** - List items and earn money

---

## User Flow

### 1. Registration
1. User fills registration form (with Aadhaar & photo)
2. Account created with role = "USER"
3. Auto-login and redirect to `/select-role`

### 2. Role Selection
User sees two options:

**BORROW** 🛒
- Browse available products
- Rent items at affordable prices
- Save money on purchases
- Rate and review products

**LEND** 💼
- List unlimited products
- Earn passive income
- Manage your listings easily
- Track orders and earnings

### 3. After Selection
- **BORROWER** → Redirected to `/catalog`
- **LENDER** → Redirected to `/owner/products`

---

## Features by Role

### BORROWER Features:
- ✅ Browse catalog
- ✅ Search & filter products
- ✅ Add to cart
- ✅ Checkout & rent items
- ✅ View borrowed items
- ✅ Track orders
- ✅ Submit reviews
- ❌ Cannot list products
- ❌ Cannot see seller dashboard

### LENDER Features:
- ✅ Browse catalog (can rent from others)
- ✅ List products
- ✅ Manage products (add/edit/delete)
- ✅ View orders for their products
- ✅ Mark items as returned
- ✅ Track earnings
- ❌ No cart (lenders don't borrow)
- ❌ No borrowed items page

---

## Navigation Changes

### Header Navigation

**BORROWER sees:**
- Catalog
- Cart
- My Rentals
- Profile

**LENDER sees:**
- Catalog
- My Products
- My Orders
- Profile

### Floating Action Button (FAB)

**BORROWER sees:**
- Browse Catalog
- View Cart

**LENDER sees:**
- List Item
- Browse Catalog

---

## Database Changes

### User Model
```prisma
model User {
  role String @default("USER")
  // Can be: "USER", "BORROWER", "LENDER", "ADMIN"
}
```

### Role Values:
- **USER** - Just registered, needs to select role
- **BORROWER** - Can only rent items
- **LENDER** - Can list and rent items
- **ADMIN** - Full access

---

## API Endpoints

### POST /api/user/select-role
**Request:**
```json
{
  "role": "BORROWER" | "LENDER"
}
```

**Response:**
```json
{
  "message": "Role updated successfully",
  "role": "BORROWER"
}
```

**Actions:**
1. Updates user.role in database
2. If LENDER, creates OwnerProfile
3. Returns success

---

## Files Created/Modified

### New Files:
1. **src/app/select-role/page.tsx**
   - Role selection UI
   - Two big buttons (BORROW vs LEND)
   - Beautiful gradient design

2. **src/app/api/user/select-role/route.ts**
   - API to update user role
   - Creates OwnerProfile for LENDER

### Modified Files:
3. **src/app/register/page.tsx**
   - Redirects to `/select-role` after signup

4. **src/app/api/auth/register/route.ts**
   - Sets role = "USER" (not "OWNER")
   - Doesn't create OwnerProfile automatically

5. **src/app/page.tsx**
   - Redirects to `/select-role` if role = "USER"

6. **src/components/main-header.tsx**
   - Different navigation for BORROWER vs LENDER
   - Shows role-specific menu items

7. **src/components/floating-action-button.tsx**
   - Different actions for BORROWER vs LENDER

---

## User Experience

### First Time User:
1. **Register** → Fill form with Aadhaar & photo
2. **Auto-login** → Redirected to role selection
3. **Choose role** → BORROW or LEND
4. **Start using** → Redirected to appropriate page

### Returning User:
- Login → Goes to home page
- Navigation shows role-specific options
- Can switch role from profile (future feature)

---

## Role Switching (Future)

Users can switch roles from profile settings:
- BORROWER → LENDER (creates OwnerProfile)
- LENDER → BORROWER (keeps OwnerProfile)

**Note:** Not implemented yet, but database supports it.

---

## Security & Validation

### Role Validation:
- Only "BORROWER" or "LENDER" accepted
- Must be logged in to select role
- Role stored in database and session

### Access Control:
- BORROWER cannot access `/owner/*` routes
- LENDER can access both borrower and lender features
- Middleware checks role before allowing access

---

## Testing

### Test BORROWER Flow:
1. Register new account
2. Choose "BORROW"
3. Verify redirected to catalog
4. Check navigation shows: Catalog, Cart, My Rentals
5. Try adding item to cart
6. Complete checkout
7. View borrowed items

### Test LENDER Flow:
1. Register new account
2. Choose "LEND"
3. Verify redirected to My Products
4. Check navigation shows: Catalog, My Products, My Orders
5. Try listing a product
6. View orders for your products
7. Mark order as returned

---

## Benefits

### For Users:
- ✅ Clear separation of roles
- ✅ Focused experience
- ✅ No confusion about features
- ✅ Can choose based on needs

### For Platform:
- ✅ Better analytics (track borrowers vs lenders)
- ✅ Targeted features per role
- ✅ Easier to add role-specific features
- ✅ Better user onboarding

---

## Future Enhancements

### Possible Additions:
1. **Dual Role** - Allow users to be both BORROWER and LENDER
2. **Role Switching** - Switch between roles from profile
3. **Role Stats** - Show earnings for LENDER, savings for BORROWER
4. **Role Badges** - Display role badge on profile
5. **Role Verification** - Additional verification for LENDER

---

## Summary

✅ **Role selection page created**  
✅ **BORROWER role implemented**  
✅ **LENDER role implemented**  
✅ **Navigation updated per role**  
✅ **FAB updated per role**  
✅ **API endpoint created**  
✅ **Database schema supports roles**

**Test URL**: http://localhost:3000/select-role

Users now have a clear, focused experience based on their chosen role! 🎉
