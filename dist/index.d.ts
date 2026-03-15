/**
 * Token Compaction System
 *
 * Automatic token optimization that preserves high-value content
 * while compacting low-value content based on context thresholds.
 *
 * Research-based improvements (2024-2025):
 * - Semantic embeddings for similarity detection
 * - Episodic memory organization (EM-LLM approach)
 * - Hierarchical summarization (tiered compression)
 * - KV cache compression support
 *
 * @example
 * ```typescript
 * import { createMonitor, createCompactor, createEpisodicMemory } from 'token-compaction';
 *
 * // Create monitor for 200K context
 * const monitor = createMonitor('large');
 *
 * // Check if compaction needed
 * const result = monitor.check(150000); // 75% usage
 * if (result.should_compact) {
 *   console.log(`Compaction recommended at tier ${result.recommended_tier}`);
 * }
 *
 * // Use episodic memory
 * const episodic = createEpisodicMemory();
 * episodic.add({ content: 'Decision: Use PostgreSQL', timestamp: Date.now() });
 * const episodes = episodic.getEpisodes();
 * ```

*/
export * from './types.js';
export * from './monitor.js';
export * from './scorer.js';
export * from './compactor.js';
export * from './preserve.js';
export * from './output.js';
export * from './embeddings.js';
export * from './episodic.js';
export * from './hierarchical.js';
export { createMonitor, ContextMonitor } from './monitor.js';
export { createScorer, ValanceScorer } from './scorer.js';
export { createCompactor, Compactor } from './compactor.js';
export { createEpisodicMemory, EpisodicMemory } from './episodic.js';
export { createHierarchicalContext, HierarchicalContext } from './hierarchical.js';
export { generateEmbedding, cosineSimilarity, groupBySemantic, findDuplicates, clusterContent, } from './embeddings.js';
export { formatResult, parseResult, createSummary, createMinimalOutput } from './output.js';
export { ContextManager, createContextManager, compactContext, getContextStats } from './openclaw-integration.js';
//# sourceMappingURL=index.d.ts.map