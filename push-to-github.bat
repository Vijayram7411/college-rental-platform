@echo off
echo ========================================
echo GitHub Push Script
echo ========================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Step 1: Removing old remote...
git remote remove origin 2>nul

echo Step 2: Adding new remote...
git remote add origin https://github.com/Vijayram7411/college-rental-platform.git

echo Step 3: Checking status...
git status

echo.
echo Step 4: Adding files...
git add .

echo Step 5: Committing...
git commit -m "Initial commit: College Rental Platform with college isolation"

echo Step 6: Renaming branch to main...
git branch -M main

echo Step 7: Pushing to GitHub...
echo.
echo NOTE: You may be asked for credentials.
echo Username: Vijayram7411
echo Password: Use your Personal Access Token (NOT your GitHub password)
echo.
git push -u origin main

echo.
echo ========================================
echo Done! Check your repository at:
echo https://github.com/Vijayram7411/college-rental-platform
echo ========================================
pause
