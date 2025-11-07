# Slack Alerts & Company-Specific Configuration Guide

## Overview

The platform now sends **real-time Slack alerts** for deployments and allows you to configure alerts per company/deployment with custom thresholds and channels.

## Features

### ✅ Real Slack Notifications
- Sends actual HTTP requests to Slack webhooks
- Rich formatted messages with Block Kit
- Action buttons to view deployments
- Automatic error spike detection

### 🎯 Per-Deployment Configuration
- Configure alerts for each company/deployment separately
- Custom Slack channels per deployment
- Custom error thresholds
- Cooldown periods to prevent spam

### 🔔 Automatic Monitoring
- Continuously monitors deployment health
- Sends alerts when thresholds are exceeded
- Respects cooldown periods
- Shows toast notifications when alerts are sent

## Setup Instructions

### 1. Connect Slack (One-Time Setup)

1. Go to **Settings** → **Slack**
2. Get your Slack webhook URL:
   - Visit https://api.slack.com/messaging/webhooks
   - Create an app and add incoming webhook
   - Copy the webhook URL
3. Paste webhook URL in the app
4. Click **Connect Slack**
5. Click **Send Test Notification** to verify

### 2. Configure Alerts Per Deployment

1. Go to any deployment (e.g., **Acme Corp**)
2. Click the **Alerts** tab
3. Configure the following:

#### **Slack Channel**
- Default: `#deployments`
- Set a different channel for this deployment
- Example: `#acme-alerts` for Acme Corp

#### **Error Rate Threshold**
- Default: 10%
- Alert when error rate exceeds this percentage
- Example: Set to 15% for less sensitive deployments

#### **Minimum Error Count**
- Default: 5 errors
- Minimum errors required to trigger alert
- Prevents alerts for low-volume deployments

#### **Cooldown Period**
- Default: 30 minutes
- Time between alerts to prevent spam
- Example: Set to 60 minutes for production deployments

#### **Enable/Disable Alerts**
- Toggle alerts on/off for this deployment
- Useful for maintenance windows

4. Click **Save Configuration**
5. Click **Send Test Alert** to verify

## How It Works

### Automatic Monitoring

When you're viewing a deployment:
1. The app checks deployment stats every 60 seconds
2. Calculates current error rate
3. Compares against configured thresholds
4. Sends alert if thresholds exceeded
5. Respects cooldown period

### Alert Triggers

An alert is sent when **ALL** conditions are met:
- ✅ Slack is connected
- ✅ Alerts are enabled for the deployment
- ✅ Error rate ≥ threshold (e.g., 10%)
- ✅ Error count ≥ minimum (e.g., 5 errors)
- ✅ Cooldown period has passed

### Alert Content

Alerts include:
- 🚨 Error alert header
- Deployment name
- Error type (most common)
- Error count
- Error rate vs threshold
- Action buttons:
  - "View Deployment" - Opens deployment page
  - "Run Runbook" - Opens runbook chat

## Example Configurations

### High-Priority Production Deployment
```
Channel: #production-alerts
Error Rate Threshold: 5%
Minimum Error Count: 3
Cooldown: 15 minutes
Enabled: Yes
```

### Standard Deployment
```
Channel: #deployments
Error Rate Threshold: 10%
Minimum Error Count: 5
Cooldown: 30 minutes
Enabled: Yes
```

### Development/Staging
```
Channel: #dev-alerts
Error Rate Threshold: 20%
Minimum Error Count: 10
Cooldown: 60 minutes
Enabled: No (during testing)
```

### Low-Volume Deployment
```
Channel: #deployments
Error Rate Threshold: 15%
Minimum Error Count: 2
Cooldown: 45 minutes
Enabled: Yes
```

## Testing Alerts

### Test from Settings
1. Go to **Settings** → **Slack**
2. Click **Send Test Notification**
3. Check your Slack channel

