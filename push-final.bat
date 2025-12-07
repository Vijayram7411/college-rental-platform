@echo off
echo ========================================
echo FINAL GitHub Push - Pull and Merge
echo ========================================
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo This will:
echo 1. Pull any existing files from GitHub
echo 2. Merge them with your local code
echo 3. Push everything to GitHub
echo.

pause

echo Step 1: Pulling from GitHub...
git pull origin main --allow-unrelated-histories

echo.
echo Step 2: Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo SUCCESS! Your code is now on GitHub!
echo ========================================
echo.
echo Check your repository at:
echo https://github.com/Vijayram7411/college-rental-platform
echo.
pause
