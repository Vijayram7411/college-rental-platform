@echo off
echo ========================================
echo Vercel Production Database Setup
echo ========================================
echo.

REM IMPORTANT: Replace this with your POSTGRES_PRISMA_URL from Vercel
set DATABASE_URL=REPLACE_WITH_YOUR_POSTGRES_PRISMA_URL

echo Checking DATABASE_URL...
if "%DATABASE_URL%"=="REPLACE_WITH_YOUR_POSTGRES_PRISMA_URL" (
    echo.
    echo ERROR: Please edit this file and replace DATABASE_URL with your actual Vercel Postgres URL
    echo.
    echo 1. Open setup-vercel-production.bat in a text editor
    echo 2. Replace REPLACE_WITH_YOUR_POSTGRES_PRISMA_URL with your POSTGRES_PRISMA_URL
    echo 3. Save and run again
    echo.
    pause
    exit /b 1
)

echo DATABASE_URL is set!
echo.

echo ========================================
echo Step 1: Running Database Migrations
echo ========================================
echo This will create all tables in your Vercel database...
echo.
npx prisma migrate deploy
if errorlevel 1 (
    echo.
    echo ERROR: Migration failed!
    echo Check your DATABASE_URL and try again.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 2: Generating Prisma Client
echo ========================================
echo.
npx prisma generate

echo.
echo ========================================
echo Step 3: Seeding Categories
echo ========================================
echo Adding product categories...
echo.
node scripts/seed-categories.mjs
if errorlevel 1 (
    echo.
    echo WARNING: Category seeding failed or categories already exist
    echo.
)

echo.
echo ========================================
echo Step 4: Seeding Colleges
echo ========================================
echo Adding Mangalore colleges...
echo.
node scripts/seed-mangalore-colleges.mjs
if errorlevel 1 (
    echo.
    echo WARNING: College seeding failed or colleges already exist
    echo.
)

echo.
echo ========================================
echo Setup Complete! ✓
echo ========================================
echo.
echo Your Vercel production database is now ready!
echo.
echo Next steps:
echo 1. Go to Vercel Dashboard
echo 2. Settings → Environment Variables
echo 3. Add these variables:
echo    - DATABASE_URL = your POSTGRES_PRISMA_URL
echo    - NEXTAUTH_SECRET = generate with: openssl rand -base64 32
echo    - NEXTAUTH_URL = https://your-app.vercel.app
echo 4. Redeploy your app
echo 5. Visit your site and register a new account
echo 6. Add some products
echo 7. Test the catalog!
echo.
echo ========================================
pause
