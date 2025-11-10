"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DeploymentCard } from "@/components/dashboard/DeploymentCard";
import { PainPointsPanel } from "@/components/dashboard/PainPointsPanel";
import { LiveMetrics } from "@/components/dashboard/LiveMetrics";
import { SearchFilter } from "@/components/dashboard/SearchFilter";
import { AskAI } from "@/components/dashboard/AskAI";
import { IntegrationActivity } from "@/components/dashboard/IntegrationActivity";
import { ProjectTree } from "@/components/dashboard/ProjectTree";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProjects } from "@/lib/mockProjectData";

interface Deployment {
  id: string;
  name: string;
  health: "healthy" | "noisy" | "degraded";
  errorCounts: number[];
  tags: string[];
  env: string;
}

export default function DashboardPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [filteredDeployments, setFilteredDeployments] = useState<Deployment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ health: "all", env: "all" });
  const [viewMode, setViewMode] = useState<"tree" | "grid">("tree");

  useEffect(() => {
    fetch("/api/deployments")
      .then((res) => res.json())
      .then((data) => {
        setDeployments(data);
        setFilteredDeployments(data);
      })
      .catch((err) => console.error("Failed to fetch deployments:", err));
  }, []);

  useEffect(() => {
    let filtered = deployments;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply health filter
    if (filters.health !== "all") {
      filtered = filtered.filter((d) => d.health === filters.health);
    }

    // Apply env filter
    if (filters.env !== "all") {
      filtered = filtered.filter((d) => d.env === filters.env);
    }

    setFilteredDeployments(filtered);
  }, [searchQuery, filters, deployments]);

  // Use realistic mock project data
  const projects = mockProjects;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header with Stats Bar */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Projects & Deployments</h1>
              <p className="text-muted-foreground mt-2">
                Hierarchical view of projects and their deployments
              </p>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-2xl font-bold">{deployments.length}</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-foreground" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="p-4 border rounded bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Healthy</span>
                <span className="text-2xl font-bold text-green-600">
                  {deployments.filter(d => d.health === "healthy").length}
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600" 
                  style={{ width: `${(deployments.filter(d => d.health === "healthy").length / deployments.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-4 border rounded bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Noisy</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {deployments.filter(d => d.health === "noisy").length}
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-600" 
                  style={{ width: `${(deployments.filter(d => d.health === "noisy").length / deployments.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-4 border rounded bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Degraded</span>
                <span className="text-2xl font-bold text-red-600">
                  {deployments.filter(d => d.health === "degraded").length}
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600" 
                  style={{ width: `${(deployments.filter(d => d.health === "degraded").length / deployments.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-muted/30 -mx-6 px-6 py-6 border-y">
          <SearchFilter
            onSearch={setSearchQuery}
            onFilterChange={setFilters}
          />
        </div>

        {/* View Toggle */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "tree" | "grid")} className="space-y-6">
          <TabsList>
            <TabsTrigger value="tree">Tree View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>

          {/* Tree View */}
          <TabsContent value="tree" className="space-y-6">
            <ProjectTree projects={projects} />
          </TabsContent>

          {/* Grid View */}
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDeployments.length > 0 ? (
                filteredDeployments.map((deployment, index) => (
                  <div 
                    key={deployment.id} 
                    className={`animate-fade-in stagger-${Math.min(index + 1, 6)}`}
                    style={{ opacity: 0 }}
                  >
                    <DeploymentCard deployment={deployment} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 text-muted-foreground animate-fade-in">
                  <div className="space-y-2">
                    <p className="text-lg font-medium">No deployments found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Metrics Section */}
        <div className="separator-line pt-12">
          <LiveMetrics />
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PainPointsPanel />
          </div>
          <AskAI />
        </div>

        {/* Integration Activity */}
        <div className="separator-line pt-12">
          <IntegrationActivity />
        </div>
      </div>
    </AppLayout>
  );
}
