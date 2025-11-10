"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Copy, Check, Play, Repeat, GitPullRequest } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  plan?: any;
  mode?: "stub" | "llm";
}

interface RunbookChatProps {
  deploymentId: string;
}

export function RunbookChat({ deploymentId }: RunbookChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [currentMode, setCurrentMode] = useState<"stub" | "llm">("stub");

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/runbook/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deploymentId, goal: input }),
      });

      const plan = await res.json();

      setCurrentMode(plan.mode || "stub");

      const assistantMessage: Message = {
        role: "assistant",
        content: plan.summary,
        plan,
        mode: plan.mode,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to generate runbook");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const executeAction = async (action: string) => {
    try {
      let endpoint = "";
      let body = {};

      switch (action) {
        case "create_pr":
          endpoint = "/api/actions/create-pr";
          const githubToken = localStorage.getItem("github_token");
          const githubRepo = localStorage.getItem("github_repo");
          body = { 
            deploymentId, 
            diff: "Auto-generated diff",
            title: `Fix: ${deploymentId} deployment issues`,
            ...(githubToken && githubRepo && {
              githubToken,
              githubRepo,
              branch: `fde/${deploymentId}-fix-${Date.now()}`,
            }),
          };
          break;
        case "run_backfill":
          endpoint = "/api/actions/run-backfill";
          body = { deploymentId, count: 123 };
          break;
        case "replay_events":
          endpoint = "/api/actions/replay-events";
          body = { deploymentId, count: 20 };
          break;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.error || "Failed to execute action");
        return;
      }
      
      if (action === "create_pr") {
        if (data.mock) {
          toast.success(`PR #${data.prNumber} created (demo mode)`);
        } else {
          toast.success(`PR #${data.prNumber} created!`);
        }
      } else {
        toast.success(`Job ${data.jobId} queued`);
      }
    } catch (error) {
      toast.error("Failed to execute action");
    }
  };

  const actionIcons = {
    create_pr: GitPullRequest,
    run_backfill: Play,
    replay_events: Repeat,
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Runbook Copilot</CardTitle>
          <Badge variant={currentMode === "llm" ? "default" : "secondary"} className="text-xs">
            {currentMode === "llm" ? "AI Powered" : "Stub Mode"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-2">Ask me to help fix issues!</p>
              <p className="text-sm">Try: &quot;Fix the mapping errors&quot;</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`${msg.role === "user" ? "text-right" : ""}`}>
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>

                {msg.plan && (
                  <div className="mt-4 space-y-3 text-left">
                    {msg.plan.steps.map((step: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{step.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {step.detail}
                            </p>
                          </div>
                          {step.action && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => executeAction(step.action)}
                            >
                              {actionIcons[step.action as keyof typeof actionIcons] && (
                                <>
                                  {(() => {
                                    const Icon = actionIcons[step.action as keyof typeof actionIcons];
                                    return <Icon className="h-3 w-3 mr-1" />;
                                  })()}
                                </>
                              )}
                              Run
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {msg.plan.codeBlocks.map((block: any, idx: number) => (
                      <div key={idx} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{block.language}</Badge>
                          {block.filename && (
                            <span className="text-xs text-muted-foreground">
                              {block.filename}
                            </span>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyCode(block.content, idx)}
                          >
                            {copiedIndex === idx ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                          <code>{block.content}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="text-muted-foreground">
              <div className="inline-block p-3 rounded-lg bg-muted">
                Analyzing deployment...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Textarea
            placeholder="Describe the issue or ask for help..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="min-h-[60px]"
          />
          <Button onClick={handleSubmit} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

