# College Rental Platform

A peer-to-peer rental marketplace for college students to rent and lend items within their campus community.

## Features

- **College Isolation**: Students only see items from their own college
- **User Authentication**: Secure login and registration with NextAuth
- **Product Management**: Add, edit, and delete rental items
- **Shopping Cart**: Add items and checkout with rental duration
- **Order Management**: Track borrowed items and rental orders
- **Email Notifications**: Automatic emails to owners and borrowers
- **Profile Management**: View and manage user profiles
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Email**: Resend API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Resend API key for emails

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Vijayram7411/college-rental-platform.git
cd college-rental-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="your-resend-api-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Seed initial data:
```bash
node scripts/seed-categories.mjs
node scripts/seed-colleges.mjs
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions and configurations
│   └── auth.ts          # Authentication configuration
├── prisma/
│   └── schema.prisma    # Database schema
├── scripts/             # Database seeding scripts
└── public/              # Static assets
```

## Key Features Explained

### College Isolation
Students are assigned to a college during registration. They can only view and rent items from students in the same college, creating a trusted campus community.

### Rental System
- Items are priced per day
- Users select rental duration when adding to cart
- Orders track pickup points instead of shipping addresses
- Email notifications sent to both owner and borrower

### User Roles
- **OWNER**: Can list items for rent (all registered users)
- **ADMIN**: Full platform management access

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio (database GUI)

## Deployment

The platform is deployed on Vercel. For deployment:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Contributing

This is a college project. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

## Support

For questions or issues, please open an issue on GitHub.
