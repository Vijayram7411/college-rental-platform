<<<<<<< HEAD
# College Rental Platform

A modern rental platform for college students built with Next.js 16, featuring a Flipkart-inspired UI design and college-based data isolation.

## ✨ Key Features

### 🏫 College Isolation System
- **Automatic College Assignment**: Users are automatically assigned to colleges based on their email domain
- **Data Isolation**: Students can only see and interact with products from their own college
- **Cross-College Protection**: Secure access control prevents viewing products from other colleges
- **Multi-College Support**: Platform supports unlimited colleges with automatic creation

### 🎨 Flipkart-Style UI
- **Beautiful Design**: Blue (#2874f0), orange (#ff9f00), and yellow (#ffe500) color scheme
- **Responsive Layout**: Mobile-friendly interface with Tailwind CSS
- **Custom Shadows**: Flipkart-inspired shadow effects and hover states
- **Modern Components**: Clean, professional UI components

### 📦 Product Management
- **Category Filtering**: Browse by 8 categories (Electronics, Books, Furniture, Sports, etc.)
- **Image Upload**: Upload 3-10 product images (base64 storage, 5MB limit)
- **Rental Duration**: Set rental periods in days with min/max limits
- **Price Management**: Set base and original prices per month

### 🔐 Authentication & Security
- **Secure Login**: NextAuth v5 with JWT tokens
- **Password Hashing**: bcrypt encryption
- **Role-Based Access**: USER, OWNER, and ADMIN roles
- **Session Management**: collegeId stored in session for isolation

### 🛒 Shopping & Orders
- **Shopping Cart**: Add items with customizable rental duration (in days)
- **Order Management**: Track rental orders and history
- **Owner Dashboard**: Manage products and view orders

### 👤 Owner Features
- **Owner Application**: Apply to become a product owner
- **ID Verification**: Upload college ID card (both sides required)
- **Product Listing**: Add and manage rental products
- **Order Tracking**: View and manage rental orders

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.7 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with Prisma ORM 5.22.0
- **Authentication**: NextAuth.js v5 (beta)
- **UI Components**: Custom components with Flipkart design system
- **Payment**: Stripe integration ready

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/college-rental-platform.git
cd college-rental-platform
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Initialize the database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed colleges (optional)
node scripts/seed-colleges.mjs

# Seed categories (optional)
node scripts/seed-categories.mjs
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

> **Note:** The server may use port 3001 if port 3000 is already in use.

## 🧪 Testing

### Run Full System Test
```bash
node scripts/full-system-test.mjs
```
Runs 25 automated tests covering all features.

### Test College Isolation
```bash
node scripts/test-college-isolation.mjs
```
Creates test users and products to demonstrate college isolation.

### Check System Status
```bash
# Check college statistics
node scripts/check-colleges.mjs

# Check products
node scripts/check-products.mjs
```

### Test Credentials
After running the test scripts, you can login with:

**MIT User:**
- Email: `testuser1@mit.edu`
- Password: `password123`

**Stanford User:**
- Email: `testuser2@stanford.edu`
- Password: `password123`

## 📁 Project Structure

```
college-rental-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   └── owner/         # Owner product management
│   │   ├── cart/              # Shopping cart
│   │   ├── catalog/           # Product catalog with college filtering
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page (with college assignment)
│   │   ├── me/                # User profile & orders
│   │   ├── owner/             # Owner dashboard & application
│   │   └── products/          # Product details (with college authorization)
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utility functions
│   ├── generated/             # Prisma generated client
│   └── auth.ts                # NextAuth configuration (with collegeId)
├── prisma/
│   ├── schema.prisma          # Database schema (with College table)
│   └── migrations/            # Database migrations
├── scripts/                   # Utility scripts
│   ├── full-system-test.mjs   # Complete system test (25 tests)
│   ├── test-college-isolation.mjs  # College isolation demo
│   ├── check-colleges.mjs     # Check college statistics
│   ├── check-products.mjs     # Check products
│   ├── seed-colleges.mjs      # Seed sample colleges
│   ├── seed-categories.mjs    # Seed product categories
│   ├── make-admin.mjs         # Make user admin
│   └── assign-colleges-to-users.mjs  # Update existing data
├── docs/                      # Documentation
│   ├── FINAL_TEST_REPORT.md   # Complete test results
│   ├── PROJECT_STATUS.md      # Quick reference guide
│   ├── COLLEGE_ISOLATION.md   # College system docs
│   └── IMPLEMENTATION_SUMMARY.md  # Technical details
└── public/                    # Static assets
```

## 🎯 Available Scripts

### Development
- `npm run dev` - Start development server (port 3001)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npx prisma generate` - Generate Prisma Client
- `npx prisma migrate dev` - Run migrations
- `npx prisma db push` - Push schema changes
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate reset` - Reset database

### Testing & Utilities
- `node scripts/full-system-test.mjs` - Run all 25 tests
- `node scripts/test-college-isolation.mjs` - Test college isolation
- `node scripts/check-colleges.mjs` - Check college status
- `node scripts/check-products.mjs` - Check products
- `node scripts/seed-colleges.mjs` - Seed colleges
- `node scripts/seed-categories.mjs` - Seed categories
- `node scripts/make-admin.mjs <email>` - Make user admin
- `node scripts/assign-colleges-to-users.mjs` - Update existing data

## 🔐 User Roles & Permissions

### USER (Default)
- Browse products from their college
- Add items to cart
- Place rental orders
- View order history
- Apply to become an owner

### OWNER
- All USER permissions
- List products for rent
- Upload product images (3-10 images)
- Manage product inventory
- View and manage rental orders
- Products automatically assigned to their college

### ADMIN
- All OWNER permissions
- Approve owner applications
- Manage users across all colleges
- Access admin dashboard
- View platform statistics

## 🏫 College System

### How It Works
1. **Registration**: Users register with their college email (e.g., `student@mit.edu`)
2. **Auto-Assignment**: System extracts domain (`mit.edu`) and assigns user to MIT college
3. **Auto-Creation**: If college doesn't exist, it's automatically created
4. **Isolation**: Users only see products from their own college
5. **Security**: Cross-college access is blocked (returns 404)

### Supported Colleges
The platform automatically supports any college email domain. Pre-seeded colleges include:
- MIT (mit.edu)
- Stanford (stanford.edu)
- Harvard (harvard.edu)
- Berkeley (berkeley.edu)
- Example College (example.edu)

New colleges are created automatically when users register with new domains.

## 🎨 Design System

The UI follows Flipkart's design language:
- **Primary Blue**: #2874f0 (Headers, links, primary actions)
- **Orange**: #ff9f00 (Call-to-action buttons)
- **Yellow**: #ffe500 (Accents, badges)
- **Background**: #f1f3f6 (Page background)
- **Dark Footer**: #172337

## 📱 Categories

- 📱 Electronics
- 📚 Books
- 🛋️ Furniture
- ⚽ Sports
- 🎸 Musical Instruments
- 🔌 Appliances
- 👕 Clothing
- 🔧 Tools

## 📊 Database Schema

### Key Tables
- **College**: Stores college information (name, domain, isActive)
- **User**: User accounts with collegeId for isolation
- **Product**: Rental products with collegeId and images (JSON)
- **Cart**: Shopping carts with collegeId
- **RentalOrder**: Rental orders with collegeId
- **OwnerProfile**: Owner applications with college verification
- **Category**: Product categories
- **CartItem**: Items in cart with rental duration
- **RentalOrderItem**: Items in orders
- **Review**: Product reviews
- **Address**: Shipping addresses

### College Isolation
All major tables include `collegeId` to ensure data isolation:
- Users can only see products from their college
- Carts are college-specific
- Orders are college-specific
- Owner applications are college-specific

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.com"
```

> **Note:** For production, consider using PostgreSQL instead of SQLite.

### Post-Deployment Setup

```bash
# Run migrations
npx prisma migrate deploy

# Seed initial data
node scripts/seed-colleges.mjs
node scripts/seed-categories.mjs
```

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ✅ Test Results

The platform has been thoroughly tested with 25 automated tests:

- ✅ Database Connection (1/1 passed)
- ✅ College System (2/2 passed)
- ✅ User Registration & College Assignment (3/3 passed)
- ✅ Category System (2/2 passed)
- ✅ Product Creation & Management (4/4 passed)
- ✅ College Isolation (4/4 passed)
- ✅ Cart System (2/2 passed)
- ✅ Owner Profile System (2/2 passed)
- ✅ Data Integrity (3/3 passed)
- ✅ Image Storage (2/2 passed)

**Success Rate:** 100% (25/25 tests passed)

See `FINAL_TEST_REPORT.md` for detailed test results.

## 📚 Documentation

- **FINAL_TEST_REPORT.md** - Complete test results (25 tests)
- **PROJECT_STATUS.md** - Quick reference guide
- **COLLEGE_ISOLATION.md** - College system documentation
- **IMPLEMENTATION_SUMMARY.md** - Technical implementation details
- **DEMO_TEST_RESULTS.md** - Demo test results
- **SELLER_DASHBOARD_GUIDE.md** - Owner dashboard guide
- **IMAGE_UPLOAD_GUIDE.md** - Image upload guide

## 🐛 Known Issues

- NextAuth v5 is in beta - some features may change
- SQLite is used for development - use PostgreSQL for production
- Port 3000 may be in use - server auto-selects port 3001

## 🔧 Troubleshooting

### Server won't start
```bash
# Clear Next.js cache
rm -rf .next

# Remove lock file
rm .next/dev/lock

# Restart server
npm run dev
```

### Database issues
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate

# Reseed data
node scripts/seed-colleges.mjs
node scripts/seed-categories.mjs
```

### Test the system
```bash
# Run full test suite
node scripts/full-system-test.mjs

# Check college status
node scripts/check-colleges.mjs
```

## 📧 Support

For support, open an issue on GitHub or refer to the documentation files.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `node scripts/full-system-test.mjs`
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ for college students | Tested with ✅ 25/25 passing tests
=======
# college-rental-platform
>>>>>>> 55d87f70080b8779352de813a3d4004b54145b44
