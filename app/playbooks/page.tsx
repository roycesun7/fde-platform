"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Rocket, FileCode, Plus } from "lucide-react";
import { toast } from "sonner";

interface Playbook {
  id: string;
  title: string;
  description: string;
  triggers: string[];
  steps: string[];
  codeSamples: Array<{
    language: string;
    filename?: string;
    content: string;
  }>;
  estimatedTime?: string;
  impact?: string;
}

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);

  useEffect(() => {
    fetch("/fixtures/playbooks.json")
      .then((res) => res.json())
      .then((data) => setPlaybooks(data))
      .catch((err) => console.error("Failed to fetch playbooks:", err));
  }, []);

  const applyPlaybook = (playbook: Playbook) => {
    toast.success(`Applied "${playbook.title}" to Dropbox deployment`);
    // In a real app, this would trigger the playbook execution
  };

  const renderCodeDiff = (playbook: Playbook) => {
    if (!playbook.codeSamples || playbook.codeSamples.length === 0) {
      return <div className="text-sm text-muted-foreground">No code samples available</div>;
    }

    return (
      <div className="space-y-4">
        {playbook.codeSamples.map((sample, idx) => {
          // For playbooks, we'll show the code as "new" additions
          const codeLines = sample.content.split("\n");

          return (
            <div key={idx} className="space-y-2">
              <Tabs defaultValue="diff" className="w-full">
                <TabsList>
                  <TabsTrigger value="diff">Diff View</TabsTrigger>
                  <TabsTrigger value="code">Full Code</TabsTrigger>
                </TabsList>

                <TabsContent value="diff" className="space-y-2">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-3 py-2 border-b flex items-center justify-between">
                      <span className="text-sm font-mono">{sample.filename || `code.${sample.language}`}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="gap-1">
                          <Plus className="h-3 w-3 text-green-500" />
                          {codeLines.length} additions
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-background max-h-[600px] overflow-y-auto">
                      {codeLines.map((line, lineIdx) => (
                        <div
                          key={lineIdx}
                          className="flex items-start gap-2 px-3 py-1 font-mono text-xs bg-green-500/10 border-l-2 border-green-500"
                        >
                          <span className="text-muted-foreground w-8 text-right select-none">
                            {lineIdx + 1}
                          </span>
                          <span className="w-4 flex items-center justify-center">
                            <Plus className="h-3 w-3 text-green-500" />
                          </span>
                          <span className="flex-1 text-green-400">{line || " "}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-3 py-2 border-b">
                      <span className="text-sm font-mono">{sample.filename || `code.${sample.language}`}</span>
                    </div>
                    <div className="bg-[#1e1e1e] p-6 overflow-x-auto max-h-[600px] overflow-y-auto">
                      <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                        <code>{sample.content}</code>
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Playbooks</h1>
          <p className="text-muted-foreground mt-1">
            Pre-built solutions for common integration issues
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {playbooks.map((playbook) => (
            <Card key={playbook.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{playbook.title}</CardTitle>
                <CardDescription className="mt-2">
                  {playbook.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Triggers:</h4>
                    <ul className="space-y-1">
                      {playbook.triggers.map((trigger, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start">
                          <span className="mr-2">•</span>
                          <span>{trigger}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Steps:</h4>
                    <ol className="space-y-1">
                      {playbook.steps.slice(0, 3).map((step, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start">
                          <span className="mr-2">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                      {playbook.steps.length > 3 && (
                        <li className="text-sm text-muted-foreground ml-4">
                          +{playbook.steps.length - 3} more steps
                        </li>
                      )}
                    </ol>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <FileCode className="h-4 w-4 mr-2" />
                        View Changes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{playbook.title}</DialogTitle>
                        <DialogDescription className="text-base">{playbook.description}</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        {renderCodeDiff(playbook)}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    className="flex-1"
                    onClick={() => applyPlaybook(playbook)}
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Apply to Dropbox
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

