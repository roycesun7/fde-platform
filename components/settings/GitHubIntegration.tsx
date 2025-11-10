"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, GitPullRequest, GitBranch, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PR {
  number: number;
  title: string;
  status: string;
  branch: string;
  author: string;
  createdAt: string;
  url?: string;
}

export function GitHubIntegration() {
  const [token, setToken] = useState("");
  const [repo, setRepo] = useState("foundry/deployments");
  const [connected, setConnected] = useState(false);
  const [testing, setTesting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentPRs, setRecentPRs] = useState<PR[]>([]);
  const [loadingPRs, setLoadingPRs] = useState(false);
  const [repoInfo, setRepoInfo] = useState<any>(null);

  // Load saved credentials on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("github_token");
    const savedRepo = localStorage.getItem("github_repo");
    if (savedToken && savedRepo) {
      setToken(savedToken);
      setRepo(savedRepo);
      setConnected(true);
      loadPRs(savedToken, savedRepo);
    }
  }, []);

  const connectGitHub = async () => {
    if (!token || !repo) {
      toast.error("Please enter a GitHub token and repository");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/github/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, repo }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to connect to GitHub");
        return;
      }

      // Save credentials
      localStorage.setItem("github_token", token);
      localStorage.setItem("github_repo", repo);
      setConnected(true);
      setRepoInfo(data.repository);
      toast.success("GitHub connected successfully!");
      
      // Load PRs
      loadPRs(token, repo);
    } catch (error: any) {
      toast.error("Failed to connect to GitHub: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const response = await fetch("/api/github/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, repo }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Connection test failed");
        return;
      }

      setRepoInfo(data.repository);
      toast.success("Connection test successful!");
    } catch (error: any) {
      toast.error("Connection test failed: " + error.message);
    } finally {
      setTesting(false);
    }
  };

  const loadPRs = async (tokenToUse?: string, repoToUse?: string) => {
    const tokenValue = tokenToUse || token;
    const repoValue = repoToUse || repo;

    if (!tokenValue || !repoValue || !connected) return;

    setLoadingPRs(true);
    try {
      const response = await fetch(
        `/api/github/prs?token=${encodeURIComponent(tokenValue)}&repo=${encodeURIComponent(repoValue)}&limit=10`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to load PRs:", data.error);
        return;
      }

      // Format PRs with relative time
      const formattedPRs = data.prs.map((pr: any) => ({
        ...pr,
        createdAt: formatRelativeTime(pr.createdAt),
      }));

      setRecentPRs(formattedPRs);
    } catch (error: any) {
      console.error("Error loading PRs:", error);
    } finally {
      setLoadingPRs(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const disconnect = () => {
    localStorage.removeItem("github_token");
    localStorage.removeItem("github_repo");
    setConnected(false);
    setToken("");
    setRepo("foundry/deployments");
    setRecentPRs([]);
    setRepoInfo(null);
    toast.info("GitHub disconnected");
  };

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

            <Button onClick={connectGitHub} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Github className="h-4 w-4 mr-2" />
                  Connect GitHub
                </>
              )}
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
                  <span className="font-medium text-sm">{repoInfo?.fullName || repo}</span>
                </div>
                {repoInfo && (
                  <>
                    <p className="text-xs text-muted-foreground mb-1">
                      {repoInfo.description || "No description"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {repoInfo.private ? "Private" : "Public"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Default: {repoInfo.defaultBranch}
                      </Badge>
                    </div>
                  </>
                )}
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
                        {repoInfo?.defaultBranch || "main"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button onClick={testConnection} disabled={testing} className="w-full">
                  {testing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>
                <Button onClick={() => loadPRs()} disabled={loadingPRs} variant="outline" className="w-full">
                  {loadingPRs ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Refresh PRs"
                  )}
                </Button>
                <Button onClick={disconnect} variant="outline" className="w-full">
                  Disconnect
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="prs" className="space-y-3">
              {loadingPRs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : recentPRs.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No pull requests found
                </div>
              ) : (
                <>
                  {recentPRs.map((pr) => (
                    <div key={pr.number} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <GitPullRequest className="h-4 w-4" />
                            <span className="font-medium text-sm">#{pr.number}</span>
                            <Badge variant={pr.status === "merged" ? "default" : pr.status === "open" ? "secondary" : "outline"}>
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
                        {pr.url && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => window.open(pr.url, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Showing last {recentPRs.length} PRs from {repo}
                  </p>
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

