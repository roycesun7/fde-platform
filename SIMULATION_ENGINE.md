# 🎲 Simulation Engine - Live Error Generation & Slack Notifications

## Overview
A powerful simulation system that generates realistic random errors based on deployment health patterns and automatically triggers Slack notifications for critical issues.

---

## 🚀 Features

### 1. **Realistic Error Generation**
- Errors generated based on deployment health:
  - **Healthy**: 5% chance per check, mostly low/medium severity
  - **Noisy**: 25% chance per check, mixed severity including some high
  - **Degraded**: 50% chance per check, frequent high/critical errors

### 2. **12 Error Types**
```
AUTH_FAILURE         - OAuth token expired
RATE_LIMIT           - Salesforce API rate limit exceeded  
MAPPING_ERROR        - Field mapping failed
CONNECTION_TIMEOUT   - Database connection timeout
VALIDATION_ERROR     - Data validation failed
SYNC_CONFLICT        - Record conflict during sync
PERMISSION_DENIED    - Insufficient permissions
DATA_TOO_LARGE       - Record exceeds batch size
NULL_POINTER         - Null reference in transformation
WEBHOOK_FAILURE      - Webhook delivery failed
DUPLICATE_KEY        - Database unique constraint violation
NETWORK_ERROR        - Network connection lost
```

### 3. **Automatic Slack Notifications**
- **High** and **Critical** severity errors automatically send Slack notifications
- Includes error details, deployment info, and recent error history
- Only sends if Slack is configured (webhook URL present)

### 4. **Live UI Updates**
- Real-time error feed shows errors as they occur
- Deployment stats update automatically
- Error counts and rates track in real-time
- Cross-component communication via custom events

### 5. **Deployment Statistics**
- Tracks per-deployment:
  - Total error count
  - Error rate (errors/minute)
  - Current health status
  - Last error details

---

## 🎮 How to Use

### **Step 1: Open Dashboard**
Navigate to the main dashboard (`/`)

### **Step 2: Start Simulation**
Click "Start Simulation" in the purple "Simulation Engine" card at the top

### **Step 3: Watch It Run**
- **Live Error Feed** appears showing errors in real-time
- **Stats update** automatically (Total Errors, Avg Error Rate, Healthy/Issues count)
- **Deployment Status** shows individual deployment health
- **Slack notifications** sent for high/critical errors (if configured)

### **Step 4: Stop or Reset**
- **Stop** - Stops generating new errors (keeps existing data)
- **Reset** - Clears all errors and resets statistics

---

## 📊 Visual Components

### **1. Simulation Control Panel**
```
┌───────────────────────────────────────────────┐
│ ⚡ Simulation Engine [Running]                │
│                                               │
│ [Start] [Stop] [Reset]                       │
│                                               │
│ Total Errors: 47    Avg Error Rate: 3.2/min │
│ Healthy: 6          Issues: 4                │
│                                               │
│ Recent Errors (Live):                        │
│ ├─ [HIGH] Acme Production                   │
│ │   AUTH_FAILURE: OAuth token expired       │
│ │   [📩 Slack]                              │
│ │                                            │
│ └─ [MEDIUM] Global Retail EU               │
│     RATE_LIMIT: API limit exceeded          │
│                                              │
│ Deployment Status:                           │
│ ├─ Internal Production: 0 errors, 0/min    │
│ ├─ Acme Production: 12 errors, 2.5/min     │
│ └─ TechStart Dev: 23 errors, 4.1/min       │
└───────────────────────────────────────────────┘
```

### **2. Live Error Feed** (appears when errors occur)
```
┌───────────────────────────────────────────────┐
│ 🚨 Live Error Feed  [5 recent]               │
│                                               │
│ ├─ [CRITICAL] Global Retail US               │
│ │   CONNECTION_TIMEOUT                       │
│ │   Connection to PostgreSQL timed out       │
│ │   host: postgres-prod.example.com          │
│ │   3:45:23 PM                               │
│ │                                            │
│ ├─ [HIGH] Acme Production                   │
│ │   AUTH_FAILURE                             │
│ │   OAuth token expired                      │
│ │   token_expiry: 2024-01-01T12:00:00Z      │
│ │   3:45:19 PM                               │
│ │                                            │
│ └─ [MEDIUM] TechStart Production            │
│     SYNC_CONFLICT                            │
│     Record conflict detected during sync     │
│     3:45:15 PM                               │
└───────────────────────────────────────────────┘
```

---

## 🔔 Slack Notification Flow

### **Trigger Conditions**
1. Simulation generates an error
2. Error severity is **HIGH** or **CRITICAL**
3. Slack webhook URL is configured
4. Slack integration is connected

### **What Gets Sent**
```
🚨 ERROR ALERT: Acme Production

Error Rate: 2.5 errors/min (threshold: 5.0)
Error Count: 12 errors (threshold: 20)

Recent Errors:
• AUTH_FAILURE: 1 occurrence

Details:
- Deployment: Acme Production
- Total Events: 156
- Time: 3:45:23 PM
```

