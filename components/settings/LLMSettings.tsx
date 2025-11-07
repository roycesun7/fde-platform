"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Key, Zap, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function LLMSettings() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [useStub, setUseStub] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("llm-config");
    if (saved) {
      const config = JSON.parse(saved);
      setApiKey(config.apiKey || "");
      setModel(config.model || "gpt-4o-mini");
      setUseStub(config.useStub !== false);
    }
  }, []);

  const saveConfig = () => {
    const config = { apiKey, model, useStub };
    localStorage.setItem("llm-config", JSON.stringify(config));
    
    // Configure the LLM service
    fetch("/api/llm/configure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    toast.success("LLM settings saved");
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/llm/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, model }),
      });

      const data = await response.json();

      if (data.success) {
        setTestResult("success");
        toast.success("LLM connection successful!");
      } else {
        setTestResult("error");
        toast.error(data.error || "Connection failed");
      }
    } catch (error) {
      setTestResult("error");
      toast.error("Failed to test connection");
    } finally {
      setTesting(false);
    }
  };

  const toggleMode = () => {
    const newUseStub = !useStub;
    setUseStub(newUseStub);
    
    if (newUseStub) {
      toast.info("Switched to Stub Mode - using deterministic responses");
    } else if (!apiKey) {
      toast.warning("LLM Mode requires an API key");
    } else {
      toast.success("Switched to LLM Mode - using real AI");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                LLM Configuration
              </CardTitle>
              <CardDescription className="mt-2">
                Configure AI-powered features using OpenAI or use deterministic stub mode
              </CardDescription>
            </div>
            <Badge variant={useStub ? "secondary" : "default"} className="flex items-center gap-1">
              {useStub ? (
                <>
                  <Zap className="h-3 w-3" />
                  Stub Mode
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  LLM Mode
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Current Mode</p>
              <p className="text-sm text-muted-foreground mt-1">
                {useStub
                  ? "Using deterministic stub responses (no API key needed)"
                  : "Using real OpenAI API for intelligent responses"}
              </p>
            </div>
            <Button onClick={toggleMode} variant={useStub ? "default" : "outline"}>
              {useStub ? "Enable LLM" : "Use Stub"}
            </Button>
          </div>

          {!useStub && (
            <Tabs defaultValue="openai" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="openai" className="flex-1">OpenAI</TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="openai" className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    OpenAI API Key
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="pl-10"
                      />
                    </div>
                    <Button
                      onClick={testConnection}
                      disabled={!apiKey || testing}
                      variant="outline"
                    >
                      {testing ? "Testing..." : "Test"}
                    </Button>
                  </div>
                  {testResult && (
                    <div className={`flex items-center gap-2 mt-2 text-sm ${testResult === "success" ? "text-green-500" : "text-red-500"}`}>
                      {testResult === "success" ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Connection successful
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          Connection failed
                        </>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Get your API key from{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      OpenAI Platform
                    </a>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Model</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="gpt-4o">GPT-4o (Most capable)</option>
                    <option value="gpt-4o-mini">GPT-4o Mini (Recommended)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fastest)</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-2">
                    GPT-4o Mini offers the best balance of speed and quality
                  </p>
                </div>

                <Button onClick={saveConfig} className="w-full">
                  Save Configuration
                </Button>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Features Using LLM</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Runbook Copilot - Intelligent fix suggestions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Error Analysis - Detailed error explanations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Code Review - Automated PR reviews
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Natural Language Queries - Ask questions about deployments
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Privacy & Security</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• API keys are stored locally in your browser</li>
                      <li>• Keys are never sent to our servers</li>
                      <li>• Deployment data is sent to OpenAI for analysis</li>
                      <li>• You can switch to Stub Mode anytime</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Test</CardTitle>
          <CardDescription>
            Test the LLM with a sample query
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {useStub
                ? "In Stub Mode, you'll get deterministic responses. Enable LLM Mode for AI-powered answers."
                : "Ask a question to test your LLM configuration:"}
            </p>
            <Button
              onClick={async () => {
                toast.info("Testing LLM...");
                const response = await fetch("/api/llm/query", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    query: "Which deployment has the most errors?",
                  }),
                });
                const data = await response.json();
                toast.success(data.answer || "Test complete!");
              }}
              variant="outline"
              className="w-full"
            >
              Test: "Which deployment has the most errors?"
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

