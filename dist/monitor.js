/**
 * Context Monitor - Detects when compaction should trigger
 *
 * Monitors token usage and triggers compaction at configured thresholds.
 */
/**
 * Default thresholds for compaction tiers
 */
const DEFAULT_THRESHOLDS = {
    tier1: 70, // Summarize low-valance
    tier2: 80, // Compress medium-valance
    tier3: 90, // Keep only high-valance
};
/**
 * Context Monitor class
 */
export class ContextMonitor {
    maxTokens;
    thresholds;
    constructor(maxTokens, thresholds) {
        this.maxTokens = maxTokens;
        this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
    }
    /**
     * Check if compaction should trigger based on current usage
     */
    check(currentTokens) {
        const percentage = (currentTokens / this.maxTokens) * 100;
        const usage = {
            current: currentTokens,
            max: this.maxTokens,
            percentage,
        };
        // Determine recommended tier
        let recommended_tier;
        let should_compact = false;
        if (percentage >= this.thresholds.tier3) {
            recommended_tier = 3;
            should_compact = true;
        }
        else if (percentage >= this.thresholds.tier2) {
            recommended_tier = 2;
            should_compact = true;
        }
        else if (percentage >= this.thresholds.tier1) {
            recommended_tier = 1;
            should_compact = true;
        }
        else {
            recommended_tier = 1; // Default, won't be used
        }
        return {
            should_compact,
            usage_percentage: percentage,
            recommended_tier,
            usage,
        };
    }
    /**
     * Get the appropriate compaction tier for a percentage
     */
    getTier(percentage) {
        if (percentage >= this.thresholds.tier3)
            return 3;
        if (percentage >= this.thresholds.tier2)
            return 2;
        return 1;
    }
    /**
     * Calculate tokens to remove for a given tier
     */
    calculateTargetTokens(currentTokens, tier) {
        // Target different compression ratios per tier
        const targets = {
            1: 0.85, // Keep 85% (15% reduction)
            2: 0.70, // Keep 70% (30% reduction)
            3: 0.50, // Keep 50% (50% reduction)
        };
        return Math.floor(currentTokens * targets[tier]);
    }
    /**
     * Get current context usage stats
     */
    getUsageStats(currentTokens) {
        const result = this.check(currentTokens);
        return {
            usage: result.usage,
            tier: result.recommended_tier,
            shouldCompact: result.should_compact,
        };
    }
}
/**
 * Create a default monitor for common context sizes
 */
export function createMonitor(contextSize) {
    const sizes = {
        small: 8192, // ~8K tokens
        medium: 32768, // ~32K tokens
        large: 200000, // ~200K tokens (Claude/GPT-4)
    };
    const maxTokens = typeof contextSize === 'number' ? contextSize : sizes[contextSize];
    return new ContextMonitor(maxTokens);
}
//# sourceMappingURL=monitor.js.map