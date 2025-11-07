import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MiniChart } from "./MiniChart";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface DeploymentCardProps {
  deployment: {
    id: string;
    name: string;
    health: "healthy" | "noisy" | "degraded";
    errorCounts: number[];
    tags: string[];
    env: string;
  };
}

const healthConfig = {
  healthy: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    label: "Healthy",
  },
  noisy: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    label: "Noisy",
  },
  degraded: {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "Degraded",
  },
};

export function DeploymentCard({ deployment }: DeploymentCardProps) {
  const config = healthConfig[deployment.health];
  const Icon = config.icon;
  const totalErrors = deployment.errorCounts.reduce((a, b) => a + b, 0);

  return (
    <Link href={`/d/${deployment.id}`}>
      <Card className="hover:border-primary transition-colors cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{deployment.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {deployment.id}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={deployment.health === "healthy" ? "default" : "destructive"}>
              {config.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {totalErrors} errors (24h)
            </span>
          </div>

          <div className="h-16">
            <MiniChart data={deployment.errorCounts} />
          </div>

          <div className="flex flex-wrap gap-1">
            {deployment.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

