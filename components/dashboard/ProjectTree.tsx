"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, GitBranch, Circle, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Deployment {
  id: string;
  name: string;
  health: "healthy" | "noisy" | "degraded";
  environment: string;
  errorCount: number;
  isShared: boolean; // Indicates if config is inherited from project
}

interface Project {
  id: string;
  name: string;
  description: string;
  deployments: Deployment[];
  sharedConfig: {
    connectors: boolean;
    mappings: boolean;
    webhooks: boolean;
  };
}

interface ProjectTreeProps {
  projects: Project[];
}

export function ProjectTree({ projects }: ProjectTreeProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy": return "text-green-600";
      case "noisy": return "text-yellow-600";
      case "degraded": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case "healthy": return "default";
      case "noisy": return "secondary";
      case "degraded": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-2">
      {projects.map((project) => {
        const isExpanded = expandedProjects.has(project.id);
        const totalErrors = project.deployments.reduce((sum, d) => sum + d.errorCount, 0);
        const healthyCount = project.deployments.filter(d => d.health === "healthy").length;

        return (
          <div key={project.id} className="border rounded bg-card">
            {/* Project Header */}
            <div className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => toggleProject(project.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {isExpanded ? (
                <FolderOpen className="h-5 w-5 text-blue-600" />
              ) : (
                <Folder className="h-5 w-5 text-blue-600" />
              )}

              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleProject(project.id)}>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-base">{project.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {project.deployments.length} deployments
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Healthy</div>
                    <div className="font-semibold text-green-600">
                      {healthyCount}/{project.deployments.length}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Total Errors</div>
                    <div className="font-semibold">{totalErrors}</div>
                  </div>
                </div>
                
                <Link href={`/projects/${project.id}`}>
                  <Button variant="outline" size="sm" className="gap-2" onClick={(e) => e.stopPropagation()}>
                    <GitBranch className="h-4 w-4" />
                    Compare
                  </Button>
                </Link>
              </div>
            </div>

            {/* Shared Configuration Indicator */}
            {isExpanded && (
              <div className="px-4 pb-3 border-t bg-muted/30">
                {project.id === "internal-base" ? (
                  // Show what the base defines
                  <div className="py-3 space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-semibold text-foreground">
                        Base Configuration Template
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="font-medium text-muted-foreground">Connectors</div>
                        <div className="space-y-0.5 text-muted-foreground">
                          <div>✓ Salesforce → PostgreSQL</div>
                          <div>✓ OAuth 2.0, API v58.0</div>
                          <div>✓ Sync every 15 min</div>
                          <div>✓ Batch size 200</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-muted-foreground">Mappings</div>
                        <div className="space-y-0.5 text-muted-foreground">
                          <div>✓ Account → accounts</div>
                          <div>✓ Contact → contacts</div>
                          <div>✓ Opportunity → opportunities</div>
                          <div>✓ Lead → leads</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-muted-foreground">Webhooks</div>
                        <div className="space-y-0.5 text-muted-foreground">
                          <div>○ Not configured</div>
                          <div className="text-xs italic">(optional per deployment)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show shared config summary for deployments
                  <div className="flex items-center gap-2 py-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">All inherit base config, customizations shown below:</span>
                  </div>
                )}
              </div>
            )}

            {/* Deployments Tree */}
            {isExpanded && project.deployments.length > 0 && (
              <div className="border-t">
                {project.deployments.map((deployment, index) => {
                  // Group deployments by company
                  const prevDeployment = index > 0 ? project.deployments[index - 1] : null;
                  const nextDeployment = index < project.deployments.length - 1 ? project.deployments[index + 1] : null;
                  
                  // Determine company based on deployment name
                  const getCompany = (name: string) => {
                    if (name.includes("Internal")) return "Internal";
                    if (name.includes("Acme")) return "Acme Corp";
                    if (name.includes("TechStart")) return "TechStart Inc";
                    if (name.includes("Global")) return "Global Retail";
                    return "Other";
                  };
                  
                  const currentCompany = getCompany(deployment.name);
                  const prevCompany = prevDeployment ? getCompany(prevDeployment.name) : null;
                  const showCompanyHeader = currentCompany !== prevCompany;
                  
                  return (
                    <div key={deployment.id}>
                      {/* Company Group Header */}
                      {showCompanyHeader && (
                        <div className="px-4 py-2 bg-muted/50 border-t">
                          <span className="text-xs font-semibold text-muted-foreground">
                            {currentCompany}
                          </span>
                        </div>
                      )}
                      
                      {/* Deployment Row */}
                      <Link href={`/d/${deployment.id}`} className="block">
                        <div className="flex items-center gap-3 p-3 pl-12 hover:bg-muted/50 transition-colors border-t">
                          {/* Tree Branch Indicator */}
                          <div className="relative">
                            <div className="absolute -left-8 top-1/2 w-6 h-px bg-border"></div>
                            {index !== project.deployments.length - 1 && (
                              <div className="absolute -left-8 top-1/2 bottom-0 w-px bg-border"></div>
                            )}
                            <Circle className={`h-3 w-3 fill-current ${getHealthColor(deployment.health)}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">{deployment.name}</span>
                              <Badge variant={getHealthBadge(deployment.health) as any} className="text-xs">
                                {deployment.health}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {deployment.environment}
                              </Badge>
                              {deployment.isShared ? (
                                <Badge variant="secondary" className="text-xs flex items-center gap-1 bg-green-500/10 text-green-700 border-green-200">
                                  <GitBranch className="h-3 w-3" />
                                  Inherited
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs flex items-center gap-1 bg-blue-500/10 text-blue-700 border-blue-200">
                                  Custom
                                </Badge>
                              )}
                            </div>
                            
                            {/* Show what's different */}
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              {(() => {
                                const customConnectors = deployment.connectors.filter(c => !c.isShared || c.isDifferent);
                                const customMappings = deployment.mappings.filter(m => !m.isShared || m.isDifferent);
                                const customWebhooks = deployment.webhooks.filter(w => !w.isShared || w.isDifferent);
                                const hasCustom = customConnectors.length > 0 || customMappings.length > 0 || customWebhooks.length > 0;
                                
                                if (!hasCustom) {
                                  return <span className="text-xs text-muted-foreground">100% base configuration</span>;
                                }
                                
                                return (
                                  <>
                                    {customConnectors.length > 0 && (
                                      <span className="text-xs px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">
                                        {customConnectors.map(c => c.name.split(' ')[0]).join(', ')}
                                      </span>
                                    )}
                                    {customMappings.length > 0 && (
                                      <span className="text-xs px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800">
                                        {customMappings.length} custom {customMappings.length === 1 ? 'mapping' : 'mappings'}
                                      </span>
                                    )}
                                    {customWebhooks.length > 0 && (
                                      <span className="text-xs px-1.5 py-0.5 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 rounded border border-orange-200 dark:border-orange-800">
                                        {customWebhooks.length} {customWebhooks.length === 1 ? 'webhook' : 'webhooks'}
                                      </span>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>

                          <div className="text-sm text-right">
                            <span className={`font-semibold ${deployment.errorCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {deployment.errorCount} errors
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

