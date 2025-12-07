# College Rental Platform

A modern rental platform for college students built with Next.js 16, featuring a Flipkart-inspired UI design.

## 🎨 Features

- **Flipkart-Style UI**: Beautiful blue (#2874f0), orange (#ff9f00), and yellow (#ffe500) color scheme
- **Category Filtering**: Browse products by 8 different categories (Electronics, Books, Furniture, Sports, etc.)
- **User Authentication**: Secure login and registration with NextAuth v5
- **Role-Based Access**: Support for USER, OWNER, and ADMIN roles
- **Product Management**: Owners can list and manage rental products
- **Shopping Cart**: Add items to cart with customizable rental duration
- **Order Management**: Track rental orders and history
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.7 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with Prisma ORM 5.22.0
- **Authentication**: NextAuth.js v5 (beta)
- **UI Components**: Custom components with Flipkart design system
- **Payment**: Stripe integration ready

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/college-rental-platform.git
cd college-rental-platform
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Initialize the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
college-rental-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── cart/              # Shopping cart
│   │   ├── catalog/           # Product catalog with categories
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── me/                # User profile & orders
│   │   ├── owner/             # Owner dashboard
│   │   └── products/          # Product details
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utility functions
│   └── auth.ts                # NextAuth configuration
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                    # Static assets
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

## 🔐 User Roles

- **USER**: Can browse products, add to cart, and place orders
- **OWNER**: Can list products and manage their inventory
- **ADMIN**: Full access to manage users, owners, and platform settings

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
STRIPE_SECRET_KEY="your-stripe-secret-key"
```

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

- NextAuth v5 is in beta - some features may change
- SQLite is used for development - consider PostgreSQL for production

## 📧 Support

For support, email your-email@example.com or open an issue on GitHub.

---

Built with ❤️ for college students
