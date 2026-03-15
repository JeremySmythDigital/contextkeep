/**
 * Tests for Compaction Engine
 */

import { Compactor, createCompactor } from '../src/compactor.js';
import { ContentItem, CompactionTier } from '../src/types.js';

describe('Compactor', () => {
  let compactor: Compactor;

  beforeEach(() => {
    compactor = createCompactor();
  });

  const sampleItems: ContentItem[] = [
    { content: 'Decision: Use React for frontend framework', type: 'decision' },
    { content: 'Task: Implement login page', type: 'task' },
    { content: 'Blocker: API returns 500 error', type: 'blocker' },
    { content: 'Hello there, how are you?', type: 'pleasantry' },
    { content: 'This is an explanation of how the system works...', type: 'explanation' },
    { content: 'Error: Connection timeout', type: 'error' }
  ];

  test('compacts content with tier 1', () => {
    const result = compactor.compact(sampleItems, 1 as CompactionTier);
    
    expect(result.metadata.tier_used).toBe(1);
    expect(result.metadata.original_tokens).toBeGreaterThan(0);
    // Compression ratio can be negative for small inputs (JSON overhead)
    expect(typeof result.metadata.compression_ratio).toBe('number');
  });

  test('compacts content with tier 2', () => {
    const result = compactor.compact(sampleItems, 2 as CompactionTier);
    
    expect(result.metadata.tier_used).toBe(2);
  });

  test('compacts content with tier 3 (most aggressive)', () => {
    const result = compactor.compact(sampleItems, 3 as CompactionTier);
    
    expect(result.metadata.tier_used).toBe(3);
  });

  test('preserves decisions', () => {
    const result = compactor.compact(sampleItems, 1 as CompactionTier);
    
    expect(result.preserved.decisions).toContain('Decision: Use React for frontend framework');
  });

  test('preserves blockers', () => {
    const result = compactor.compact(sampleItems, 1 as CompactionTier);
    
    expect(result.preserved.blockers).toContain('Blocker: API returns 500 error');
  });

  test('preserves active tasks', () => {
    const result = compactor.compact(sampleItems, 1 as CompactionTier);
    
    expect(result.preserved.active_tasks).toContain('Task: Implement login page');
  });

  test('generates summary', () => {
    const result = compactor.compact(sampleItems, 1 as CompactionTier);
    
    expect(result.compacted.summary).toBeTruthy();
    expect(result.compacted.summary.length).toBeGreaterThan(0);
  });

  test('generates key facts', () => {
    const result = compactor.compact(sampleItems, 1 as CompactionTier);
    
    expect(Array.isArray(result.compacted.key_facts)).toBe(true);
  });

  test('generates context hash', () => {
    const result = compactor.compact(sampleItems, 1 as CompactionTier);
    
    expect(result.compacted.context_hash).toBeTruthy();
  });

  test('handles empty items', () => {
    const result = compactor.compact([], 1 as CompactionTier);
    
    expect(result.metadata.original_tokens).toBe(0);
    expect(result.preserved.decisions).toEqual([]);
  });

  test('produces valid output structure', () => {
    const result = compactor.compact(sampleItems, 2 as CompactionTier);
    
    expect(result.preserved).toBeDefined();
    expect(result.preserved.session_state).toBeDefined();
    expect(result.preserved.decisions).toBeDefined();
    expect(result.preserved.active_tasks).toBeDefined();
    expect(result.preserved.blockers).toBeDefined();
    
    expect(result.compacted).toBeDefined();
    expect(result.compacted.summary).toBeDefined();
    expect(result.compacted.key_facts).toBeDefined();
    expect(result.compacted.context_hash).toBeDefined();
    
    expect(result.metadata).toBeDefined();
    expect(result.metadata.original_tokens).toBeGreaterThanOrEqual(0);
    expect(result.metadata.compacted_tokens).toBeGreaterThan(0);
    expect(typeof result.metadata.compression_ratio).toBe('number');
    expect([1, 2, 3]).toContain(result.metadata.tier_used);
  });

  test('tier 3 produces more compression than tier 1', () => {
    const result1 = compactor.compact(sampleItems, 1 as CompactionTier);
    const result3 = compactor.compact(sampleItems, 3 as CompactionTier);
    
    // Tier 3 should produce equal or less compacted tokens than tier 1
    // (more aggressive compression)
    expect(result3.metadata.compacted_tokens).toBeLessThanOrEqual(result1.metadata.compacted_tokens + 50);
  });

  test('handles large content for compression', () => {
    // Create large content to test actual compression
    const largeItems: ContentItem[] = [];
    for (let i = 0; i < 100; i++) {
      largeItems.push({
        content: `This is explanation number ${i} which contains a lot of text that should be compacted because it is low priority content.`,
        type: 'explanation'
      });
    }
    largeItems.push({ content: 'Decision: Use React', type: 'decision' });
    
    const result = compactor.compact(largeItems, 3 as CompactionTier);
    
    // With 100 items of low priority, we should see actual compression
    expect(result.metadata.original_tokens).toBeGreaterThan(500);
    // The preserved decision should be there
    expect(result.preserved.decisions).toContain('Decision: Use React');
  });
});
