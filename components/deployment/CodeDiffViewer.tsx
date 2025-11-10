"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, Plus, Minus, ExternalLink } from "lucide-react";

interface DiffLine {
  type: "add" | "remove" | "context";
  content: string;
  lineNumber?: number;
}

interface FileDiff {
  filename: string;
  additions: number;
  deletions: number;
  diff: DiffLine[];
}

export function CodeDiffViewer() {
  // Mock PR diff data
  const prData = {
    number: 342,
    title: "Add missing field mapping for plan_tier",
    branch: "fix/plan-tier-mapping",
    author: "AI Copilot",
    url: "#",
  };

  const fileDiffs: FileDiff[] = [
    {
      filename: "src/mappings/dropbox.ts",
      additions: 8,
      deletions: 2,
      diff: [
        { type: "context", content: "export const dropboxMapping = {", lineNumber: 12 },
        { type: "context", content: "  customer_id: 'id',", lineNumber: 13 },
        { type: "context", content: "  email: 'email',", lineNumber: 14 },
        { type: "remove", content: "  // TODO: Add plan_tier mapping", lineNumber: 15 },
        { type: "add", content: "  plan_tier: (data: any) => {", lineNumber: 15 },
        { type: "add", content: "    const tier = data.subscription?.plan?.tier;", lineNumber: 16 },
        { type: "add", content: "    if (!tier) {", lineNumber: 17 },
        { type: "add", content: "      throw new MappingError('plan_tier is required');", lineNumber: 18 },
        { type: "add", content: "    }", lineNumber: 19 },
        { type: "add", content: "    return tier.toLowerCase();", lineNumber: 20 },
        { type: "add", content: "  },", lineNumber: 21 },
        { type: "context", content: "  mrr: 'monthly_revenue',", lineNumber: 22 },
        { type: "context", content: "};", lineNumber: 23 },
      ],
    },
    {
      filename: "src/types/dropbox.ts",
      additions: 3,
      deletions: 0,
      diff: [
        { type: "context", content: "export interface DropboxCustomer {", lineNumber: 5 },
        { type: "context", content: "  id: string;", lineNumber: 6 },
        { type: "context", content: "  email: string;", lineNumber: 7 },
        { type: "add", content: "  plan_tier: 'free' | 'pro' | 'enterprise';", lineNumber: 8 },
        { type: "context", content: "  mrr: number;", lineNumber: 9 },
        { type: "context", content: "}", lineNumber: 10 },
      ],
    },
  ];

  const renderDiffLine = (line: DiffLine, index: number) => {
    const bgColor =
      line.type === "add"
        ? "bg-green-500/10 border-l-2 border-green-500"
        : line.type === "remove"
        ? "bg-red-500/10 border-l-2 border-red-500"
        : "bg-muted/30";

    const icon =
      line.type === "add" ? (
        <Plus className="h-3 w-3 text-green-500" />
      ) : line.type === "remove" ? (
        <Minus className="h-3 w-3 text-red-500" />
      ) : null;

    return (
      <div key={index} className={`flex items-start gap-2 px-3 py-1 font-mono text-xs ${bgColor}`}>
        <span className="text-muted-foreground w-10 text-right select-none">
          {line.lineNumber || ""}
        </span>
        <span className="w-4 flex items-center justify-center">{icon}</span>
        <span className="flex-1">{line.content}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Code Changes
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              PR #{prData.number}: {prData.title}
            </p>
          </div>
          <Button size="sm" variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on GitHub
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline" className="gap-1">
              <Plus className="h-3 w-3 text-green-500" />
              {fileDiffs.reduce((sum, f) => sum + f.additions, 0)} additions
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Minus className="h-3 w-3 text-red-500" />
              {fileDiffs.reduce((sum, f) => sum + f.deletions, 0)} deletions
            </Badge>
            <span className="text-muted-foreground">
              {fileDiffs.length} file{fileDiffs.length !== 1 ? "s" : ""} changed
            </span>
          </div>

          <Tabs defaultValue={fileDiffs[0]?.filename} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              {fileDiffs.map((file) => (
                <TabsTrigger key={file.filename} value={file.filename} className="text-xs">
                  {file.filename.split("/").pop()}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    +{file.additions} -{file.deletions}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {fileDiffs.map((file) => (
              <TabsContent key={file.filename} value={file.filename} className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-3 py-2 border-b">
                    <span className="text-sm font-mono">{file.filename}</span>
                  </div>
                  <div className="bg-background">
                    {file.diff.map((line, index) => renderDiffLine(line, index))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

