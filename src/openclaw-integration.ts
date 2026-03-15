/**
 * OpenClaw Token Compaction Integration
 * 
 * Integrates the Token Compaction System with OpenClaw's context management.
 * 
 * Usage:
 * ```typescript
 * import { compactContext, createContextManager } from './index.js';
 * 
 * const manager = createContextManager();
 * const result = await manager.checkAndCompact(context, 200000);
 * ```
 */

import {
  createMonitor,
  createCompactor,
  createEpisodicMemory,
  createHierarchicalContext,
  ContextMonitor,
  Compactor,
  EpisodicMemory,
  HierarchicalContext,
  TokenUsage,
  CompactionResult,
  ContentItem,
} from './index.js';

/**
 * Context Manager for OpenClaw
 * 
 * Manages context with automatic compaction at thresholds.
 */
export class ContextManager {
  private monitor: ContextMonitor;
  private compactor: Compactor;
  private episodic: EpisodicMemory;
  private hierarchical: HierarchicalContext;
  private lastCompaction: number = 0;

  constructor(maxTokens: number = 200000) {
    this.monitor = createMonitor(maxTokens);
    this.compactor = createCompactor();
    this.episodic = createEpisodicMemory();
    this.hierarchical = createHierarchicalContext();
  }

  /**
   * Check if compaction is needed and perform if necessary
   */
  async checkAndCompact(
    items: ContentItem[],
    maxTokens?: number
  ): Promise<{
    compacted: boolean;
    result?: CompactionResult;
    usage: TokenUsage;
  }> {
    // Estimate current tokens
    const currentTokens = this.estimateTokens(items);
    
    // Check if compaction needed
    const check = this.monitor.check(currentTokens);
    
    if (!check.should_compact) {
      return {
        compacted: false,
        usage: check.usage,
      };
    }

    // Add items to episodic memory
    for (const item of items) {
      this.episodic.add(item);
    }

    // Compact using appropriate tier
    const result = this.compactor.compact(items, check.recommended_tier);
    
    this.lastCompaction = Date.now();

    return {
      compacted: true,
      result,
      usage: check.usage,
    };
  }

  /**
   * Add content to context with automatic organization
   */
  add(content: ContentItem): void {
    this.episodic.add(content);
    this.hierarchical.add([content], 1);
  }

  /**
   * Get context optimized for a token limit
   */
  getOptimizedContext(maxTokens: number): {
    full: ContentItem[];
    summarized: string[];
    compressed: string[];
  } {
    return this.hierarchical.getContextForLimit(maxTokens);
  }

  /**
   * Get all episodes
   */
  getEpisodes() {
    return this.episodic.getEpisodes();
  }

  /**
   * Get important episodes only
   */
  getImportantEpisodes(threshold: number = 80) {
    return this.episodic.getImportantEpisodes(threshold);
  }

  /**
   * Estimate tokens from content
   */
  private estimateTokens(items: ContentItem[]): number {
    const totalChars = items.reduce((sum, item) => sum + item.content.length, 0);
    return Math.ceil(totalChars / 4); // ~4 chars per token
  }
}

/**
 * Create a context manager instance
 */
export function createContextManager(maxTokens?: number): ContextManager {
  return new ContextManager(maxTokens);
}

/**
 * Quick compaction function
 */
export async function compactContext(
  items: ContentItem[],
  maxTokens: number = 200000
): Promise<CompactionResult | null> {
  const monitor = createMonitor(maxTokens);
  const compactor = createCompactor();
  
  const currentTokens = Math.ceil(
    items.reduce((sum, item) => sum + item.content.length, 0) / 4
  );
  
  const check = monitor.check(currentTokens);
  
  if (!check.should_compact) {
    return null;
  }
  
  return compactor.compact(items, check.recommended_tier);
}

/**
 * Get context statistics
 */
export function getContextStats(items: ContentItem[]): {
  tokenCount: number;
  episodeCount: number;
  avgEpisodeSize: number;
} {
  const episodic = createEpisodicMemory();
  
  for (const item of items) {
    episodic.add(item);
  }
  
  const episodes = episodic.getEpisodes();
  const tokenCount = Math.ceil(
    items.reduce((sum, item) => sum + item.content.length, 0) / 4
  );
  
  return {
    tokenCount,
    episodeCount: episodes.length,
    avgEpisodeSize: episodes.length > 0 
      ? Math.ceil(items.length / episodes.length)
      : 0,
  };
}

// Re-export types
export type {
  TokenUsage,
  CompactionResult,
  ContentItem,
};