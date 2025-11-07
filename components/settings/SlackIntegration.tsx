"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Bell, CheckCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { sendSlackNotification, saveSlackWebhookUrl, getSlackWebhookUrl } from "@/lib/slack";

export function SlackIntegration() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [channel, setChannel] = useState("#deployments");
  const [connected, setConnected] = useState(false);
  const [testing, setTesting] = useState(false);

  // Load saved webhook URL and connection status on mount
  useEffect(() => {
    const savedUrl = getSlackWebhookUrl();
    const isConnected = localStorage.getItem("slack-connected") === "true";
    
    if (savedUrl && isConnected) {
      // User has previously connected with a real webhook
      setWebhookUrl(savedUrl);
      setConnected(true);
    } else {
      // Not connected - show disconnected state
      setWebhookUrl("");
      setConnected(false);
      // Clean up any stale connection state
      localStorage.removeItem("slack-connected");
    }
  }, []);

  const connectSlack = () => {
    if (!webhookUrl) {
      toast.error("Please enter a webhook URL");
      return;
    }
    
    // Validate webhook URL format (allow demo URLs with asterisks)
    if (!webhookUrl.startsWith('https://hooks.slack.com/')) {
      toast.error("Invalid Slack webhook URL format");
      return;
    }
    
    setConnected(true);
    localStorage.setItem("slack-connected", "true");
    // Only save real URLs, not demo ones
    if (!webhookUrl.includes('***')) {
      saveSlackWebhookUrl(webhookUrl);
    }
    toast.success("Slack connected successfully!");
  };

  const testNotification = async () => {
    setTesting(true);
    
    try {
      const success = await sendSlackNotification(webhookUrl, {
        title: 'Test Notification',
        message: `This is a test notification from *Foundry FDE*\n\nChannel: ${channel}\nTimestamp: ${new Date().toLocaleString()}`,
        emoji: '🧪',
        color: 'info',
        fields: [
          { title: 'Status', value: '✅ Integration Working', short: true },
          { title: 'Channel', value: channel, short: true }
        ]
      });

      if (success) {
        toast.success(`Test notification sent to ${channel}`);
      } else {
        toast.error('Failed to send notification. Check your webhook URL.');
      }
    } catch (error) {
      toast.error('Failed to send notification. Check your webhook URL.');
      console.error('Slack notification error:', error);
    } finally {
      setTesting(false);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setWebhookUrl("");
    localStorage.removeItem("slack-connected");
    localStorage.removeItem("slack-webhook-url");
    toast.info("Slack disconnected");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Slack Integration
            </CardTitle>
            <CardDescription className="mt-2">
              Send deployment notifications and alerts to Slack channels
            </CardDescription>
          </div>
          <Badge variant={connected ? "default" : "secondary"}>
            {connected ? "Connected" : "Not Connected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!connected ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Webhook URL
              </label>
              <Input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                type="url"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Create a webhook at{" "}
                <a
                  href="https://api.slack.com/messaging/webhooks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Slack API
                </a>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Default Channel
              </label>
              <Input
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="#deployments"
              />
            </div>

            <Button onClick={connectSlack} className="w-full">
              Connect Slack
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="notifications" className="flex-1">
                Settings
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">
                Activity
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Error Alerts</p>
                      <p className="text-xs text-muted-foreground">
                        When error rate exceeds 10%
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Deployment Updates</p>
                      <p className="text-xs text-muted-foreground">
                        New deployments and config changes
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">PR Created</p>
                      <p className="text-xs text-muted-foreground">
                        When AI generates a pull request
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Job Completion</p>
                      <p className="text-xs text-muted-foreground">
                        Backfills and replay events
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button onClick={testNotification} disabled={testing} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  {testing ? "Sending..." : "Send Test Notification"}
                </Button>
                <Button onClick={disconnect} variant="outline" className="w-full">
                  Disconnect
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Error Alert Sent</span>
                    </div>
                    <span className="text-xs text-muted-foreground">1 min ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sent to #deployments • Error rate: 15.2%
                  </p>
                </div>

                <div className="p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Deployment Update</span>
                    </div>
                    <span className="text-xs text-muted-foreground">6 hours ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sent to #deployments • New config deployed
                  </p>
                </div>

                <div className="p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">PR Created Alert</span>
                    </div>
                    <span className="text-xs text-muted-foreground">8 hours ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sent to #deployments • PR #346 created by AI
                  </p>
                </div>

                <div className="p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Error Alert Sent</span>
                    </div>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sent to #deployments • MAPPING_ERROR spike detected
                  </p>
                </div>

                <div className="p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Deployment Update</span>
                    </div>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sent to #deployments • Acme Corp config updated
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                Last 5 notifications sent to Slack
              </p>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    F
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold">Foundry FDE</span>
                      <Badge variant="outline" className="text-xs">APP</Badge>
                      <span className="text-xs text-muted-foreground">2:34 PM</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🚨</span>
                        <span className="font-semibold">Error Alert: Acme Corp</span>
                      </div>
                      <p className="text-sm">
                        Error rate increased to <strong>15.2%</strong> (threshold: 10%)
                      </p>
                      <div className="bg-background border-l-4 border-destructive p-3 rounded text-sm">
                        <p className="font-mono text-xs">
                          <strong>Top Error:</strong> MAPPING_ERROR<br/>
                          <strong>Count:</strong> 48 occurrences<br/>
                          <strong>Deployment:</strong> acme
                        </p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          View Deployment
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          Run Runbook
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Preview of how notifications appear in Slack
              </p>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
