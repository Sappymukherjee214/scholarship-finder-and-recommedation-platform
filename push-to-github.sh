#!/bin/bash
# GitHub Push Commands
# Replace YOUR_GITHUB_USERNAME with your actual username

# Step 1: Add remote repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/internfair-scholarship-platform.git

# Step 2: Rename branch to main
git branch -M main

# Step 3: Push to GitHub
git push -u origin main

# You'll be prompted for credentials:
# Username: Your GitHub username
# Password: Use a Personal Access Token (not your password)

# To create a Personal Access Token:
# 1. Go to: https://github.com/settings/tokens
# 2. Click "Generate new token" → "Generate new token (classic)"
# 3. Name it: "InternFair Deployment"
# 4. Select scope: ✅ repo (all)
# 5. Click "Generate token"
# 6. Copy the token and use it as your password
