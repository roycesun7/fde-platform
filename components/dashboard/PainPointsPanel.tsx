import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

const painPoints = [
  {
    title: "Missing field mappings",
    count: 48,
    severity: "high",
    deployments: ["Acme Corp"],
  },
  {
    title: "Type mismatches",
    count: 12,
    severity: "medium",
    deployments: ["Acme Corp"],
  },
  {
    title: "Rate limit errors",
    count: 5,
    severity: "low",
    deployments: ["Gamma LLC"],
  },
];

export function PainPointsPanel() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      case "medium": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "low": return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      default: return "";
    }
  };

  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </div>
          Common Pain Points
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Most frequent issues across deployments
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {painPoints.map((point, i) => (
            <div 
              key={i} 
              className="group relative p-4 rounded-lg border bg-card hover:bg-muted/50 transition-all duration-200 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-base group-hover:text-primary transition-colors">
                      {point.title}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-semibold ${getSeverityColor(point.severity)}`}
                    >
                      {point.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Affecting: {point.deployments.join(", ")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-2xl font-bold">{point.count}</div>
                  <div className="text-xs text-muted-foreground">occurrences</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

