"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DeploymentCard } from "@/components/dashboard/DeploymentCard";
import { PainPointsPanel } from "@/components/dashboard/PainPointsPanel";
import { LiveMetrics } from "@/components/dashboard/LiveMetrics";
import { SearchFilter } from "@/components/dashboard/SearchFilter";
import { AskAI } from "@/components/dashboard/AskAI";

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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Deployments</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your field data engine deployments
          </p>
        </div>

        <SearchFilter
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDeployments.length > 0 ? (
            filteredDeployments.map((deployment) => (
              <DeploymentCard key={deployment.id} deployment={deployment} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p>No deployments found matching your filters</p>
            </div>
          )}
        </div>

        <LiveMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PainPointsPanel />
          </div>
          <AskAI />
        </div>
      </div>
    </AppLayout>
  );
}
