# Foundry FDE - Field Data Engine Demo

A slick, front-end-first demo showcasing a field data engine with deployment monitoring, mapping management, and intelligent runbook generation.

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **Lucide Icons** for icons
- **Recharts** for data visualization
- **Sonner** for toast notifications

## Features

### Core Features
- 📊 **Dashboard**: Monitor multiple deployments with health status, error trends, and pain points
- 🔍 **Deployment Details**: Deep dive into individual deployments with 6 comprehensive tabs
- 🤖 **Runbook Copilot**: AI-powered assistant that suggests fixes for common issues
- 🔄 **Field Mappings**: Visual mapping editor with drift detection and PR generation
- ⚡ **Jobs Management**: Track backfills, event replays, and PR creation
- 📚 **Playbooks**: Pre-built solutions for common integration patterns
- ⌨️ **Command Palette**: Quick actions with ⌘K shortcut
- 🎭 **Demo Mode**: Auto-progress jobs for realistic demonstrations

### New Enhanced Features
- 📈 **Live Metrics Dashboard**: Real-time charts showing throughput, error rates, latency, and connections
- 📊 **Error Analytics**: Advanced error grouping, distribution charts, and 24-hour timelines
- 🔌 **Webhook Tester**: Interactive webhook testing with sample payloads and response inspection
- 📋 **Activity Timeline**: Complete audit log of all actions, changes, and events
- 🔔 **Notification Center**: Toast history with unread badges and notification management
- 🔍 **Search & Filter**: Powerful search and filtering across deployments by health and environment
- ⚖️ **Deployment Comparison**: Side-by-side comparison of deployment metrics and health

### 🤖 AI/LLM Integration
- 🧠 **Real OpenAI Integration**: Connect your own API key for true AI-powered responses
- 🎯 **Dual Mode Operation**: Seamlessly switch between Stub Mode (deterministic) and LLM Mode (AI)
- 💬 **Ask AI**: Natural language queries about your deployments on the dashboard
- 🔧 **Smart Runbook Generation**: AI analyzes errors and suggests fixes with code
- ⚙️ **LLM Settings Panel**: Easy configuration with API key testing
- 🛡️ **Graceful Fallback**: Automatically falls back to stub mode if LLM fails
- 🎨 **Mode Indicators**: Clear badges showing which mode is active

### 🔌 Integrations (NEW!)
- 💬 **Slack Integration**: Send notifications and alerts to Slack channels
  - Error alerts when thresholds exceeded
  - Deployment update notifications
  - PR creation notifications
  - Interactive notification preview
  - Test notification functionality
- 🐙 **GitHub Integration**: Automatic PR creation and codebase sync
  - Connect with personal access token
  - Auto-create PRs from AI suggestions
  - View recent PRs in-app
  - PR templates and base branch config
  - Connection testing
- 📊 **Integration Status**: Quick status indicator in top bar showing connected services

## Getting Started

### Quick Start (Auto-Reload Enabled)

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will automatically reload when you make changes! ✨

### Alternative Commands

```bash
# Development mode (same as npm start)
npm run dev

# Production build
npm run build
npm run start:prod
```

## Demo Flow

Follow this sequence for the best demo experience:

### Part 1: Dashboard & Live Metrics
1. **Dashboard** → View all 4 deployments (Acme, Beta, Gamma, Delta)
   - Notice Acme has "noisy" health status with 48 errors
   - Use **Search & Filter** to filter by health status or environment
   - Watch **Live Metrics** update in real-time (throughput, errors, latency)
   - Check the "Common Pain Points" panel

### Part 2: Deployment Deep Dive
2. **Click on Acme Corp** → Opens deployment detail page with 6 tabs
   
   **Overview Tab:**
   - See KPI cards showing 48 errors, 89.1% success rate
   - Review "Recent Failures" table showing MAPPING_ERROR codes
   - Use **Runbook Copilot** (right panel) - Type: "Fix the mapping errors"
   - Watch it generate a plan with code snippets and actionable steps
   - Click "Run" buttons to execute actions

   **Analytics Tab:**
   - View error distribution pie chart
   - See 24-hour error timeline
   - Review error breakdown by type with percentages

   **Mappings Tab:**
   - See field mappings with status indicators (Active/Missing/Drift)
   - Click "Generate PR" → Opens drawer with diff preview
   - Click "Create PR" → Generates PR with toast notification

   **Webhook Tab:**
   - Test webhooks with sample payloads (Customer, Subscription, Event)
   - Send test webhooks and view responses
   - Inspect headers and response body

   **Jobs Tab:**
   - View queued/running/completed jobs
   - Click "Run Backfill" or "Replay Events" buttons
   - Watch jobs progress (especially with Demo Mode on)

   **Activity Tab:**
   - Review complete audit log of all actions
   - See PRs created, jobs completed, config changes
   - View timestamps and user information

