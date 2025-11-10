/**
 * Simulation Engine - Generates realistic random noise and errors
 * Triggers Slack notifications and UI updates
 */

import { sendErrorAlert } from "./slack";

export interface SimulatedError {
  id: string;
  deploymentId: string;
  deploymentName: string;
  timestamp: Date;
  errorType: string;
  errorMessage: string;
  severity: "low" | "medium" | "high" | "critical";
  payload?: any;
}

export interface DeploymentStats {
  deploymentId: string;
  errorCount: number;
  errorRate: number;
  lastError?: SimulatedError;
  health: "healthy" | "noisy" | "degraded";
}

// Error patterns by deployment type
const ERROR_PATTERNS = {
  healthy: {
    frequency: 0.05, // 5% chance per check
    severityDistribution: { low: 0.7, medium: 0.25, high: 0.05, critical: 0 },
  },
  noisy: {
    frequency: 0.25, // 25% chance per check
    severityDistribution: { low: 0.5, medium: 0.3, high: 0.15, critical: 0.05 },
  },
  degraded: {
    frequency: 0.5, // 50% chance per check
    severityDistribution: { low: 0.3, medium: 0.3, high: 0.3, critical: 0.1 },
  },
};

// Realistic error types
const ERROR_TYPES = [
  { type: "AUTH_FAILURE", message: "OAuth token expired", severity: "high" },
  { type: "RATE_LIMIT", message: "Salesforce API rate limit exceeded", severity: "medium" },
  { type: "MAPPING_ERROR", message: "Field mapping failed: missing required field", severity: "high" },
  { type: "CONNECTION_TIMEOUT", message: "Connection to PostgreSQL timed out", severity: "critical" },
  { type: "VALIDATION_ERROR", message: "Data validation failed: invalid email format", severity: "low" },
  { type: "SYNC_CONFLICT", message: "Record conflict detected during sync", severity: "medium" },
  { type: "PERMISSION_DENIED", message: "Insufficient permissions to access Salesforce object", severity: "high" },
  { type: "DATA_TOO_LARGE", message: "Record size exceeds maximum batch size", severity: "medium" },
  { type: "NULL_POINTER", message: "Null reference in field transformation", severity: "low" },
  { type: "WEBHOOK_FAILURE", message: "Webhook delivery failed after 3 retries", severity: "medium" },
  { type: "DUPLICATE_KEY", message: "PostgreSQL unique constraint violation", severity: "low" },
  { type: "NETWORK_ERROR", message: "Network connection lost during sync", severity: "critical" },
];

class SimulationEngine {
  private isRunning = false;
  private interval: NodeJS.Timeout | null = null;
  private errorLog: SimulatedError[] = [];
  private statsMap: Map<string, DeploymentStats> = new Map();
  private listeners: Set<(error: SimulatedError) => void> = new Set();

  /**
   * Start the simulation
   */
  start(deployments: any[], checkInterval: number = 5000) {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log("🎲 Simulation engine started");

    // Initialize stats for each deployment
    deployments.forEach((d) => {
      this.statsMap.set(d.id, {
        deploymentId: d.id,
        errorCount: 0,
        errorRate: 0,
        health: d.health,
      });
    });

    // Run simulation checks periodically
    this.interval = setInterval(() => {
      deployments.forEach((deployment) => {
        this.checkDeployment(deployment);
      });
    }, checkInterval);
  }

  /**
   * Stop the simulation
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log("🛑 Simulation engine stopped");
  }

  /**
   * Check a deployment for errors based on its health
   */
  private checkDeployment(deployment: any) {
    const pattern = ERROR_PATTERNS[deployment.health as keyof typeof ERROR_PATTERNS];
    if (!pattern) return;

    // Random chance of error based on health pattern
    if (Math.random() < pattern.frequency) {
      const error = this.generateError(deployment, pattern);
      this.logError(error);
      this.updateStats(error);
      this.notifyListeners(error);
      this.handleError(error);
    }
  }

  /**
   * Generate a realistic error
   */
  private generateError(
    deployment: any,
    pattern: typeof ERROR_PATTERNS.healthy
  ): SimulatedError {
    // Pick severity based on distribution
    const severityRoll = Math.random();
    let severity: "low" | "medium" | "high" | "critical" = "low";
    let cumulative = 0;

    for (const [sev, prob] of Object.entries(pattern.severityDistribution)) {
      cumulative += prob;
      if (severityRoll < cumulative) {
        severity = sev as any;
        break;
      }
    }

    // Pick a random error type
    const errorTemplate = ERROR_TYPES[Math.floor(Math.random() * ERROR_TYPES.length)];

    // Generate error
    const error: SimulatedError = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      deploymentId: deployment.id,
      deploymentName: deployment.name,
      timestamp: new Date(),
      errorType: errorTemplate.type,
      errorMessage: errorTemplate.message,
      severity: severity,
      payload: this.generatePayload(errorTemplate.type),
    };

