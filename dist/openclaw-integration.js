/**
 * OpenClaw Token Compaction Integration
 *
 * Integrates the Token Compaction System with OpenClaw's context management.
 *
 * Usage:
 * ```typescript
 * import { compactContext, createContextManager } from './index.js';
 *
 * const manager = createContextManager();
 * const result = await manager.checkAndCompact(context, 200000);
 * ```
 */
import { createMonitor, createCompactor, createEpisodicMemory, createHierarchicalContext, } from './index.js';
/**
 * Context Manager for OpenClaw
 *
 * Manages context with automatic compaction at thresholds.
 */
export class ContextManager {
    monitor;
    compactor;
    episodic;
    hierarchical;
    lastCompaction = 0;
    constructor(maxTokens = 200000) {
        this.monitor = createMonitor(maxTokens);
        this.compactor = createCompactor();
        this.episodic = createEpisodicMemory();
        this.hierarchical = createHierarchicalContext();
    }
    /**
     * Check if compaction is needed and perform if necessary
     */
    async checkAndCompact(items, maxTokens) {
        // Estimate current tokens
        const currentTokens = this.estimateTokens(items);
        // Check if compaction needed
        const check = this.monitor.check(currentTokens);
        if (!check.should_compact) {
            return {
                compacted: false,
                usage: check.usage,
            };
        }
        // Add items to episodic memory
        for (const item of items) {
            this.episodic.add(item);
        }
        // Compact using appropriate tier
        const result = this.compactor.compact(items, check.recommended_tier);
        this.lastCompaction = Date.now();
        return {
            compacted: true,
            result,
            usage: check.usage,
        };
    }
    /**
     * Add content to context with automatic organization
     */
    add(content) {
        this.episodic.add(content);
        this.hierarchical.add([content], 1);
    }
    /**
     * Get context optimized for a token limit
     */
    getOptimizedContext(maxTokens) {
        return this.hierarchical.getContextForLimit(maxTokens);
    }
    /**
     * Get all episodes
     */
    getEpisodes() {
        return this.episodic.getEpisodes();
    }
    /**
     * Get important episodes only
     */
    getImportantEpisodes(threshold = 80) {
        return this.episodic.getImportantEpisodes(threshold);
    }
    /**
     * Estimate tokens from content
     */
    estimateTokens(items) {
        const totalChars = items.reduce((sum, item) => sum + item.content.length, 0);
        return Math.ceil(totalChars / 4); // ~4 chars per token
    }
}
/**
 * Create a context manager instance
 */
export function createContextManager(maxTokens) {
    return new ContextManager(maxTokens);
}
/**
 * Quick compaction function
 */
export async function compactContext(items, maxTokens = 200000) {
    const monitor = createMonitor(maxTokens);
    const compactor = createCompactor();
    const currentTokens = Math.ceil(items.reduce((sum, item) => sum + item.content.length, 0) / 4);
    const check = monitor.check(currentTokens);
    if (!check.should_compact) {
        return null;
    }
    return compactor.compact(items, check.recommended_tier);
}
/**
 * Get context statistics
 */
export function getContextStats(items) {
    const episodic = createEpisodicMemory();
    for (const item of items) {
        episodic.add(item);
    }
    const episodes = episodic.getEpisodes();
    const tokenCount = Math.ceil(items.reduce((sum, item) => sum + item.content.length, 0) / 4);
    return {
        tokenCount,
        episodeCount: episodes.length,
        avgEpisodeSize: episodes.length > 0
            ? Math.ceil(items.length / episodes.length)
            : 0,
    };
}
//# sourceMappingURL=openclaw-integration.js.map