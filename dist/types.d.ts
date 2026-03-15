/**
 * Token Compaction System - Type Definitions
 *
 * Automatic token optimization that activates at context thresholds
 * using valance scoring to preserve high-value content.
 */
/**
 * Current token usage information
 */
export interface TokenUsage {
    /** Current tokens used */
    current: number;
    /** Maximum tokens allowed */
    max: number;
    /** Percentage of context used (0-100) */
    percentage: number;
}
/**
 * Content type classification for valance scoring
 */
export type ContentType = 'decision' | 'task' | 'blocker' | 'verification' | 'fact' | 'code' | 'explanation' | 'pleasantry' | 'error' | 'unknown';
/**
 * Valance score for a piece of content
 * Higher scores = more important = less likely to compact
 */
export interface ValanceScore {
    /** Valance score (0-100) */
    score: number;
    /** Content type classification */
    type: ContentType;
    /** The content being scored */
    content: string;
}
/**
 * Compaction tier levels
 */
export type CompactionTier = 1 | 2 | 3;
/**
 * Result of compaction operation
 */
export interface CompactionResult {
    /** High-valance content that was preserved in full */
    preserved: {
        /** Session state object */
        session_state: Record<string, unknown>;
        /** Important decisions */
        decisions: string[];
        /** Active tasks */
        active_tasks: string[];
        /** Blockers requiring attention */
        blockers: string[];
    };
    /** Low/medium-valance content that was compacted */
    compacted: {
        /** Summary of compacted content */
        summary: string;
        /** Key facts extracted from compacted content */
        key_facts: string[];
        /** Hash of original context for reference */
        context_hash: string;
    };
    /** Metadata about the compaction */
    metadata: {
        /** Original token count */
        original_tokens: number;
        /** Token count after compaction */
        compacted_tokens: number;
        /** Compression ratio (0-1, higher = more compression) */
        compression_ratio: number;
        /** Compaction tier used (1, 2, or 3) */
        tier_used: CompactionTier;
    };
}
/**
 * Options for compaction operation
 */
export interface CompactionOptions {
    /** Threshold percentage to trigger compaction (70, 80, or 90) */
    threshold: number;
    /** Content types that should always be preserved */
    preserve_types: ContentType[];
    /** Maximum tokens allowed */
    max_tokens?: number;
}
/**
 * Content item with metadata for scoring
 */
export interface ContentItem {
    /** The content text */
    content: string;
    /** Content type if known */
    type?: ContentType;
    /** Timestamp of content */
    timestamp?: number;
    /** Whether content is from current session */
    is_current?: boolean;
}
/**
 * Monitor result indicating if compaction is needed
 */
export interface MonitorResult {
    /** Whether compaction should trigger */
    should_compact: boolean;
    /** Current usage percentage */
    usage_percentage: number;
    /** Recommended compaction tier */
    recommended_tier: CompactionTier;
    /** Token usage details */
    usage: TokenUsage;
}
/**
 * Rule for valance scoring
 */
export interface ValanceRule {
    /** Content type this rule applies to */
    type: ContentType;
    /** Base score (0-100) */
    base_score: number;
    /** Keywords that boost score */
    boost_keywords?: string[];
    /** Keywords that reduce score */
    reduce_keywords?: string[];
}
//# sourceMappingURL=types.d.ts.map