# FDE Field Data Engine

## Features

**Core Functionality**
- Dashboard with deployment health monitoring and error trends
- Deployment detail pages with analytics, mappings, webhooks, jobs, and activity logs
- Runbook Copilot for generating fix suggestions
- Field mapping editor with drift detection and PR generation
- Jobs management for backfills, event replays, and PR creation
- Playbooks library with pre-built solutions
- Command palette (⌘K) for quick actions
- Demo mode for auto-progressing jobs

**AI/LLM Integration**
- OpenAI integration with API key configuration
- Dual mode: Stub Mode (deterministic) and LLM Mode (AI-powered)
- Natural language queries about deployments
- Automatic runbook generation from error analysis
- Graceful fallback to stub mode on LLM failures

**Integrations**
- Slack: Send notifications and alerts to channels
- GitHub: Automatic PR creation with personal access token
- Integration status indicators

## Getting Started

```bash
npm install
npm start
```

Open http://localhost:3000 in your browser.

**Other Commands**
```bash
npm run dev      # Development mode
npm run build    # Production build
npm run start:prod  # Run production build
```

## Usage

**Dashboard**
- View all deployments and their health status
- Filter by health status or environment
- Monitor live metrics (throughput, errors, latency)

**Deployment Details**
- Overview: KPIs, recent failures, runbook copilot
- Analytics: Error distribution and timelines
- Mappings: Field mapping editor with PR generation
- Webhooks: Test webhooks with sample payloads
- Jobs: View and manage backfill/replay jobs
- Activity: Complete audit log

**Playbooks**
- Browse pre-built solutions for common issues
- View triggers, steps, and code samples
- Apply playbooks to deployments

**Settings**
- Configure LLM API keys
- Set up Slack and GitHub integrations
- Test connections and view integration status

## Architecture

**Data Layer**
All data is mocked using JSON fixtures in `/fixtures`:
- `deployments.json` - Sample deployments
- `acme.deployment.json` - Detailed Acme configuration
- `acme.logs.json` - Error logs
- `acme.schema.json` - Field schemas
- `playbooks.json` - Playbook definitions

**API Routes**
- `GET /api/deployments` - List deployments
- `GET /api/deployments/[id]` - Get deployment details
- `POST /api/runbook/suggest` - Generate runbook plan
- `POST /api/actions/create-pr` - Create PR job
- `POST /api/actions/run-backfill` - Start backfill
- `POST /api/actions/replay-events` - Replay events
- `GET /api/jobs` - List jobs
- `POST /api/jobs/tick` - Advance job states (demo mode)

**LLM Stub**
The `lib/LLMStub.ts` provides deterministic runbook generation without real LLM calls. It analyzes mappings and error logs to generate step-by-step plans with code samples.

**Job Store**
In-memory job tracking in `lib/JobStore.ts`. Jobs reset on server restart. Supports demo mode auto-progression.

## Customization

**Adding Deployments**
Edit `fixtures/deployments.json` and create corresponding fixture files for detailed configuration.

**Adding Playbooks**
Edit `public/fixtures/playbooks.json` with new playbook definitions including triggers, steps, and code samples.
