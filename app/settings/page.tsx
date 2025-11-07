"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LLMSettings } from "@/components/settings/LLMSettings";
import { SlackIntegration } from "@/components/settings/SlackIntegration";
import { GitHubIntegration } from "@/components/settings/GitHubIntegration";
import { Brain, MessageSquare, Github } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure AI features and integrations
          </p>
        </div>

        <Tabs defaultValue="ai" className="space-y-6">
          <TabsList>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI & LLM
            </TabsTrigger>
            <TabsTrigger value="slack" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Slack
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai">
            <LLMSettings />
          </TabsContent>

          <TabsContent value="slack">
            <SlackIntegration />
          </TabsContent>

          <TabsContent value="github">
            <GitHubIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

