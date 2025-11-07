"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

export default function ComparePage() {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [deployment1, setDeployment1] = useState("acme");
  const [deployment2, setDeployment2] = useState("beta");

  useEffect(() => {
    fetch("/api/deployments")
      .then((res) => res.json())
      .then((data) => setDeployments(data))
      .catch((err) => console.error("Failed to fetch deployments:", err));
  }, []);

  const dep1 = deployments.find((d) => d.id === deployment1);
  const dep2 = deployments.find((d) => d.id === deployment2);

  if (!dep1 || !dep2) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  const totalErrors1 = dep1.errorCounts.reduce((a: number, b: number) => a + b, 0);
  const totalErrors2 = dep2.errorCounts.reduce((a: number, b: number) => a + b, 0);

  const metrics = [
    {
      label: "Health Status",
      value1: dep1.health,
      value2: dep2.health,
      type: "status",
    },
    {
      label: "Total Errors (24h)",
      value1: totalErrors1,
      value2: totalErrors2,
      type: "number",
      better: "lower",
    },
    {
      label: "Environment",
      value1: dep1.env,
      value2: dep2.env,
      type: "text",
    },
    {
      label: "Tags",
      value1: dep1.tags.length,
      value2: dep2.tags.length,
      type: "number",
    },
    {
      label: "Error Trend",
      value1: dep1.errorCounts.slice(-3).reduce((a: number, b: number) => a + b, 0),
      value2: dep2.errorCounts.slice(-3).reduce((a: number, b: number) => a + b, 0),
      type: "number",
      better: "lower",
    },
  ];

  const getBetterValue = (metric: any) => {
    if (metric.type !== "number" || !metric.better) return null;
    if (metric.better === "lower") {
      return metric.value1 < metric.value2 ? "left" : metric.value1 > metric.value2 ? "right" : "equal";
    }
    return metric.value1 > metric.value2 ? "left" : metric.value1 < metric.value2 ? "right" : "equal";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Compare Deployments</h1>
          <p className="text-muted-foreground mt-1">
            Side-by-side comparison of deployment metrics and health
          </p>
        </div>

        {/* Deployment Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Card>
            <CardContent className="pt-6">
              <label className="text-sm font-medium mb-2 block">Deployment 1</label>
              <Select value={deployment1} onValueChange={setDeployment1}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {deployments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <ArrowRight className="h-8 w-8 text-muted-foreground" />
          </div>

          <Card>
            <CardContent className="pt-6">
              <label className="text-sm font-medium mb-2 block">Deployment 2</label>
              <Select value={deployment2} onValueChange={setDeployment2}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {deployments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Metrics Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.map((metric, index) => {
                const better = getBetterValue(metric);
                return (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 items-center p-4 border rounded-lg"
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {metric.type === "status" ? (
                          <Badge
                            variant={
                              metric.value1 === "healthy"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {metric.value1}
                          </Badge>
                        ) : (
                          <span className="text-lg font-semibold">
                            {metric.value1}
                          </span>
                        )}
                        {better === "left" && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="font-medium text-muted-foreground">
                        {metric.label}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {metric.type === "status" ? (
                          <Badge
                            variant={
                              metric.value2 === "healthy"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {metric.value2}
                          </Badge>
                        ) : (
                          <span className="text-lg font-semibold">
                            {metric.value2}
                          </span>
                        )}
                        {better === "right" && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {totalErrors1 < totalErrors2 ? (
                  <TrendingDown className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">
                    {dep1.name} has {Math.abs(totalErrors1 - totalErrors2)} {totalErrors1 < totalErrors2 ? "fewer" : "more"} errors than {dep2.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {totalErrors1 < totalErrors2 ? "Better" : "Worse"} error rate by{" "}
                    {(Math.abs(totalErrors1 - totalErrors2) / Math.max(totalErrors1, totalErrors2) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                {dep1.health === "healthy" && dep2.health !== "healthy" ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : dep2.health === "healthy" && dep1.health !== "healthy" ? (
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                )}
                <div>
                  <p className="font-medium">Health Status</p>
                  <p className="text-sm text-muted-foreground">
                    {dep1.name} is {dep1.health}, {dep2.name} is {dep2.health}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

