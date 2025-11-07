# GitHub Setup Guide

Follow these steps to connect your FDE Platform project to GitHub.

## Step 1: Initialize Git Repository

If you haven't already, initialize git in your project:

```bash
cd /Users/kzoyce/Downloads/Code_Projects/fde_platform
git init
```

## Step 2: Add All Files

Add all project files to git:

```bash
git add .
```

## Step 3: Make Initial Commit

Create your first commit:

```bash
git commit -m "Initial commit: FDE OS Platform POC"
```

## Step 4: Create GitHub Repository

### Option A: Using GitHub Website (Recommended for beginners)

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `fde-platform` (or your preferred name)
   - **Description**: "AI-powered Operating System for Forward-Deployed Engineering"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Option B: Using GitHub CLI (if installed)

```bash
gh repo create fde-platform --public --source=. --remote=origin --push
```

## Step 5: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see instructions. Use these commands:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/fde-platform.git

# Rename default branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Note**: If you used a different repository name, replace `fde-platform` with your actual repository name.

## Step 6: Verify Connection

Verify everything is set up correctly:

```bash
git remote -v
```

You should see your GitHub repository URL listed.

## Alternative: Using SSH (if you have SSH keys set up)

If you prefer SSH instead of HTTPS:

```bash
git remote add origin git@github.com:YOUR_USERNAME/fde-platform.git
git branch -M main
git push -u origin main
```

## Troubleshooting

### If you get authentication errors:
- For HTTPS: GitHub now requires a Personal Access Token instead of passwords
  - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate a new token with `repo` permissions
  - Use the token as your password when pushing

### If the remote already exists:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/fde-platform.git
```

### If you need to update the remote URL:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/fde-platform.git
```

## Future Updates

After making changes to your code:

```bash
git add .
git commit -m "Description of your changes"
git push
```

## Quick Reference Commands

```bash
# Check status
git status

# See what files changed
git diff

# View commit history
git log --oneline

# Pull latest changes (if working with others)
git pull
```

