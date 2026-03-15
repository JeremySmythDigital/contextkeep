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
  importance: number; // 0-100
}

/**
 * Episodic Memory Manager
 */
export class EpisodicMemory {
  private episodes: Episode[] = [];
  private currentEpisode: Episode | null = null;
  private episodeCounter = 0;

  /**
   * Add content to episodic memory
   */
  add(content: ContentItem): Episode {
    // Determine if this continues current episode or starts new one
    const type = this.detectType(content);
    
    if (this.shouldStartNewEpisode(content, type)) {
      // Save current episode
      if (this.currentEpisode) {
        this.finalizeEpisode(this.currentEpisode);
        this.episodes.push(this.currentEpisode);
      }
      
      // Start new episode
      this.currentEpisode = {
        id: `episode-${++this.episodeCounter}`,
        type,
        startTime: content.timestamp || Date.now(),
        endTime: content.timestamp || Date.now(),
        items: [content],
        summary: '',
        importance: this.calculateImportance(type, content),
      };
    } else if (this.currentEpisode) {
      // Add to current episode
      this.currentEpisode.items.push(content);
      this.currentEpisode.endTime = content.timestamp || Date.now();
      this.currentEpisode.importance = Math.max(
        this.currentEpisode.importance,
        this.calculateImportance(type, content)
      );
    }
    
    return this.currentEpisode || this.episodes[this.episodes.length - 1];
  }

  /**
   * Detect content type
   */
  private detectType(content: ContentItem): Episode['type'] {
    const text = content.content.toLowerCase();
    
    if (text.includes('decision:') || text.includes('decided:') || 
        text.includes('✅') || text.includes('❌')) {
      return 'decision';
    }
    if (text.includes('todo:') || text.includes('task:') || 
        text.includes('⏳') || text.includes('implement')) {
      return 'task';
    }
    if (text.includes('error:') || text.includes('failed:') || 
        text.includes('❌') || text.includes('exception')) {
      return 'error';
    }
    if (text.includes('verified:') || text.includes('passed:') || 
        text.includes('confirmed:')) {
      return 'verification';
    }
    if (text.includes('?') || text.includes('what') || 
        text.includes('how') || text.includes('why')) {
      return 'discussion';
    }
    return 'other';
  }

  /**
   * Determine if content should start a new episode
   */
  private shouldStartNewEpisode(content: ContentItem, type: Episode['type']): boolean {
    if (!this.currentEpisode) return true;
    
    // Start new episode if:
    // 1. Type changes significantly
    if (this.currentEpisode.type !== type && 
        type !== 'other' && 
        this.currentEpisode.type !== 'other') {
      return true;
    }
    
    // 2. Time gap is too large (> 5 minutes between items)
    const timeGap = (content.timestamp || Date.now()) - this.currentEpisode.endTime;
    if (timeGap > 5 * 60 * 1000) {
      return true;
    }
    
    // 3. Current episode is getting too large (> 50 items)
    if (this.currentEpisode.items.length >= 50) {
      return true;
    }
    
    return false;
  }

  /**
   * Calculate importance score for episode
   */
  private calculateImportance(type: Episode['type'], content: ContentItem): number {
    const typeScores: Record<Episode['type'], number> = {
      decision: 100,
      task: 95,
      verification: 85,
      error: 60,
      discussion: 40,
      other: 50,
    };
    
    return typeScores[type] || 50;
  }

  /**
   * Finalize an episode with summary
   */
  private finalizeEpisode(episode: Episode): void {
    // Create simple summary
    const itemCount = episode.items.length;
    const types = [...new Set(episode.items.map(i => this.detectType(i)))];
    
    episode.summary = `${itemCount} ${episode.type} items (${types.join(', ')})`;
  }

  /**
   * Get all episodes
   */
  getEpisodes(): Episode[] {
    return [...this.episodes, ...(this.currentEpisode ? [this.currentEpisode] : [])];
  }

  /**
   * Get episodes by type
   */
  getEpisodesByType(type: Episode['type']): Episode[] {
    return this.getEpisodes().filter(e => e.type === type);
  }

  /**
   * Get episodes above importance threshold
   */
  getImportantEpisodes(threshold: number = 80): Episode[] {
    return this.getEpisodes().filter(e => e.importance >= threshold);
  }

  /**
   * Get recent episodes
   */
  getRecentEpisodes(count: number = 5): Episode[] {
    return this.getEpisodes()
      .sort((a, b) => b.endTime - a.endTime)
      .slice(0, count);
  }

  /**
   * Get episodes for a time range
   */
  getEpisodesInRange(start: number, end: number): Episode[] {
    return this.getEpisodes().filter(
      e => e.startTime >= start && e.endTime <= end
    );
  }

  /**
   * Compress old episodes into summaries
   */
  compressOldEpisodes(keepRecent: number = 5): {
    recent: Episode[];
    compressed: { summary: string; count: number }[];
  } {
    const episodes = this.getEpisodes();
    const recent = episodes.slice(-keepRecent);
    const old = episodes.slice(0, -keepRecent);
    
    // Group old episodes by type
    const byType: Record<string, Episode[]> = {};
    for (const ep of old) {
      if (!byType[ep.type]) byType[ep.type] = [];
      byType[ep.type].push(ep);
    }
    
    const compressed = Object.entries(byType).map(([type, eps]) => ({
      summary: `${eps.length} ${type} episodes: ${eps.map(e => e.summary).join('; ')}`,
      count: eps.length,
    }));
    
    return { recent, compressed };
  }
}

/**
 * Create episodic memory instance
 */
export function createEpisodicMemory(): EpisodicMemory {
  return new EpisodicMemory();
}