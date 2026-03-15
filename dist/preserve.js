/**
 * Preservation Rules - Determines what content must always be kept
 *
 * NEVER compact: decisions, blockers, verification results
 * ALWAYS keep: SESSION-STATE.md content, active tasks
 * MAY compact: explanations, error logs, conversation history
 */
/**
 * Content types that should NEVER be compacted
 */
export const NEVER_COMPACT = [
    'decision',
    'blocker',
    'verification',
];
/**
 * Content types that should ALWAYS be preserved
 */
export const ALWAYS_PRESERVE = [
    'task',
    'fact',
    'decision',
    'blocker',
    'verification',
];
/**
 * Content types that MAY be compacted
 */
export const MAY_COMPACT = [
    'code',
    'explanation',
    'pleasantry',
    'error',
    'unknown',
];
/**
 * Check if content should be preserved regardless of tier
 */
export function shouldPreserve(score) {
    return ALWAYS_PRESERVE.includes(score.type) || score.score >= 80;
}
/**
 * Check if content can be safely compacted
 */
export function canCompact(score) {
    return MAY_COMPACT.includes(score.type) && score.score < 80;
}
/**
 * Extract SESSION-STATE.md style content from items
 */
export function extractSessionState(items) {
    const decisions = [];
    const active_tasks = [];
    const blockers = [];
    const facts = [];
    for (const item of items) {
        const content = item.content.trim();
        // Extract decisions
        if (content.includes('Decision:') || content.includes('decided:') ||
            content.includes('✅') || content.includes('❌')) {
            decisions.push(content.substring(0, 200));
        }
        // Extract active tasks
        if (content.includes('TODO:') || content.includes('TASK:') ||
            content.includes('⏳') || content.includes('ACTIVE:')) {
            active_tasks.push(content.substring(0, 150));
        }
        // Extract blockers
        if (content.includes('BLOCKER:') || content.includes('⚠️') ||
            content.includes('blocked') || content.includes('stuck')) {
            blockers.push(content.substring(0, 150));
        }
        // Extract facts
        if (content.includes('FACT:') || content.includes('Note:') ||
            content.includes('Important:') || content.includes('Key:')) {
            facts.push(content.substring(0, 100));
        }
    }
    return { decisions, active_tasks, blockers, facts };
}
/**
 * Filter items by preservation rules
 */
export function filterPreservable(items) {
    return items.filter(item => {
        const content = item.content.toLowerCase();
        // Check for preserved keywords
        const preservedKeywords = [
            'decision:', 'decided:', 'approved:', 'rejected:',
            'task:', 'todo:', 'active:', 'pending:',
            'blocker:', 'blocked:', 'stuck:', 'waiting:',
            'verified:', 'confirmed:', 'passed:', 'failed:',
        ];
        for (const keyword of preservedKeywords) {
            if (content.includes(keyword)) {
                return true;
            }
        }
        return item.is_current ?? false;
    });
}
/**
 * Get preservation priority for content
 */
export function getPreservationPriority(score) {
    // Higher number = higher priority to preserve
    if (NEVER_COMPACT.includes(score.type))
        return 100;
    if (ALWAYS_PRESERVE.includes(score.type))
        return 80;
    if (MAY_COMPACT.includes(score.type))
        return score.score;
    return 50; // Unknown types get medium priority
}
//# sourceMappingURL=preserve.js.map