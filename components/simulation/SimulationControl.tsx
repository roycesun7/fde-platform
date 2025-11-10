"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap
} from "lucide-react";
import { simulationEngine, SimulatedError } from "@/lib/simulationEngine";

interface SimulationControlProps {
  deployments: any[];
}

export function SimulationControl({ deployments }: SimulationControlProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [recentErrors, setRecentErrors] = useState<SimulatedError[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    // Listen for simulation errors
    const unsubscribe = simulationEngine.onError((error) => {
      setRecentErrors((prev) => [error, ...prev].slice(0, 5));
      updateStats();
    });

    // Listen for custom events
    const handleSimulationError = (event: any) => {
      updateStats();
    };

    window.addEventListener("simulation-error", handleSimulationError);

    return () => {
      unsubscribe();
      window.removeEventListener("simulation-error", handleSimulationError);
    };
  }, []);

  const updateStats = () => {
    const allStats = simulationEngine.getAllStats();
    setStats(allStats);
  };

  const handleStart = () => {
    simulationEngine.start(deployments, 3000); // Check every 3 seconds
    setIsRunning(true);
    updateStats();
  };

  const handleStop = () => {
    simulationEngine.stop();
    setIsRunning(false);
  };

  const handleReset = () => {
    simulationEngine.clearErrors();
    setRecentErrors([]);
    setStats([]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const totalErrors = stats.reduce((sum, s) => sum + s.errorCount, 0);
  const avgErrorRate = stats.length > 0 
    ? (stats.reduce((sum, s) => sum + s.errorRate, 0) / stats.length).toFixed(1)
    : "0";

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Simulation Engine</CardTitle>
            {isRunning ? (
              <Badge variant="default" className="bg-green-600">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                Running
              </Badge>
            ) : (
              <Badge variant="secondary">Stopped</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <Button onClick={handleStart} size="sm" className="gap-2">
                <Play className="h-4 w-4" />
                Start Simulation
              </Button>
            ) : (
              <Button onClick={handleStop} size="sm" variant="destructive" className="gap-2">
                <Pause className="h-4 w-4" />
                Stop
              </Button>
            )}
            <Button onClick={handleReset} size="sm" variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 bg-muted/50 rounded border">
            <div className="text-xs text-muted-foreground mb-1">Total Errors</div>
            <div className="text-2xl font-bold">{totalErrors}</div>
          </div>
          <div className="p-3 bg-muted/50 rounded border">
            <div className="text-xs text-muted-foreground mb-1">Avg Error Rate</div>
            <div className="text-2xl font-bold">{avgErrorRate}/min</div>
          </div>
          <div className="p-3 bg-muted/50 rounded border">
            <div className="text-xs text-muted-foreground mb-1">Healthy</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.filter(s => s.health === "healthy").length}
            </div>
          </div>
          <div className="p-3 bg-muted/50 rounded border">
            <div className="text-xs text-muted-foreground mb-1">Issues</div>
            <div className="text-2xl font-bold text-destructive">
              {stats.filter(s => s.health !== "healthy").length}
            </div>
          </div>
        </div>

        {/* Recent Errors */}
        {recentErrors.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Recent Errors (Live)
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recentErrors.map((error) => (
                <div
                  key={error.id}
                  className="p-3 rounded border bg-card text-sm animate-fade-in"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-xs ${getSeverityColor(error.severity)}`}>
                          {error.severity}
                        </Badge>
                        <span className="font-medium text-xs">{error.deploymentName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(error.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs font-mono bg-muted/30 px-2 py-1 rounded">
                        {error.errorType}: {error.errorMessage}
                      </div>
                    </div>
                    {(error.severity === "high" || error.severity === "critical") && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        📩 Slack
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deployment Status */}
        {stats.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Deployment Status</div>
            <div className="grid grid-cols-2 gap-2">
              {stats.slice(0, 6).map((stat) => (
                <div
                  key={stat.deploymentId}
                  className="p-2 rounded border bg-card text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">
                      {deployments.find(d => d.id === stat.deploymentId)?.name || stat.deploymentId}
                    </span>
                    {stat.health === "healthy" ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : stat.health === "noisy" ? (
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.errorCount} errors · {stat.errorRate}/min
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Message */}
        {!isRunning && recentErrors.length === 0 && (
          <div className="text-center py-6 text-sm text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Click "Start Simulation" to generate random errors and noise</p>
            <p className="text-xs mt-1">
              High/Critical errors will trigger Slack notifications if configured
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