    return error;
  }

  /**
   * Generate realistic error payload
   */
  private generatePayload(errorType: string) {
    const payloads: Record<string, any> = {
      AUTH_FAILURE: {
        token_expiry: new Date(Date.now() - 3600000).toISOString(),
        auth_provider: "Salesforce",
        last_refresh: new Date(Date.now() - 7200000).toISOString(),
      },
      RATE_LIMIT: {
        limit: 5000,
        used: 5234,
        reset_time: new Date(Date.now() + 900000).toISOString(),
      },
      MAPPING_ERROR: {
        source_field: "Account.CustomField__c",
        target_field: "accounts.custom_field",
        record_id: `SF_${Math.random().toString(36).substr(2, 9)}`,
      },
      CONNECTION_TIMEOUT: {
        host: "postgres-prod.example.com",
        port: 5432,
        timeout_ms: 30000,
      },
    };

    return payloads[errorType] || { raw_error: "Unknown error type" };
  }

  /**
   * Log error to memory
   */
  private logError(error: SimulatedError) {
    this.errorLog.push(error);
    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }
    console.log(
      `⚠️  [${error.deploymentName}] ${error.severity.toUpperCase()}: ${error.errorType}`
    );
  }

  /**
   * Update deployment statistics
   */
  private updateStats(error: SimulatedError) {
    const stats = this.statsMap.get(error.deploymentId);
    if (!stats) return;

    stats.errorCount++;
    stats.lastError = error;
    
    // Calculate error rate (errors per minute)
    const recentErrors = this.errorLog.filter(
      (e) =>
        e.deploymentId === error.deploymentId &&
        Date.now() - e.timestamp.getTime() < 60000
    );
    stats.errorRate = recentErrors.length;

    // Update health based on error rate
    if (stats.errorRate > 10) {
      stats.health = "degraded";
    } else if (stats.errorRate > 5) {
      stats.health = "noisy";
    } else {
      stats.health = "healthy";
    }
  }

  /**
   * Handle error - send notifications, etc.
   */
  private async handleError(error: SimulatedError) {
    // Send Slack notification for high/critical errors
    if (error.severity === "high" || error.severity === "critical") {
      await this.sendSlackNotification(error);
    }

    // Store in localStorage for UI updates
    this.storeErrorForUI(error);
  }

  /**
   * Send Slack notification
   */
  private async sendSlackNotification(error: SimulatedError) {
    const webhookUrl = localStorage.getItem("slack-webhook-url");
    const isConnected = localStorage.getItem("slack-connected") === "true";

    if (!webhookUrl || !isConnected) {
      console.log("📢 Slack not configured, skipping notification");
      return;
    }

    try {
      const stats = this.statsMap.get(error.deploymentId);
      const errorsByType: Record<string, number> = {};
      errorsByType[error.errorType] = 1;

      await sendErrorAlert(
        error.deploymentName,
        error.errorRate || stats?.errorRate || 0,
        error.errorCount || stats?.errorCount || 0,
        webhookUrl,
        errorsByType
      );

      console.log(`📩 Slack notification sent for ${error.deploymentName}`);
    } catch (err) {
      console.error("Failed to send Slack notification:", err);
    }
  }

  /**
   * Store error for UI updates
   */
  private storeErrorForUI(error: SimulatedError) {
    // Store in localStorage
    const key = `simulation_errors_${error.deploymentId}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push({
      ...error,
      timestamp: error.timestamp.toISOString(),
    });
    
    // Keep only last 20 errors per deployment
    if (existing.length > 20) {
      existing.shift();
    }
    
    localStorage.setItem(key, JSON.stringify(existing));

    // Trigger storage event for cross-tab communication
    window.dispatchEvent(
      new CustomEvent("simulation-error", { detail: error })
    );
  }

  /**
   * Add listener for errors
   */
  onError(callback: (error: SimulatedError) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(error: SimulatedError) {
    this.listeners.forEach((callback) => callback(error));
  }

  /**
   * Get current stats for a deployment
   */
  getStats(deploymentId: string): DeploymentStats | undefined {
    return this.statsMap.get(deploymentId);
  }

  /**
   * Get all stats
   */
  getAllStats(): DeploymentStats[] {
    return Array.from(this.statsMap.values());
  }

  /**
   * Get recent errors
   */
  getRecentErrors(deploymentId?: string, limit: number = 10): SimulatedError[] {
    let errors = this.errorLog;
    
    if (deploymentId) {
      errors = errors.filter((e) => e.deploymentId === deploymentId);
    }
    
    return errors
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Clear all errors
   */
  clearErrors(deploymentId?: string) {
    if (deploymentId) {
      this.errorLog = this.errorLog.filter((e) => e.deploymentId !== deploymentId);
      localStorage.removeItem(`simulation_errors_${deploymentId}`);
    } else {
      this.errorLog = [];
      // Clear all deployment errors from localStorage
      Object.keys(localStorage)
        .filter((key) => key.startsWith("simulation_errors_"))
        .forEach((key) => localStorage.removeItem(key));
    }
  }

  /**
   * Get simulation status
   */
  isActive(): boolean {
    return this.isRunning;
  }
}

// Singleton instance
export const simulationEngine = new SimulationEngine();

