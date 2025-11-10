# 📊 Demo Data Scenarios - Realistic Project Tree Examples

## Overview
The demo data showcases realistic scenarios where the tree structure and configuration comparison features provide real value. Each project demonstrates different use cases and configuration patterns.

---

## 🌳 Project Scenarios

### **1. Internal Base Configuration**
**Purpose:** Foundation project that other deployments can inherit from

**Deployments:**
- Internal Production (healthy, 0 errors)
- Internal Staging (healthy, 2 errors)  
- Internal Development (noisy, 15 errors - testing v59.0 beta)

**Key Features:**
- ✅ All use shared base configuration
- ✅ Standard Salesforce → PostgreSQL pipeline
- ✅ Standard mappings for Account, Contact, Opportunity, Lead
- ⚙️ Custom webhooks per environment
- ⚙️ Dev environment testing newer API version (v59.0 beta)

**Why Tree Structure Matters:**
Shows a clean inheritance model where all deployments share the same base config, with only environment-specific differences (webhooks, API versions for testing).

---

### **2. Acme Corporation**
**Purpose:** Enterprise customer with custom requirements

**Deployments:**
- Acme Production (healthy, 5 errors)
- Acme Staging (noisy, 23 errors)

**Key Features:**
- ✅ Shared base connectors (Salesforce → PostgreSQL)
- ⚙️ **Faster sync frequency** in production (5 min vs 15 min)
- ⚙️ **Custom field mappings** including Territory, Department, Forecast
- ⚙️ **Custom object mapping** for "Projects"
- ⚙️ **Multiple webhooks** including audit logging
- 🔍 **Different API versions** between prod (v57.0) and staging (v58.0 - testing)

**Configuration Differences:**
| Config | Production | Staging |
|--------|-----------|---------|
| Sync Frequency | 5 minutes (faster) | 15 minutes (standard) |
| Account Mapping | Custom - Include Territory | Custom - Include Territory |
| Opportunity Mapping | Custom - Include Forecast | Standard (testing) |
| Custom Object: Projects | Enabled | Disabled (not ready) |
| Audit Webhook | Enabled | Not configured |

**Why Tree Structure Matters:**
Shows how a customer can inherit base connectors but customize mappings and sync frequencies for their specific needs. The comparison view makes it easy to see why staging behaves differently from production.

---

### **3. TechStart Inc**
**Purpose:** Startup with minimal customization

**Deployments:**
- TechStart Production (healthy, 1 error)
- TechStart Development (degraded, 48 errors)

**Key Features:**
- ✅ **Mostly inherited** from base configuration
- ⚙️ Only one custom object: "Tickets"
- ⚙️ Shared webhooks for error notifications
- 🔍 Dev environment is degraded (testing/development issues)

**Why Tree Structure Matters:**
Demonstrates the "simple customer" scenario where they use 95% of the base configuration with minimal customization. Tree view shows they're mostly green (inherited), making it obvious they're using standard configs.

---

### **4. Global Retail Co**
**Purpose:** Multi-region deployment with compliance requirements

**Deployments:**
- Global Retail US (healthy, 3 errors)
- Global Retail EU (noisy, 12 errors)
- Global Retail APAC (healthy, 7 errors)

**Key Features:**
- ✅ Shared base connectors
- ⚙️ **Region-specific data centers** (US-East, EU-West, APAC-Southeast)
- ⚙️ **Compliance-specific mappings** (CCPA, GDPR, APAC Privacy Laws)
- ⚙️ **Currency handling** (USD, EUR, Multi-Currency)
- ⚙️ **Tax fields** (US Tax, VAT, Multi-Currency)
- ⚙️ **Region-specific webhooks** for monitoring and compliance

**Configuration Differences:**
| Config | US | EU | APAC |
|--------|----|----|------|
| Data Region | US-East | EU-West | APAC-Southeast |
| Account Mapping | US Tax Fields | VAT Fields | Multi-Currency |
| Contact Mapping | CCPA Compliance | GDPR Compliance | APAC Privacy Laws |
| Opportunity Mapping | USD Currency | EUR Currency | Multi-Currency |
| Compliance Webhook | /us | /eu | /apac |

**Why Tree Structure Matters:**
Perfect example of where comparison view is essential. All three deployments share the same base connectors but have completely different mappings and webhooks due to regional requirements. The side-by-side comparison makes it obvious what's different and why.

---

## 🎯 Key Insights from Demo Data

### **1. Inheritance Patterns**

**High Inheritance (TechStart):**
```
📁 TechStart Inc
├─ 🟢 Production [🔀 95% inherited]
└─ 🔴 Development [🔀 95% inherited]
```
- Simple customer
- Uses base configuration
- Minimal customization

