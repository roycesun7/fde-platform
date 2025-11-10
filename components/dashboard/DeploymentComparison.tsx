"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, GitBranch, Settings } from "lucide-react";

interface ConfigItem {
  name: string;
  value: string;
  isShared: boolean;
  isDifferent?: boolean;
}

interface DeploymentConfig {
  id: string;
  name: string;
  environment: string;
  connectors: ConfigItem[];
  mappings: ConfigItem[];
  webhooks: ConfigItem[];
}

interface DeploymentComparisonProps {
  deployments: DeploymentConfig[];
  projectName: string;
}

export function DeploymentComparison({ deployments, projectName }: DeploymentComparisonProps) {
  const configCategories = ["connectors", "mappings", "webhooks"] as const;

  const getConfigItems = (deployment: DeploymentConfig, category: typeof configCategories[number]) => {
    return deployment[category] || [];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration Comparison - {projectName}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Compare configurations across deployments. Shared configs are inherited from the project.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {configCategories.map((category) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-semibold capitalize flex items-center gap-2">
                {category}
                <Badge variant="outline" className="text-xs">
                  {deployments.length} deployments
                </Badge>
              </h3>

              <div className="border rounded">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">
                        Config Item
                      </th>
                      {deployments.map((deployment) => (
                        <th key={deployment.id} className="text-left text-xs font-medium text-muted-foreground px-4 py-2">
                          <div className="space-y-1">
                            <div className="font-semibold text-foreground">{deployment.name}</div>
                            <Badge variant="outline" className="text-xs">{deployment.environment}</Badge>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Get all unique config items across deployments */}
                    {Array.from(
                      new Set(
                        deployments.flatMap((d) =>
                          getConfigItems(d, category).map((item) => item.name)
                        )
                      )
                    ).map((configName) => {
                      const values = deployments.map((d) =>
                        getConfigItems(d, category).find((item) => item.name === configName)
                      );
                      
                      const allSame = values.every(
                        (v, i, arr) => v?.value === arr[0]?.value
                      );
                      
                      const allShared = values.every((v) => v?.isShared);

                      return (
                        <tr key={configName} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium">
                            <div className="flex items-center gap-2">
                              {configName}
                              {allShared && (
                                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                  <GitBranch className="h-3 w-3" />
                                  Shared
                                </Badge>
                              )}
                            </div>
                          </td>
                          {values.map((value, index) => (
                            <td key={index} className="px-4 py-3 text-sm">
                              {value ? (
                                <div className="flex items-center gap-2">
                                  <span className={allSame ? "text-muted-foreground" : "font-medium"}>
                                    {value.value}
                                  </span>
                                  {!allSame && value.isDifferent && (
                                    <Badge variant="outline" className="text-xs">
                                      Custom
                                    </Badge>
                                  )}
                                  {value.isShared ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Settings className="h-4 w-4 text-blue-600" />
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <X className="h-4 w-4" />
                                  <span className="text-xs">Not configured</span>
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t">
          <div className="text-xs font-medium text-muted-foreground mb-3">Legend:</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Inherited from project</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-blue-600" />
              <span>Custom configuration</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-muted-foreground" />
              <span>Not configured</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <span>Shared across all</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

