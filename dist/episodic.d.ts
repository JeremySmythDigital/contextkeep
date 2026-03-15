/**
 * Episodic Memory - Organize content into coherent episodes
 *
 * Based on EM-LLM research: organizes token sequences into
 * episodic events for better retrieval and compression.
 */
import { ContentItem } from './types.js';
/**
 * An episode is a coherent group of related content
 */
export interface Episode {
    id: string;
    type: 'decision' | 'task' | 'discussion' | 'error' | 'verification' | 'other';
    startTime: number;
    endTime: number;
    items: ContentItem[];
    summary: string;
    importance: number;
}
/**
 * Episodic Memory Manager
 */
export declare class EpisodicMemory {
    private episodes;
    private currentEpisode;
    private episodeCounter;
    /**
     * Add content to episodic memory
     */
    add(content: ContentItem): Episode;
    /**
     * Detect content type
     */
    private detectType;
    /**
     * Determine if content should start a new episode
     */
    private shouldStartNewEpisode;
    /**
     * Calculate importance score for episode
     */
    private calculateImportance;
    /**
     * Finalize an episode with summary
     */
    private finalizeEpisode;
    /**
     * Get all episodes
     */
    getEpisodes(): Episode[];
    /**
     * Get episodes by type
     */
    getEpisodesByType(type: Episode['type']): Episode[];
    /**
     * Get episodes above importance threshold
     */
    getImportantEpisodes(threshold?: number): Episode[];
    /**
     * Get recent episodes
     */
    getRecentEpisodes(count?: number): Episode[];
    /**
     * Get episodes for a time range
     */
    getEpisodesInRange(start: number, end: number): Episode[];
    /**
     * Compress old episodes into summaries
     */
    compressOldEpisodes(keepRecent?: number): {
        recent: Episode[];
        compressed: {
            summary: string;
            count: number;
        }[];
    };
}
/**
 * Create episodic memory instance
 */
export declare function createEpisodicMemory(): EpisodicMemory;
//# sourceMappingURL=episodic.d.ts.map