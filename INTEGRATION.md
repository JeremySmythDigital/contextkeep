# Token Compaction Integration Plan

## Integration Points

### 1. OpenClaw Context Management
**File:** `~/.openclaw/agents/glyph/agent/context-manager.ts`

The Token Compaction System should hook into OpenClaw's context management to:
- Monitor token usage automatically
- Trigger compaction at thresholds
- Preserve high-valance content (decisions, tasks, blockers)

### 2. ContextKeep Integration
**File:** `~/workspace/products/ai-context-manager/src/lib/compaction.ts`

Add token compaction to ContextKeep for:
- Session history compression
- Long-term memory storage
- Export optimization

### 3. WAL Protocol Integration
**File:** `~/.openclaw/agents/glyph/agent/wal.ts`

The WAL (Write-Ahead Log) protocol should use compaction to:
- Compress old WAL entries
- Preserve critical state transitions
- Maintain audit trail

## Implementation Steps

### Step 1: Create OpenClaw Integration Module
```typescript
// ~/.openclaw/agents/glyph/agent/compaction/index.ts
import { createMonitor, createCompactor, createEpisodicMemory } from 'token-compaction';

export async function compactContext(context: any, maxTokens: number) {
  const monitor = createMonitor('large');
  const result = monitor.check(context.tokens);
  
  if (result.should_compact) {
    const compactor = createCompactor();
    return compactor.compact(context.items, result.recommended_tier);
  }
  
  return context;
}
```

### Step 2: Create ContextKeep Integration
```typescript
// ~/workspace/products/ai-context-manager/src/lib/compaction.ts
import { createMonitor, createCompactor } from 'token-compaction';

export async function compressContext(context: ContextItem[]) {
  const monitor = createMonitor(200000); // 200K context
  const result = monitor.check(estimateTokens(context));
  
  if (result.should_compact) {
    const compactor = createCompactor();
    return compactor.compact(context, result.recommended_tier);
  }
  
  return { preserved: context, compacted: null };
}
```

### Step 3: Hook into Session Management
Add compaction trigger before context overflow:
- Check token usage before each message
- Trigger compaction at 70%, 80%, 90%
- Store compacted context in Mem0

## Files to Create/Modify

1. `~/.openclaw/agents/glyph/agent/compaction/index.ts` - OpenClaw integration
2. `~/workspace/products/ai-context-manager/src/lib/compaction.ts` - ContextKeep integration
3. `~/workspace/products/ai-context-manager/src/app/api/compact/route.ts` - API endpoint
4. `~/workspace/products/ai-context-manager/src/components/CompactionPanel.tsx` - UI component

## Verification
- Run `npm run build` in both projects
- Test compaction triggers at thresholds
- Verify preserved content is correct
- Check token savings