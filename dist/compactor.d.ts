/**
 * Compaction Engine - 3-tier compaction strategy
 *
 * Tier 1 (70%): Summarize low-valance content
 * Tier 2 (80%): Compress medium-valance content
 * Tier 3 (90%): Keep only high-valance content
 */
import { CompactionResult, CompactionTier, ContentItem } from './types.js';
import { ValanceScorer } from './scorer.js';
/**
 * Compaction Engine class
 */
export declare class Compactor {
    private scorer;
    constructor(scorer?: ValanceScorer);
    /**
     * Compact content using the specified tier
     */
    compact(items: ContentItem[], tier: CompactionTier): CompactionResult;
    /**
     * Extract decisions from high-valance content
     */
    private extractDecisions;
    /**
     * Extract active tasks from high-valance content
     */
    private extractTasks;
    /**
     * Extract blockers from high-valance content
     */
    private extractBlockers;
    /**
     * Summarize low-valance content (Tier 1)
     */
    private summarizeLow;
    /**
     * Include medium-valance content in preserved (Tier 1)
     */
    private includeMedium;
    /**
     * Compress medium and low-valance content (Tier 2)
     */
    private compressMediumLow;
    /**
     * Summarize all non-high-valance content (Tier 3)
     */
    private summarizeAll;
    /**
     * Estimate token count from items
     */
    private estimateTokens;
    /**
     * Estimate tokens from result
     */
    private estimateTokensFromResult;
    /**
     * Generate a hash for context reference
     */
    private generateHash;
}
/**
 * Create a default compactor
 */
export declare function createCompactor(): Compactor;
//# sourceMappingURL=compactor.d.ts.map