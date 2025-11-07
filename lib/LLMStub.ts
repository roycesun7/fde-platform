export interface RunbookStep {
  title: string;
  detail: string;
  action?: "create_pr" | "run_backfill" | "replay_events";
}

export interface CodeBlock {
  language: "ts" | "bash" | "typescript";
  filename?: string;
  content: string;
}

export interface RunbookPlan {
  summary: string;
  steps: RunbookStep[];
  codeBlocks: CodeBlock[];
}

interface SuggestInput {
  spec: any;
  logs: any[];
  goal?: string;
}

export async function suggestRunbook(input: SuggestInput): Promise<RunbookPlan> {
  const { spec, logs, goal } = input;

  // Analyze missing mappings
  const missingMappings = spec.mappings?.filter((m: any) => m.status === "missing") || [];
  const driftMappings = spec.mappings?.filter((m: any) => m.status === "drift") || [];

  // Count error codes
  const errorCounts: Record<string, number> = {};
  logs.forEach((log: any) => {
    if (log.code) {
      errorCounts[log.code] = (errorCounts[log.code] || 0) + 1;
    }
  });

  const topError = Object.entries(errorCounts).sort((a, b) => b[1] - a[1])[0];

  // Build deterministic plan
  const steps: RunbookStep[] = [];
  const codeBlocks: CodeBlock[] = [];

  let summary = "Detected field mapping issues and data quality problems. ";

  // Step 1: Fix missing mappings
  if (missingMappings.length > 0) {
    const field = missingMappings[0];
    steps.push({
      title: `Add missing mapping for ${field.source}`,
      detail: `Field '${field.source}' exists in source but is not mapped to destination. This is causing ${errorCounts.MAPPING_ERROR || 0} errors.`,
    });

    codeBlocks.push({
      language: "typescript",
      filename: `mappings/${spec.id}.ts`,
      content: `// Add mapping for ${field.source}\nexport function map${toPascalCase(field.source)}(source: any) {\n  return {\n    '${field.dest}': source.${field.source}?.toLowerCase() || 'default'\n  };\n}\n\n// Usage in main mapper\nexport function mapEvent(event: any) {\n  return {\n    ...mapCustomerEmail(event),\n    ...map${toPascalCase(field.source)}(event),\n    // ... other mappings\n  };\n}`,
    });

    summary += `Add mapping for ${field.source}. `;
  }

  // Step 2: Fix drift mappings
  if (driftMappings.length > 0) {
    const field = driftMappings[0];
    steps.push({
      title: `Fix type mismatch for ${field.source}`,
      detail: field.note || `Type drift detected in ${field.source} mapping. Convert to expected type.`,
    });

    codeBlocks.push({
      language: "typescript",
      filename: `mappings/${spec.id}.ts`,
      content: `// Fix type conversion for ${field.source}\nexport function map${toPascalCase(field.source)}(source: any) {\n  const value = source.${field.source};\n  // Remove currency symbols and parse as number\n  const numericValue = typeof value === 'string' \n    ? parseFloat(value.replace(/[$,]/g, ''))\n    : value;\n  return {\n    '${field.dest}': numericValue\n  };\n}`,
    });
  }

  // Step 3: Generate PR
  if (missingMappings.length > 0 || driftMappings.length > 0) {
    steps.push({
      title: "Generate PR with mapping changes",
      detail: `Create a pull request with the updated field mappings. This will fix ${(errorCounts.MAPPING_ERROR || 0) + (errorCounts.TYPE_MISMATCH || 0)} errors.`,
      action: "create_pr",
    });

    summary += "Generate PR with fixes. ";
  }

  // Step 4: Backfill affected records
  const affectedCount = Math.min(logs.filter(l => l.code === "MAPPING_ERROR" || l.code === "TYPE_MISMATCH").length * 10, 500);
  if (affectedCount > 0) {
    steps.push({
      title: `Run backfill for ${affectedCount} affected records`,
      detail: `Reprocess ${affectedCount} records that failed due to mapping errors. This will apply the new mappings retroactively.`,
      action: "run_backfill",
    });

    codeBlocks.push({
      language: "bash",
      content: `# Backfill affected records\ncurl -X POST https://api.foundry.dev/v1/deployments/${spec.id}/backfill \\\n  -H "Authorization: Bearer $API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "filter": {\n      "errorCodes": ["MAPPING_ERROR", "TYPE_MISMATCH"],\n      "since": "2025-11-06T00:00:00Z"\n    },\n    "limit": ${affectedCount}\n  }'`,
    });

    summary += `Backfill ${affectedCount} records. `;
  }

  // Step 5: Replay recent failed events
  const recentFailures = Math.min(logs.length, 20);
  if (recentFailures > 0) {
    steps.push({
      title: `Replay last ${recentFailures} failed events`,
      detail: `Retry the most recent failed events with the updated mappings to verify the fix works correctly.`,
      action: "replay_events",
    });

    summary += `Replay ${recentFailures} events to verify.`;
  }

  // Step 6: Monitor results
  steps.push({
    title: "Monitor error rates",
    detail: `Watch the error dashboard for 24 hours to ensure the fix is effective. Expected error reduction: ${Math.round((errorCounts.MAPPING_ERROR || 0) / (logs.length || 1) * 100)}%.`,
  });

  return {
    summary: summary.trim(),
    steps,
    codeBlocks,
  };
}

function toPascalCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