### **Configuration Required**
1. Go to **Settings → Integrations → Slack**
2. Enter your Slack Webhook URL
3. Click "Connect"
4. Start simulation
5. High/Critical errors will automatically send notifications

---

## 🎯 Error Patterns by Health

### **Healthy Deployments** (5% error rate)
```
Example: Internal Production, TechStart Production

Typical Errors:
├─ 70% LOW severity
│  └─ VALIDATION_ERROR, NULL_POINTER, DUPLICATE_KEY
│
├─ 25% MEDIUM severity
│  └─ RATE_LIMIT, SYNC_CONFLICT, DATA_TOO_LARGE
│
└─ 5% HIGH severity
    └─ MAPPING_ERROR, AUTH_FAILURE, PERMISSION_DENIED

Slack Notifications: Rare (only 5% of errors)
Error Rate: 0-1 error/min
```

### **Noisy Deployments** (25% error rate)
```
Example: Internal Dev, Acme Staging, Global Retail EU

Typical Errors:
├─ 50% LOW severity
├─ 30% MEDIUM severity
├─ 15% HIGH severity
└─ 5% CRITICAL severity
    └─ CONNECTION_TIMEOUT, NETWORK_ERROR

Slack Notifications: Occasional (20% of errors)
Error Rate: 1-3 errors/min
```

### **Degraded Deployments** (50% error rate)
```
Example: TechStart Development

Typical Errors:
├─ 30% LOW severity
├─ 30% MEDIUM severity
├─ 30% HIGH severity
└─ 10% CRITICAL severity

Slack Notifications: Frequent (40% of errors)
Error Rate: 3-6 errors/min
```

---

## 🔧 Technical Details

### **How It Works**

1. **Initialization**
   ```typescript
   simulationEngine.start(deployments, 3000);
   // Checks every 3 seconds
   ```

2. **Error Generation Loop**
   - For each deployment:
     - Check health pattern (healthy/noisy/degraded)
     - Roll random chance based on frequency
     - If triggered, generate error with realistic data
     - Log error and update stats
     - Send Slack notification if high/critical
     - Dispatch UI event for live updates

3. **Error Distribution**
   - Severity picked from probability distribution
   - Error type randomly selected from 12 types
   - Realistic payload generated per error type

4. **Stats Tracking**
   - Per-deployment error count
   - Error rate (rolling 1-minute window)
   - Health status updates based on error rate:
     - > 10 errors/min → Degraded
     - > 5 errors/min → Noisy
     - ≤ 5 errors/min → Healthy

### **Event System**
```typescript
// Listen for errors
simulationEngine.onError((error) => {
  console.log("New error:", error);
});

// Or use custom events
window.addEventListener("simulation-error", (event) => {
  const error = event.detail;
  // Update UI
});
```

### **Storage**
- Errors stored in localStorage per deployment
- Key: `simulation_errors_{deploymentId}`
- Keeps last 20 errors per deployment
- Stats kept in memory (lost on page refresh)

---

## 💡 Use Cases

### **1. Demo & Presentation**
- Show live error monitoring
- Demonstrate Slack integration
- Illustrate error patterns by health status

### **2. UI Testing**
- Test error display components
- Verify notification system
- Check cross-component updates

### **3. Load Testing**
- See how UI handles high error rates
- Test performance with many simultaneous errors
- Verify memory usage stays reasonable

### **4. Customer Onboarding**
- Show realistic deployment monitoring
- Demonstrate alerting capabilities
- Explain health status meanings

---

## 🎨 Customization

### **Change Check Interval**
```typescript
// Default: 3 seconds
simulationEngine.start(deployments, 3000);

// Faster: 1 second
simulationEngine.start(deployments, 1000);

// Slower: 10 seconds
simulationEngine.start(deployments, 10000);
```

### **Add Custom Error Types**
Edit `lib/simulationEngine.ts`:
```typescript
const ERROR_TYPES = [
  // ... existing errors
  { 
    type: "CUSTOM_ERROR", 
    message: "Your custom error message", 
    severity: "high" 
  },
];
```

### **Adjust Error Frequencies**
Edit `ERROR_PATTERNS`:
```typescript
const ERROR_PATTERNS = {
  healthy: {
    frequency: 0.02, // Change from 0.05 (5%) to 0.02 (2%)
    severityDistribution: { low: 0.8, medium: 0.15, high: 0.05, critical: 0 },
  },
  // ...
};
```

---

## ⚡ Performance

- **Memory**: ~100KB for 100 errors (old errors auto-cleared)
- **CPU**: Minimal (checks run every 3 seconds)
- **Network**: Only when sending Slack notifications
- **Storage**: ~50KB per deployment in localStorage

---

## 🎯 Summary

The Simulation Engine provides:

✅ **Realistic error generation** based on deployment health  
✅ **12 types of authentic errors** with detailed payloads  
✅ **Automatic Slack notifications** for high/critical errors  
✅ **Live UI updates** across all components  
✅ **Deployment statistics** tracking and health monitoring  
✅ **Easy start/stop/reset** controls  
✅ **Cross-tab communication** via custom events  

**Perfect for demos, testing, and showcasing the monitoring platform's capabilities!** 🎲✨

