import { Architecture, Artifacts } from './store'

export interface CopilotResponse {
  summary: string
  architecture: Architecture
  artifacts: Artifacts
  risks: string[]
}

// Mock AI Copilot - in production, this would call an actual LLM API
export async function analyzeRequirements(requirements: string): Promise<CopilotResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simple keyword-based detection for demo
  const lowerReq = requirements.toLowerCase()
  
  let components: Architecture['components'] = []
  let risks: string[] = []
  let terraform = ''
  let helm = ''

  // Detect common patterns
  if (lowerReq.includes('snowflake') || lowerReq.includes('data warehouse')) {
    components.push({
      id: 'snowflake-1',
      type: 'database',
      name: 'Snowflake Data Warehouse',
      provider: 'Snowflake',
      status: 'pending',
      config: { warehouse: 'COMPUTE_WH', database: 'PROD_DB' },
    })
    terraform += generateSnowflakeTerraform()
  }

  if (lowerReq.includes('s3') || lowerReq.includes('object storage') || lowerReq.includes('storage')) {
    components.push({
      id: 's3-1',
      type: 'storage',
      name: 'S3 Bucket',
      provider: 'AWS',
      status: 'pending',
      config: { bucket: 'client-data-bucket', region: 'us-east-1' },
    })
    terraform += generateS3Terraform()
  }

  if (lowerReq.includes('dbt') || lowerReq.includes('transformation') || lowerReq.includes('etl')) {
    components.push({
      id: 'dbt-1',
      type: 'transformation',
      name: 'dbt Core',
      provider: 'dbt Labs',
      status: 'pending',
      config: { project: 'client_dbt_project', profiles: 'snowflake' },
    })
  }

  if (lowerReq.includes('airflow') || lowerReq.includes('orchestration') || lowerReq.includes('scheduler')) {
    components.push({
      id: 'airflow-1',
      type: 'orchestration',
      name: 'Apache Airflow',
      provider: 'Apache',
      status: 'pending',
      config: { version: '2.8.0', executor: 'KubernetesExecutor' },
    })
    helm += generateAirflowHelm()
  }

  if (lowerReq.includes('kubernetes') || lowerReq.includes('k8s') || lowerReq.includes('container')) {
    components.push({
      id: 'k8s-1',
      type: 'compute',
      name: 'Kubernetes Cluster',
      provider: 'AWS EKS',
      status: 'pending',
      config: { version: '1.28', nodeCount: 3 },
    })
    terraform += generateEKSTerraform()
  }

  // Default components if nothing detected
  if (components.length === 0) {
    components = [
      {
        id: 'default-1',
        type: 'compute',
        name: 'Application Server',
        provider: 'AWS EC2',
        status: 'pending',
        config: { instanceType: 't3.medium' },
      },
    ]
    terraform = generateDefaultTerraform()
  }

  // Generate risks based on requirements
  if (lowerReq.includes('production') || lowerReq.includes('prod')) {
    risks.push('Production deployment requires careful testing and rollback plan')
  }
  if (lowerReq.includes('pii') || lowerReq.includes('sensitive')) {
    risks.push('Sensitive data handling requires encryption and compliance review')
  }
  if (components.length > 3) {
    risks.push('Complex architecture may require additional monitoring and maintenance')
  }

  const summary = `Based on your requirements, I've identified ${components.length} core components needed for this deployment. The architecture includes ${components.map((c) => c.name).join(', ')}.`

  return {
    summary,
    architecture: {
      components,
      risks: risks.length > 0 ? risks : ['No major risks identified'],
      estimatedTime: `${Math.ceil(components.length * 0.5)} hours`,
    },
    artifacts: {
      terraform: terraform || generateDefaultTerraform(),
      helm: helm || undefined,
      config: generateConfigYAML(components),
    },
  }
}

function generateSnowflakeTerraform(): string {
  return `
# Snowflake Data Warehouse
resource "snowflake_warehouse" "compute_wh" {
  name           = "COMPUTE_WH"
  warehouse_size = "SMALL"
  auto_suspend   = 60
  auto_resume    = true
}

resource "snowflake_database" "prod_db" {
  name    = "PROD_DB"
  comment = "Production database for client"
}

resource "snowflake_schema" "main" {
  database = snowflake_database.prod_db.name
  name     = "MAIN"
}
`
}

function generateS3Terraform(): string {
  return `
# S3 Bucket for Data Storage
resource "aws_s3_bucket" "client_data" {
  bucket = "client-data-bucket-${Date.now()}"
  
  tags = {
    Environment = "production"
    ManagedBy   = "FDE-OS"
  }
}

resource "aws_s3_bucket_versioning" "client_data" {
  bucket = aws_s3_bucket.client_data.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "client_data" {
  bucket = aws_s3_bucket.client_data.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
`
}

function generateAirflowHelm(): string {
  return `
# Apache Airflow Helm Chart
apiVersion: v1
kind: Namespace
metadata:
  name: airflow

---
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: airflow
  namespace: airflow
spec:
  chart: apache-airflow
  repo: https://airflow.apache.org
  version: 2.8.0
  values:
    executor: KubernetesExecutor
    workers:
      replicas: 2
    webserver:
      replicas: 1
`
}

function generateEKSTerraform(): string {
  return `
# EKS Cluster
resource "aws_eks_cluster" "main" {
  name     = "client-eks-cluster"
  role_arn = aws_iam_role.eks_cluster.arn
  version  = "1.28"

  vpc_config {
    subnet_ids = var.subnet_ids
  }
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "main"
  node_role_arn   = aws_iam_role.eks_node.arn
  subnet_ids      = var.subnet_ids
  instance_types  = ["t3.medium"]

  scaling_config {
    desired_size = 3
    max_size     = 5
    min_size     = 2
  }
}
`
}

function generateDefaultTerraform(): string {
  return `
# Default Infrastructure
resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"

  tags = {
    Name = "Client Application Server"
    ManagedBy = "FDE-OS"
  }
}
`
}

function generateConfigYAML(components: Architecture['components']): string {
  return `
# Deployment Configuration
deployment:
  name: client-deployment
  environment: production
  components:
${components.map((c) => `    - name: ${c.name}\n      type: ${c.type}\n      provider: ${c.provider}`).join('\n')}

monitoring:
  enabled: true
  alerts:
    - cpu_threshold: 80
    - memory_threshold: 85

backup:
  enabled: true
  schedule: "0 2 * * *"
`
}

