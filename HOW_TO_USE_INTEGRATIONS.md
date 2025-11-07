# 🚀 How to Use Slack & GitHub Integrations

Quick guide to demo the integrations in Foundry FDE.

---

## 💬 Slack Integration - Step by Step

### 1. Navigate to Settings
- Click **Settings** in the left sidebar
- Click the **Slack** tab

### 2. Connect Slack
- **Webhook URL**: Enter any URL (e.g., `https://hooks.slack.com/services/DEMO/DEMO/DEMO`)
  - For demo purposes, any URL works since we're not making real calls
  - In production, get this from: https://api.slack.com/messaging/webhooks
- **Default Channel**: Enter a channel name (e.g., `#deployments` or `#alerts`)
- Click **Connect Slack**
- ✅ You'll see a success toast!

### 3. Explore Notification Settings
After connecting, you'll see the **Notifications** tab:
- ✅ **Error Alerts** - When error rate exceeds 10%
- ✅ **Deployment Updates** - New deployments and config changes
- ✅ **PR Created** - When AI generates a pull request
- ⚪ **Job Completion** - Backfills and replay events (disabled by default)

### 4. Preview Notifications
- Click the **Preview** tab
- See a realistic Slack message showing:
  - 🚨 Error alert for Acme Corp
  - Error rate: 15.2% (above 10% threshold)
  - Top error: MAPPING_ERROR with 48 occurrences
  - Action buttons: "View Deployment" and "Run Runbook"

### 5. Test It Out
- Click **Send Test Notification**
- Watch the toast: "Test notification sent to #deployments"
- In a real setup, this would post to your Slack channel!

### 6. Check Integration Status
- Look at the **top bar** (next to notifications)
- Click **Integrations** button
- You'll see Slack with a ✅ green checkmark

---

## 🐙 GitHub Integration - Step by Step

### 1. Navigate to Settings
- Click **Settings** in the left sidebar
- Click the **GitHub** tab

### 2. Connect GitHub
- **Personal Access Token**: Enter any token-like string (e.g., `ghp_demo_token_for_presentation`)
  - For demo purposes, any string works
  - In production, create at: https://github.com/settings/tokens
  - Needs `repo` scope for PR creation
- **Repository**: Enter a repo name (e.g., `foundry/deployments` or `your-org/your-repo`)
- Click **Connect GitHub**
- ✅ You'll see a success toast!

### 3. Review Settings
After connecting, you'll see the **Settings** tab:
- ✅ **Auto-create PRs** - When AI suggests code fixes
- ✅ **PR Templates** - Use standardized PR descriptions
- 🌿 **Base Branch** - main

### 4. View Recent PRs
- Click the **Recent PRs** tab
- See 3 mock PRs created by the AI:
  - **PR #342** (open): "Add missing field mapping for plan_tier"
  - **PR #341** (merged): "Fix type mismatch for mrr field"
  - **PR #340** (open): "Implement exponential backoff for webhooks"
- Each shows:
  - PR number and status badge
  - Branch name
  - Author (AI Copilot or user email)
  - Time created

### 5. Test Connection
- Go back to **Settings** tab
- Click **Test Connection**
- Watch the toast: "Connection test successful!"

### 6. Check Integration Status
- Look at the **top bar**
- Click **Integrations** button
- You'll see GitHub with a ✅ green checkmark

---

## 📝 Code Diff Viewer - Step by Step

### 1. Navigate to a Deployment
- Go to **Dashboard**
- Click on **Acme Corp** deployment

### 2. Open Code Tab
- Click the **Code** tab (new!)
- You'll see PR #342: "Add missing field mapping for plan_tier"

### 3. Explore the Diff
- **Summary Stats**:
  - +11 additions
  - -2 deletions
  - 2 files changed

- **File Tabs**:
  - `acme.ts` - Main mapping changes (+8, -2)
  - `acme.ts` (types) - Type definition (+3, -0)