### Test from Deployment
1. Go to any deployment
2. Click **Alerts** tab
3. Click **Send Test Alert**
4. Alert uses current deployment stats
5. Check the configured Slack channel

## Alert Message Format

```
🚨 Error Alert

Error rate increased for Acme Corp

Error Type: MAPPING_ERROR
Count: 48
Threshold: 10%
Deployment: acme

[View Deployment] [Run Runbook]

Today at 2:34 PM
```

## Storage & Persistence

Configuration is stored in localStorage:
- `alert-config-{deploymentId}` - Alert settings per deployment
- `slack-channel-{deploymentId}` - Slack channel per deployment
- `slack-connected` - Global Slack connection status
- `slack-webhook-url` - Slack webhook URL

## Monitoring Dashboard

The **Current Status** section shows:
- **Error Count**: Total errors in last 24h
- **Error Rate**: Current error percentage
- **Top Error**: Most common error type

This helps you understand if alerts will trigger.

## Troubleshooting

### Alerts Not Sending

**Check:**
1. Is Slack connected? (Settings → Slack)
2. Are alerts enabled for this deployment? (Alerts tab)
3. Is error rate above threshold?
4. Is error count above minimum?
5. Has cooldown period passed?

**Solution:**
- Click "Send Test Alert" to verify Slack works
- Check browser console for errors
- Verify webhook URL is correct

### Wrong Channel

**Problem:** Alerts going to wrong channel

**Solution:**
1. Go to deployment **Alerts** tab
2. Update **Slack Channel** field
3. Click **Save Configuration**
4. Send test alert to verify

### Too Many Alerts

**Problem:** Getting spammed with alerts

**Solution:**
1. Increase **Cooldown Period** (e.g., 60 minutes)
2. Increase **Error Rate Threshold** (e.g., 15%)
3. Increase **Minimum Error Count** (e.g., 10)
4. Temporarily disable alerts

### No Alerts Despite Errors

**Problem:** Errors present but no alerts

**Solution:**
1. Check if error rate exceeds threshold
2. Check if error count exceeds minimum
3. Verify alerts are enabled
4. Check if in cooldown period
5. Send test alert to verify Slack works

## API Integration

### Send Custom Alert

```typescript
import { sendErrorAlert } from '@/lib/slack';

await sendErrorAlert(
  'CUSTOM_ERROR',
  25,
  'My Deployment',
  10
);
```

### Check Alert Config

```typescript
import { getAlertConfig } from '@/lib/alerting';

const config = getAlertConfig('acme');
console.log(config.errorRateThreshold); // 10
```

### Monitor Deployment

```typescript
import { monitorDeployment } from '@/lib/alerting';

const sent = await monitorDeployment(
  'acme',
  'Acme Corp',
  {
    errorCount: 48,
    totalEvents: 500,
    errorsByType: { 'MAPPING_ERROR': 48 }
  }
);
```

## Best Practices

1. **Use Separate Channels**
   - Production: `#production-alerts`
   - Staging: `#staging-alerts`
   - Development: `#dev-alerts`

2. **Set Appropriate Thresholds**
   - Production: Lower thresholds (5-10%)
   - Staging: Medium thresholds (10-15%)
   - Development: Higher thresholds (15-20%)

3. **Configure Cooldowns**
   - Critical: 15-30 minutes
   - Standard: 30-60 minutes
   - Low priority: 60+ minutes

4. **Test Regularly**
   - Send test alerts after configuration changes
   - Verify alerts reach correct channels
   - Check message formatting

5. **Monitor Alert Frequency**
   - If getting too many alerts, increase thresholds
   - If missing issues, decrease thresholds
   - Adjust based on deployment behavior

## Security Notes

- Webhook URLs are stored in localStorage (client-side)
- Anyone with webhook URL can send to your channel
- Rotate webhooks if exposed
- Use environment variables for production
- Consider server-side storage for sensitive deployments

---

**Need Help?** Check [SLACK_SETUP.md](./SLACK_SETUP.md) for webhook setup instructions.

