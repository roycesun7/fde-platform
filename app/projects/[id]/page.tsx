"use client";

import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { DeploymentComparison } from "@/components/dashboard/DeploymentComparison";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Settings, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getProjectById } from "@/lib/mockProjectData";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  // Get project from mock data
  const project = getProjectById(projectId);

  if (!project) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-semibold">Project not found</p>
              <p className="text-sm text-muted-foreground mt-2">
                The project you're looking for doesn't exist.
              </p>
            </div>
            <Link href="/">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Get summary of shared configs
  const sharedConnectorTypes = project.deployments[0]?.connectors
    .filter(c => c.isShared)
    .map(c => c.value)
    .join(", ") || "None";
  
  const sharedMappingTypes = project.deployments[0]?.mappings
    .filter(m => m.isShared)
    .map(m => m.name)
    .join(", ") || "None";
  
  const customConfigCount = project.deployments.reduce((count, d) => {
    const customConfigs = [
      ...d.connectors.filter(c => !c.isShared),
      ...d.mappings.filter(m => !m.isShared),
      ...d.webhooks.filter(w => !w.isShared),
    ];
    return count + customConfigs.length;
  }, 0);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <Badge variant="outline" className="text-sm">
                {project.deployments.length} deployments
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2">{project.description}</p>
          </div>
        </div>

        {/* Project Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Project Configuration Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Shared Connectors</div>
                <div className="flex items-start gap-2">
                  <Settings className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="font-medium text-sm">{sharedConnectorTypes}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Shared Mappings</div>
                <div className="flex items-start gap-2">
                  <Settings className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="font-medium text-sm">{sharedMappingTypes}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Custom Configurations</div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{customConfigCount} custom overrides</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison View */}
        <DeploymentComparison 
          deployments={project.deployments} 
          projectName={project.name}
        />

        {/* Deployment List */}
        <Card>
          <CardHeader>
            <CardTitle>Deployments in this Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {project.deployments.map((deployment) => (
                <Link key={deployment.id} href={`/d/${deployment.id}`}>
                  <div className="flex items-center justify-between p-4 border rounded hover:bg-muted/50 transition-colors">
                    <div>
                      <div className="font-medium">{deployment.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">{deployment.id}</div>
                    </div>
                    <Badge variant="outline">{deployment.environment}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

