# 🤖 AI Code Assistant - Interactive Code Modification Tool

## Overview

The AI Code Assistant is a powerful tool that generates code changes as **unified diffs**, supports **multi-file editing**, and includes a complete **approval workflow** before applying changes to your codebase.

## ✨ Key Features

### 1. **Diff-Based Code Changes**
- Shows only what changed (additions/deletions)
- Line-by-line diff view with syntax highlighting
- Unified diff format (`+` for additions, `-` for deletions)
- Context lines for better understanding

### 2. **Multi-File Support**
- AI can modify multiple files in one request
- Each file has its own approval status
- Expandable/collapsible file views
- File-level statistics (additions/deletions)

### 3. **Approval Workflow**
- **Per-file approval**: Approve or reject individual files
- **Visual indicators**: Green (approved), Red (rejected), Gray (pending)
- **Bulk actions**: Apply only approved files
- **Safety first**: Must approve at least one file before applying

### 4. **Deployment Integration**
- **Apply Changes**: Applies approved files to codebase
- **Deploy to Branch**: Creates a feature branch with changes
- **Status tracking**: Ready → Approved → Deployed
- **Branch naming**: Auto-generates `feature/ai-{timestamp}`

## 🎯 How to Use

### Step 1: Generate Code Changes

**Option A: Use Sample Prompts**
```
Click any of the pre-built prompts:
- "Add retry logic with exponential backoff to the sync handler"
- "Implement field validation for custom Salesforce objects"
- "Add comprehensive error logging to the webhook endpoint"
```

**Option B: Custom Request**
```
Type your own request in natural language:
- "Add rate limiting to the API handler"
- "Implement caching for database queries"
- "Add TypeScript types to the config file"
```

### Step 2: Review Generated Diffs

The AI will show:
```
📁 src/handlers/syncHandler.ts
   Language: typescript
   +23 additions, -5 deletions
   
   [Expandable diff view showing line-by-line changes]
```

**Diff Format:**
- **Green lines (+)**: New code being added
- **Red lines (-)**: Existing code being removed
- **Gray lines ( )**: Context (unchanged)
- **Line numbers**: Show old and new positions

### Step 3: Approve/Reject Files

For each file:
- ✅ **Approve**: Click the green checkmark
- ❌ **Reject**: Click the red X
- 📊 **Review**: Expand to see full diff

**Status Indicators:**
- `Pending`: Awaiting your decision
- `Approved`: Ready to apply
- `Rejected`: Will be skipped

### Step 4: Apply Changes

Once you've approved files:

**Apply Changes Button**
```
✓ Apply Changes
  2 of 3 files approved
```

This will:
1. Apply approved files to your codebase
2. Skip rejected files
3. Show confirmation message
4. Change status to "Approved"

### Step 5: Deploy (Optional)

After applying:

**Deploy to Branch Button**
```
🚀 Deploy to Branch
   Changes applied and ready to deploy
```

This will:
1. Create a new feature branch
2. Commit the changes
3. Show branch name: `feature/ai-1699564800`
4. Provide next steps (review, test, PR)

## 📋 Example Workflows

### Workflow 1: Add Retry Logic

1. **Prompt**: "Add retry logic with exponential backoff to the sync handler"

2. **AI Generates**:
   - `src/handlers/syncHandler.ts` (+23, -5)
   - `src/types/sync.ts` (+5, -0)

3. **Review Diff**:
   ```typescript
   - async syncData(payload: SyncPayload) {
   + async syncData(payload: SyncPayload, retryCount = 0) {
   +   const maxRetries = 3;
   +   const baseDelay = 1000;
   ```

4. **Approve Both Files** ✅✅

5. **Apply Changes** → Success!

6. **Deploy to Branch** → `feature/ai-1699564800`

### Workflow 2: Selective Approval

1. **Prompt**: "Add validation and logging"

2. **AI Generates**:
   - `src/validators/fieldValidator.ts` (+42, -0) ← New file
   - `src/handlers/syncHandler.ts` (+15, -3)
   - `src/config/settings.ts` (+3, -1)

