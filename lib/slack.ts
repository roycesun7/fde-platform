/**
 * Slack Integration Utilities
 * Send real notifications to Slack webhooks
 */

export interface SlackNotificationOptions {
  title: string;
  message: string;
  emoji?: string;
  color?: 'success' | 'warning' | 'error' | 'info';
  fields?: Array<{ title: string; value: string; short?: boolean }>;
  actions?: Array<{ text: string; url: string }>;
}

const colorMap = {
  success: '#10b981', // green
  warning: '#f59e0b', // yellow
  error: '#ef4444',   // red
  info: '#3b82f6',    // blue
};

/**
 * Send a notification to Slack via API route
 */
export async function sendSlackNotification(
  webhookUrl: string,
  options: SlackNotificationOptions
): Promise<boolean> {
  try {
    const { title, message, emoji = '📢', color = 'info', fields, actions } = options;

    const blocks: any[] = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${emoji} ${title}`,
          emoji: true
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: message
        }
      }
    ];

    // Add fields if provided
    if (fields && fields.length > 0) {
      blocks.push({
        type: "section",
        fields: fields.map(field => ({
          type: "mrkdwn",
          text: `*${field.title}*\n${field.value}`
        }))
      });
    }

    // Add action buttons if provided
    if (actions && actions.length > 0) {
      blocks.push({
        type: "actions",
        elements: actions.map(action => ({
          type: "button",
          text: {
            type: "plain_text",
            text: action.text,
            emoji: true
          },
          url: action.url
        }))
      });
    }

    // Add timestamp
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `<!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} at {time}|${new Date().toLocaleString()}>`
        }
      ]
    });

    const payload = {
      attachments: [
        {
          color: colorMap[color],
          blocks
        }
      ]
    };

    // Use API route to avoid CORS issues
    const response = await fetch('/api/slack/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webhookUrl,
        payload
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    return false;
  }
}

/**
 * Check if Slack is connected
 */
export function isSlackConnected(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('slack-connected') === 'true';
}

/**
 * Get the configured Slack webhook URL
 */
export function getSlackWebhookUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('slack-webhook-url');
}

/**
 * Save Slack webhook URL
 */
export function saveSlackWebhookUrl(url: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('slack-webhook-url', url);
}

/**
 * Send error alert to Slack with detailed history
 */
export async function sendErrorAlert(
  errorType: string,
  errorCount: number,
  deploymentName: string,
  threshold: number,
  additionalStats?: {
    totalEvents?: number;
    errorRate?: number;
    errorsByType?: Record<string, number>;
  }
): Promise<boolean> {
  const webhookUrl = getSlackWebhookUrl();
  if (!webhookUrl || !isSlackConnected()) return false;

  const errorRate = additionalStats?.errorRate || ((errorCount / (additionalStats?.totalEvents || 100)) * 100);
  
  // Get top 3 errors if available
  let topErrorsText = '';
  if (additionalStats?.errorsByType) {
    const topErrors = Object.entries(additionalStats.errorsByType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type, count]) => `• ${type}: ${count}`)
      .join('\n');
    topErrorsText = topErrors ? `\n\n*Top Errors:*\n${topErrors}` : '';
  }

  const fields = [
    { title: 'Error Type', value: errorType, short: true },
    { title: 'Count', value: errorCount.toString(), short: true },
    { title: 'Error Rate', value: `${errorRate.toFixed(1)}%`, short: true },
    { title: 'Threshold', value: `${threshold}%`, short: true },
  ];

  if (additionalStats?.totalEvents) {
    fields.push({ title: 'Total Events', value: additionalStats.totalEvents.toLocaleString(), short: true });
  }

  return sendSlackNotification(webhookUrl, {
    title: 'Error Alert',
    message: `🚨 Error rate increased for *${deploymentName}*\n\nError rate: *${errorRate.toFixed(1)}%* (threshold: ${threshold}%)${topErrorsText}`,
    emoji: '🚨',
    color: 'error',
    fields,
    actions: [
      { text: 'View Deployment', url: `${window.location.origin}/d/${deploymentName.toLowerCase().replace(/\s+/g, '-')}` },
      { text: 'Configure Alerts', url: `${window.location.origin}/d/${deploymentName.toLowerCase().replace(/\s+/g, '-')}?tab=alerts` }
    ]
  });
}

/**
 * Send PR creation notification to Slack
 */
export async function sendPRNotification(
  prNumber: number,
  prTitle: string,
  prUrl: string,
  deploymentName: string
): Promise<boolean> {
  const webhookUrl = getSlackWebhookUrl();
  if (!webhookUrl || !isSlackConnected()) return false;

  return sendSlackNotification(webhookUrl, {
    title: 'Pull Request Created',
    message: `PR #${prNumber} has been created by AI Copilot`,
    emoji: '🔀',
    color: 'success',
    fields: [
      { title: 'Title', value: prTitle, short: false },
      { title: 'Deployment', value: deploymentName, short: true },
      { title: 'PR Number', value: `#${prNumber}`, short: true }
    ],
    actions: [
      { text: 'View PR on GitHub', url: prUrl }
    ]
  });
}

/**
 * Send deployment update notification to Slack
 */
export async function sendDeploymentUpdate(
  deploymentName: string,
  updateType: string,
  description: string
): Promise<boolean> {
  const webhookUrl = getSlackWebhookUrl();
  if (!webhookUrl || !isSlackConnected()) return false;

  return sendSlackNotification(webhookUrl, {
    title: 'Deployment Update',
    message: `Configuration updated for *${deploymentName}*`,
    emoji: '🔄',
    color: 'info',
    fields: [
      { title: 'Update Type', value: updateType, short: true },
      { title: 'Deployment', value: deploymentName, short: true },
      { title: 'Description', value: description, short: false }
    ]
  });
}

/**
 * Send job completion notification to Slack
 */
export async function sendJobCompletion(
  jobType: string,
  recordCount: number,
  deploymentName: string,
  duration: string
): Promise<boolean> {
  const webhookUrl = getSlackWebhookUrl();
  if (!webhookUrl || !isSlackConnected()) return false;

  return sendSlackNotification(webhookUrl, {
    title: 'Job Completed',
    message: `${jobType} completed successfully`,
    emoji: '✅',
    color: 'success',
    fields: [
      { title: 'Job Type', value: jobType, short: true },
      { title: 'Records', value: recordCount.toString(), short: true },
      { title: 'Deployment', value: deploymentName, short: true },
      { title: 'Duration', value: duration, short: true }
    ]
  });
}

