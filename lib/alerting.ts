/**
 * Alerting System
 * Monitors deployments and sends alerts when thresholds are exceeded
 */

import { sendErrorAlert, isSlackConnected } from './slack';

export interface DeploymentAlert {
  deploymentId: string;
  deploymentName: string;
  errorType: string;
  errorCount: number;
  errorRate: number;
  threshold: number;
  timestamp: Date;
}

export interface AlertConfig {
  enabled: boolean;
  errorRateThreshold: number; // percentage
  minErrorCount: number; // minimum errors to trigger alert
  cooldownMinutes: number; // prevent alert spam
}

const DEFAULT_ALERT_CONFIG: AlertConfig = {
  enabled: true,
  errorRateThreshold: 10, // 10%
  minErrorCount: 5,
  cooldownMinutes: 30,
};

// Track last alert time per deployment to prevent spam
const lastAlertTime = new Map<string, Date>();

/**
 * Check if deployment should trigger an alert
 */
export function shouldAlert(
  deploymentId: string,
  errorRate: number,
  errorCount: number,
  config: AlertConfig = DEFAULT_ALERT_CONFIG
): boolean {
  if (!config.enabled) return false;
  if (!isSlackConnected()) return false;
  
  // Check thresholds
  if (errorRate < config.errorRateThreshold) return false;
  if (errorCount < config.minErrorCount) return false;
  
  // Check cooldown
  const lastAlert = lastAlertTime.get(deploymentId);
  if (lastAlert) {
    const minutesSinceLastAlert = (Date.now() - lastAlert.getTime()) / 1000 / 60;
    if (minutesSinceLastAlert < config.cooldownMinutes) {
      return false;
    }
  }
  
  return true;
}

/**
 * Send alert for deployment error spike
 */
export async function sendDeploymentAlert(
  alert: DeploymentAlert,
  stats?: {
    totalEvents: number;
    errorsByType: Record<string, number>;
  }
): Promise<boolean> {
  try {
    const success = await sendErrorAlert(
      alert.errorType,
      alert.errorCount,
      alert.deploymentName,
      alert.threshold,
      {
        totalEvents: stats?.totalEvents,
        errorRate: alert.errorRate,
        errorsByType: stats?.errorsByType,
      }
    );
    
    if (success) {
      // Update last alert time
      lastAlertTime.set(alert.deploymentId, new Date());
    }
    
    return success;
  } catch (error) {
    console.error('Failed to send deployment alert:', error);
    return false;
  }
}

/**
 * Monitor deployment and send alerts if needed
 */
export async function monitorDeployment(
  deploymentId: string,
  deploymentName: string,
  stats: {
    errorCount: number;
    totalEvents: number;
    errorsByType: Record<string, number>;
  },
  config?: AlertConfig
): Promise<boolean> {
  const errorRate = (stats.errorCount / stats.totalEvents) * 100;
  
  if (!shouldAlert(deploymentId, errorRate, stats.errorCount, config)) {
    return false;
  }
  
  // Find the most common error type
  const topError = Object.entries(stats.errorsByType)
    .sort(([, a], [, b]) => b - a)[0];
  
  if (!topError) return false;
  
  const [errorType, errorCount] = topError;
  
  const alert: DeploymentAlert = {
    deploymentId,
    deploymentName,
    errorType,
    errorCount,
    errorRate,
    threshold: config?.errorRateThreshold || DEFAULT_ALERT_CONFIG.errorRateThreshold,
    timestamp: new Date(),
  };
  
  return await sendDeploymentAlert(alert, {
    totalEvents: stats.totalEvents,
    errorsByType: stats.errorsByType,
  });
}

/**
 * Get alert configuration for a deployment
 */
export function getAlertConfig(deploymentId: string): AlertConfig {
  if (typeof window === 'undefined') return DEFAULT_ALERT_CONFIG;
  
  const saved = localStorage.getItem(`alert-config-${deploymentId}`);
  if (saved) {
    return { ...DEFAULT_ALERT_CONFIG, ...JSON.parse(saved) };
  }
  
  return DEFAULT_ALERT_CONFIG;
}

/**
 * Save alert configuration for a deployment
 */
export function saveAlertConfig(deploymentId: string, config: Partial<AlertConfig>): void {
  if (typeof window === 'undefined') return;
  
  const current = getAlertConfig(deploymentId);
  const updated = { ...current, ...config };
  localStorage.setItem(`alert-config-${deploymentId}`, JSON.stringify(updated));
}

/**
 * Get Slack channel for a deployment
 */
export function getDeploymentChannel(deploymentId: string): string {
  if (typeof window === 'undefined') return '#deployments';
  
  const saved = localStorage.getItem(`slack-channel-${deploymentId}`);
  return saved || '#deployments';
}

/**
 * Set Slack channel for a deployment
 */
export function setDeploymentChannel(deploymentId: string, channel: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(`slack-channel-${deploymentId}`, channel);
}

