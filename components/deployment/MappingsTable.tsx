"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitPullRequest, ArrowRight } from "lucide-react";
import { useState } from "react";
import { PRPreviewDrawer } from "./PRPreviewDrawer";

interface Mapping {
  source: string;
  dest: string;
  status: "active" | "missing" | "drift";
  lastUpdated: string | null;
  note?: string;
}

interface MappingsTableProps {
  mappings: Mapping[];
  deploymentId: string;
}

const statusConfig = {
  active: { label: "Active", variant: "default" as const },
  missing: { label: "Missing", variant: "destructive" as const },
  drift: { label: "Drift", variant: "secondary" as const },
};

export function MappingsTable({ mappings, deploymentId }: MappingsTableProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Field Mappings</CardTitle>
          <Button onClick={() => setDrawerOpen(true)}>
            <GitPullRequest className="h-4 w-4 mr-2" />
            Generate PR
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mappings.map((mapping, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-4 flex-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {mapping.source}
                  </code>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {mapping.dest}
                  </code>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusConfig[mapping.status].variant}>
                    {statusConfig[mapping.status].label}
                  </Badge>
                  {mapping.lastUpdated && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(mapping.lastUpdated).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <PRPreviewDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        deploymentId={deploymentId}
        mappings={mappings}
      />
    </>
  );
}

