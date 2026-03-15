# Token Compaction System

Automatic token optimization that preserves high-value content while compacting low-value content based on context thresholds.

## Features

- **Context Monitoring**: Detects when context usage reaches thresholds (70%, 80%, 90%)
- **Valance Scoring**: Hybrid scoring system (rule-based + ML-based) to rank content importance
- **3-Tier Compaction**: Progressive compaction strategy
  - Tier 1 (70%): Summarize low-valance content
  - Tier 2 (80%): Compress medium and low content
  - Tier 3 (90%): Keep only high-valance content
- **Preservation Rules**: Always preserves decisions, blockers, active tasks, verification results

## Installation

```bash
npm install
npm run build
npm test
```

## Usage

```typescript
import { Compactor, ContextMonitor } from 'token-compaction';

// Create monitor and compactor
const monitor = new ContextMonitor(200000); // 200k context window
const compactor = new Compactor();

// Check if compaction needed
const check = monitor.checkCompaction();
if (check.should_compact) {
  // Compact content
  const result = compactor.compact(items, check.recommended_tier);
  console.log(`Compressed from ${result.metadata.original_tokens} to ${result.metadata.compacted_tokens} tokens`);
}
```

## API

### ContextMonitor

- `updateTokens(current: number)`: Update current token count
- `getUsage()`: Get TokenUsage object
- `checkCompaction()`: Get MonitorResult with compaction recommendation

### ValanceScorer

- `score(content: string, type?: ContentType)`: Score a single content item
- `scoreAll(items: ContentItem[])`: Score multiple items
- `getPreservable(scores: ValanceScore[], threshold?)`: Get high-valance items
- `getCompactable(scores: ValanceScore[], threshold?)`: Get low-valance items

### Compactor

- `compact(items: ContentItem[], tier: CompactionTier)`: Compact content using specified tier

## Output Format

```json
{
  "preserved": {
    "session_state": {},
    "decisions": ["Decision 1", "Decision 2"],
    "active_tasks": ["Task 1"],
    "blockers": ["Blocker 1"]
  },
  "compacted": {
    "summary": "Compacted 50 items...",
    "key_facts": ["Fact 1", "Fact 2"],
    "context_hash": "a1b2c3d4"
  },
  "metadata": {
    "original_tokens": 150000,
    "compacted_tokens": 45000,
    "compression_ratio": 0.70,
    "tier_used": 2
  }
}
```

## License

MIT
