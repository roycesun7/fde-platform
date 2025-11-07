"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ConfigManagerProps {
  deployment: any;
}

export function ConfigManager({ deployment }: ConfigManagerProps) {
  const [importedConfig, setImportedConfig] = useState("");
  const [copied, setCopied] = useState(false);

  const exportConfig = () => {
    const config = {
      id: deployment.id,
      name: deployment.name,
      environment: deployment.environment,
      envVars: deployment.envVars,
      mappings: deployment.mappings,
      connectors: deployment.connectors,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deployment.id}-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Configuration exported successfully");
  };

  const copyConfig = () => {
    const config = {
      id: deployment.id,
      name: deployment.name,
      environment: deployment.environment,
      envVars: deployment.envVars,
      mappings: deployment.mappings,
      connectors: deployment.connectors,
    };

    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Configuration copied to clipboard");
  };

  const importConfig = () => {
    try {
      const config = JSON.parse(importedConfig);
      
      // Validate config structure
      if (!config.id || !config.name) {
        throw new Error("Invalid configuration format");
      }

      toast.success(`Configuration imported for ${config.name}`);
      setImportedConfig("");
    } catch (error) {
      toast.error("Failed to import configuration. Please check the JSON format.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export the current deployment configuration including mappings, connectors, and environment settings.
          </p>

          <div className="flex gap-2">
            <Button onClick={exportConfig} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download JSON
            </Button>
            <Button onClick={copyConfig} variant="outline">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-xs font-mono">
              {deployment.id}-config.json
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {deployment.mappings?.length || 0} mappings • {Object.keys(deployment.envVars || {}).length} env vars
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Import a configuration from a JSON file to quickly set up or update a deployment.
          </p>

          <Textarea
            value={importedConfig}
            onChange={(e) => setImportedConfig(e.target.value)}
            placeholder='Paste configuration JSON here...'
            className="font-mono text-sm min-h-[150px]"
          />

          <Button
            onClick={importConfig}
            disabled={!importedConfig}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Configuration
          </Button>

          <div className="text-xs text-muted-foreground">
            <p>⚠️ Importing will validate the configuration structure before applying changes.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

