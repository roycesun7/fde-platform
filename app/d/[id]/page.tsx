"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/deployment/KPICard";
import { FailuresTable } from "@/components/deployment/FailuresTable";
import { MappingsTable } from "@/components/deployment/MappingsTable";
import { JobsList } from "@/components/deployment/JobsList";
import { RunbookChat } from "@/components/deployment/RunbookChat";
import { ErrorAnalytics } from "@/components/deployment/ErrorAnalytics";
import { WebhookTester } from "@/components/deployment/WebhookTester";
import { ActivityTimeline } from "@/components/deployment/ActivityTimeline";
import { ConfigManager } from "@/components/deployment/ConfigManager";
import { CodeDiffViewer } from "@/components/deployment/CodeDiffViewer";
import { SlackAlertConfig } from "@/components/deployment/SlackAlertConfig";
import { AlertCircle, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { useDeploymentMonitoring } from "@/hooks/useDeploymentMonitoring";

export default function DeploymentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [deployment, setDeployment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/deployments/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDeployment(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch deployment:", err);
        setLoading(false);
      });
  }, [id]);

  // Monitor deployment - must be called unconditionally (before any early returns)
  useDeploymentMonitoring(
    id,
    deployment?.name || '',
    deployment ? {
      errorCount: deployment.stats?.errors24h || 0,
      totalEvents: deployment.stats?.totalEvents || 0,
      errorsByType: deployment.logs?.reduce((acc: Record<string, number>, log: any) => {
        acc[log.errorCode] = (acc[log.errorCode] || 0) + 1;
        return acc;
      }, {}) || {}
    } : undefined,
    !!deployment // Only enable when deployment is loaded
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (!deployment) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Deployment not found</p>
        </div>
      </AppLayout>
    );
  }

  // Show empty state for non-configured deployments
  if (!deployment.connectors || deployment.message) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{deployment.name}</h1>
            <Badge className="mt-2">{deployment.environment || "production"}</Badge>
          </div>
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Connectors Not Configured</p>
              <p className="text-sm text-muted-foreground mt-2">
                This deployment needs connector configuration to start syncing data.
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const stats = deployment.stats || {};
  const successRate = ((stats.successRate || 0) * 100).toFixed(1);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{deployment.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge>{deployment.environment || "production"}</Badge>
            <span className="text-sm text-muted-foreground">
              {deployment.connectors.source.type} → {deployment.connectors.destination.type}
            </span>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="mappings">Mappings</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="webhook">Webhook</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="24h Errors"
                value={stats.errors24h || 0}
                subtitle={`${successRate}% success rate`}
                icon={AlertCircle}
                trend="down"
              />
              <KPICard
                title="Total Events"
                value={(stats.totalEvents || 0).toLocaleString()}
                subtitle="All time"
                icon={TrendingUp}
                trend="up"
              />
              <KPICard
                title="Avg Latency"
                value={`${stats.avgLatencyMs || 0}ms`}
                subtitle="Response time"
                icon={Clock}
                trend="neutral"
              />
              <KPICard
                title="Success Rate"
                value={`${successRate}%`}
                subtitle="Last 24 hours"
                icon={CheckCircle}
                trend={parseFloat(successRate) > 90 ? "up" : "down"}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FailuresTable logs={deployment.logs || []} />
              </div>
              <div>
                <RunbookChat deploymentId={id} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <ErrorAnalytics logs={deployment.logs || []} />
          </TabsContent>

          <TabsContent value="mappings">
            <MappingsTable
              mappings={deployment.mappings || []}
              deploymentId={id}
            />
          </TabsContent>

          <TabsContent value="code">
            <CodeDiffViewer />
          </TabsContent>

          <TabsContent value="webhook">
            <WebhookTester />
          </TabsContent>

          <TabsContent value="jobs">
            <JobsList deploymentId={id} />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTimeline />
          </TabsContent>

          <TabsContent value="alerts">
            <SlackAlertConfig 
              deploymentId={id}
              deploymentName={deployment.name}
              stats={{
                errorCount: stats.errors24h || 0,
                totalEvents: stats.totalEvents || 0,
                errorsByType: deployment.logs?.reduce((acc: Record<string, number>, log: any) => {
                  acc[log.errorCode] = (acc[log.errorCode] || 0) + 1;
                  return acc;
                }, {}) || {}
              }}
            />
          </TabsContent>

          <TabsContent value="config">
            <ConfigManager deployment={deployment} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

