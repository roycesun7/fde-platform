"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Activity, TrendingUp, TrendingDown, Minus, AlertCircle, Clock } from "lucide-react";

export function LiveMetrics() {
  const [metrics, setMetrics] = useState({
    eventsPerSecond: 0,
    errorRate: 0,
    avgLatency: 0,
    activeConnections: 0,
  });

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Simulate live metrics
    const interval = setInterval(() => {
      const newMetrics = {
        eventsPerSecond: Math.floor(Math.random() * 50) + 100,
        errorRate: Math.random() * 5,
        avgLatency: Math.floor(Math.random() * 100) + 150,
        activeConnections: Math.floor(Math.random() * 10) + 15,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMetrics(newMetrics);
      setHistory((prev) => {
        const updated = [...prev, newMetrics];
        return updated.slice(-20); // Keep last 20 data points
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getTrend = (current: number, previous: number) => {
    if (!previous) return "neutral";
    if (current > previous) return "up";
    if (current < previous) return "down";
    return "neutral";
  };

  const prevMetrics = history[history.length - 2];
  const trends = {
    events: getTrend(metrics.eventsPerSecond, prevMetrics?.eventsPerSecond),
    errors: getTrend(metrics.errorRate, prevMetrics?.errorRate),
    latency: getTrend(metrics.avgLatency, prevMetrics?.avgLatency),
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Live Metrics</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 border rounded bg-card">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium">Live</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-base font-semibold">Throughput</span>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight">{metrics.eventsPerSecond}</span>
                <span className="text-sm text-muted-foreground">events/sec</span>
                <TrendIcon trend={trends.events} />
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="eventsPerSecond"
                      stroke="hsl(var(--primary))"
                      fill="url(#colorEvents)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-base font-semibold">Error Rate</span>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight text-red-600">{metrics.errorRate.toFixed(2)}%</span>
                <span className="text-sm text-muted-foreground">current</span>
                <TrendIcon trend={trends.errors} />
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="errorRate"
                      stroke="hsl(var(--destructive))"
                      fill="url(#colorErrors)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-base font-semibold">Latency</span>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight">{metrics.avgLatency}</span>
                <span className="text-sm text-muted-foreground">ms</span>
                <TrendIcon trend={trends.latency} />
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="avgLatency"
                      stroke="hsl(var(--chart-2))"
                      fill="url(#colorLatency)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-base font-semibold">Connections</span>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight">{metrics.activeConnections}</span>
                <span className="text-sm text-muted-foreground">active</span>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorConnections" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="stepAfter"
                      dataKey="activeConnections"
                      stroke="hsl(var(--chart-3))"
                      fill="url(#colorConnections)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

