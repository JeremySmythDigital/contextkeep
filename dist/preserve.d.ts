/**
 * Preservation Rules - Determines what content must always be kept
 *
 * NEVER compact: decisions, blockers, verification results
 * ALWAYS keep: SESSION-STATE.md content, active tasks
 * MAY compact: explanations, error logs, conversation history
 */
import { ValanceScore, ContentType, ContentItem } from './types.js';
/**
 * Content types that should NEVER be compacted
 */
export declare const NEVER_COMPACT: ContentType[];
/**
 * Content types that should ALWAYS be preserved
 */
export declare const ALWAYS_PRESERVE: ContentType[];
/**
 * Content types that MAY be compacted
 */
export declare const MAY_COMPACT: ContentType[];
/**
 * Check if content should be preserved regardless of tier
 */
export declare function shouldPreserve(score: ValanceScore): boolean;
/**
 * Check if content can be safely compacted
 */
export declare function canCompact(score: ValanceScore): boolean;
/**
 * Extract SESSION-STATE.md style content from items
 */
export declare function extractSessionState(items: ContentItem[]): {
    decisions: string[];
    active_tasks: string[];
    blockers: string[];
    facts: string[];
};
/**
 * Filter items by preservation rules
 */
export declare function filterPreservable(items: ContentItem[]): ContentItem[];
/**
 * Get preservation priority for content
 */
export declare function getPreservationPriority(score: ValanceScore): number;
//# sourceMappingURL=preserve.d.ts.map