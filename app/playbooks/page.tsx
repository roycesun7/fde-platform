"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Clock, TrendingUp } from "lucide-react";
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
  estimatedTime: string;
  impact: string;
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

  const impactColors = {
    High: "destructive",
    Medium: "secondary",
    Low: "outline",
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
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{playbook.title}</CardTitle>
                  <Badge variant={impactColors[playbook.impact as keyof typeof impactColors] as any}>
                    {playbook.impact}
                  </Badge>
                </div>
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

                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{playbook.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{playbook.impact} impact</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="mt-4 w-full"
                  onClick={() => applyPlaybook(playbook)}
                >
                  <Rocket className="h-4 w-4 mr-2" />
                      Apply to Dropbox
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

