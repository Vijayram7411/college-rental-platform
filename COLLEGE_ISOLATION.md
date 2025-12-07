# College Isolation System

## Overview
The platform now implements college-based data isolation. Users can only see and interact with products from their own college.

## How It Works

### 1. **Automatic College Assignment**
- When a user registers, their email domain is extracted (e.g., `user@mit.edu` → `mit.edu`)
- The system finds or creates a College record for that domain
- The user is automatically assigned to that college

### 2. **College Filtering**
- **Catalog Page**: Only shows products from the user's college
- **Product Details**: Users can only view products from their college
- **Product Creation**: New products are automatically assigned to the owner's college

### 3. **Session Management**
- User's `collegeId` is stored in the NextAuth session
- Available in all server components via `auth()`
- Used for authorization checks throughout the app

## Database Schema

### New Tables
- **College**: Stores college information
  - `id`: Unique identifier
  - `name`: College name (e.g., "MIT")
  - `domain`: Email domain (e.g., "mit.edu")
  - `isActive`: Whether the college is active

### Updated Tables
All major tables now have a `collegeId` field:
- `User`
- `Product`
- `Cart`
- `RentalOrder`
- `OwnerProfile`

## Scripts

### Seed Colleges
```bash
node scripts/seed-colleges.mjs
```
Creates sample colleges (MIT, Stanford, Harvard, Berkeley, Example College)

### Assign Colleges to Existing Users
```bash
node scripts/assign-colleges-to-users.mjs
```
Updates existing users and products with college assignments based on email domains

## Testing

1. **Register with different email domains**:
   - `user1@mit.edu`
   - `user2@stanford.edu`

2. **Create products** as each user

3. **Verify isolation**:
   - MIT user should only see MIT products
   - Stanford user should only see Stanford products

## Important Notes

- Users from different colleges cannot see each other's products
- College assignment is automatic based on email domain
- Existing functionality (images, cart, orders) remains unchanged
- Only the necessary isolation features were added
