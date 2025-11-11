"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/deployment/KPICard";
import { FailuresTable } from "@/components/deployment/FailuresTable";
import { JobsList } from "@/components/deployment/JobsList";
import { ErrorAnalytics } from "@/components/deployment/ErrorAnalytics";
import { WebhookTester } from "@/components/deployment/WebhookTester";
import { ActivityTimeline } from "@/components/deployment/ActivityTimeline";
import { CodeDiffViewer } from "@/components/deployment/CodeDiffViewer";
import { SlackAlertConfig } from "@/components/deployment/SlackAlertConfig";
import { CodeAssistant } from "@/components/deployment/CodeAssistant";
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
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 animate-pulse">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-lg font-medium">Loading deployment...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!deployment) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-semibold">Deployment not found</p>
              <p className="text-sm text-muted-foreground mt-2">
                The deployment you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </div>
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
      <div className="space-y-6 animate-fade-in">
        {/* Header with Status Bar */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{deployment.name}</h1>
                <Badge className="text-sm px-3 py-1">
                  {deployment.environment || "production"}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">
                  {deployment.connectors.source.type}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="text-muted-foreground">
                  {deployment.connectors.destination.type}
                </span>
              </div>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded bg-card">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-600">{successRate}%</span>
              </div>
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600" 
                  style={{ width: `${successRate}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground mb-1">24h Errors</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stats.errors24h || 0}</span>
              </div>
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600" 
                  style={{ width: `${Math.min((stats.errors24h || 0) / 100 * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground mb-1">Avg Latency</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stats.avgLatency || 0}</span>
                <span className="text-sm text-muted-foreground">ms</span>
              </div>
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600" 
                  style={{ width: `${Math.min((stats.avgLatency || 0) / 500 * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Events</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stats.totalEvents || 0}</span>
              </div>
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-foreground" 
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
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

            <FailuresTable logs={deployment.logs || []} />
          </TabsContent>

          <TabsContent value="analytics">
            <ErrorAnalytics logs={deployment.logs || []} />
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <CodeAssistant />
          </TabsContent>

          <TabsContent value="jobs">
            <JobsList deploymentId={id} />
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
        </Tabs>
      </div>
    </AppLayout>
  );
}

