import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MiniChart } from "./MiniChart";
import { AlertCircle, CheckCircle, AlertTriangle, MessageSquare, Github } from "lucide-react";

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
  
  const [integrations, setIntegrations] = useState(() => {
    if (typeof window === 'undefined') return { slack: false, github: false };
    return {
      slack: localStorage.getItem("slack-connected") === "true",
      github: localStorage.getItem("github-connected") === "true",
    };
  });

  return (
    <Link href={`/d/${deployment.id}`} className="group block h-full">
      <Card className="relative overflow-hidden hover:shadow-xl hover:border-foreground/30 transition-all duration-300 cursor-pointer h-full hover-lift group-hover:scale-[1.02]">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                {deployment.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {deployment.id}
              </p>
            </div>
            <div className={`p-2.5 rounded-lg ${config.bgColor} shrink-0 transition-transform duration-300 group-hover:scale-110`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge 
              variant={deployment.health === "healthy" ? "default" : "destructive"} 
              className="text-xs font-semibold px-3 py-1 shadow-sm"
            >
              {config.label}
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current"></span>
              <span>{totalErrors} errors</span>
            </div>
          </div>

          <div className="h-16 -mx-2 px-2 py-2 bg-muted/30 rounded-lg">
            <MiniChart data={deployment.errorCounts} />
          </div>

          <div className="flex flex-wrap gap-2">
            {deployment.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs hover:bg-muted/50 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {(integrations.slack || integrations.github) && (
            <div className="flex items-center gap-3 pt-3 border-t border-border/50">
              {integrations.slack && (
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-purple-50 dark:bg-purple-950/20 rounded-md transition-colors group-hover:bg-purple-100 dark:group-hover:bg-purple-950/30">
                  <MessageSquare className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">Slack</span>
                </div>
              )}
              {integrations.github && (
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-muted rounded-md transition-colors group-hover:bg-muted/80">
                  <Github className="h-3.5 w-3.5 text-foreground" />
                  <span className="text-xs text-foreground font-medium">GitHub</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

