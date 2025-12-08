@echo off
echo ========================================
echo Production Database Setup
echo ========================================
echo.

echo Step 1: Setting DATABASE_URL...
echo Please paste your POSTGRES_PRISMA_URL when prompted.
echo.
set /p DATABASE_URL="Enter POSTGRES_PRISMA_URL: "

echo.
echo Step 2: Running Prisma migrations...
npx prisma migrate deploy

echo.
echo Step 3: Generating Prisma Client...
npx prisma generate

echo.
echo Step 4: Seeding categories...
node scripts/seed-categories.mjs

echo.
echo Step 5: Seeding colleges...
node scripts/seed-mangalore-colleges.mjs

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to your Vercel site
echo 2. Register a new account
echo 3. Add some products
echo 4. Your catalog should now show products!
echo.
pause
