# FDE OS Platform - Forward-Deployed Engineering Platform

An AI-powered Operating System for Forward-Deployed Engineering, designed to streamline customer deployment workflows.

## Overview

This platform helps Forward-Deployed Engineers (FDEs) design, deploy, and track per-customer environments with AI assistance. It transforms fragmented deployment workflows into a unified, automated system.

## Features

- **AI Deployment Copilot**: Analyzes client requirements and generates deployment plans
- **Environment Graph**: Visual representation of customer infrastructure components
- **Code Generation**: Automatically generates Terraform, Helm, and configuration files
- **Simulated Provisioning**: Demonstrates infrastructure provisioning with streaming logs
- **Playbook Library**: Save and reuse successful deployment configurations
- **Playbook Comparison**: Compare current deployments with saved playbooks

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Visualization**: React Flow
- **Code Editor**: Monaco Editor
- **Build Tool**: Next.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Demo Flow

1. **Upload Requirements**: Paste client requirements in the AI Copilot chat (left panel)
   - Example: "We need a Snowflake data warehouse connected to S3, with dbt for transformations and Airflow for orchestration."

2. **Generate Plan**: Click "Analyze & Generate Plan" to let the AI Copilot analyze requirements and propose an architecture

3. **View Architecture**: The Environment Graph tab shows a visual representation of all components

4. **Review Artifacts**: Switch to the "Generated Artifacts" tab to see Terraform, Helm, and config files

5. **Simulate Provisioning**: Click "Simulate Provisioning" in the Environment Graph to see fake provisioning logs and component status updates

6. **Save as Playbook**: Use the Playbook Library to save successful deployments for reuse

7. **Compare Playbooks**: Select a playbook and use the "Playbook Comparison" tab to see differences

## Project Structure

```
fde_platform/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx             # Main dashboard page
│   └── globals.css          # Global styles
├── components/
│   ├── CopilotChat.tsx      # AI Copilot interface
│   ├── EnvironmentGraph.tsx # Infrastructure visualization
│   ├── CodePane.tsx         # Code artifact viewer
│   ├── DiffViewer.tsx       # Playbook comparison
│   └── PlaybookLibrary.tsx  # Playbook management
├── lib/
│   ├── store.ts             # Zustand state management
│   └── copilot.ts           # AI Copilot logic (mocked)
├── data/                    # Sample data files
│   ├── clients/
│   ├── templates/
│   └── playbooks/
└── public/
    └── data/                # Public data files
```

## Key Components

### AI Copilot
The copilot analyzes text requirements and detects common infrastructure patterns:
- Snowflake data warehouses
- S3 storage buckets
- dbt transformations
- Airflow orchestration
- Kubernetes clusters

### Environment Graph
Interactive visualization using React Flow showing:
- Component relationships
- Status indicators (pending, provisioning, active, error)
- Real-time updates during provisioning

### Code Generation
Generates infrastructure-as-code artifacts:
- Terraform configurations
- Helm charts
- YAML configuration files

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Notes

This is a **Proof of Concept** implementation. The AI Copilot uses deterministic, keyword-based analysis rather than a real LLM. Infrastructure provisioning is simulated with fake logs and status updates.

## Future Enhancements

- Integration with real LLM APIs (OpenAI, Anthropic, etc.)
- Real infrastructure provisioning via Terraform Cloud/Spacelift
- Backend API for persistent storage
- Multi-user collaboration
- Advanced playbook templating and variable substitution
- Integration with actual cloud providers

## License

MIT

