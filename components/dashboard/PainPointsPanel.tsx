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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Common Pain Points
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {painPoints.map((point, i) => (
            <div key={i} className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0">
              <div className="space-y-1">
                <p className="font-medium">{point.title}</p>
                <p className="text-sm text-muted-foreground">
                  {point.deployments.join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={point.severity === "high" ? "destructive" : "secondary"}
                >
                  {point.count}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

