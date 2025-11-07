# 🔌 Integrations Guide

Foundry FDE now includes basic Slack and GitHub integrations for a complete demo experience.

## 🎯 Overview

The integrations are **demo-ready** but not fully functional. They provide realistic UI/UX for showcasing how Foundry FDE connects with external tools.

---

## 💬 Slack Integration

### Features
- **Webhook Configuration**: Add your Slack webhook URL and default channel
- **Notification Types**:
  - ⚠️ Error alerts when thresholds exceeded
  - 📦 Deployment update notifications
  - 🔀 PR creation notifications
  - ✅ Job completion notifications (optional)
- **Interactive Preview**: See how notifications appear in Slack
- **Test Notifications**: Send test messages to verify setup
- **Connection Status**: Visual indicator in top bar

### Setup
1. Go to **Settings** → **Slack** tab
2. Enter your Slack webhook URL (from https://api.slack.com/messaging/webhooks)
3. Set default channel (e.g., `#deployments`)
4. Click **Connect Slack**
5. Test with **Send Test Notification**

### What Works
✅ UI for configuration  
✅ Connection status tracking  
✅ Notification preview  
✅ Test notification simulation  

### What's Demo-Only
⚠️ Actual webhook calls (not sent to real Slack)  
⚠️ Real-time notifications (simulated)  

---

## 🐙 GitHub Integration

### Features
- **Personal Access Token**: Connect with GitHub PAT
- **Repository Configuration**: Specify target repo (owner/repository)
- **Auto-create PRs**: When AI suggests code fixes
- **PR Templates**: Standardized descriptions
- **Recent PRs View**: See last 3 PRs created by Foundry
- **Connection Testing**: Verify GitHub access
- **Base Branch Config**: Set default base branch

### Setup
1. Go to **Settings** → **GitHub** tab
2. Create a PAT at https://github.com/settings/tokens with `repo` scope
3. Enter token and repository (e.g., `foundry/deployments`)
4. Click **Connect GitHub**
5. Test with **Test Connection**

### What Works
✅ UI for configuration  
✅ Connection status tracking  
✅ Mock PR list with realistic data  
✅ PR metadata display  

### What's Demo-Only
⚠️ Actual GitHub API calls (mocked)  
⚠️ Real PR creation (simulated)  
⚠️ PR links (placeholder URLs)  

---

## 📊 Integration Status Indicator

### Location
Top bar, next to Notification Center

### Features
- **Quick Status**: Shows X/3 integrations connected
- **Popover Details**: Click to see which integrations are active
  - Slack (MessageSquare icon)
  - GitHub (GitHub icon)
  - AI/LLM (Brain icon)
- **Visual Indicators**: Green checkmark (connected) or gray X (not connected)
- **Quick Access**: Link to Settings page

---

## 🎨 Code Diff Viewer

### Features
- **File-by-File Diffs**: Tabbed interface for multiple files
- **Syntax Highlighting**: Color-coded additions/deletions
- **Line Numbers**: Accurate line number tracking
- **Change Summary**: Total additions/deletions count
- **GitHub Link**: Quick link to view PR on GitHub (demo)

### Location
Deployment Detail → **Code** tab

### What's Shown
- Mock PR #342: "Add missing field mapping for plan_tier"
- Changes to `src/mappings/acme.ts` and `src/types/acme.ts`
- Realistic TypeScript code with proper formatting

---

## 🚀 Demo Flow

### For Presentations

1. **Show Integration Status** (Top Bar)
   - Point out "0/3" integrations connected
   - Click to show popover

2. **Configure Slack** (Settings → Slack)
   - Enter webhook URL: `https://hooks.slack.com/services/DEMO/DEMO/DEMO`
   - Set channel: `#deployments`
   - Connect and test notification
   - Show preview of how alerts appear

3. **Configure GitHub** (Settings → GitHub)
   - Enter token: `ghp_demo_token_for_presentation`
   - Set repo: `foundry/deployments`
   - Connect and view recent PRs
   - Show PR #342 created by AI Copilot

4. **View Code Changes** (Deployment Detail → Code)
   - Show diff viewer with real code changes
   - Explain how AI generated the fix
   - Point out additions/deletions

5. **Check Status Again** (Top Bar)
   - Now shows "2/3" or "3/3" connected
   - Popover shows green checkmarks

---

## 🔧 Technical Details

### Storage
- **localStorage**: Integration configs stored in browser
- **In-Memory**: Connection status tracked client-side
- **No Backend**: All integration logic is frontend-only

### Components
```
components/settings/
├── SlackIntegration.tsx      # Slack config UI
├── GitHubIntegration.tsx     # GitHub config UI
└── LLMSettings.tsx            # AI/LLM config UI

components/layout/
└── IntegrationsStatus.tsx     # Top bar indicator

components/deployment/
└── CodeDiffViewer.tsx         # PR diff viewer
```

### Styling
- Consistent with dark theme
- Uses shadcn/ui components (Card, Badge, Tabs, Popover)
- Lucide icons for visual consistency
- Responsive design

---

## 💡 Future Enhancements

If you want to make these integrations functional:

### Slack
1. Add backend API route to send webhooks
2. Implement real notification triggers
3. Add webhook signature verification
4. Support multiple channels

### GitHub
1. Add Octokit for GitHub API
2. Implement real PR creation
3. Add PR status polling
4. Support multiple repositories
5. Add commit/branch management

### Code Diff
1. Fetch real PR data from GitHub API
2. Support more file types
3. Add inline commenting
4. Add merge conflict detection

---

## 📝 Notes

- All integrations are **safe to demo** without real credentials
- No actual API calls are made to external services
- Perfect for presentations and showcases
- Can be extended to real integrations with minimal changes

---

**Need help?** Check the main README.md or Settings page for more details.