**Medium Inheritance (Acme):**
```
📁 Acme Corporation
├─ 🟢 Production [🔀 60% inherited, ⚙️ 40% custom]
└─ 🟡 Staging [🔀 60% inherited, ⚙️ 40% custom]
```
- Enterprise customer
- Custom mappings and sync frequency
- Environment-specific differences

**Low Inheritance (Global Retail):**
```
📁 Global Retail Co
├─ 🟢 US [🔀 30% inherited, ⚙️ 70% custom]
├─ 🟡 EU [🔀 30% inherited, ⚙️ 70% custom]
└─ 🟢 APAC [🔀 30% inherited, ⚙️ 70% custom]
```
- Multi-region deployment
- Heavy customization per region
- Compliance requirements

### **2. Common Customization Points**

**Most Commonly Shared:**
- Source/Destination connector types
- Auth methods
- Base object mappings (Account, Contact, Lead)

**Most Commonly Customized:**
- API versions (for testing)
- Sync frequencies (performance requirements)
- Custom object mappings (business-specific)
- Webhooks (environment/region-specific)
- Field mappings (compliance/currency requirements)

### **3. Environment Patterns**

**Production Environments:**
- Generally healthy or with few errors
- Stable API versions
- Full webhook configuration
- Optimized sync frequencies

**Staging Environments:**
- May be noisy (testing new features)
- Newer API versions being tested
- Simplified webhook configuration
- Standard sync frequencies

**Development Environments:**
- Often degraded (active development)
- Beta API versions
- Minimal webhook configuration
- May have disabled features

---

## 📊 Comparison View Use Cases

### **Use Case 1: Troubleshooting**
**Scenario:** "Why is EU deployment noisier than US?"

**Solution:** Click "Compare" on Global Retail project

**Findings:**
- EU uses different API version
- Different compliance mappings
- Different webhook configurations
- Can identify root cause quickly

### **Use Case 2: Onboarding New Region**
**Scenario:** "We need to add a Latin America deployment"

**Solution:** Look at Global Retail comparison

**Action Items:**
- Copy base connector configuration
- Create LATAM-specific mappings (currency, privacy laws)
- Set up region-specific webhooks
- Configure LATAM data center

### **Use Case 3: Standardization**
**Scenario:** "Can we standardize Acme's staging to match production?"

**Solution:** Compare Acme deployments

**Findings:**
- Staging uses newer API version (intentional for testing)
- Staging has Standard Opportunity Mapping (should be Custom)
- Staging missing Custom Object: Projects (needs to be enabled)
- Staging missing Audit Webhook (should be added)

### **Use Case 4: Cost Optimization**
**Scenario:** "Which customers have custom sync frequencies?"

**Solution:** Compare all projects

**Findings:**
- Acme Production: 5-minute sync (3x cost)
- Global Retail: 10-minute sync (1.5x cost)
- TechStart: 15-minute sync (standard)
- Internal: 15-minute sync (standard)

---

## 🎨 Visual Indicators in Demo Data

### **Health Status Distribution**
```
🟢 Healthy (8 deployments)
- Internal Prod, Internal Staging
- Acme Prod
- TechStart Prod
- Global US, Global APAC

🟡 Noisy (3 deployments)
- Internal Dev (testing beta)
- Acme Staging (testing v58.0)
- Global EU (compliance issues?)

🔴 Degraded (1 deployment)
- TechStart Dev (active development)
```

### **Inheritance Levels**
```
🔀 High Inheritance (green badges)
- Internal Base: 100%
- TechStart: 95%

⚙️ Medium Inheritance (mix of badges)
- Acme: 60%

⚙️ Low Inheritance (mostly custom)
- Global Retail: 30%
```

---

## 🚀 Demo Flow Recommendations

### **For Showcasing Inheritance:**
1. Start with **Internal Base** project
2. Expand to show all deployments use same config
3. Point out only webhooks are different

### **For Showcasing Customization:**
1. Open **Acme Corporation** project
2. Click "Compare" button
3. Show custom mappings and sync frequency
4. Highlight differences between prod and staging

### **For Showcasing Multi-Region:**
1. Open **Global Retail Co** project
2. Click "Compare" button
3. Show how all three regions have different:
   - Data centers
   - Compliance mappings
   - Currency handling
   - Webhooks

### **For Showcasing Simplicity:**
1. Open **TechStart Inc** project
2. Show mostly inherited configuration
3. Only one custom object
4. Perfect for small customers

---

## ✅ Summary

The demo data provides:

✅ **4 distinct project scenarios** covering different use cases  
✅ **12 total deployments** with realistic configurations  
✅ **Meaningful differences** that justify the comparison view  
✅ **Real-world patterns** (inheritance, customization, multi-region)  
✅ **Clear visual indicators** (health status, inheritance badges)  

**The tree structure and comparison view make it immediately obvious what's shared, what's custom, and why deployments behave differently.** 🎯

---

*This demo data scales from simple startups to complex multi-region enterprises, showcasing the full power of the hierarchical project structure.* ✨

