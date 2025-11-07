# 🚀 Foundry FDE - Quick Start Guide

## Installation & Running

```bash
npm install
npm start
```

**That's it!** Open [http://localhost:3000](http://localhost:3000) 

✨ **Auto-reload is enabled** - changes update instantly!

---

## 🎯 5-Minute Demo Script

### Step 1: Dashboard (30 seconds)
- You'll see 4 deployments
- **Acme Corp** is "noisy" with 48 errors
- Check "Common Pain Points" panel

### Step 2: Open Acme (1 minute)
- Click **Acme Corp** card
- See error metrics: 48 errors, 89.1% success rate
- Scroll through "Recent Failures"

### Step 3: Ask the AI (1 minute)
- In **Runbook Copilot** (right panel), type:
  ```
  Fix the mapping errors
  ```
- Watch it generate:
  - ✅ Problem analysis
  - ✅ Step-by-step fix plan
  - ✅ TypeScript code snippets
  - ✅ Bash commands

### Step 4: Execute Actions (1 minute)
- Click **"Run"** buttons on the action steps
- Watch toast notifications appear
- Jobs get queued automatically

### Step 5: Demo Mode (30 seconds)
- Toggle **"Demo Mode"** in top bar
- Jobs auto-progress: Queued → Running → Succeeded
- Perfect for live demos!

### Step 6: Explore More (1 minute)
- **Mappings tab**: See field mappings, click "Generate PR"
- **Jobs tab**: View all jobs, run backfills
- **⌘K**: Open command palette for quick actions
- **Playbooks** (sidebar): Browse pre-built solutions

---

## 🎨 Key Features

| Feature | Description |
|---------|-------------|
| 🌙 Dark Theme | Modern, sleek interface |
| 📊 Live Charts | Real-time error trends |
| 🤖 AI Copilot | Deterministic runbook generation |
| ⚡ Hot Reload | Instant updates on code changes |
| 🎭 Demo Mode | Auto-progress jobs for presentations |
| ⌨️ ⌘K Palette | Quick access to all actions |

---

## 🔧 Keyboard Shortcuts

- `⌘K` or `Ctrl+K` - Open command palette
- `⌘R` or `Ctrl+R` - Refresh page

---

## 📱 What to Click

1. **Acme Corp card** → Opens deployment details
2. **Runbook Copilot input** → Type "fix mapping errors"
3. **"Run" buttons** → Execute actions
4. **"Demo Mode" toggle** → Auto-progress jobs
5. **"Generate PR" button** → Preview code changes
6. **Tabs** → Switch between Overview/Mappings/Jobs

---

## 🎬 Perfect for Demos

This app is **demo-first**:
- ✅ No real database (JSON fixtures)
- ✅ No real LLM calls (deterministic)
- ✅ No real GitHub (mocked PRs)
- ✅ Pre-seeded with realistic data
- ✅ Jobs auto-progress in Demo Mode

**Everything works offline!**

---

## 🐛 Troubleshooting

**Jobs stuck?**  
→ Enable Demo Mode (top bar)

**Port 3000 in use?**  
→ `PORT=3001 npm start`

**No data showing?**  
→ Check `/fixtures/*.json` files exist

---

## 📚 Learn More

See [README.md](./README.md) for:
- Full feature documentation
- Architecture details
- Customization guide
- API routes reference

---

**Enjoy the demo!** 🎉