### Part 3: Advanced Features
3. **Notification Center** (bell icon in top bar)
   - View notification history
   - See unread count badge
   - Mark notifications as read
   - Clear notification history

4. **Compare Deployments** (sidebar → Compare)
   - Select two deployments to compare
   - View side-by-side metrics comparison
   - See which deployment performs better
   - Review summary insights

5. **Enable Demo Mode** (top bar toggle)
   - Jobs automatically progress: Queued → Running → Succeeded
   - Toast notifications appear as jobs complete
   - Perfect for live presentations!

6. **Try Command Palette** (⌘K or Ctrl+K)
   - Quick access to common actions
   - Open deployments, generate PRs, run jobs

7. **Configure Integrations** (Settings → Slack/GitHub)
   - Set up Slack webhook for notifications
   - Connect GitHub for automatic PR creation
   - Test connections and preview notifications
   - View recent PRs and integration status

8. **Visit Playbooks** (sidebar)
   - Browse 3 pre-built solutions
   - See triggers, steps, and code samples
   - Click "Apply to Acme" to simulate playbook execution

## Architecture

### Data Layer

All data is mocked using JSON fixtures in `/fixtures`:

- `deployments.json` - 4 sample deployments
- `acme.deployment.json` - Detailed Acme configuration
- `acme.logs.json` - Error logs for Acme
- `acme.schema.json` - Source/destination field schemas
- `playbooks.json` - 3 canned playbooks

### API Routes

- `GET /api/deployments` - List all deployments
- `GET /api/deployments/[id]` - Get deployment details
- `POST /api/runbook/suggest` - Generate runbook plan (uses LLMStub)
- `POST /api/actions/create-pr` - Create PR job
- `POST /api/actions/run-backfill` - Start backfill job
- `POST /api/actions/replay-events` - Replay failed events
- `GET /api/jobs` - List jobs (optionally filtered by deployment)
- `POST /api/jobs/tick` - Advance job states (for demo mode)

### LLM Stub

The `lib/LLMStub.ts` provides deterministic runbook generation:

- Analyzes missing/drifted field mappings
- Groups error codes from logs
- Generates step-by-step plans
- Produces TypeScript and bash code samples
- No real LLM calls - fully deterministic for demos

### Job Store

In-memory job tracking (`lib/JobStore.ts`):

- Stores jobs with status progression
- Pre-seeded with 2 completed jobs for Acme
- Supports tick() for demo mode auto-progression
- No real database - resets on server restart

## Key Components

- **AppLayout** - Sidebar + top bar wrapper
- **CommandPalette** - ⌘K quick actions
- **DeploymentCard** - Dashboard deployment cards with mini charts
- **KPICard** - Metric display cards
- **FailuresTable** - Recent error logs
- **MappingsTable** - Field mapping editor with PR generation
- **PRPreviewDrawer** - Split diff view for PR preview
- **JobsList** - Job queue with actions
- **RunbookChat** - Interactive AI assistant interface

## Customization

### Adding New Deployments

Edit `fixtures/deployments.json` and create corresponding fixture files:

```json
{
  "id": "new-deployment",
  "name": "New Deployment",
  "health": "healthy",
  "errorCounts": [1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 0],
  "tags": ["production"],
  "env": "production"
}
```

### Adding Playbooks

Edit `fixtures/playbooks.json`:

```json
{
  "id": "custom-playbook",
  "title": "Custom Solution",
  "description": "Solve a specific problem",
  "triggers": ["When X happens"],
  "steps": ["Step 1", "Step 2"],
  "codeSamples": [],
  "estimatedTime": "10 min",
  "impact": "Medium"
}
```

## Non-Goals (Intentionally Skipped)

- ❌ Real OAuth or authentication
- ❌ Real GitHub PR creation
- ❌ Real database or persistence
- ❌ Real LLM API calls
- ❌ Multi-tenant support
- ❌ Real webhook integrations

This is a **demo-first** implementation optimized for presentations and prototyping.

## Troubleshooting

### Jobs not progressing?

Enable Demo Mode (toggle in top bar) to auto-progress jobs every 1.5 seconds.

### No data showing?

Check that fixture files exist in `/fixtures` directory and are valid JSON.

### Command palette not opening?

Try ⌘K (Mac) or Ctrl+K (Windows/Linux). Make sure no other app is capturing the shortcut.

## License

MIT - Feel free to use this as a starting point for your own projects!
