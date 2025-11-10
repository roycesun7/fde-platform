"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Repeat, GitPullRequest, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Job {
  id: string;
  type: "backfill" | "replay_events" | "create_pr";
  status: "queued" | "running" | "succeeded" | "failed";
  deploymentId: string;
  startedAt: string;
  finishedAt?: string;
  meta: Record<string, any>;
}

interface JobsListProps {
  deploymentId: string;
}

const jobIcons = {
  backfill: Play,
  replay_events: Repeat,
  create_pr: GitPullRequest,
};

const statusConfig = {
  queued: { label: "Queued", variant: "secondary" as const },
  running: { label: "Running", variant: "default" as const },
  succeeded: { label: "Succeeded", variant: "outline" as const },
  failed: { label: "Failed", variant: "destructive" as const },
};

export function JobsList({ deploymentId }: JobsListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/jobs?deploymentId=${deploymentId}`);
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 2000);
    return () => clearInterval(interval);
  }, [deploymentId]);

  const runBackfill = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/actions/run-backfill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deploymentId, count: 123 }),
      });
      const data = await res.json();
      toast.success(`Backfill job ${data.jobId} queued`);
      fetchJobs();
    } catch (error) {
      toast.error("Failed to start backfill");
    } finally {
      setLoading(false);
    }
  };

  const replayEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/actions/replay-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deploymentId, count: 20 }),
      });
      const data = await res.json();
      toast.success(`Replay job ${data.jobId} queued`);
      fetchJobs();
    } catch (error) {
      toast.error("Failed to replay events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Jobs</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" onClick={runBackfill} disabled={loading}>
            <Play className="h-4 w-4 mr-2" />
            Run Backfill
          </Button>
          <Button size="sm" variant="outline" onClick={replayEvents} disabled={loading}>
            <Repeat className="h-4 w-4 mr-2" />
            Replay Events
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No jobs yet. Run a backfill or replay events to get started.
            </p>
          ) : (
            jobs.map((job) => {
              const Icon = jobIcons[job.type];
              return (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">
                        {job.type.replace("_", " ").toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(job.startedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {job.meta.count && (
                      <span className="text-sm text-muted-foreground">
                        {job.meta.count} records
                      </span>
                    )}
                    <Badge variant={statusConfig[job.status].variant}>
                      {statusConfig[job.status].label}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

