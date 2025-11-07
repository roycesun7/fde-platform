"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Bell, CheckCircle, Send } from "lucide-react";
import { toast } from "sonner";

export function SlackIntegration() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [channel, setChannel] = useState("#deployments");
  const [connected, setConnected] = useState(false);
  const [testing, setTesting] = useState(false);

  const connectSlack = () => {
    if (!webhookUrl) {
      toast.error("Please enter a webhook URL");
      return;
    }
    setConnected(true);
    toast.success("Slack connected successfully!");
  };

  const testNotification = async () => {
    setTesting(true);
    
    // Simulate sending test notification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Test notification sent to ${channel}`);
    setTesting(false);
  };

  const disconnect = () => {
    setConnected(false);
    setWebhookUrl("");
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
                Notifications
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

