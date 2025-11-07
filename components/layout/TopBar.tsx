"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { NotificationCenter } from "./NotificationCenter";
import { IntegrationsStatus } from "./IntegrationsStatus";

export function TopBar() {
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (!demoMode) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/jobs/tick", { method: "POST" });
        const data = await res.json();
        
        if (data.updated && data.updated.length > 0) {
          data.updated.forEach((job: any) => {
            if (job.status === "running") {
              toast.info(`Job ${job.id} is now running`);
            } else if (job.status === "succeeded") {
              toast.success(`Job ${job.id} completed successfully`);
            }
          });
        }
      } catch (error) {
        console.error("Failed to tick jobs:", error);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [demoMode]);

  return (
    <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Field Data Engine</h2>
        <Badge variant="outline" className="text-xs">
          Production
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <IntegrationsStatus />
        <NotificationCenter />
        <Button
          variant={demoMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setDemoMode(!demoMode);
            toast.info(demoMode ? "Demo mode disabled" : "Demo mode enabled - jobs will auto-progress");
          }}
        >
          {demoMode ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Demo Mode On
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Demo Mode Off
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

