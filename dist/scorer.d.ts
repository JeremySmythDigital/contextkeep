/**
 * Valance Scorer - Scores content by importance for compaction
 *
 * Uses hybrid approach:
 * - Rule-based scoring for known content types
 * - Pattern matching for content classification
 */
import { ValanceScore, ContentType, ValanceRule, ContentItem } from './types.js';
/**
 * Valance Scorer class
 */
export declare class ValanceScorer {
    private rules;
    constructor(customRules?: ValanceRule[]);
    /**
     * Score a single content item
     */
    score(content: string, type?: ContentType): ValanceScore;
    /**
     * Score multiple content items
     */
    scoreAll(items: ContentItem[]): ValanceScore[];
    /**
     * Detect content type from text
     */
    detectType(content: string): ContentType;
    /**
     * Get content that should be preserved (high valance)
     */
    getPreservable(scores: ValanceScore[], threshold?: number): ValanceScore[];
    /**
     * Get content that can be compacted (low valance)
     */
    getCompactable(scores: ValanceScore[], threshold?: number): ValanceScore[];
    /**
     * Get content in the middle range
     */
    getMedium(scores: ValanceScore[], low?: number, high?: number): ValanceScore[];
    /**
     * Sort content by valance score (highest first)
     */
    sortByImportance(scores: ValanceScore[]): ValanceScore[];
    /**
     * Calculate average valance score
     */
    averageScore(scores: ValanceScore[]): number;
}
/**
 * Create a default scorer
 */
export declare function createScorer(): ValanceScorer;
//# sourceMappingURL=scorer.d.ts.map