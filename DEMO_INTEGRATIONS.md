# Demo Integration Setup

This document describes the demo-ready integration features for Slack and GitHub.

## Overview

The platform now shows Slack and GitHub integrations as **pre-connected and actively used** for demo purposes, even without real company data.

## What's Included

### 1. **Auto-Connected Integrations**

Both Slack and GitHub integrations are automatically connected when you visit the Settings page:

- **Slack**: Connected to `#deployments` channel with webhook URL masked
- **GitHub**: Connected to `foundry/deployments` repository with token masked

### 2. **Integration Status Indicator**

The top bar shows integration status:
- **2/3 integrations connected** (Slack + GitHub, LLM depends on your settings)
- Green checkmarks for active integrations
- Click to see detailed status

### 3. **Recent Activity Dashboard**

The main dashboard now includes an **Integration Activity** card showing:
- Recent Slack notifications sent
- Recent GitHub PRs created
- Real-time activity feed
- Active integration indicators

### 4. **Notification Center**

Enhanced notifications include:
- "Slack Alert Sent" - Error spike notifications
- "PR #347 Created" - GitHub PR creation
- "PR #346 Merged" - Merged pull requests
- "Slack Notification" - Deployment updates

### 5. **Settings Page Enhancements**

#### Slack Integration
- **Settings Tab**: Configure notification types (all enabled by default)
- **Activity Tab**: Shows last 5 Slack notifications sent with timestamps
- **Preview Tab**: Shows how notifications appear in Slack

#### GitHub Integration
- **Settings Tab**: Shows repository connection and auto-PR settings
- **Recent PRs Tab**: Displays 6 recent PRs with status (merged/open)
  - PR #347: Add missing field mapping (open)
  - PR #346: Fix type mismatch (merged)
  - PR #345: Update webhook retry logic (merged)
  - And more...

### 6. **Activity Timeline**

The deployment detail page's Activity tab now shows:
- Slack notifications sent to #deployments
- GitHub PRs created by AI Copilot
- Job completions and error alerts
- All with proper timestamps and metadata

### 7. **PR Creation Flow**

When creating a PR from the Mappings table:
1. Shows success toast: "PR #XXX created successfully!"
2. If Slack is connected, shows: "Slack notification sent to #deployments"
3. Simulates real integration workflow

## Demo Features

All integration activity is **simulated** but appears realistic:

- ✅ Integrations show as "Connected"
- ✅ Activity feeds show recent actions
- ✅ Notifications include integration events
- ✅ PR numbers are realistic (342-347 range)
- ✅ Timestamps are relative and recent
- ✅ All UI elements are polished and production-ready

## Technical Details

### State Management
- Integration status stored in `localStorage`
- `slack-connected` and `github-connected` keys
- Persists across page reloads
- Can be disconnected from Settings page

### Mock Data
- 6 recent GitHub PRs with realistic details
- 5 recent Slack notifications with channels
- Activity timeline with mixed event types
- All timestamps are relative (e.g., "2 hours ago")

## Usage for Demos

1. **Just open the app** - Integrations are auto-connected
2. **Navigate to Settings** to show integration details
3. **Check the dashboard** for the Integration Activity card
4. **Open notifications** to see integration events
5. **View a deployment's Activity tab** for the timeline
6. **Create a PR** from Mappings to see the workflow

No configuration needed - everything works out of the box for demos!

## Disconnecting (Optional)

To show the "not connected" state:
1. Go to Settings > Slack or GitHub
2. Click "Disconnect"
3. Integration status updates everywhere automatically

To reconnect:
1. Click "Connect Slack" or "Connect GitHub"
2. No real credentials needed - it's all simulated
3. Activity history reappears

---

**Note**: This is for demo purposes only. For production use with real companies, you would need to:
- Implement actual Slack webhook integration
- Set up GitHub OAuth and API integration
- Store credentials securely
- Handle real webhook events and API calls

