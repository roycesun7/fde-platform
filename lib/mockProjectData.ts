// Mock data structure showing clear base configuration → deployment inheritance pattern

export interface ConfigItem {
  name: string;
  value: string;
  isShared: boolean;
  isDifferent?: boolean;
}

export interface DeploymentConfig {
  id: string;
  name: string;
  environment: string;
  health: "healthy" | "noisy" | "degraded";
  errorCount: number;
  isShared: boolean; // True = mostly inherits from base, False = heavy customization
  connectors: ConfigItem[];
  mappings: ConfigItem[];
  webhooks: ConfigItem[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  deployments: DeploymentConfig[];
  sharedConfig: {
    connectors: boolean;
    mappings: boolean;
    webhooks: boolean;
  };
}

// ============================================================================
// BASE CONFIGURATION - What all deployments can inherit from
// ============================================================================

const baseConnectors: ConfigItem[] = [
  { name: "Source Type", value: "Salesforce", isShared: true },
  { name: "Destination Type", value: "PostgreSQL", isShared: true },
  { name: "Auth Method", value: "OAuth 2.0", isShared: true },
  { name: "API Version", value: "v58.0", isShared: true },
  { name: "Sync Frequency", value: "Every 15 minutes", isShared: true },
  { name: "Batch Size", value: "200 records", isShared: true },
];

const baseMappings: ConfigItem[] = [
  { name: "Account → accounts", value: "Standard mapping", isShared: true },
  { name: "Contact → contacts", value: "Standard mapping", isShared: true },
  { name: "Opportunity → opportunities", value: "Standard mapping", isShared: true },
  { name: "Lead → leads", value: "Standard mapping", isShared: true },
];

const baseWebhooks: ConfigItem[] = [
  { name: "Error Notifications", value: "Not configured", isShared: false },
  { name: "Success Notifications", value: "Not configured", isShared: false },
  { name: "Audit Logging", value: "Not configured", isShared: false },
];

// ============================================================================
// TREE STRUCTURE: Base Config → All Deployments
// ============================================================================

export const mockProjects: Project[] = [
  // ====================================
  // ROOT: Internal Base Configuration
  // ====================================
  {
    id: "internal-base",
    name: "🔧 Internal Base Configuration",
    description: "Standard Salesforce → PostgreSQL pipeline. All deployments inherit these defaults.",
    sharedConfig: {
      connectors: true,
      mappings: true,
      webhooks: false,
    },
    deployments: [], // Empty - this defines the base that others inherit from
  },
  // ====================================
  // BRANCH: All Deployments from Base
  // ====================================
  {
    id: "all-deployments",
    name: "📦 All Deployments",
    description: "All customer deployments inheriting from base configuration",
    sharedConfig: {
      connectors: true,
      mappings: true,
      webhooks: false,
    },
    deployments: [
      
      // ============================================================
      // COMPANY: Internal (Reference Implementation)
      // Pattern: Uses pure base config with minimal customization
      // ============================================================
      {
        id: "internal-prod",
        name: "Internal Production",
        environment: "production",
        health: "healthy",
        errorCount: 0,
        isShared: true, // ✅ 100% inherited
        connectors: baseConnectors, // All inherited
        mappings: baseMappings, // All inherited
        webhooks: [
          { name: "Error Notifications", value: "https://slack.com/internal-errors", isShared: false, isDifferent: true },
          { name: "Success Notifications", value: "Not configured", isShared: false },
          { name: "Audit Logging", value: "Not configured", isShared: false },
        ],
      },
      {
        id: "internal-staging",
        name: "Internal Staging",
        environment: "staging",
        health: "healthy",
        errorCount: 2,
        isShared: true, // ✅ 100% inherited
        connectors: baseConnectors,
        mappings: baseMappings,
        webhooks: [
          { name: "Error Notifications", value: "https://slack.com/internal-staging", isShared: false, isDifferent: true },
          { name: "Success Notifications", value: "Not configured", isShared: false },
          { name: "Audit Logging", value: "Not configured", isShared: false },
        ],
      },
      {
        id: "internal-dev",
        name: "Internal Development",
        environment: "development",
        health: "noisy",
        errorCount: 15,
        isShared: true, // ✅ Mostly inherited (testing new API)
        connectors: [
          { name: "Source Type", value: "Salesforce", isShared: true },
          { name: "Destination Type", value: "PostgreSQL", isShared: true },
          { name: "Auth Method", value: "OAuth 2.0", isShared: true },
          { name: "API Version", value: "v59.0 (beta)", isShared: false, isDifferent: true }, // Testing
          { name: "Sync Frequency", value: "Every 15 minutes", isShared: true },
          { name: "Batch Size", value: "200 records", isShared: true },
        ],
        mappings: baseMappings,
        webhooks: baseWebhooks, // No webhooks in dev
      },
      
      // ============================================================
      // COMPANY: Acme Corporation
      // Pattern: Enterprise with custom field mappings & fast sync
      // ============================================================
      {
        id: "acme-prod",
        name: "Acme Production",
        environment: "production",
        health: "healthy",
        errorCount: 5,
        isShared: false, // ⚙️ Heavy customization
        connectors: [
          { name: "Source Type", value: "Salesforce", isShared: true }, // ✅ From base
          { name: "Destination Type", value: "PostgreSQL", isShared: true }, // ✅ From base
          { name: "Auth Method", value: "OAuth 2.0", isShared: true }, // ✅ From base
          { name: "API Version", value: "v57.0 (stable)", isShared: false, isDifferent: true }, // ⚙️ Custom: older stable
          { name: "Sync Frequency", value: "Every 5 minutes", isShared: false, isDifferent: true }, // ⚙️ Custom: faster for real-time needs
          { name: "Batch Size", value: "500 records", isShared: false, isDifferent: true }, // ⚙️ Custom: larger batches
        ],
        mappings: [
          { name: "Account → accounts", value: "Custom: +territory +sales_region", isShared: false, isDifferent: true },
          { name: "Contact → contacts", value: "Custom: +department +title", isShared: false, isDifferent: true },
          { name: "Opportunity → opportunities", value: "Custom: +forecast_category", isShared: false, isDifferent: true },
          { name: "Lead → leads", value: "Standard mapping", isShared: true }, // ✅ Inherited
          { name: "Project__c → projects", value: "Custom object mapping", isShared: false, isDifferent: true },
        ],
        webhooks: [
          { name: "Error Notifications", value: "https://acme.pagerduty.com/prod-errors", isShared: false, isDifferent: true },
          { name: "Success Notifications", value: "https://acme.datadog.com/success", isShared: false, isDifferent: true },
          { name: "Audit Logging", value: "https://acme.splunk.com/audit", isShared: false, isDifferent: true },
        ],
      },
      {
        id: "acme-staging",
        name: "Acme Staging",
        environment: "staging",
        health: "noisy",
        errorCount: 23,
        isShared: false, // ⚙️ Custom (testing new mappings)
        connectors: [
          { name: "Source Type", value: "Salesforce", isShared: true },
          { name: "Destination Type", value: "PostgreSQL", isShared: true },
          { name: "Auth Method", value: "OAuth 2.0", isShared: true },
          { name: "API Version", value: "v58.0 (testing)", isShared: false, isDifferent: true }, // ⚙️ Testing newer version
          { name: "Sync Frequency", value: "Every 15 minutes", isShared: true }, // ✅ Standard for staging
          { name: "Batch Size", value: "500 records", isShared: false, isDifferent: true },
        ],
        mappings: [
          { name: "Account → accounts", value: "Custom: +territory +sales_region", isShared: false, isDifferent: true },
          { name: "Contact → contacts", value: "Custom: +department +title", isShared: false, isDifferent: true },
          { name: "Opportunity → opportunities", value: "Standard mapping", isShared: true }, // ⚙️ Testing standard before prod
          { name: "Lead → leads", value: "Standard mapping", isShared: true },
          { name: "Project__c → projects", value: "Disabled (testing)", isShared: false, isDifferent: true },
        ],
        webhooks: [
          { name: "Error Notifications", value: "https://acme.slack.com/staging-errors", isShared: false, isDifferent: true },
          { name: "Success Notifications", value: "Not configured", isShared: false },
          { name: "Audit Logging", value: "Not configured", isShared: false },
        ],
      },
      
      // ============================================================
      // COMPANY: TechStart Inc (Startup)
      // Pattern: Minimal customization, uses base config
      // ============================================================
      {
        id: "techstart-prod",
        name: "TechStart Production",
        environment: "production",
        health: "healthy",
        errorCount: 1,
        isShared: true, // ✅ 95% inherited (just one custom object)
        connectors: baseConnectors, // ✅ All inherited
        mappings: [
          { name: "Account → accounts", value: "Standard mapping", isShared: true },
          { name: "Contact → contacts", value: "Standard mapping", isShared: true },
          { name: "Opportunity → opportunities", value: "Standard mapping", isShared: true },
          { name: "Lead → leads", value: "Standard mapping", isShared: true },
          { name: "Ticket__c → support_tickets", value: "Custom object", isShared: false, isDifferent: true }, // ⚙️ Only customization
        ],
        webhooks: [
          { name: "Error Notifications", value: "https://techstart.slack.com/errors", isShared: false, isDifferent: true },
          { name: "Success Notifications", value: "Not configured", isShared: false },
          { name: "Audit Logging", value: "Not configured", isShared: false },
        ],
      },
      {
        id: "techstart-dev",
        name: "TechStart Development",
        environment: "development",
        health: "degraded",
        errorCount: 48,
        isShared: true, // ✅ 100% inherited
        connectors: baseConnectors,
        mappings: baseMappings,
        webhooks: baseWebhooks, // No webhooks
      },
      
      // ============================================================
      // COMPANY: Global Retail (Multi-Region)
      // Pattern: Heavy regional customization for compliance
      // ============================================================
      {
        id: "global-us-prod",
        name: "Global Retail US",
        environment: "production",
        health: "healthy",
        errorCount: 3,
        isShared: false, // ⚙️ Heavy customization for US region
        connectors: [
          { name: "Source Type", value: "Salesforce", isShared: true }, // ✅ From base
          { name: "Destination Type", value: "PostgreSQL", isShared: true }, // ✅ From base
          { name: "Auth Method", value: "OAuth 2.0", isShared: true }, // ✅ From base
          { name: "API Version", value: "v57.0", isShared: false, isDifferent: true },
          { name: "Sync Frequency", value: "Every 10 minutes", isShared: false, isDifferent: true },
          { name: "Batch Size", value: "200 records", isShared: true },
          { name: "Data Center", value: "US-East-1", isShared: false, isDifferent: true }, // ⚙️ Region-specific
        ],
        mappings: [
          { name: "Account → accounts", value: "Custom: +tax_id +state_code", isShared: false, isDifferent: true }, // ⚙️ US Tax
          { name: "Contact → contacts", value: "Custom: +ssn_hash +ccpa_consent", isShared: false, isDifferent: true }, // ⚙️ CCPA
          { name: "Opportunity → opportunities", value: "Custom: +usd_amount +tax_rate", isShared: false, isDifferent: true }, // ⚙️ USD
          { name: "Lead → leads", value: "Standard mapping", isShared: true },
        ],
        webhooks: [
          { name: "Error Notifications", value: "https://global.pagerduty.com/us", isShared: false, isDifferent: true },
          { name: "Success Notifications", value: "https://global.datadog.com/us", isShared: false, isDifferent: true },
          { name: "Audit Logging", value: "https://compliance.global.com/us-audit", isShared: false, isDifferent: true },
        ],
      },
      {
        id: "global-eu-prod",
        name: "Global Retail EU",
        environment: "production",
        health: "noisy",
        errorCount: 12,
        isShared: false, // ⚙️ Heavy customization for EU region
        connectors: [
          { name: "Source Type", value: "Salesforce", isShared: true },
          { name: "Destination Type", value: "PostgreSQL", isShared: true },
          { name: "Auth Method", value: "OAuth 2.0", isShared: true },
          { name: "API Version", value: "v57.0", isShared: false, isDifferent: true },
          { name: "Sync Frequency", value: "Every 10 minutes", isShared: false, isDifferent: true },
          { name: "Batch Size", value: "200 records", isShared: true },
          { name: "Data Center", value: "EU-West-1", isShared: false, isDifferent: true }, // ⚙️ Region-specific
        ],
        mappings: [
          { name: "Account → accounts", value: "Custom: +vat_number +country_code", isShared: false, isDifferent: true }, // ⚙️ EU VAT
          { name: "Contact → contacts", value: "Custom: +gdpr_consent +right_to_delete", isShared: false, isDifferent: true }, // ⚙️ GDPR
          { name: "Opportunity → opportunities", value: "Custom: +eur_amount +vat_rate", isShared: false, isDifferent: true }, // ⚙️ EUR
          { name: "Lead → leads", value: "Standard mapping", isShared: true },
        ],
        webhooks: [
          { name: "Error Notifications", value: "https://global.pagerduty.com/eu", isShared: false, isDifferent: true },
          { name: "Success Notifications", value: "https://global.datadog.com/eu", isShared: false, isDifferent: true },
          { name: "Audit Logging", value: "https://compliance.global.com/eu-audit", isShared: false, isDifferent: true },
        ],
      },
      {
        id: "global-apac-prod",
        name: "Global Retail APAC",
        environment: "production",
        health: "healthy",
        errorCount: 7,
        isShared: false, // ⚙️ Heavy customization for APAC region
        connectors: [
          { name: "Source Type", value: "Salesforce", isShared: true },
          { name: "Destination Type", value: "PostgreSQL", isShared: true },
          { name: "Auth Method", value: "OAuth 2.0", isShared: true },
          { name: "API Version", value: "v57.0", isShared: false, isDifferent: true },
          { name: "Sync Frequency", value: "Every 10 minutes", isShared: false, isDifferent: true },
          { name: "Batch Size", value: "200 records", isShared: true },
          { name: "Data Center", value: "APAC-Southeast-1", isShared: false, isDifferent: true }, // ⚙️ Region-specific
        ],
        mappings: [
          { name: "Account → accounts", value: "Custom: +business_reg +region_code", isShared: false, isDifferent: true }, // ⚙️ APAC
          { name: "Contact → contacts", value: "Custom: +privacy_consent +language", isShared: false, isDifferent: true }, // ⚙️ Multi-region
          { name: "Opportunity → opportunities", value: "Custom: +multi_currency +exchange_rate", isShared: false, isDifferent: true }, // ⚙️ Multi-currency
          { name: "Lead → leads", value: "Standard mapping", isShared: true },
        ],
        webhooks: [
          { name: "Error Notifications", value: "https://global.pagerduty.com/apac", isShared: false, isDifferent: true },
          { name: "Success Notifications", value: "https://global.datadog.com/apac", isShared: false, isDifferent: true },
          { name: "Audit Logging", value: "https://compliance.global.com/apac-audit", isShared: false, isDifferent: true },
        ],
      },
    ],
  },
];

// Helper function to get project by ID
export function getProjectById(id: string): Project | undefined {
  return mockProjects.find(p => p.id === id);
}

// Helper function to get all deployments across all projects
export function getAllDeployments() {
  return mockProjects.flatMap(project => 
    project.deployments.map(deployment => ({
      ...deployment,
      projectId: project.id,
      projectName: project.name,
    }))
  );
}

// Helper function to get deployment by ID
export function getDeploymentById(id: string) {
  for (const project of mockProjects) {
    const deployment = project.deployments.find(d => d.id === id);
    if (deployment) {
      return {
        ...deployment,
        projectId: project.id,
        projectName: project.name,
      };
    }
  }
  return null;
}

