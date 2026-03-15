/**
 * Output Formatter - Formats compaction results as JSON
 */
/**
 * Format compaction result as JSON
 */
export function formatResult(result) {
    return JSON.stringify(result, null, 2);
}
/**
 * Parse compacted JSON back to result
 */
export function parseResult(json) {
    return JSON.parse(json);
}
/**
 * Create a summary string for human readability
 */
export function createSummary(result) {
    const { preserved, compacted, metadata } = result;
    const lines = [
        '# Compaction Summary',
        '',
        '## Preserved Content',
        `- Decisions: ${preserved.decisions.length}`,
        `- Active Tasks: ${preserved.active_tasks.length}`,
        `- Blockers: ${preserved.blockers.length}`,
        '',
        '## Compacted Content',
        `- Summary: ${compacted.summary}`,
        `- Key Facts: ${compacted.key_facts.length}`,
        '',
        '## Metadata',
        `- Original Tokens: ${metadata.original_tokens}`,
        `- Compacted Tokens: ${metadata.compacted_tokens}`,
        `- Compression Ratio: ${(metadata.compression_ratio * 100).toFixed(1)}%`,
        `- Tier Used: ${metadata.tier_used}`,
    ];
    return lines.join('\n');
}
/**
 * Create a minimal output for context injection
 */
export function createMinimalOutput(result) {
    const parts = [];
    // Add decisions
    if (result.preserved.decisions.length > 0) {
        parts.push('## Decisions');
        parts.push(...result.preserved.decisions.map(d => `- ${d}`));
        parts.push('');
    }
    // Add active tasks
    if (result.preserved.active_tasks.length > 0) {
        parts.push('## Active Tasks');
        parts.push(...result.preserved.active_tasks.map(t => `- ${t}`));
        parts.push('');
    }
    // Add blockers
    if (result.preserved.blockers.length > 0) {
        parts.push('## Blockers');
        parts.push(...result.preserved.blockers.map(b => `- ${b}`));
        parts.push('');
    }
    // Add summary of compacted content
    if (result.compacted.summary) {
        parts.push('## Compacted Content');
        parts.push(result.compacted.summary);
        parts.push('');
    }
    // Add key facts
    if (result.compacted.key_facts.length > 0) {
        parts.push('## Key Facts');
        parts.push(...result.compacted.key_facts.map(f => `- ${f}`));
    }
    return parts.join('\n');
}
/**
 * Calculate compression statistics
 */
export function calculateStats(result) {
    const { metadata } = result;
    const tokensSaved = metadata.original_tokens - metadata.compacted_tokens;
    const preservationRate = metadata.compacted_tokens / metadata.original_tokens;
    return {
        compressionRatio: metadata.compression_ratio,
        tokensSaved,
        preservationRate,
    };
}
//# sourceMappingURL=output.js.map