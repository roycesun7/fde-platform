"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, TrendingUp } from "lucide-react";
import { SimulatedError } from "@/lib/simulationEngine";

export function LiveErrorFeed() {
  const [errors, setErrors] = useState<SimulatedError[]>([]);

  useEffect(() => {
    // Listen for simulation errors
    const handleSimulationError = (event: any) => {
      const error = event.detail as SimulatedError;
      setErrors((prev) => [error, ...prev].slice(0, 10));
    };

    window.addEventListener("simulation-error", handleSimulationError);

    return () => {
      window.removeEventListener("simulation-error", handleSimulationError);
    };
  }, []);

  if (errors.length === 0) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50/30 dark:bg-orange-950/10">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
          </div>
          <CardTitle className="text-base">Live Error Feed</CardTitle>
          <Badge variant="secondary" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            {errors.length} recent
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-80 overflow-y-auto">
        {errors.map((error, index) => (
          <div
            key={error.id}
            className="p-3 bg-card rounded border animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              {/* Severity indicator */}
              <div className={`h-10 w-1 rounded-full ${getSeverityColor(error.severity)}`} />
              
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="outline" className="text-xs font-mono">
                    {error.errorType}
                  </Badge>
                  <span className="text-xs font-medium">{error.deploymentName}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <Clock className="h-3 w-3" />
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                
                {/* Message */}
                <div className="text-sm text-muted-foreground">
                  {error.errorMessage}
                </div>
                
                {/* Payload preview */}
                {error.payload && (
                  <div className="mt-2 text-xs font-mono bg-muted/50 p-2 rounded">
                    {Object.entries(error.payload).slice(0, 2).map(([key, value]) => (
                      <div key={key} className="truncate">
                        <span className="text-muted-foreground">{key}:</span>{" "}
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

