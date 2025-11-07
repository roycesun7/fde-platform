"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bell, Settings } from "lucide-react";
import { toast } from "sonner";
import { 
  getAlertConfig, 
  saveAlertConfig, 
  getDeploymentChannel, 
  setDeploymentChannel,
  monitorDeployment 
} from "@/lib/alerting";
import { isSlackConnected, getSlackWebhookUrl } from "@/lib/slack";

interface SlackAlertConfigProps {
  deploymentId: string;
  deploymentName: string;
  stats?: {
    errorCount: number;
    totalEvents: number;
    errorsByType: Record<string, number>;
  };
}

export function SlackAlertConfig({ deploymentId, deploymentName, stats }: SlackAlertConfigProps) {
  const [slackConnected, setSlackConnected] = useState(false);
  const [channel, setChannel] = useState("#deployments");
  const [enabled, setEnabled] = useState(true);
  const [threshold, setThreshold] = useState(10);
  const [minErrors, setMinErrors] = useState(5);
  const [cooldown, setCooldown] = useState(30);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Load configuration
    setSlackConnected(isSlackConnected());
    setChannel(getDeploymentChannel(deploymentId));
    
    const config = getAlertConfig(deploymentId);
    setEnabled(config.enabled);
    setThreshold(config.errorRateThreshold);
    setMinErrors(config.minErrorCount);
    setCooldown(config.cooldownMinutes);
  }, [deploymentId]);

  const handleSave = () => {
    saveAlertConfig(deploymentId, {
      enabled,
      errorRateThreshold: threshold,
      minErrorCount: minErrors,
      cooldownMinutes: cooldown,
    });
    
    setDeploymentChannel(deploymentId, channel);
    
    toast.success("Alert configuration saved");
  };

  const handleTestAlert = async () => {
    if (!slackConnected) {
      toast.error("Slack is not connected. Go to Settings to connect.");
      return;
    }

    setTesting(true);
    
    try {
      const webhookUrl = getSlackWebhookUrl();
      
      if (!webhookUrl) {
        toast.error("Slack webhook URL not found");
        setTesting(false);
        return;
      }

      // Send detailed test alert with company history
      const response = await fetch('/api/slack/send-test-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deploymentId,
          deploymentName,
          channel,
          webhookUrl,
          stats: stats || {
            errorCount: 48,
            totalEvents: 500,
            errorsByType: { 'MAPPING_ERROR': 48 },
          },
          config: {
            errorRateThreshold: threshold,
            minErrorCount: minErrors,
            cooldownMinutes: cooldown,
          }
        })
      });
      
      if (response.ok) {
        toast.success(`Test alert sent to ${channel}`);
      } else {
        toast.error("Failed to send test alert");
      }
    } catch (error) {
      toast.error("Failed to send test alert");
      console.error(error);
    } finally {
      setTesting(false);
    }
  };

  if (!slackConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Slack Alerts
          </CardTitle>
          <CardDescription>
            Configure real-time alerts for this deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-2">Slack Not Connected</p>
            <p className="text-xs text-muted-foreground mb-4">
              Connect Slack in Settings to receive alerts for this deployment
            </p>
            <Button size="sm" onClick={() => window.location.href = '/settings'}>
              Go to Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Slack Alerts
            </CardTitle>
            <CardDescription>
              Configure real-time alerts for {deploymentName}
            </CardDescription>
          </div>
          <Badge variant={enabled ? "default" : "secondary"}>
            {enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Slack Channel
            </label>
            <Input
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="#deployments"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Channel where alerts will be sent
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Error Rate Threshold (%)
            </label>
            <Input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              min="1"
              max="100"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Alert when error rate exceeds this percentage
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Minimum Error Count
            </label>
            <Input
              type="number"
              value={minErrors}
              onChange={(e) => setMinErrors(Number(e.target.value))}
              min="1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum errors required to trigger alert
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Cooldown Period (minutes)
            </label>
            <Input
              type="number"
              value={cooldown}
              onChange={(e) => setCooldown(Number(e.target.value))}
              min="1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Time between alerts to prevent spam
            </p>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <div>
                <p className="font-medium text-sm">Enable Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Automatically send alerts when thresholds are exceeded
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant={enabled ? "default" : "outline"}
              onClick={() => setEnabled(!enabled)}
            >
              {enabled ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <Button onClick={handleSave} className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
          <Button 
            onClick={handleTestAlert} 
            disabled={testing} 
            variant="outline" 
            className="w-full"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {testing ? "Sending..." : "Send Test Alert"}
          </Button>
        </div>

        {stats && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Current Status</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground">Error Count</p>
                <p className="font-semibold">{stats.errorCount}</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground">Error Rate</p>
                <p className="font-semibold">
                  {((stats.errorCount / stats.totalEvents) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-2 bg-muted rounded col-span-2">
                <p className="text-muted-foreground mb-1">Top Error</p>
                <p className="font-semibold">
                  {Object.entries(stats.errorsByType).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

