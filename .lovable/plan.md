

# AI Architect Workspace — Full Rebuild Plan

## Overview
Replace the current 5-step wizard (`AgentBuilderWizard.tsx`) and related components with a futuristic 3-panel workspace that looks like an AI operating system. Dark glassmorphism theme with neon purple/blue accents.

## Architecture

```text
┌─────────────────────────────────────────────────────────────────────┐
│  Top Bar: Agent Name (editable) | Status dot | [Deploy to Market]  │
├──────────┬──────────────────────────────┬───────────────────────────┤
│          │                              │                           │
│  LEFT    │   CENTER PANEL               │   RIGHT PANEL             │
│  PANEL   │   "The Canvas"               │   "AI Assistant"          │
│          │                              │                           │
│  Explorer│   Config area for selected   │   Persistent chat with    │
│  Tree    │   tree node. Renders:        │   ASER AI. Context-aware  │
│          │   - Agent info form          │   responses about agent   │
│          │   - Tool Power Cards grid    │   config, tool help.      │
│  Nodes:  │   - Model settings           │                           │
│  · Info  │   - Output config            │  ─────────────────────── │
│  · Tools │                              │   Mini Sandbox / Terminal │
│  · Model │   Framer Motion transitions  │   Test prompt + output    │
│  · Output│   between sections           │                           │
│          │                              │                           │
├──────────┴──────────────────────────────┴───────────────────────────┤
│  (no footer — everything inline)                                    │
└─────────────────────────────────────────────────────────────────────┘
```

## Theme & Styling

- Background: `#0f172a` (slate-900) applied to the workspace container
- Panels: `bg-white/5 backdrop-blur-xl border border-white/10`
- Accent primary: `#a855f7` (purple-500) for selections, glows
- Accent secondary: `#3b82f6` (blue-500) for interactive elements
- Text: `text-slate-100` primary, `text-slate-400` muted
- All styling scoped to the workspace component via inline/utility classes — no changes to global `index.css` or `tailwind.config.ts`

## Files to Create/Edit

### 1. `src/components/workspace/AgentWorkspace.tsx` (NEW — main container)
- Full-screen dark container with 3-panel flex layout
- Top bar with editable agent name input, status indicator, "Deploy Agent" button
- Manages all shared state: `agentName`, `agentDescription`, `selectedTools`, `activeNode` (which tree item is selected), `modelSettings`
- Passes state down to child panels

### 2. `src/components/workspace/ExplorerPanel.tsx` (NEW — left panel)
- ~220px wide vertical panel
- Tree-view with collapsible nodes using Lucide icons:
  - **Agent Info** (FileText) — always first
  - **Knowledge Base** (Database)
  - **Tools** (Wrench) — shows count badge of selected tools
  - **Model Settings** (Settings)
  - **Output** (Monitor)
- Active node highlighted with purple left border + glow
- Clicking a node sets `activeNode` which changes center panel content

### 3. `src/components/workspace/CanvasPanel.tsx` (NEW — center panel)
- Renders content based on `activeNode`:
  - **info**: Agent name + description inputs (dark styled)
  - **knowledge**: Placeholder for future knowledge base upload
  - **tools**: Power Cards grid (see below)
  - **model**: Model selector (MiniMax default), temperature slider, max tokens
  - **output**: Output channel config (Telegram, Email, Dashboard toggles)
- Smooth `AnimatePresence` transitions between sections
- Editor-style top tab bar showing active section name

### 4. `src/components/workspace/ToolPowerCards.tsx` (NEW — tool selection sub-component)
- 7 tools rendered as "Power Cards" in a responsive grid
- Each card: icon, name, description, brand color accent
- Selected state: glowing border in brand color + scale animation
- Brand colors: Serper `#3b82f6`, Firecrawl `#f97316`, E2B `#10b981`, X `#000`, File `#8b5cf6`, Dashboard `#06b6d4`, MiniMax `#a855f7`
- "Register" external link button appears on selected cards

### 5. `src/components/workspace/AssistantPanel.tsx` (NEW — right panel)
- ~320px wide, split vertically:
  - **Top ~65%**: Chat interface (reuse logic from `WizardAIChat.tsx`)
    - Context-aware responses about current agent config
    - Dark-themed message bubbles
  - **Bottom ~35%**: Mini Sandbox terminal
    - Input field + "Run" button
    - Monospace output area showing simulated test results
- Chat and sandbox share agent context

### 6. Edit `src/components/DashboardContent.tsx`
- Replace `AgentBuilderWizard` import with `AgentWorkspace`
- Render `<AgentWorkspace />` when `activeSection === "create"`

## Interaction Model
- No Next/Back buttons — user clicks tree nodes to navigate
- All fields auto-update shared state (no explicit save step)
- Single "Deploy Agent to Marketplace" button in top bar triggers creation flow
- Deploy button disabled until agent has name + at least 1 tool selected

## Animations (Framer Motion)
- Panel mount: staggered fade-in from left to right
- Tree node selection: `layoutId` for active indicator
- Canvas content: `AnimatePresence` with x-slide transitions
- Tool cards: `whileHover={{ scale: 1.03 }}`, glow pulse on selection
- Deploy button: hover glow intensifies

## Files Removed (cleanup)
- `src/components/AgentBuilderWizard.tsx` — replaced entirely
- `src/components/wizard/WizardAIChat.tsx` — logic absorbed into AssistantPanel

