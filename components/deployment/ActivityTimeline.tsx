"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitPullRequest, Play, Repeat, Settings, AlertCircle, CheckCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "pr_created" | "job_started" | "job_completed" | "config_changed" | "error" | "deployment";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  metadata?: Record<string, any>;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "pr_created",
    title: "PR #342 created",
    description: "Add missing field mapping for plan_tier",
    timestamp: "2 minutes ago",
    user: "AI Copilot",
    metadata: { prNumber: 342, files: 2 },
  },
  {
    id: "2",
    type: "job_completed",
    title: "Backfill completed",
    description: "Successfully processed 123 records",
    timestamp: "5 minutes ago",
    user: "System",
    metadata: { records: 123, duration: "2m 34s" },
  },
  {
    id: "3",
    type: "job_started",
    title: "Replay events started",
    description: "Replaying 20 failed events",
    timestamp: "8 minutes ago",
    user: "john@acme.com",
    metadata: { count: 20 },
  },
  {
    id: "4",
    type: "error",
    title: "Error spike detected",
    description: "MAPPING_ERROR increased by 45% in last hour",
    timestamp: "15 minutes ago",
    metadata: { errorCode: "MAPPING_ERROR", increase: "45%" },
  },
  {
    id: "5",
    type: "config_changed",
    title: "Configuration updated",
    description: "Webhook retry policy changed to exponential backoff",
    timestamp: "1 hour ago",
    user: "sarah@acme.com",
    metadata: { setting: "retry_policy" },
  },
  {
    id: "6",
    type: "deployment",
    title: "Deployment updated",
    description: "New connector version deployed: v2.3.1",
    timestamp: "2 hours ago",
    user: "System",
    metadata: { version: "v2.3.1" },
  },
  {
    id: "7",
    type: "job_completed",
    title: "Schema sync completed",
    description: "Synced 47 fields from source",
    timestamp: "3 hours ago",
    user: "System",
    metadata: { fields: 47 },
  },
  {
    id: "8",
    type: "pr_created",
    title: "PR #341 created",
    description: "Fix type mismatch for mrr field",
    timestamp: "4 hours ago",
    user: "AI Copilot",
    metadata: { prNumber: 341, files: 1 },
  },
];

const activityIcons = {
  pr_created: GitPullRequest,
  job_started: Play,
  job_completed: CheckCircle,
  config_changed: Settings,
  error: AlertCircle,
  deployment: Repeat,
};

const activityColors = {
  pr_created: "text-blue-500",
  job_started: "text-yellow-500",
  job_completed: "text-green-500",
  config_changed: "text-purple-500",
  error: "text-red-500",
  deployment: "text-cyan-500",
};

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-6">
            {activities.map((activity, index) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];

              return (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Icon */}
                  <div className={cn("relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2", colorClass)}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        {activity.metadata && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(activity.metadata).map(([key, value]) => (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </p>
                        {activity.user && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            {activity.user}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

