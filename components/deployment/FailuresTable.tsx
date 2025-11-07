import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Log {
  ts: string;
  code: string;
  message: string;
  payloadSample: any;
}

interface FailuresTableProps {
  logs: Log[];
}

const codeColors: Record<string, string> = {
  MAPPING_ERROR: "destructive",
  TYPE_MISMATCH: "secondary",
  RATE_LIMIT: "outline",
  WEBHOOK_TIMEOUT: "outline",
};

export function FailuresTable({ logs }: FailuresTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Failures</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {logs.slice(0, 8).map((log, i) => (
            <div key={i} className="flex items-start gap-4 pb-3 border-b last:border-0">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={codeColors[log.code] as any || "outline"}>
                    {log.code}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.ts).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{log.message}</p>
                {log.payloadSample && (
                  <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                    {JSON.stringify(log.payloadSample, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

