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
import { TokenUsage, CompactionResult, ContentItem } from './index.js';
/**
 * Context Manager for OpenClaw
 *
 * Manages context with automatic compaction at thresholds.
 */
export declare class ContextManager {
    private monitor;
    private compactor;
    private episodic;
    private hierarchical;
    private lastCompaction;
    constructor(maxTokens?: number);
    /**
     * Check if compaction is needed and perform if necessary
     */
    checkAndCompact(items: ContentItem[], maxTokens?: number): Promise<{
        compacted: boolean;
        result?: CompactionResult;
        usage: TokenUsage;
    }>;
    /**
     * Add content to context with automatic organization
     */
    add(content: ContentItem): void;
    /**
     * Get context optimized for a token limit
     */
    getOptimizedContext(maxTokens: number): {
        full: ContentItem[];
        summarized: string[];
        compressed: string[];
    };
    /**
     * Get all episodes
     */
    getEpisodes(): import("./episodic.js").Episode[];
    /**
     * Get important episodes only
     */
    getImportantEpisodes(threshold?: number): import("./episodic.js").Episode[];
    /**
     * Estimate tokens from content
     */
    private estimateTokens;
}
/**
 * Create a context manager instance
 */
export declare function createContextManager(maxTokens?: number): ContextManager;
/**
 * Quick compaction function
 */
export declare function compactContext(items: ContentItem[], maxTokens?: number): Promise<CompactionResult | null>;
/**
 * Get context statistics
 */
export declare function getContextStats(items: ContentItem[]): {
    tokenCount: number;
    episodeCount: number;
    avgEpisodeSize: number;
};
export { TokenUsage, CompactionResult, ContentItem, };
//# sourceMappingURL=openclaw-integration.d.ts.map