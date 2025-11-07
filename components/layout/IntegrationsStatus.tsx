"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plug, CheckCircle, XCircle, MessageSquare, Github, Brain } from "lucide-react";
import Link from "next/link";

export function IntegrationsStatus() {
  const [integrations, setIntegrations] = useState({
    slack: false,
    github: false,
    llm: false,
  });

  useEffect(() => {
    // Check localStorage for integration status
    const llmConfig = localStorage.getItem("llm-config");
    if (llmConfig) {
      const config = JSON.parse(llmConfig);
      setIntegrations((prev) => ({
        ...prev,
        llm: !config.useStub && !!config.apiKey,
      }));
    }
  }, []);

  const connectedCount = Object.values(integrations).filter(Boolean).length;
  const totalCount = Object.keys(integrations).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Plug className="h-4 w-4 mr-2" />
          Integrations
          <Badge variant="secondary" className="ml-2">
            {connectedCount}/{totalCount}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Integration Status</h4>
            <p className="text-sm text-muted-foreground">
              {connectedCount} of {totalCount} integrations connected
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">Slack</span>
              </div>
              {integrations.slack ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <span className="text-sm">GitHub</span>
              </div>
              {integrations.github ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="text-sm">AI / LLM</span>
              </div>
              {integrations.llm ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          <Link href="/settings">
            <Button variant="outline" size="sm" className="w-full">
              Manage Integrations
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

