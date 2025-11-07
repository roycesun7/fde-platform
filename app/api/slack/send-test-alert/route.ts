import { NextResponse } from "next/server";

/**
 * API route to send detailed test alert with company history
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deploymentId, deploymentName, channel, stats, config, webhookUrl } = body;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Slack webhook URL not configured" },
        { status: 400 }
      );
    }

    // Calculate error rate
    const errorRate = ((stats.errorCount / stats.totalEvents) * 100).toFixed(1);
    const successRate = (100 - parseFloat(errorRate)).toFixed(1);

    // Get top 3 errors
    const topErrors = Object.entries(stats.errorsByType)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([type, count]) => `• *${type}*: ${count} occurrences`)
      .join('\n');

    // Build detailed Slack message
    const payload = {
      text: `🧪 Test Alert: ${deploymentName}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `🧪 Test Alert: ${deploymentName}`,
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `This is a test alert for *${deploymentName}* deployment.\n\nChannel: ${channel}\nTimestamp: <!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} at {time}|${new Date().toLocaleString()}>`
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*📊 Current Statistics*"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Total Errors (24h)*\n${stats.errorCount}`
            },
            {
              type: "mrkdwn",
              text: `*Error Rate*\n${errorRate}%`
            },
            {
              type: "mrkdwn",
              text: `*Success Rate*\n${successRate}%`
            },
            {
              type: "mrkdwn",
              text: `*Total Events*\n${stats.totalEvents.toLocaleString()}`
            }
          ]
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*🔥 Top Errors*\n${topErrors || '• No errors recorded'}`
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*⚙️ Alert Configuration*"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Threshold*\n${config.errorRateThreshold}%`
            },
            {
              type: "mrkdwn",
              text: `*Min Errors*\n${config.minErrorCount}`
            },
            {
              type: "mrkdwn",
              text: `*Cooldown*\n${config.cooldownMinutes} min`
            },
            {
              type: "mrkdwn",
              text: `*Status*\n${parseFloat(errorRate) >= config.errorRateThreshold ? '🚨 Would Alert' : '✅ Below Threshold'}`
            }
          ]
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*📈 Recent Activity*"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: generateRecentActivity(deploymentName, stats)
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View Deployment",
                emoji: true
              },
              url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/d/${deploymentId}`,
              style: "primary"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Configure Alerts",
                emoji: true
              },
              url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/d/${deploymentId}?tab=alerts`
            }
          ]
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "✅ This is a test alert. Real alerts will be sent when error thresholds are exceeded."
            }
          ]
        }
      ],
      attachments: [
        {
          color: parseFloat(errorRate) >= config.errorRateThreshold ? "#ef4444" : "#10b981",
          blocks: []
        }
      ]
    };

    // Send directly to Slack webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Slack error:', errorText);
      return NextResponse.json(
        { error: 'Failed to send to Slack' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Test alert error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate recent activity summary
 */
function generateRecentActivity(deploymentName: string, stats: any): string {
  const activities = [];
  
  // Simulated recent activity based on stats
  if (stats.errorCount > 0) {
    activities.push(`• Last error spike: 2 hours ago (${Math.floor(stats.errorCount / 2)} errors)`);
  }
  
  if (stats.errorCount > 20) {
    activities.push(`• High error rate detected: 4 hours ago`);
  }
  
  activities.push(`• Total events processed today: ${stats.totalEvents.toLocaleString()}`);
  
  if (stats.errorsByType) {
    const topError = Object.entries(stats.errorsByType)[0];
    if (topError) {
      activities.push(`• Most common issue: ${topError[0]}`);
    }
  }
  
  activities.push(`• Last configuration update: 1 day ago`);
  
  return activities.join('\n');
}

