"use client";

import { useEffect, useRef } from 'react';
import { monitorDeployment, getAlertConfig } from '@/lib/alerting';
import { isSlackConnected } from '@/lib/slack';
import { toast } from 'sonner';

interface DeploymentStats {
  errorCount: number;
  totalEvents: number;
  errorsByType: Record<string, number>;
}

/**
 * Hook to monitor a deployment and send alerts automatically
 */
export function useDeploymentMonitoring(
  deploymentId: string,
  deploymentName: string,
  stats: DeploymentStats | undefined,
  enabled: boolean = true
) {
  const lastCheckRef = useRef<number>(0);
  const alertSentRef = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled || !stats || !isSlackConnected()) {
      return;
    }

    const checkInterval = setInterval(async () => {
      const now = Date.now();
      
      // Check every 60 seconds
      if (now - lastCheckRef.current < 60000) {
        return;
      }
      
      lastCheckRef.current = now;
      
      try {
        const config = getAlertConfig(deploymentId);
        
        if (!config.enabled) {
          return;
        }
        
        const errorRate = (stats.errorCount / stats.totalEvents) * 100;
        
        // Check if alert should be sent
        if (
          errorRate >= config.errorRateThreshold &&
          stats.errorCount >= config.minErrorCount &&
          !alertSentRef.current
        ) {
          const success = await monitorDeployment(
            deploymentId,
            deploymentName,
            stats,
            config
          );
          
          if (success) {
            alertSentRef.current = true;
            toast.success('Alert sent to Slack', {
              description: `Error rate: ${errorRate.toFixed(1)}% (threshold: ${config.errorRateThreshold}%)`
            });
            
            // Reset alert flag after cooldown
            setTimeout(() => {
              alertSentRef.current = false;
            }, config.cooldownMinutes * 60 * 1000);
          }
        }
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(checkInterval);
  }, [deploymentId, deploymentName, stats, enabled]);
}