### 4. Read the Code Changes
Click on `acme.ts` to see:
- ➖ **Red lines** (removed): Old TODO comment
- ➕ **Green lines** (added): New `plan_tier` mapping function
  - Extracts tier from subscription data
  - Throws error if missing
  - Returns lowercase tier value

### 5. View on GitHub
- Click **View on GitHub** button (top right)
- In a real setup, this would open the PR on GitHub!

---

## 🎯 Integration Status Indicator

### Location
Top bar, between the environment badge and notification center

### What It Shows
- **Button**: "Integrations" with badge showing "X/3"
- **Popover** (click to open):
  - 💬 Slack - ✅ or ⚪
  - 🐙 GitHub - ✅ or ⚪
  - 🧠 AI/LLM - ✅ or ⚪
  - Link to **Manage Integrations**

### Demo Flow
1. **Before setup**: Shows "0/3"
2. **Connect Slack**: Shows "1/3", Slack has ✅
3. **Connect GitHub**: Shows "2/3", GitHub has ✅
4. **Enable LLM** (Settings → AI & LLM): Shows "3/3", all green!

---

## 🎬 Full Demo Script

### Opening (30 seconds)
> "Let me show you how Foundry FDE integrates with your existing tools..."

1. Click **Integrations** in top bar
2. Point out "0/3 connected"
3. Click **Manage Integrations**

### Slack Setup (1 minute)
> "First, let's connect Slack for real-time alerts..."

1. Go to **Slack** tab
2. Enter webhook URL and channel
3. Click **Connect Slack**
4. Show notification preview
5. Click **Send Test Notification**
6. Point out the realistic Slack message format

### GitHub Setup (1 minute)
> "Now let's connect GitHub for automatic PR creation..."

1. Go to **GitHub** tab
2. Enter PAT and repository
3. Click **Connect GitHub**
4. Show **Recent PRs** tab
5. Point out AI-generated PRs
6. Highlight PR #342 (the one we'll see code for)

### Code Review (1 minute)
> "Let's see what code the AI actually generated..."

1. Go to **Dashboard** → **Acme Corp**
2. Click **Code** tab
3. Show the diff viewer
4. Walk through the `plan_tier` mapping code
5. Explain how it fixes the MAPPING_ERROR

### Closing (30 seconds)
> "And that's how Foundry FDE closes the loop..."

1. Return to top bar
2. Click **Integrations** - now shows "2/3" or "3/3"
3. Point out all green checkmarks

---

## 💡 Pro Tips

### For Presentations
- ✅ Use realistic-looking URLs and tokens (even though they're fake)
- ✅ Mention "In production, you'd get this from [service]"
- ✅ Show the preview/test features to prove it works
- ✅ Connect integrations in order: Slack → GitHub → LLM

### For Screenshots
- 📸 Slack notification preview looks great in screenshots
- 📸 Code diff viewer shows real TypeScript code
- 📸 Recent PRs list looks like real GitHub activity

### For Live Demos
- 🎤 Have Slack/GitHub tabs open in browser to show "where you'd get credentials"
- 🎤 Explain the notification types and why they matter
- 🎤 Walk through the code changes line by line

---

## ❓ FAQ

**Q: Do I need real Slack/GitHub credentials?**
A: No! For demo purposes, any string works. The integrations are UI-only.

**Q: Will it actually post to Slack?**
A: No, it's simulated. Perfect for demos without spamming real channels.

**Q: Can I make it functional?**
A: Yes! Check `INTEGRATIONS.md` for how to add real API calls.

**Q: What about the hydration error?**
A: Fixed! It was caused by browser extensions (Grammarly). Now suppressed.

**Q: Why does it say "AI Copilot" as the PR author?**
A: That's the mock data showing AI-generated PRs. Looks cool in demos!

---

**Ready to demo?** Run `npm start` and follow this guide! 🚀

