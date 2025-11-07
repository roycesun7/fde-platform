"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Throughput
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{metrics.eventsPerSecond}</p>
                <p className="text-sm text-muted-foreground">events/sec</p>
              </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Error Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{metrics.errorRate.toFixed(2)}%</p>
                <p className="text-sm text-muted-foreground">current rate</p>
              </div>
              <TrendIcon trend={trends.errors} />
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <Line
                    type="monotone"
                    dataKey="errorRate"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Latency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{metrics.avgLatency}ms</p>
                <p className="text-sm text-muted-foreground">response time</p>
              </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Active Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold">{metrics.activeConnections}</p>
              <p className="text-sm text-muted-foreground">concurrent connections</p>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <Line
                    type="stepAfter"
                    dataKey="activeConnections"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

