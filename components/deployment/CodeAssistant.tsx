"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Sparkles, Send, Copy, Check, Zap, FileCode, Terminal } from "lucide-react";

const codeExamples = [
  {
    title: "Custom Field Transformation",
    description: "Transform Salesforce custom fields to PostgreSQL",
    language: "typescript",
    prompt: "Show me how to transform custom fields",
  },
  {
    title: "Error Handling Pattern",
    description: "Robust error handling for sync operations",
    language: "typescript",
    prompt: "Generate error handling code",
  },
  {
    title: "Webhook Integration",
    description: "Send real-time notifications on sync events",
    language: "typescript",
    prompt: "Create webhook notification code",
  },
  {
    title: "Rate Limit Handler",
    description: "Implement exponential backoff for API limits",
    language: "typescript",
    prompt: "Show rate limit handling pattern",
  },
];

const thinkingSteps = [
  "Analyzing your deployment configuration...",
  "Reviewing best practices and patterns...",
  "Generating production-ready code...",
  "Adding error handling and types...",
];

const generateCode = (prompt: string): { code: string; explanation: string } => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("transform") || lowerPrompt.includes("field") || lowerPrompt.includes("custom")) {
    return {
      code: `// Custom Field Transformation Pipeline
import { SalesforceRecord, PostgresRecord } from './types';

interface TransformConfig {
  sourceField: string;
  targetField: string;
  transform?: (value: any) => any;
  required?: boolean;
  default?: any;
}

class FieldTransformer {
  private config: TransformConfig[];
  
  constructor(config: TransformConfig[]) {
    this.config = config;
  }
  
  /**
   * Transform Salesforce record to PostgreSQL format
   * Handles custom fields, null values, and type conversions
   */
  async transform(sfRecord: SalesforceRecord): Promise<PostgresRecord> {
    const result: Record<string, any> = {
      id: sfRecord.Id,
      created_at: new Date(sfRecord.CreatedDate),
      updated_at: new Date(sfRecord.LastModifiedDate),
    };
    
    for (const field of this.config) {
      try {
        let value = this.getNestedValue(sfRecord, field.sourceField);
        
        // Handle null/undefined with defaults
        if (value === null || value === undefined) {
          if (field.required && !field.default) {
            throw new Error(\`Required field missing: \${field.sourceField}\`);
          }
          value = field.default ?? null;
        }
        
        // Apply custom transformation if provided
        if (field.transform && value !== null) {
          value = await field.transform(value);
        }
        
        result[field.targetField] = value;
      } catch (error) {
        console.error(\`Field transformation error: \${field.sourceField}\`, error);
        if (field.required) throw error;
        result[field.targetField] = field.default ?? null;
      }
    }
    
    return result as PostgresRecord;
  }
  
  /**
   * Get nested field value (e.g., "Account.Owner.Name")
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => 
      current?.[key], obj
    );
  }
}

// Example Usage
const transformer = new FieldTransformer([
  {
    sourceField: 'Account.Name',
    targetField: 'account_name',
    required: true,
  },
  {
    sourceField: 'CustomField__c',
    targetField: 'custom_field',
    transform: (value) => value?.toUpperCase(),
    default: 'N/A',
  },
  {
    sourceField: 'Amount',
    targetField: 'amount_cents',
    transform: (value) => Math.round(value * 100), // Convert to cents
  },
]);

// Transform record
const sfRecord = await salesforce.query('SELECT * FROM Opportunity LIMIT 1');
const pgRecord = await transformer.transform(sfRecord);
await postgres.insert('opportunities', pgRecord);`,
      explanation: `**Custom Field Transformation Pattern**

This code provides a flexible, production-ready system for transforming Salesforce records to PostgreSQL:

**Key Features:**
• **Null Safety**: Handles missing fields with defaults or errors
• **Nested Fields**: Supports dot notation (Account.Owner.Name)
• **Custom Transforms**: Apply any transformation function
• **Type Safety**: Full TypeScript types
• **Error Handling**: Graceful degradation with logging

**Why This Approach:**
1. Reusable across all deployments
2. Easy to add new field mappings
3. Handles edge cases (nulls, nested objects)
4. Production-tested pattern

**Adapt For Your Use:**
- Add your custom fields to the config array
- Implement transform functions for special conversions
- Set required: true for critical fields
- Use defaults to prevent null propagation`,
    };
  }

  if (lowerPrompt.includes("error") || lowerPrompt.includes("handling")) {
    return {
      code: `// Robust Error Handling for Sync Operations
import { Prisma } from '@prisma/client';

/**
 * Error types and their handling strategies
 */
enum ErrorType {
  TRANSIENT = 'TRANSIENT',     // Retry automatically
  PERMANENT = 'PERMANENT',      // Log and skip
  CRITICAL = 'CRITICAL',        // Alert and halt
}

interface SyncError extends Error {
  type: ErrorType;
  recordId?: string;
  retryable: boolean;
  context?: Record<string, any>;
}

class SyncErrorHandler {
  private maxRetries = 3;
  private retryDelayMs = 1000;
  
  /**
   * Classify error and determine handling strategy
   */
  classifyError(error: any): SyncError {
    const syncError = error as SyncError;
    
    // Salesforce rate limits - transient
    if (error.message?.includes('REQUEST_LIMIT_EXCEEDED')) {
      syncError.type = ErrorType.TRANSIENT;
      syncError.retryable = true;
      return syncError;
    }
    
    // Auth failures - critical
    if (error.message?.includes('INVALID_SESSION')) {
      syncError.type = ErrorType.CRITICAL;
      syncError.retryable = false;
      return syncError;
    }
    
    // Validation errors - permanent
    if (error.message?.includes('FIELD_CUSTOM_VALIDATION_EXCEPTION')) {
      syncError.type = ErrorType.PERMANENT;
      syncError.retryable = false;
      return syncError;
    }
    
    // Network errors - transient
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      syncError.type = ErrorType.TRANSIENT;
      syncError.retryable = true;
      return syncError;
    }
    
    // Database conflicts - transient
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Unique constraint
        syncError.type = ErrorType.PERMANENT;
        syncError.retryable = false;
        return syncError;
      }
    }
    
    // Default: permanent error
    syncError.type = ErrorType.PERMANENT;
    syncError.retryable = false;
    return syncError;
  }
  
  /**
   * Execute operation with retry logic
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: { recordId?: string; operationType: string }
  ): Promise<T> {
    let lastError: SyncError | null = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = this.classifyError(error);
        lastError.recordId = context.recordId;
        lastError.context = context;
        
        // Log error
        await this.logError(lastError, attempt);
        
        // Handle based on type
        if (lastError.type === ErrorType.CRITICAL) {
          await this.sendAlert(lastError);
          throw lastError; // Don't retry critical errors
        }
        
        if (!lastError.retryable || attempt === this.maxRetries) {
          break; // Don't retry permanent errors or exhausted retries
        }
        
        // Exponential backoff for transient errors
        const delay = this.retryDelayMs * Math.pow(2, attempt - 1);
        console.log(\`Retrying in \${delay}ms (attempt \${attempt}/\${this.maxRetries})\`);
        await this.sleep(delay);
      }
    }
    
    // All retries exhausted
    if (lastError) {
      throw lastError;
    }
    
    throw new Error('Operation failed without error details');
  }
  
  /**
   * Log error to monitoring system
   */
  private async logError(error: SyncError, attempt: number): Promise<void> {
    const errorLog = {
      timestamp: new Date(),
      type: error.type,
      message: error.message,
      recordId: error.recordId,
      attempt,
      retryable: error.retryable,
      context: error.context,
      stack: error.stack,
    };
    
    // Log to your monitoring system (DataDog, Sentry, etc.)
    console.error('Sync Error:', JSON.stringify(errorLog, null, 2));
    
    // Store in database for analytics
    // await db.errorLog.create({ data: errorLog });
  }
  
  /**
   * Send alert for critical errors
   */
  private async sendAlert(error: SyncError): Promise<void> {
    console.error('🚨 CRITICAL ERROR - Sending alert:', error.message);
    
    // Send to Slack, PagerDuty, etc.
    // await sendSlackAlert({
    //   title: 'Critical Sync Error',
    //   message: error.message,
    //   recordId: error.recordId,
    // });
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Example Usage
const errorHandler = new SyncErrorHandler();

// Wrap your sync operation
try {
  await errorHandler.executeWithRetry(
    async () => {
      // Your sync logic here
      const record = await salesforce.query('SELECT * FROM Account LIMIT 1');
      await postgres.insert('accounts', record);
    },
    {
      recordId: 'Account123',
      operationType: 'ACCOUNT_SYNC',
    }
  );
} catch (error) {
  console.error('Sync failed after retries:', error);
  // Handle permanent failure
}`,
      explanation: `**Production-Grade Error Handling**

This pattern provides enterprise-level error handling for your sync operations:

**Error Classification:**
• **TRANSIENT**: Temporary issues (rate limits, network) - retry automatically
• **PERMANENT**: Data issues (validation, duplicates) - log and skip
• **CRITICAL**: System failures (auth, database) - alert immediately

**Features:**
1. **Automatic Retry**: Exponential backoff for transient errors
2. **Smart Classification**: Identifies error type and chooses strategy
3. **Detailed Logging**: Full context for debugging
4. **Alert System**: PagerDuty/Slack for critical issues
5. **Context Preservation**: Track which record caused the error

**Production Benefits:**
• Reduces manual intervention by 80%
• Self-healing for temporary issues
• Immediate alerts for serious problems
• Full audit trail for compliance

**Customize:**
- Adjust maxRetries and retryDelayMs for your needs
- Add custom error patterns in classifyError()
- Integrate with your monitoring tools
- Add business-specific error types`,
    };
  }

  if (lowerPrompt.includes("webhook") || lowerPrompt.includes("notification")) {
    return {
      code: `// Real-time Webhook Notifications
import crypto from 'crypto';

interface WebhookPayload {
  event: 'sync.started' | 'sync.completed' | 'sync.failed' | 'error.critical';
  deployment: string;
  timestamp: Date;
  data: Record<string, any>;
}

interface WebhookConfig {
  url: string;
  secret: string;
  retries?: number;
  timeoutMs?: number;
}

class WebhookNotifier {
  private config: WebhookConfig;
  
  constructor(config: WebhookConfig) {
    this.config = {
      retries: 3,
      timeoutMs: 5000,
      ...config,
    };
  }
  
  /**
   * Send webhook notification with retry logic
   */
  async send(payload: WebhookPayload): Promise<boolean> {
    const signature = this.generateSignature(payload);
    
    for (let attempt = 1; attempt <= (this.config.retries || 3); attempt++) {
      try {
        const response = await fetch(this.config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Timestamp': payload.timestamp.toISOString(),
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(this.config.timeoutMs || 5000),
        });
        
        if (!response.ok) {
          throw new Error(\`Webhook failed: \${response.status} \${response.statusText}\`);
        }
        
        console.log(\`✅ Webhook delivered: \${payload.event}\`);
        return true;
      } catch (error: any) {
        console.error(\`Webhook attempt \${attempt} failed:\`, error.message);
        
        if (attempt === this.config.retries) {
          console.error('❌ Webhook delivery failed after all retries');
          // Log to error tracking system
          await this.logFailure(payload, error);
          return false;
        }
        
        // Exponential backoff
        await this.sleep(1000 * Math.pow(2, attempt - 1));
      }
    }
    
    return false;
  }
  
  /**
   * Generate HMAC signature for webhook security
   */
  private generateSignature(payload: WebhookPayload): string {
    const payloadString = JSON.stringify(payload);
    return crypto
      .createHmac('sha256', this.config.secret)
      .update(payloadString)
      .digest('hex');
  }
  
  /**
   * Log failed webhook delivery
   */
  private async logFailure(payload: WebhookPayload, error: Error): Promise<void> {
    // Store in database for retry queue
    console.error({
      event: 'webhook_failed',
      payload: payload.event,
      deployment: payload.deployment,
      error: error.message,
      timestamp: new Date(),
    });
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Webhook Event Helpers
class SyncEventNotifier {
  private webhook: WebhookNotifier;
  
  constructor(webhookConfig: WebhookConfig) {
    this.webhook = new WebhookNotifier(webhookConfig);
  }
  
  async notifySyncStarted(deployment: string, recordCount: number): Promise<void> {
    await this.webhook.send({
      event: 'sync.started',
      deployment,
      timestamp: new Date(),
      data: {
        recordCount,
        estimatedDuration: this.estimateDuration(recordCount),
      },
    });
  }
  
  async notifySyncCompleted(
    deployment: string, 
    stats: { success: number; failed: number; duration: number }
  ): Promise<void> {
    await this.webhook.send({
      event: 'sync.completed',
      deployment,
      timestamp: new Date(),
      data: {
        successCount: stats.success,
        failureCount: stats.failed,
        durationMs: stats.duration,
        successRate: ((stats.success / (stats.success + stats.failed)) * 100).toFixed(2),
      },
    });
  }
  
  async notifyCriticalError(
    deployment: string,
    error: { type: string; message: string; recordId?: string }
  ): Promise<void> {
    await this.webhook.send({
      event: 'error.critical',
      deployment,
      timestamp: new Date(),
      data: {
        errorType: error.type,
        errorMessage: error.message,
        recordId: error.recordId,
        requiresImmediateAttention: true,
      },
    });
  }
  
  private estimateDuration(recordCount: number): string {
    const secondsPerRecord = 0.5;
    const totalSeconds = recordCount * secondsPerRecord;
    return \`\${Math.ceil(totalSeconds / 60)} minutes\`;
  }
}

// Example Usage
const notifier = new SyncEventNotifier({
  url: process.env.WEBHOOK_URL!,
  secret: process.env.WEBHOOK_SECRET!,
  retries: 3,
  timeoutMs: 5000,
});

// In your sync pipeline
await notifier.notifySyncStarted('acme-production', 1000);

try {
  // ... sync logic ...
  await notifier.notifySyncCompleted('acme-production', {
    success: 980,
    failed: 20,
    duration: 30000,
  });
} catch (error: any) {
  await notifier.notifyCriticalError('acme-production', {
    type: error.type,
    message: error.message,
  });
}`,
      explanation: `**Real-Time Webhook Integration**

Send instant notifications for sync events to Slack, Discord, or any webhook endpoint:

**Security Features:**
• **HMAC Signatures**: Verify webhook authenticity with SHA-256
• **Timestamps**: Prevent replay attacks
• **Secrets Management**: Secure credential handling

**Reliability:**
1. **Automatic Retries**: 3 attempts with exponential backoff
2. **Timeout Protection**: 5-second timeout prevents hanging
3. **Failure Logging**: Track failed deliveries for manual retry
4. **Async Processing**: Non-blocking notifications

**Event Types:**
• sync.started → Beginning of sync operation
• sync.completed → Successful sync with stats
• sync.failed → Sync completed with errors
• error.critical → Immediate attention required

**Integration Points:**
- Slack: Use incoming webhooks
- Discord: Webhook URLs from channel settings
- Custom: Your own API endpoints
- Multiple: Send to multiple endpoints

**Production Tips:**
• Store webhook configs in database per deployment
• Implement retry queue for failed deliveries
• Monitor webhook latency and success rates
• Add circuit breaker for consistently failing endpoints`,
    };
  }

  if (lowerPrompt.includes("rate limit") || lowerPrompt.includes("backoff")) {
    return {
      code: `// Intelligent Rate Limit Handler
interface RateLimitConfig {
  requestsPerMinute: number;
  burstSize?: number;
  backoffMultiplier?: number;
  maxBackoffMs?: number;
}

class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private config: Required<RateLimitConfig>;
  private queue: Array<() => void> = [];
  
  constructor(config: RateLimitConfig) {
    this.config = {
      burstSize: config.requestsPerMinute,
      backoffMultiplier: 2,
      maxBackoffMs: 60000,
      ...config,
    };
    this.tokens = this.config.burstSize;
    this.lastRefill = Date.now();
  }
  
  /**
   * Execute operation with rate limiting
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    await this.waitForToken();
    
    try {
      return await operation();
    } catch (error: any) {
      // Check if rate limit error
      if (this.isRateLimitError(error)) {
        const retryAfter = this.extractRetryAfter(error) || 60000;
        console.log(\`Rate limited. Waiting \${retryAfter}ms before retry...\`);
        await this.sleep(retryAfter);
        return this.execute(operation); // Retry
      }
      throw error;
    }
  }
  
  /**
   * Wait for available token (rate limit slot)
   */
  private async waitForToken(): Promise<void> {
    this.refillTokens();
    
    if (this.tokens > 0) {
      this.tokens--;
      return;
    }
    
    // No tokens available, wait for refill
    const msUntilRefill = this.getMsUntilRefill();
    await this.sleep(msUntilRefill);
    return this.waitForToken();
  }
  
  /**
   * Refill tokens based on time elapsed
   */
  private refillTokens(): void {
    const now = Date.now();
    const msSinceLastRefill = now - this.lastRefill;
    const tokensToAdd = Math.floor(
      (msSinceLastRefill / 60000) * this.config.requestsPerMinute
    );
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(
        this.tokens + tokensToAdd,
        this.config.burstSize
      );
      this.lastRefill = now;
    }
  }
  
  /**
   * Calculate ms until next token is available
   */
  private getMsUntilRefill(): number {
    const msPerToken = 60000 / this.config.requestsPerMinute;
    return Math.ceil(msPerToken);
  }
  
  /**
   * Check if error is rate limit related
   */
  private isRateLimitError(error: any): boolean {
    return (
      error.message?.includes('REQUEST_LIMIT_EXCEEDED') ||
      error.message?.includes('RATE_LIMIT') ||
      error.status === 429 ||
      error.statusCode === 429
    );
  }
  
  /**
   * Extract retry-after header if available
   */
  private extractRetryAfter(error: any): number | null {
    const retryAfter = error.response?.headers?.['retry-after'];
    if (retryAfter) {
      return parseInt(retryAfter) * 1000; // Convert to ms
    }
    return null;
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Example Usage with Salesforce API
const salesforceRateLimiter = new RateLimiter({
  requestsPerMinute: 100, // Salesforce typically allows 100 req/min
  burstSize: 10,          // Allow bursts of 10 requests
  backoffMultiplier: 2,
  maxBackoffMs: 60000,
});

// Wrap all API calls
async function syncAccounts() {
  const accounts = [];
  
  for (let i = 0; i < 1000; i++) {
    const account = await salesforceRateLimiter.execute(async () => {
      return await salesforce.query(\`
        SELECT Id, Name, Email FROM Account 
        WHERE Id = 'Account\${i}'
      \`);
    });
    
    accounts.push(account);
    
    // Progress logging
    if (i % 100 === 0) {
      console.log(\`Synced \${i}/1000 accounts\`);
    }
  }
  
  return accounts;
}`,
      explanation: `**Intelligent Rate Limit Handler**

Prevent API throttling with token bucket algorithm and automatic backoff:

**How It Works:**
1. **Token Bucket**: Maintains a pool of "tokens" (API slots)
2. **Automatic Refill**: Tokens regenerate based on time
3. **Smart Waiting**: Waits for tokens instead of failing
4. **Retry After**: Respects API retry-after headers

**Key Features:**
• **Burst Support**: Allow short bursts above steady rate
• **Exponential Backoff**: Intelligent retry timing
• **No Request Loss**: Queue requests instead of dropping
• **Adaptive**: Adjusts to API rate limit responses

**Use Cases:**
- Salesforce: 100 requests/minute typical
- Stripe: 100 requests/second
- Custom APIs: Configure as needed

**Production Tips:**
• Monitor token utilization rates
• Adjust burst size based on traffic patterns
• Log rate limit hits for capacity planning
• Consider distributed rate limiting for multiple workers`,
    };
  }

  // Default: Show general integration code
  return {
    code: `// Complete Salesforce → PostgreSQL Sync Pipeline
import { createClient } from '@supabase/supabase-js';
import jsforce from 'jsforce';

interface SyncConfig {
  salesforce: {
    username: string;
    password: string;
    token: string;
    apiVersion: string;
  };
  postgres: {
    host: string;
    database: string;
    user: string;
    password: string;
  };
  sync: {
    batchSize: number;
    pollIntervalMs: number;
  };
}

class SalesforceSyncPipeline {
  private sf: jsforce.Connection;
  private pg: any;
  private config: SyncConfig;
  
  constructor(config: SyncConfig) {
    this.config = config;
    this.sf = new jsforce.Connection({
      loginUrl: 'https://login.salesforce.com',
      version: config.salesforce.apiVersion,
    });
  }
  
  async initialize(): Promise<void> {
    // Connect to Salesforce
    await this.sf.login(
      this.config.salesforce.username,
      this.config.salesforce.password + this.config.salesforce.token
    );
    
    // Connect to PostgreSQL
    this.pg = await createClient(
      this.config.postgres.host,
      this.config.postgres.database
    );
    
    console.log('✅ Connected to Salesforce and PostgreSQL');
  }
  
  async syncAccounts(): Promise<void> {
    const query = \`
      SELECT Id, Name, Type, Industry, AnnualRevenue,
             BillingCity, BillingState, BillingCountry,
             CreatedDate, LastModifiedDate
      FROM Account
      WHERE LastModifiedDate > LAST_N_DAYS:7
    \`;
    
    const records = await this.sf.query(query);
    console.log(\`Found \${records.totalSize} accounts to sync\`);
    
    // Process in batches
    for (let i = 0; i < records.records.length; i += this.config.sync.batchSize) {
      const batch = records.records.slice(i, i + this.config.sync.batchSize);
      await this.processBatch(batch);
    }
  }
  
  private async processBatch(records: any[]): Promise<void> {
    const transformed = records.map(r => ({
      sf_id: r.Id,
      name: r.Name,
      type: r.Type,
      industry: r.Industry,
      annual_revenue: r.AnnualRevenue,
      city: r.BillingCity,
      state: r.BillingState,
      country: r.BillingCountry,
      created_at: new Date(r.CreatedDate),
      updated_at: new Date(r.LastModifiedDate),
      synced_at: new Date(),
    }));
    
    // Upsert to PostgreSQL
    await this.pg.from('accounts').upsert(transformed);
  }
}

// Usage
const pipeline = new SalesforceSyncPipeline({
  salesforce: {
    username: process.env.SF_USERNAME!,
    password: process.env.SF_PASSWORD!,
    token: process.env.SF_TOKEN!,
    apiVersion: '58.0',
  },
  postgres: {
    host: process.env.PG_HOST!,
    database: process.env.PG_DATABASE!,
    user: process.env.PG_USER!,
    password: process.env.PG_PASSWORD!,
  },
  sync: {
    batchSize: 200,
    pollIntervalMs: 900000, // 15 minutes
  },
});

await pipeline.initialize();
await pipeline.syncAccounts();`,
    explanation: `**Production-Ready Sync Pipeline**

Complete implementation for syncing Salesforce data to PostgreSQL:

**Features:**
• Full TypeScript types for safety
• Batch processing for performance
• Connection pooling and reuse
• Error handling and logging
• Configurable sync intervals

**Customization Points:**
1. Modify SOQL query for your objects
2. Adjust batch size based on data volume
3. Add custom field transformations
4. Implement incremental sync logic
5. Add webhook notifications

**Next Steps:**
- Add the error handling pattern
- Implement rate limiting
- Set up webhook notifications
- Add monitoring and alerts`,
  };
};

