/**
 * Output Formatter - Formats compaction results as JSON
 */
import { CompactionResult } from './types.js';
/**
 * Format compaction result as JSON
 */
export declare function formatResult(result: CompactionResult): string;
/**
 * Parse compacted JSON back to result
 */
export declare function parseResult(json: string): CompactionResult;
/**
 * Create a summary string for human readability
 */
export declare function createSummary(result: CompactionResult): string;
/**
 * Create a minimal output for context injection
 */
export declare function createMinimalOutput(result: CompactionResult): string;
/**
 * Calculate compression statistics
 */
export declare function calculateStats(result: CompactionResult): {
    compressionRatio: number;
    tokensSaved: number;
    preservationRate: number;
};
//# sourceMappingURL=output.d.ts.map