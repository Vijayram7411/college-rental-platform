# 🚀 Complete GitHub Setup Guide

## Step 1: Install Git

### For Windows:
1. Download Git from: https://git-scm.com/download/win
2. Run the installer
3. Use default settings (recommended)
4. Restart your terminal/PowerShell after installation

### Verify Installation:
Open a new terminal and run:
```bash
git --version
```
You should see something like: `git version 2.x.x`

---

## Step 2: Configure Git

After installing Git, configure your identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Verify configuration:
```bash
git config --list
```

---

## Step 3: Create GitHub Account

1. Go to https://github.com
2. Click "Sign up"
3. Follow the registration process
4. Verify your email address

---

## Step 4: Create a New Repository on GitHub

1. Login to GitHub
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `college-rental-platform`
   - **Description**: "A modern rental platform for college students with Flipkart-style UI and college-based data isolation"
   - **Visibility**: Public (or Private if you prefer)
   - **DO NOT check**: "Initialize this repository with a README"
   - **DO NOT add**: .gitignore or license (we already have these)
5. Click "Create repository"

GitHub will show you a page with commands. **Keep this page open!**

---

## Step 5: Initialize Git in Your Project

Open PowerShell in your project directory and run:

```bash
# Initialize Git repository
git init

# Add all files to staging
git add .

# Create first commit
git commit -m "Initial commit: College Rental Platform with college isolation system"
```

---

## Step 6: Connect to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/college-rental-platform.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Step 7: Authenticate

When you push for the first time, you'll be asked to authenticate.

### Option A: Use GitHub Desktop (Easiest)
1. Download GitHub Desktop: https://desktop.github.com/
2. Login with your GitHub account
3. Add your local repository
4. Push changes

### Option B: Use Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "College Rental Platform"
4. Select scopes: Check "repo" (full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. When Git asks for password, paste the token

### Option C: Use SSH (Advanced)
Follow GitHub's SSH setup guide: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## Complete Command Sequence

After Git is installed and configured:

```bash
# 1. Initialize repository
git init

# 2. Check what will be committed
git status

# 3. Add all files
git add .

# 4. Create initial commit
git commit -m "Initial commit: College Rental Platform

Features:
- Next.js 16 with TypeScript
- Flipkart-style UI design
- College-based data isolation
- User authentication with NextAuth v5
- Product catalog with category filtering
- Shopping cart and order management
- Owner dashboard and application system
- 25/25 tests passing (100% success rate)"

# 5. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/college-rental-platform.git

# 6. Rename branch to main
git branch -M main

# 7. Push to GitHub
git push -u origin main
```

---

## Verify Your Repository

After pushing:
1. Go to: `https://github.com/YOUR_USERNAME/college-rental-platform`
2. You should see all your files
3. README.md should display on the main page
4. Check that `.env` and `dev.db` are NOT visible (they're in .gitignore)

---

## Update .gitignore (Important!)

Make sure your `.gitignore` file includes:

```gitignore
# Dependencies
node_modules/

# Next.js
.next/
out/

# Environment variables
.env
.env.local
.env.production.local

# Database
*.db
*.db-journal
dev.db
prisma/dev.db

# Logs
*.log

# IDE
.vscode/
.idea/

# OS
.DS_Store
```

---

## Common Issues & Solutions

### Issue 1: Git not recognized
**Solution:** Install Git from https://git-scm.com/download/win and restart terminal

### Issue 2: Permission denied
**Solution:** Use Personal Access Token instead of password

### Issue 3: Remote already exists
**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/college-rental-platform.git
```

### Issue 4: Merge conflicts
**Solution:**
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

---

## After Successful Push

### 1. Add Repository Description
- Go to your repository on GitHub
- Click the gear icon next to "About"
- Add description: "A modern rental platform for college students with Flipkart-style UI and college-based data isolation"
- Add website: Your deployed URL (if any)
- Add topics: `nextjs`, `typescript`, `rental-platform`, `college`, `prisma`, `nextauth`

### 2. Update Repository Settings
- Go to Settings
- Enable Issues (for bug tracking)
- Enable Discussions (optional)
- Set up branch protection rules (optional)

### 3. Share Your Repository
Your repository URL will be:
```
https://github.com/YOUR_USERNAME/college-rental-platform
```

---

## Quick Reference

### Daily Git Commands
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push

# Pull latest changes
git pull

# View history
git log --oneline
```

### Useful Git Commands
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# View remotes
git remote -v
```

---

## Need Help?

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **GitHub Support**: https://support.github.com/

---

## Project Information

**Project Name:** College Rental Platform  
**Tech Stack:** Next.js 16, TypeScript, Prisma, NextAuth v5, Tailwind CSS  
**Features:** College isolation, Flipkart UI, Product catalog, Shopping cart  
**Test Status:** ✅ 25/25 tests passing (100%)  
**Status:** Production ready

---

**Good luck with your GitHub push! 🚀**
