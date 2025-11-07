"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Github, CheckCircle, GitPullRequest } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "slack" | "github";
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "pending";
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "slack",
    title: "Error Alert Sent",
    description: "Sent to #deployments",
    timestamp: "1 min ago",
    status: "success",
  },
  {
    id: "2",
    type: "github",
    title: "PR #347 Created",
    description: "Add missing field mapping",
    timestamp: "2 min ago",
    status: "success",
  },
  {
    id: "3",
    type: "github",
    title: "PR #346 Merged",
    description: "Fix type mismatch for mrr",
    timestamp: "5 hours ago",
    status: "success",
  },
  {
    id: "4",
    type: "slack",
    title: "Deployment Update",
    description: "Config change notification",
    timestamp: "6 hours ago",
    status: "success",
  },
];

export function IntegrationActivity() {
  const [slackConnected, setSlackConnected] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);

  useEffect(() => {
    // Check integration status
    const slack = localStorage.getItem("slack-connected") === "true";
    const github = localStorage.getItem("github-connected") === "true";
    setSlackConnected(slack);
    setGithubConnected(github);
  }, []);

  // Only show if at least one integration is connected
  if (!slackConnected && !githubConnected) {
    return null;
  }

  const filteredActivities = mockActivities.filter(activity => {
    if (activity.type === "slack" && !slackConnected) return false;
    if (activity.type === "github" && !githubConnected) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Integration Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="mt-0.5">
                {activity.type === "slack" ? (
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {activity.timestamp}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {slackConnected && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Slack Active</span>
              </div>
            )}
            {githubConnected && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>GitHub Active</span>
              </div>
            )}
          </div>
          <span>Last 24 hours</span>
        </div>
      </CardContent>
    </Card>
  );
}

