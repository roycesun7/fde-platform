import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  percentage?: number;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, percentage }: KPICardProps) {
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <Card className="hover-lift">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
            </div>
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          
          {subtitle && (
            <div className="flex items-center gap-2">
              <TrendIcon className={`h-4 w-4 ${trendColor}`} />
              <p className={`text-sm font-medium ${trendColor}`}>{subtitle}</p>
            </div>
          )}
          
          {percentage !== undefined && (
            <div className="space-y-1">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-foreground transition-all duration-500" 
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

