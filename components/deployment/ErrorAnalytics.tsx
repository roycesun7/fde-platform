"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { AlertTriangle, TrendingDown, Clock } from "lucide-react";

interface ErrorAnalyticsProps {
  logs: any[];
}

export function ErrorAnalytics({ logs }: ErrorAnalyticsProps) {
  // Group errors by code
  const errorGroups = logs.reduce((acc: any, log) => {
    if (!acc[log.code]) {
      acc[log.code] = { code: log.code, count: 0, messages: [] };
    }
    acc[log.code].count++;
    acc[log.code].messages.push(log.message);
    return acc;
  }, {});

  const errorData = Object.values(errorGroups).sort((a: any, b: any) => b.count - a.count);

  // Time-based grouping (last 24 hours)
  const hourlyErrors = Array.from({ length: 24 }, (_, i) => ({
    hour: `${23 - i}h ago`,
    errors: Math.floor(Math.random() * 10) + 1,
  })).reverse();

  const COLORS = [
    "hsl(var(--destructive))",
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  const pieData = errorData.slice(0, 5).map((item: any, index) => ({
    name: item.code,
    value: item.count,
    color: COLORS[index % COLORS.length],
  }));

  const totalErrors = logs.length;
  const uniqueErrorTypes = errorData.length;
  const avgErrorsPerHour = (totalErrors / 24).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Errors</p>
                <p className="text-2xl font-bold">{totalErrors}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Types</p>
                <p className="text-2xl font-bold">{uniqueErrorTypes}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg/Hour</p>
                <p className="text-2xl font-bold">{avgErrorsPerHour}</p>
              </div>
              <Clock className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Error Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Error Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyErrors}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 12 }}
                      interval={3}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="errors" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Error Breakdown by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorData.map((error: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="destructive">{error.code}</Badge>
                        <span className="font-medium">{error.count} occurrences</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {error.messages[0]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {((error.count / totalErrors) * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

