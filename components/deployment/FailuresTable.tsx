import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Failures</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 w-10"></th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Time</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Error Code</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 10).map((log, i) => (
                <>
                  <tr 
                    key={i} 
                    className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => toggleRow(i)}
                  >
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        {expandedRows.has(i) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                      {new Date(log.ts).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={codeColors[log.code] as any || "outline"} className="font-mono text-xs">
                        {log.code}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{log.message}</td>
                  </tr>
                  {expandedRows.has(i) && log.payloadSample && (
                    <tr key={`${i}-detail`} className="border-b bg-muted/20">
                      <td colSpan={4} className="px-4 py-3">
                        <div className="ml-10">
                          <div className="text-xs font-medium text-muted-foreground mb-2">Payload Sample:</div>
                          <pre className="text-xs bg-background p-3 rounded border overflow-x-auto font-mono">
                            {JSON.stringify(log.payloadSample, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

