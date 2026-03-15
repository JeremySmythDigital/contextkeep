/**
 * Context Monitor - Detects when compaction should trigger
 *
 * Monitors token usage and triggers compaction at configured thresholds.
 */
import { TokenUsage, MonitorResult, CompactionTier } from './types.js';
/**
 * Default thresholds for compaction tiers
 */
declare const DEFAULT_THRESHOLDS: {
    tier1: number;
    tier2: number;
    tier3: number;
};
/**
 * Context Monitor class
 */
export declare class ContextMonitor {
    private maxTokens;
    private thresholds;
    constructor(maxTokens: number, thresholds?: Partial<typeof DEFAULT_THRESHOLDS>);
    /**
     * Check if compaction should trigger based on current usage
     */
    check(currentTokens: number): MonitorResult;
    /**
     * Get the appropriate compaction tier for a percentage
     */
    getTier(percentage: number): CompactionTier;
    /**
     * Calculate tokens to remove for a given tier
     */
    calculateTargetTokens(currentTokens: number, tier: CompactionTier): number;
    /**
     * Get current context usage stats
     */
    getUsageStats(currentTokens: number): {
        usage: TokenUsage;
        tier: CompactionTier;
        shouldCompact: boolean;
    };
}
/**
 * Create a default monitor for common context sizes
 */
export declare function createMonitor(contextSize: 'small' | 'medium' | 'large' | number): ContextMonitor;
export {};
//# sourceMappingURL=monitor.d.ts.map