3. **Review**:
   - Validator: ✅ Approve (looks good)
   - Handler: ✅ Approve (needed)
   - Config: ❌ Reject (don't want to change timeout)

4. **Apply**: Only validator and handler are applied

## 🎨 UI Components

### Change Card
```
┌─────────────────────────────────────────────────────┐
│ 📄 Add retry logic with exponential backoff         │
│ 🕐 2:30 PM · 2 files · +28 -5                      │
│                                              [Ready] │
├─────────────────────────────────────────────────────┤
│ ▼ 📁 src/handlers/syncHandler.ts [typescript]      │
│      +23 -5                            [✓] [✗]      │
│   ┌───────────────────────────────────────────┐    │
│   │ @@ -45,8 +45,26 @@                        │    │
│   │  45 | export class SyncHandler {           │    │
│   │  46 |   private apiClient: APIClient;      │    │
│   │  48 |- async syncData(payload: SyncPayload)│    │
│   │  48 |+ async syncData(payload, retryCount) │    │
│   │  49 |+   const maxRetries = 3;             │    │
│   │     ...                                     │    │
│   └───────────────────────────────────────────┘    │
│                                                      │
│ ▶ 📁 src/types/sync.ts [typescript]                │
│      +5 -0                             [✓] [✗]      │
├─────────────────────────────────────────────────────┤
│ [✓ Apply Changes]  2 of 2 files approved           │
└─────────────────────────────────────────────────────┘
```

### Status Flow
```
1. [Ready]     → Files generated, awaiting approval
2. [Approved]  → Changes applied to codebase
3. [Deployed]  → Committed to feature branch
```

## 🔧 Technical Details

### Diff Format

**Hunk Header:**
```
@@ -45,8 +45,26 @@
   │  │   │   └─ New: 26 lines
   │  │   └───── New: starts at line 45
   │  └───────── Old: 8 lines
   └──────────── Old: starts at line 45
```

**Line Types:**
- `+` Addition (green background)
- `-` Deletion (red background)
- ` ` Context (no background)

### File Status States

```typescript
type FileStatus = 'pending' | 'approved' | 'rejected';
```

### Change Status States

```typescript
type ChangeStatus = 'generating' | 'ready' | 'approved' | 'deployed';
```

## 🎯 Best Practices

### 1. **Review Before Approving**
- Always expand and read the diff
- Check for unintended changes
- Verify line numbers make sense

### 2. **Selective Approval**
- You don't have to approve all files
- Reject files you want to modify manually
- Apply changes incrementally

### 3. **Test After Applying**
- Run your test suite
- Check for TypeScript errors
- Verify functionality

### 4. **Use Descriptive Prompts**
- ✅ "Add retry logic with exponential backoff to the sync handler"
- ❌ "Fix the code"
- ✅ "Implement field validation for email and phone number fields"
- ❌ "Add validation"

### 5. **Deploy Workflow**
1. Generate changes
2. Review diffs carefully
3. Approve files
4. Apply changes
5. Test locally
6. Deploy to branch
7. Create PR for team review

## 🚀 Advanced Features

### Model Selection
Choose from multiple AI models:
- **Claude Sonnet 4.5** - Latest Anthropic
- **GPT-5** - Next-gen OpenAI
- **GPT-4 Turbo** - Fast and accurate (default)
- **Gemini 2.5 Flash** - Google's latest

### Change History
- All changes are preserved in the session
- Review previous modifications
- See timestamps and prompts
- Track deployment status

### Multi-File Intelligence
The AI understands:
- File dependencies
- Type definitions
- Import statements
- Configuration relationships

## 📊 Statistics

Each change shows:
- **Total files modified**
- **Lines added** (green +)
- **Lines deleted** (red -)
- **Approval progress** (X of Y files)

## 🎓 Example Prompts

### Error Handling
```
"Add try-catch blocks with detailed error logging to all API calls"
"Implement custom error classes for different failure types"
"Add error recovery logic for network timeouts"
```

### Performance
```
"Add caching layer with Redis for frequently accessed data"
"Implement database query optimization with indexes"
"Add request debouncing to the search handler"
```

### Type Safety
```
"Add TypeScript interfaces for all API responses"
"Convert JavaScript files to TypeScript with proper types"
"Add Zod schema validation for user inputs"
```

### Testing
```
"Generate unit tests for the authentication service"
"Add integration tests for the webhook handler"
"Create mock data factories for testing"
```

## 🔒 Safety Features

1. **No Auto-Apply**: Changes require explicit approval
2. **File-Level Control**: Approve/reject individually
3. **Diff Preview**: See exactly what changes before applying
4. **Reversible**: Changes go to a branch, not main
5. **Audit Trail**: Track all modifications with timestamps

## 🎉 Benefits

- ✅ **Faster Development**: Generate boilerplate instantly
- ✅ **Consistent Patterns**: AI follows best practices
- ✅ **Learning Tool**: See how to implement features
- ✅ **Safe Exploration**: Review before committing
- ✅ **Multi-File Edits**: Coordinate changes across files
- ✅ **Professional Workflow**: Approval → Apply → Deploy

---

**Ready to start?** Open any deployment, go to the **Code** tab, and try the Code Assistant! 🚀

