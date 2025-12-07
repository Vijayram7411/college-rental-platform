@echo off
echo ========================================
echo Fix Vercel Deployment - Add .npmrc
echo ========================================
echo.

cd /d "%~dp0"

echo Adding .npmrc and vercel.json files...
git add .npmrc vercel.json

echo Committing changes...
git commit -m "fix: Add .npmrc for Vercel deployment with legacy-peer-deps"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo Done! Vercel will automatically redeploy.
echo ========================================
echo.
echo The .npmrc file tells Vercel to use --legacy-peer-deps
echo This fixes the Next.js 16 + NextAuth v5 compatibility issue.
echo.
pause
