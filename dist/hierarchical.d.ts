/**
 * Hierarchical Summarization - Multiple compression levels
 *
 * Implements tiered summarization:
 * - Recent context: Full fidelity
 * - Medium context: Summarized
 * - Old context: Key facts only
 */
import { ContentItem, CompactionTier } from './types.js';
import { ValanceScorer } from './scorer.js';
/**
 * Context level for hierarchical storage
 */
export interface ContextLevel {
    level: 'full' | 'summarized' | 'compressed';
    items: ContentItem[];
    tokenEstimate: number;
    summary?: string;
    keyFacts?: string[];
}
/**
 * Hierarchical Context Manager
 */
export declare class HierarchicalContext {
    private scorer;
    private levels;
    constructor(scorer?: ValanceScorer);
    /**
     * Add content at appropriate level
     */
    add(items: ContentItem[], level?: CompactionTier): void;
    /**
     * Get context optimized for a target token limit
     */
    getContextForLimit(maxTokens: number): {
        full: ContentItem[];
        summarized: string[];
        compressed: string[];
    };
    /**
     * Promote old context to higher compression level
     */
    promote(): void;
    /**
     * Get total token estimate
     */
    getTotalTokens(): number;
    /**
     * Convert tier to level type
     */
    private levelToType;
    /**
     * Estimate tokens for items
     */
    private estimateTokens;
    /**
     * Summarize a context level
     */
    private summarizeLevel;
    /**
     * Extract key facts from a level
     */
    private extractKeyFacts;
}
/**
 * Create hierarchical context instance
 */
export declare function createHierarchicalContext(): HierarchicalContext;
//# sourceMappingURL=hierarchical.d.ts.map