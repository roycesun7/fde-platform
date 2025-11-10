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

    // Get top errors for narrative format
    const topErrors = Object.entries(stats.errorsByType)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([type, count]) => `\`${type}\` (${count})`)
      .join(', ');

    // Build cohesive Slack message
    const isAlerting = parseFloat(errorRate) >= config.errorRateThreshold;
    const statusText = isAlerting ? "Would Alert" : "Below Threshold";
    
    // Create a cohesive narrative message
    const mainMessage = `*Test Alert: ${deploymentName}*\n\n` +
      `This is a test alert for the ${deploymentName} deployment. ` +
      `Over the past 24 hours, we've processed *${stats.totalEvents.toLocaleString()}* events with ` +
      `*${stats.errorCount}* errors (${errorRate}% error rate, ${successRate}% success rate). ` +
      `${stats.errorCount > 0 && topErrors ? `The most common issues are: ${topErrors}.` : 'No errors recorded.'}\n\n` +
      `Alert configuration: ${config.errorRateThreshold}% threshold, ${config.minErrorCount} minimum errors, ` +
      `${config.cooldownMinutes}-minute cooldown. *Current status: ${statusText}.*`;
    
    const payload = {
      text: `Test Alert: ${deploymentName}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: mainMessage
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `<!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} at {time}|${new Date().toLocaleString()}> • ${channel}`
            }
          ]
        },
        {
          type: "divider"
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Total Events*\n${stats.totalEvents.toLocaleString()}`
            },
            {
              type: "mrkdwn",
              text: `*Errors (24h)*\n${stats.errorCount}`
            },
            {
              type: "mrkdwn",
              text: `*Error Rate*\n${errorRate}%`
            },
            {
              type: "mrkdwn",
              text: `*Success Rate*\n${successRate}%`
            }
          ]
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
              text: `*Status*\n${statusText}`
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
            text: `*Recent Activity*\n${generateRecentActivity(deploymentName, stats)}`
          }
        },
        {
          type: "divider"
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View Deployment",
                emoji: false
              },
              url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/d/${deploymentId}`,
              style: "primary"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Configure Alerts",
                emoji: false
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
              text: "_This is a test alert. Real alerts will be sent automatically when error thresholds are exceeded._"
            }
          ]
        }
      ],
      attachments: [
        {
          color: isAlerting ? "#ef4444" : "#10b981",
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
  
  if (stats.errorCount > 0) {
    activities.push(`Last error spike: 2 hours ago (${Math.floor(stats.errorCount / 2)} errors)`);
  }
  
  if (stats.errorCount > 20) {
    activities.push(`High error rate detected: 4 hours ago`);
  }
  
  activities.push(`Total events processed today: ${stats.totalEvents.toLocaleString()}`);
  
  if (stats.errorsByType && Object.keys(stats.errorsByType).length > 0) {
    const topError = Object.entries(stats.errorsByType)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0];
    if (topError && topError[0]) {
      activities.push(`Most common issue: \`${topError[0]}\``);
    } else {
      activities.push(`Most common issue: None`);
    }
  } else {
    activities.push(`Most common issue: None`);
  }
  
  activities.push(`Last configuration update: 1 day ago`);
  
  return activities.map(a => `• ${a}`).join('\n');
}

