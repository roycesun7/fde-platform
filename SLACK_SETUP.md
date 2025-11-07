# Slack Integration Setup Guide

The Slack integration now sends **real notifications** to your Slack workspace!

## Quick Setup

### 1. Create a Slack Webhook

1. Go to https://api.slack.com/messaging/webhooks
2. Click "Create your Slack app"
3. Choose "From scratch"
4. Name your app (e.g., "Foundry FDE")
5. Select your workspace
6. Click "Incoming Webhooks" in the sidebar
7. Toggle "Activate Incoming Webhooks" to ON
8. Click "Add New Webhook to Workspace"
9. Select the channel (e.g., #deployments)
10. Click "Allow"
11. Copy the webhook URL (looks like: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX`)

### 2. Connect in the App

1. Open the app and go to **Settings** → **Slack**
2. If auto-connected with demo URL, click **Disconnect** first
3. Paste your real webhook URL
4. Set your channel name (e.g., `#deployments`)
5. Click **Connect Slack**
6. Click **Send Test Notification** to verify it works!

## What Gets Sent to Slack

The integration sends real notifications for:

### ✅ Test Notifications
- Sent when you click "Send Test Notification" in Settings
- Includes timestamp and channel info
- Formatted with Slack blocks for rich formatting

### 🚨 Error Alerts (Automatic)
- When error rate exceeds threshold
- Shows error type, count, and deployment name
- Includes action buttons to view deployment

### 🔀 PR Created (Automatic)
- When you create a PR from the Mappings table
- Shows PR number, title, and link to GitHub
- Includes deployment context

### 🔄 Deployment Updates (Automatic)
- When configuration changes
- Shows update type and description

### ✅ Job Completion (Automatic)
- When backfills or replays complete
- Shows record count and duration

## Message Format

All messages are sent using Slack's Block Kit for rich formatting:

```json
{
  "attachments": [
    {
      "color": "#3b82f6",
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "🧪 Test Notification"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Message content..."
          }
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": "Timestamp"
            }
          ]
        }
      ]
    }
  ]
}
```

## Features

- ✅ **Real webhook calls** - Actually sends to Slack
- ✅ **Rich formatting** - Uses Slack Block Kit
- ✅ **Action buttons** - Click to view deployments
- ✅ **Error handling** - Shows toast if webhook fails
- ✅ **Persistent storage** - Webhook URL saved in localStorage
- ✅ **Demo mode** - Works with masked URLs for demos

## Demo Mode

The app auto-connects with a masked webhook URL (`https://hooks.slack.com/services/T0***********`) for demo purposes. This won't send real notifications.

To use real notifications:
1. Disconnect the demo webhook
2. Enter your real webhook URL
3. Reconnect

## Troubleshooting

### "Failed to send notification"
- Check that your webhook URL is correct
- Verify the webhook hasn't been revoked in Slack
- Make sure your Slack workspace allows incoming webhooks

### Notifications not appearing in Slack
- Check you're looking at the correct channel
- Verify the webhook is for the right workspace
- Try sending a test notification first

### CORS errors
- Slack webhooks work from the browser (no CORS issues)
- If you see CORS errors, the URL might be incorrect

## Security Notes

- Webhook URLs are stored in localStorage (client-side only)
- Anyone with the webhook URL can send to your channel
- Consider using environment variables for production
- Rotate webhooks if they're exposed

## Advanced Usage

You can also send custom notifications programmatically:

```typescript
import { sendSlackNotification } from '@/lib/slack';

await sendSlackNotification(webhookUrl, {
  title: 'Custom Alert',
  message: 'Something important happened!',
  emoji: '⚡',
  color: 'warning',
  fields: [
    { title: 'Field 1', value: 'Value 1', short: true },
    { title: 'Field 2', value: 'Value 2', short: true }
  ],
  actions: [
    { text: 'View Details', url: 'https://...' }
  ]
});
```

## Helper Functions

The `lib/slack.ts` file provides several helper functions:

- `sendSlackNotification()` - Send custom notifications
- `sendErrorAlert()` - Send error alerts
- `sendPRNotification()` - Send PR creation notifications
- `sendDeploymentUpdate()` - Send deployment updates
- `sendJobCompletion()` - Send job completion notifications
- `isSlackConnected()` - Check if Slack is connected
- `getSlackWebhookUrl()` - Get saved webhook URL
- `saveSlackWebhookUrl()` - Save webhook URL

## Example Notifications

### Test Notification
![Test notification with status and channel info]

### Error Alert
![Error alert with error type, count, and action buttons]

### PR Created
![PR notification with PR number, title, and GitHub link]

---

**Note**: This sends real HTTP requests to Slack. Make sure you have permission to send notifications to your workspace!

