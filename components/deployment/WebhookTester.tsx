"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Copy, Check, Zap } from "lucide-react";
import { toast } from "sonner";

const samplePayloads = {
  customer: {
    customer_email: "test@example.com",
    customer_name: "John Doe",
    plan_tier: "enterprise",
    company_name: "Acme Corp",
    mrr: "299.00",
  },
  subscription: {
    subscription_id: "sub_123456",
    plan_tier: "pro",
    plan_interval: "monthly",
    status: "active",
    mrr: "99.00",
  },
  event: {
    event_type: "subscription.created",
    customer_email: "user@company.com",
    plan_tier: "starter",
    timestamp: new Date().toISOString(),
  },
};

export function WebhookTester() {
  const [url, setUrl] = useState("https://api.acme.com/webhooks/foundry");
  const [payload, setPayload] = useState(JSON.stringify(samplePayloads.customer, null, 2));
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const sendWebhook = async () => {
    setLoading(true);
    setResponse(null);

    // Simulate webhook call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockResponse = {
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "application/json",
        "x-request-id": `req_${Math.random().toString(36).substr(2, 9)}`,
      },
      body: {
        success: true,
        message: "Webhook received successfully",
        processed_at: new Date().toISOString(),
        mapped_fields: {
          "contact.email": "test@example.com",
          "subscription.planTier": "enterprise",
          "account.name": "Acme Corp",
        },
      },
      duration: Math.floor(Math.random() * 300) + 100,
    };

    setResponse(mockResponse);
    setLoading(false);
    toast.success("Webhook sent successfully!");
  };

  const loadSample = (type: keyof typeof samplePayloads) => {
    setPayload(JSON.stringify(samplePayloads[type], null, 2));
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.body, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Response copied to clipboard");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Webhook Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Webhook URL</label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/webhook"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Payload</label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadSample("customer")}
              >
                Customer
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadSample("subscription")}
              >
                Subscription
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadSample("event")}
              >
                Event
              </Button>
            </div>
          </div>
          <Textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="font-mono text-sm min-h-[200px]"
            placeholder='{"key": "value"}'
          />
        </div>

        <Button onClick={sendWebhook} disabled={loading} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          {loading ? "Sending..." : "Send Webhook"}
        </Button>

        {response && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Response</h4>
              <div className="flex items-center gap-2">
                <Badge variant={response.status === 200 ? "default" : "destructive"}>
                  {response.status} {response.statusText}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {response.duration}ms
                </span>
                <Button size="sm" variant="ghost" onClick={copyResponse}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="body" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="body" className="flex-1">Body</TabsTrigger>
                <TabsTrigger value="headers" className="flex-1">Headers</TabsTrigger>
              </TabsList>

              <TabsContent value="body">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(response.body, null, 2)}
                </pre>
              </TabsContent>

              <TabsContent value="headers">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{value as string}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

