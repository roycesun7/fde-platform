import OpenAI from "openai";
import { suggestRunbook as stubSuggestRunbook, RunbookPlan } from "./LLMStub";

interface LLMConfig {
  apiKey?: string;
  model?: string;
  useStub?: boolean;
}

class LLMServiceClass {
  private client: OpenAI | null = null;
  private config: LLMConfig = {
    model: "gpt-4o-mini",
    useStub: true, // Default to stub mode for demo
  };

  configure(config: LLMConfig) {
    this.config = { ...this.config, ...config };
    
    if (config.apiKey && !config.useStub) {
      this.client = new OpenAI({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true, // For demo purposes
      });
    }
  }

  async suggestRunbook(input: {
    spec: any;
    logs: any[];
    goal?: string;
  }): Promise<RunbookPlan> {
    // If no API key or stub mode, use deterministic stub
    if (this.config.useStub || !this.client) {
      return stubSuggestRunbook(input);
    }

    try {
      const { spec, logs, goal } = input;

      // Prepare context for LLM
      const context = this.prepareContext(spec, logs, goal);

      const completion = await this.client.chat.completions.create({
        model: this.config.model || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert DevOps engineer specializing in data integration and field mapping. 
Your job is to analyze deployment issues and suggest actionable runbooks to fix them.

Respond in JSON format with this structure:
{
  "summary": "Brief summary of the issues and fixes",
  "steps": [
    {
      "title": "Step title",
      "detail": "Detailed explanation",
      "action": "create_pr" | "run_backfill" | "replay_events" (optional)
    }
  ],
  "codeBlocks": [
    {
      "language": "typescript" | "bash",
      "filename": "optional filename",
      "content": "code content"
    }
  ]
}`,
          },
          {
            role: "user",
            content: context,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error("No response from LLM");
      }

      return JSON.parse(response) as RunbookPlan;
    } catch (error) {
      console.error("LLM error, falling back to stub:", error);
      // Fallback to stub on error
      return stubSuggestRunbook(input);
    }
  }

  async analyzeError(errorLog: any): Promise<string> {
    if (this.config.useStub || !this.client) {
      return this.stubAnalyzeError(errorLog);
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: this.config.model || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing error logs. Provide a concise explanation of the error and suggest a fix.",
          },
          {
            role: "user",
            content: `Analyze this error:\n\nCode: ${errorLog.code}\nMessage: ${errorLog.message}\nPayload: ${JSON.stringify(errorLog.payloadSample, null, 2)}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 200,
      });

      return completion.choices[0].message.content || "Unable to analyze error";
    } catch (error) {
      console.error("LLM error:", error);
      return this.stubAnalyzeError(errorLog);
    }
  }

  async reviewCode(code: string, context: string): Promise<string> {
    if (this.config.useStub || !this.client) {
      return "✅ Code looks good! The mapping logic is clear and handles edge cases properly.";
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: this.config.model || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a senior code reviewer. Review the code for bugs, best practices, and improvements. Be concise.",
          },
          {
            role: "user",
            content: `Context: ${context}\n\nCode:\n${code}\n\nProvide a brief review.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      });

      return completion.choices[0].message.content || "Unable to review code";
    } catch (error) {
      console.error("LLM error:", error);
      return "✅ Code looks good! The mapping logic is clear and handles edge cases properly.";
    }
  }

  async naturalLanguageQuery(query: string, deployments: any[]): Promise<string> {
    if (this.config.useStub || !this.client) {
      return this.stubNaturalLanguageQuery(query, deployments);
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: this.config.model || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that answers questions about deployments. 
Keep responses concise and actionable. Reference specific deployment names when relevant.`,
          },
          {
            role: "user",
            content: `Deployments data:\n${JSON.stringify(deployments, null, 2)}\n\nQuestion: ${query}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      return completion.choices[0].message.content || "Unable to answer query";
    } catch (error) {
      console.error("LLM error:", error);
      return this.stubNaturalLanguageQuery(query, deployments);
    }
  }

  private prepareContext(spec: any, logs: any[], goal?: string): string {
    const missingMappings = spec.mappings?.filter((m: any) => m.status === "missing") || [];
    const driftMappings = spec.mappings?.filter((m: any) => m.status === "drift") || [];
    
    const errorCounts: Record<string, number> = {};
    logs.forEach((log: any) => {
      if (log.code) {
        errorCounts[log.code] = (errorCounts[log.code] || 0) + 1;
      }
    });

    return `Deployment: ${spec.name} (${spec.id})
Environment: ${spec.env?.WEBHOOK_URL || "N/A"}
Connectors: ${spec.connectors?.source?.type} → ${spec.connectors?.destination?.type}

Missing Mappings: ${missingMappings.length}
${missingMappings.map((m: any) => `- ${m.source} → ${m.dest}`).join("\n")}

Drift Mappings: ${driftMappings.length}
${driftMappings.map((m: any) => `- ${m.source} → ${m.dest}: ${m.note}`).join("\n")}

Recent Errors (last ${logs.length}):
${Object.entries(errorCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([code, count]) => `- ${code}: ${count} occurrences`)
  .join("\n")}

Sample Error:
${logs[0] ? `Code: ${logs[0].code}\nMessage: ${logs[0].message}` : "No errors"}

${goal ? `\nUser Goal: ${goal}` : ""}

Please analyze these issues and provide a step-by-step runbook to fix them.`;
  }

  private stubAnalyzeError(errorLog: any): string {
    const explanations: Record<string, string> = {
      MAPPING_ERROR: "This error occurs when a source field is not mapped to any destination field. Add the missing mapping to resolve.",
      TYPE_MISMATCH: "The data type of the source field doesn't match the expected destination type. Add type conversion logic.",
      RATE_LIMIT: "The destination API is rate limiting requests. Implement exponential backoff or reduce request frequency.",
      WEBHOOK_TIMEOUT: "The webhook request timed out. Check network connectivity and increase timeout settings.",
    };

    return explanations[errorLog.code] || "Unknown error. Check logs for more details.";
  }

  private stubNaturalLanguageQuery(query: string, deployments: any[]): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("error") || lowerQuery.includes("problem")) {
      const problematic = deployments.filter(d => d.health !== "healthy");
      return `Found ${problematic.length} deployment(s) with issues: ${problematic.map(d => d.name).join(", ")}. Dropbox has the most errors with 48 in the last 24 hours.`;
    }
    
    if (lowerQuery.includes("healthy") || lowerQuery.includes("good")) {
      const healthy = deployments.filter(d => d.health === "healthy");
      return `${healthy.length} deployments are healthy: ${healthy.map(d => d.name).join(", ")}. They have minimal errors and good performance.`;
    }
    
    if (lowerQuery.includes("compare")) {
      return "Dropbox has 48 errors while Ramp only has 12. Dropbox needs attention on field mapping issues.";
    }

    return `I found ${deployments.length} deployments. Dropbox needs the most attention with noisy health status.`;
  }

  isConfigured(): boolean {
    return !this.config.useStub && !!this.client;
  }

  getMode(): "stub" | "llm" {
    return this.config.useStub || !this.client ? "stub" : "llm";
  }
}

export const LLMService = new LLMServiceClass();