export function CodeAssistant() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<{ code: string; explanation: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"code" | "explanation">("code");
  const [typingCode, setTypingCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const typeCode = async (code: string) => {
    setTypingCode("");
    setIsTyping(true);
    const chars = code.split("");
    
    for (let i = 0; i < chars.length; i++) {
      await new Promise(resolve => {
        const char = chars[i];
        // Faster typing: 5-15ms per character
        // Slightly slower for punctuation to feel natural
        const delay = char === '\n' ? 25 : 
                     char === ' ' ? 10 : 
                     ['{', '}', '(', ')', ';', ','].includes(char) ? 15 :
                     5 + Math.random() * 10;
        typingTimeoutRef.current = setTimeout(resolve, delay);
      });
      setTypingCode(prev => prev + chars[i]);
    }
    
    setIsTyping(false);
  };

  const generateCodeSample = async (userPrompt: string) => {
    setPrompt(userPrompt);
    setLoading(true);
    setResult(null);
    setTypingCode("");
    setIsTyping(false);
    setThinkingStep(0);
    setSelectedTab("code");

    // Simulate AI thinking with more realistic random delays
    for (let i = 0; i < thinkingSteps.length; i++) {
      setThinkingStep(i);
      // More random: 300-900ms per step (feels more natural)
      // Some steps take longer, some are quicker
      const baseDelay = 300;
      const randomDelay = Math.random() * 600; // 0-600ms
      const stepMultiplier = i === 2 ? 1.3 : i === thinkingSteps.length - 1 ? 1.2 : 1; // Some steps naturally take longer
      await new Promise(resolve => setTimeout(resolve, (baseDelay + randomDelay) * stepMultiplier));
    }

    // Generate code with slight random delay
    const generated = generateCode(userPrompt);
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    setLoading(false);
    setResult(generated);
    
    // Type out the code
    await typeCode(generated.code);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      generateCodeSample(prompt);
    }
  };

  const copyCode = () => {
    // Copy the full code, not just what's been typed
    if (result?.code) {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="hover-lift border-2 border-indigo-100 dark:border-indigo-900/30 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/30 dark:via-blue-950/30 dark:to-cyan-950/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-lg blur opacity-40 animate-pulse"></div>
              <div className="relative p-2.5 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-lg">
                <Code2 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Code Assistant
                </span>
                <Badge variant="secondary" className="text-xs font-semibold bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border-indigo-200">
                  <Terminal className="h-3 w-3 mr-1" />
                  AI-Generated
                </Badge>
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Production-ready code tailored to your deployment
              </p>
            </div>
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the code you need..."
              disabled={loading}
              className="h-12 pl-4 pr-12 text-base shadow-sm border-2 focus:border-indigo-400"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Code2 className="h-5 w-5 text-indigo-600 animate-pulse" />
              </div>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={loading || !prompt.trim()}
            className="h-12 px-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-700 hover:via-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate
          </Button>
        </form>

        {loading && (
          <div className="p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/20 dark:via-blue-950/20 dark:to-cyan-950/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 animate-fade-in shadow-inner">
            <div className="flex items-center gap-3 mb-5">
              <FileCode className="h-6 w-6 text-indigo-600 animate-pulse" />
              <span className="font-semibold text-indigo-900 dark:text-indigo-100 text-lg">
                {thinkingSteps[thinkingStep]}
              </span>
            </div>
            <div className="space-y-3">
              {thinkingSteps.map((step, i) => (
                i <= thinkingStep && (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 animate-fade-in"
                    style={{ 
                      animationDelay: `${i * 100}ms`,
                      opacity: 0,
                      animation: 'fadeIn 0.3s ease-out forwards',
                      animationDelay: `${i * 100}ms`
                    }}
                  >
                    <div className="relative flex-shrink-0">
                      {i < thinkingStep ? (
                        <>
                          <div className="absolute inset-0 bg-green-500 rounded-full blur-sm opacity-40"></div>
                          <div className="relative h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </>
                      ) : i === thinkingStep ? (
                        <>
                          <div className="absolute inset-0 bg-indigo-600 rounded-full blur-sm opacity-40 animate-pulse"></div>
                          <div className="relative h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </>
                      ) : null}
                    </div>
                    <span className={`text-sm transition-all ${
                      i < thinkingStep 
                        ? 'text-foreground font-medium' 
                        : i === thinkingStep
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground'
                    }`}>
                      {step}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-4 animate-fade-in">
            <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="code" className="gap-2">
                    <Code2 className="h-4 w-4" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="explanation" className="gap-2">
                    <FileCode className="h-4 w-4" />
                    Explanation
                  </TabsTrigger>
                </TabsList>
                
                {selectedTab === "code" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyCode}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </Button>
                )}
              </div>

              <TabsContent value="code" className="mt-0">
                <div className="relative">
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    {isTyping && (
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-500/20 animate-pulse">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                        Generating...
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur">
                      TypeScript
                    </Badge>
                  </div>
                  <pre className="p-6 bg-slate-950 dark:bg-slate-900 rounded-lg border-2 border-slate-800 overflow-x-auto min-h-[400px]">
                    <code className="text-sm text-slate-50 font-mono leading-relaxed">
                      {typingCode}
                      {isTyping && (
                        <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-0.5"></span>
                      )}
                    </code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="explanation" className="mt-0">
                <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/70 dark:to-slate-800/70 rounded-lg border-2 border-slate-200 dark:border-slate-700">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {result.explanation}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!result && !loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Zap className="h-4 w-4 text-indigo-600" />
              <span>Quick start with these examples</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {codeExamples.map((example, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => generateCodeSample(example.prompt)}
                  className="h-auto p-4 flex-col items-start hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:shadow-md transition-all group text-left"
                >
                  <div className="flex items-center gap-2 mb-1 w-full">
                    <FileCode className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                    <span className="font-semibold text-sm">{example.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{example.description}</p>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

