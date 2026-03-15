/**
 * Hierarchical Summarization - Multiple compression levels
 * 
 * Implements tiered summarization:
 * - Recent context: Full fidelity
 * - Medium context: Summarized
 * - Old context: Key facts only
 */

import { ContentItem, CompactionResult, CompactionTier } from './types.js';
import { ValanceScorer, createScorer } from './scorer.js';

/**
 * Context level for hierarchical storage
 */
export interface ContextLevel {
  level: 'full' | 'summarized' | 'compressed';
  items: ContentItem[];
  tokenEstimate: number;
  summary?: string;
  keyFacts?: string[];
}

/**
 * Hierarchical Context Manager
 */
export class HierarchicalContext {
  private scorer: ValanceScorer;
  private levels: Map<CompactionTier, ContextLevel>;
  
  constructor(scorer?: ValanceScorer) {
    this.scorer = scorer || createScorer();
    this.levels = new Map();
  }

  /**
   * Add content at appropriate level
   */
  add(items: ContentItem[], level: CompactionTier = 1): void {
    const existing = this.levels.get(level) || {
      level: this.levelToType(level),
      items: [],
      tokenEstimate: 0,
    };
    
    existing.items.push(...items);
    existing.tokenEstimate = this.estimateTokens(existing.items);
    
    this.levels.set(level, existing);
  }

  /**
   * Get context optimized for a target token limit
   */
  getContextForLimit(maxTokens: number): {
    full: ContentItem[];
    summarized: string[];
    compressed: string[];
  } {
    const result = {
      full: [] as ContentItem[],
      summarized: [] as string[],
      compressed: [] as string[],
    };
    
    let tokensUsed = 0;
    
    // Get recent context (full fidelity)
    const level1 = this.levels.get(1);
    if (level1) {
      for (const item of level1.items) {
        const itemTokens = this.estimateTokens([item]);
        if (tokensUsed + itemTokens <= maxTokens * 0.5) {
          result.full.push(item);
          tokensUsed += itemTokens;
        }
      }
    }
    
    // Get medium context (summarized)
    const level2 = this.levels.get(2);
    if (level2 && tokensUsed < maxTokens * 0.7) {
      const summary = this.summarizeLevel(level2);
      const summaryTokens = Math.ceil(summary.length / 4);
      if (tokensUsed + summaryTokens <= maxTokens) {
        result.summarized.push(summary);
        tokensUsed += summaryTokens;
      }
    }
    
    // Get old context (compressed to key facts)
    const level3 = this.levels.get(3);
    if (level3 && tokensUsed < maxTokens) {
      const facts = this.extractKeyFacts(level3);
      for (const fact of facts) {
        const factTokens = Math.ceil(fact.length / 4);
        if (tokensUsed + factTokens <= maxTokens) {
          result.compressed.push(fact);
          tokensUsed += factTokens;
        }
      }
    }
    
    return result;
  }

  /**
   * Promote old context to higher compression level
   */
  promote(): void {
    // Move level 1 items older than threshold to level 2
    // Move level 2 items older than threshold to level 3
    
    const level1 = this.levels.get(1);
    const level2 = this.levels.get(2);
    
    if (level1 && level1.items.length > 100) {
      // Keep most recent 100 items at full fidelity
      const toPromote = level1.items.slice(0, -100);
      level1.items = level1.items.slice(-100);
      level1.tokenEstimate = this.estimateTokens(level1.items);
      
      if (!level2) {
        this.levels.set(2, {
          level: 'summarized',
          items: toPromote,
          tokenEstimate: this.estimateTokens(toPromote),
        });
      } else {
        level2.items.push(...toPromote);
        level2.tokenEstimate = this.estimateTokens(level2.items);
      }
    }
    
    // Move level 2 items to level 3 if too many
    if (level2 && level2.items.length > 200) {
      const toPromote = level2.items.slice(0, -100);
      level2.items = level2.items.slice(-100);
      level2.tokenEstimate = this.estimateTokens(level2.items);
      
      const level3 = this.levels.get(3);
      if (!level3) {
        this.levels.set(3, {
          level: 'compressed',
          items: toPromote,
          tokenEstimate: this.estimateTokens(toPromote),
        });
      } else {
        level3.items.push(...toPromote);
        level3.tokenEstimate = this.estimateTokens(level3.items);
      }
    }
  }

  /**
   * Get total token estimate
   */
  getTotalTokens(): number {
    let total = 0;
    for (const level of this.levels.values()) {
      total += level.tokenEstimate;
    }
    return total;
  }

  /**
   * Convert tier to level type
   */
  private levelToType(tier: CompactionTier): 'full' | 'summarized' | 'compressed' {
    switch (tier) {
      case 1: return 'full';
      case 2: return 'summarized';
      case 3: return 'compressed';
    }
  }

  /**
   * Estimate tokens for items
   */
  private estimateTokens(items: ContentItem[]): number {
    const totalChars = items.reduce((sum, item) => sum + item.content.length, 0);
    return Math.ceil(totalChars / 4);
  }

  /**
   * Summarize a context level
   */
  private summarizeLevel(level: ContextLevel): string {
    if (level.items.length === 0) return '';
    
    const scores = this.scorer.scoreAll(level.items);
    const highValance = scores.filter(s => s.score >= 60);
    
    // Create summary from high-valance items
    const summaries = highValance.slice(0, 5).map(s => {
      const firstSentence = s.content.split(/[.!?]/)[0];
      return firstSentence.substring(0, 100);
    });
    
    return `${level.items.length} items. Key points: ${summaries.join('; ')}.`;
  }

  /**
   * Extract key facts from a level
   */
  private extractKeyFacts(level: ContextLevel): string[] {
    const scores = this.scorer.scoreAll(level.items);
    
    return scores
      .filter(s => s.score >= 80)
      .slice(0, 10)
      .map(s => {
        const firstSentence = s.content.split(/[.!?]/)[0];
        return firstSentence.substring(0, 80);
      });
  }
}

/**
 * Create hierarchical context instance
 */
export function createHierarchicalContext(): HierarchicalContext {
  return new HierarchicalContext();
}