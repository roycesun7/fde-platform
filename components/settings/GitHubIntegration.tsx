"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, GitPullRequest, GitBranch, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function GitHubIntegration() {
  const [token, setToken] = useState("");
  const [repo, setRepo] = useState("foundry/deployments");
  const [connected, setConnected] = useState(false);
  const [testing, setTesting] = useState(false);

  const connectGitHub = () => {
    if (!token) {
      toast.error("Please enter a GitHub token");
      return;
    }
    setConnected(true);
    toast.success("GitHub connected successfully!");
  };

  const testConnection = async () => {
    setTesting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Connection test successful!");
    setTesting(false);
  };

  const disconnect = () => {
    setConnected(false);
    setToken("");
    toast.info("GitHub disconnected");
  };

  // Mock PR data
  const recentPRs = [
    {
      number: 342,
      title: "Add missing field mapping for plan_tier",
      status: "open",
      branch: "fix/plan-tier-mapping",
      author: "AI Copilot",
      createdAt: "2 hours ago",
    },
    {
      number: 341,
      title: "Fix type mismatch for mrr field",
      status: "merged",
      branch: "fix/mrr-type-conversion",
      author: "AI Copilot",
      createdAt: "1 day ago",
    },
    {
      number: 340,
      title: "Implement exponential backoff for webhooks",
      status: "open",
      branch: "feat/webhook-retry",
      author: "sarah@dropbox.com",
      createdAt: "2 days ago",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub Integration
            </CardTitle>
            <CardDescription className="mt-2">
              Automatically create PRs and sync with your codebase
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
                Personal Access Token
              </label>
              <Input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_..."
                type="password"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Create a token at{" "}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  GitHub Settings
                </a>
                {" "}with <code className="text-xs bg-muted px-1 rounded">repo</code> scope
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Repository
              </label>
              <Input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="owner/repository"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Format: owner/repository (e.g., foundry/deployments)
              </p>
            </div>

            <Button onClick={connectGitHub} className="w-full">
              <Github className="h-4 w-4 mr-2" />
              Connect GitHub
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="settings" className="flex-1">
                Settings
              </TabsTrigger>
              <TabsTrigger value="prs" className="flex-1">
                Recent PRs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Github className="h-4 w-4" />
                  <span className="font-medium text-sm">{repo}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Connected repository
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Auto-create PRs</p>
                      <p className="text-xs text-muted-foreground">
                        When AI suggests code fixes
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">PR Templates</p>
                      <p className="text-xs text-muted-foreground">
                        Use standardized PR descriptions
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <GitBranch className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">Base Branch</p>
                      <p className="text-xs text-muted-foreground">
                        main
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button onClick={testConnection} disabled={testing} className="w-full">
                  {testing ? "Testing..." : "Test Connection"}
                </Button>
                <Button onClick={disconnect} variant="outline" className="w-full">
                  Disconnect
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="prs" className="space-y-3">
              {recentPRs.map((pr) => (
                <div key={pr.number} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <GitPullRequest className="h-4 w-4" />
                        <span className="font-medium text-sm">#{pr.number}</span>
                        <Badge variant={pr.status === "merged" ? "default" : "secondary"}>
                          {pr.status}
                        </Badge>
                      </div>
                      <p className="font-medium mb-1">{pr.title}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          {pr.branch}
                        </span>
                        <span>{pr.author}</span>
                        <span>{pr.createdAt}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <p className="text-xs text-muted-foreground text-center pt-2">
                Showing last 3 PRs created by Qwil AI
              </p>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
