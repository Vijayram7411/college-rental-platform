# How to Push This Project to GitHub

Follow these steps to push your College Rental Platform to GitHub.

## Prerequisites

1. **Install Git** (if not already installed)
   - Download from: https://git-scm.com/download/win
   - During installation, select "Git Bash Here" option
   - Restart your computer after installation

2. **Create a GitHub Account** (if you don't have one)
   - Go to: https://github.com/signup

## Step-by-Step Instructions

### Step 1: Open Git Bash

1. Navigate to your project folder in File Explorer:
   ```
   C:\Users\POOJA\Downloads\college-rental-platform-updated
   ```
2. Right-click in the folder and select **"Git Bash Here"**

### Step 2: Configure Git (First Time Only)

Run these commands in Git Bash (replace with your info):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Initialize Git Repository

```bash
# Initialize git in your project
git init

# Add all files to staging
git add .

# Create your first commit
git commit -m "Initial commit: College Rental Platform with Flipkart UI"
```

### Step 4: Create GitHub Repository

1. Go to: https://github.com/new
2. Fill in the details:
   - **Repository name**: `college-rental-platform` (or any name you prefer)
   - **Description**: "A modern rental platform for college students with Flipkart-style UI"
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Initialize this repository with a README" (you already have one)
3. Click **"Create repository"**

### Step 5: Connect to GitHub and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

### Step 6: Verify

1. Refresh your GitHub repository page
2. You should see all your files uploaded!

## Alternative: Using GitHub Desktop

If you prefer a GUI:

1. Download **GitHub Desktop**: https://desktop.github.com/
2. Install and sign in with your GitHub account
3. Click **"Add"** → **"Add Existing Repository"**
4. Select your project folder
5. Click **"Publish repository"**
6. Choose repository name and visibility
7. Click **"Publish repository"**

## Common Issues and Solutions

### Issue: "Git is not recognized"
**Solution**: Install Git from https://git-scm.com/download/win and restart your computer

### Issue: "Permission denied (publickey)"
**Solution**: Use HTTPS URL instead of SSH, or set up SSH keys:
```bash
# Use HTTPS (easier)
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Issue: "Failed to push some refs"
**Solution**: Pull first, then push:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## What Gets Pushed?

✅ **Included:**
- All source code
- Configuration files
- README.md
- package.json

❌ **Excluded (in .gitignore):**
- node_modules/
- .next/
- .env files
- dev.db (database)
- Generated Prisma files

## After Pushing

Your repository will be available at:
```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
```

You can now:
- Share the link with others
- Deploy to Vercel/Netlify
- Collaborate with team members
- Track changes with version control

## Need Help?

- GitHub Docs: https://docs.github.com/en/get-started
- Git Tutorial: https://git-scm.com/docs/gittutorial
- Video Tutorial: Search "How to push to GitHub" on YouTube

---

Good luck! 🚀
