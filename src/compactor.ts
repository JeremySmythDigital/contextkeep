/**
 * Compaction Engine - 3-tier compaction strategy
 * 
 * Tier 1 (70%): Summarize low-valance content
 * Tier 2 (80%): Compress medium-valance content
 * Tier 3 (90%): Keep only high-valance content
 */

import { CompactionResult, CompactionTier, ValanceScore, ContentItem } from './types.js';
import { ValanceScorer, createScorer } from './scorer.js';

/**
 * Compaction Engine class
 */
export class Compactor {
  private scorer: ValanceScorer;

  constructor(scorer?: ValanceScorer) {
    this.scorer = scorer || createScorer();
  }

  /**
   * Compact content using the specified tier
   */
  compact(items: ContentItem[], tier: CompactionTier): CompactionResult {
    const scores = this.scorer.scoreAll(items);
    
    // Get content by valance level
    const highValance = scores.filter(s => s.score >= 80);
    const mediumValance = scores.filter(s => s.score >= 40 && s.score < 80);
    const lowValance = scores.filter(s => s.score < 40);

    // Apply tier-specific compaction
    let preserved = {
      session_state: {},
      decisions: this.extractDecisions(highValance),
      active_tasks: this.extractTasks(highValance),
      blockers: this.extractBlockers(highValance),
    };

    // Initialize compacted with proper typing
    let compacted: { summary: string; key_facts: string[]; context_hash: string } = {
      summary: '',
      key_facts: [] as string[],
      context_hash: '',
    };

    switch (tier) {
      case 1:
        // Tier 1: Summarize low-valance, keep medium and high
        compacted = this.summarizeLow(lowValance);
        preserved = this.includeMedium(preserved, mediumValance);
        break;
      
      case 2:
        // Tier 2: Compress medium and low, keep only high
        compacted = this.compressMediumLow(mediumValance, lowValance);
        break;
      
      case 3:
        // Tier 3: Keep only high-valance
        compacted = this.summarizeAll(mediumValance, lowValance);
        break;
    }

    // Calculate metadata
    const originalTokens = this.estimateTokens(items);
    const compactedTokens = this.estimateTokensFromResult(preserved, compacted);
    const compressionRatio = 1 - (compactedTokens / originalTokens);

    return {
      preserved,
      compacted: {
        ...compacted,
        context_hash: this.generateHash(items),
      },
      metadata: {
        original_tokens: originalTokens,
        compacted_tokens: compactedTokens,
        compression_ratio: Math.round(compressionRatio * 100) / 100,
        tier_used: tier,
      },
    };
  }

  /**
   * Extract decisions from high-valance content
   */
  private extractDecisions(scores: ValanceScore[]): string[] {
    return scores
      .filter(s => s.type === 'decision')
      .map(s => s.content.substring(0, 200)); // Truncate long decisions
  }

  /**
   * Extract active tasks from high-valance content
   */
  private extractTasks(scores: ValanceScore[]): string[] {
    return scores
      .filter(s => s.type === 'task')
      .map(s => s.content.substring(0, 150));
  }

  /**
   * Extract blockers from high-valance content
   */
  private extractBlockers(scores: ValanceScore[]): string[] {
    return scores
      .filter(s => s.type === 'blocker')
      .map(s => s.content.substring(0, 150));
  }

  /**
   * Summarize low-valance content (Tier 1)
   */
  private summarizeLow(lowValance: ValanceScore[]): { summary: string; key_facts: string[]; context_hash: string } {
    if (lowValance.length === 0) {
      return { summary: 'No low-valance content to compact.', key_facts: [], context_hash: '' };
    }

    // Simple summarization - take first sentence of each item
    const keyFacts = lowValance.slice(0, 5).map(s => {
      const firstSentence = s.content.split(/[.!?]/)[0];
      return firstSentence.substring(0, 100);
    });

    const summary = `${lowValance.length} low-priority items compacted.`;
    
    return { summary, key_facts: keyFacts, context_hash: '' };
  }

  /**
   * Include medium-valance content in preserved (Tier 1)
   */
  private includeMedium(
    preserved: CompactionResult['preserved'],
    mediumValance: ValanceScore[]
  ): CompactionResult['preserved'] {
    // Add medium-valance facts
    const facts = mediumValance
      .filter(s => s.type === 'fact')
      .map(s => s.content.substring(0, 100));

    return {
      ...preserved,
      // @ts-ignore - We're adding facts dynamically
      facts,
    };
  }

  /**
   * Compress medium and low-valance content (Tier 2)
   */
  private compressMediumLow(
    mediumValance: ValanceScore[],
    lowValance: ValanceScore[]
  ): { summary: string; key_facts: string[]; context_hash: string } {
    const allCompactable = [...mediumValance, ...lowValance];
    
    const keyFacts = allCompactable.slice(0, 10).map(s => {
      const firstSentence = s.content.split(/[.!?]/)[0];
      return firstSentence.substring(0, 80);
    });

    const summary = `${mediumValance.length} medium-priority and ${lowValance.length} low-priority items compressed.`;
    
    return { summary, key_facts: keyFacts, context_hash: '' };
  }

  /**
   * Summarize all non-high-valance content (Tier 3)
   */
  private summarizeAll(
    mediumValance: ValanceScore[],
    lowValance: ValanceScore[]
  ): { summary: string; key_facts: string[]; context_hash: string } {
    const all = [...mediumValance, ...lowValance];
    
    // Only keep the most important facts
    const keyFacts = all
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.content.substring(0, 60));

    const summary = `Aggressively compacted ${all.length} items to essential facts only.`;
    
    return { summary, key_facts: keyFacts, context_hash: '' };
  }

  /**
   * Estimate token count from items
   */
  private estimateTokens(items: ContentItem[]): number {
    // Rough estimate: ~4 characters per token
    const totalChars = items.reduce((sum, item) => sum + item.content.length, 0);
    return Math.ceil(totalChars / 4);
  }

  /**
   * Estimate tokens from result
   */
  private estimateTokensFromResult(
    preserved: CompactionResult['preserved'],
    compacted: CompactionResult['compacted']
  ): number {
    const preservedStr = JSON.stringify(preserved);
    const compactedStr = JSON.stringify(compacted);
    const totalChars = preservedStr.length + compactedStr.length;
    return Math.ceil(totalChars / 4);
  }

  /**
   * Generate a hash for context reference
   */
  private generateHash(items: ContentItem[]): string {
    const content = items.map(i => i.content).join('');
    // Simple hash - in production use crypto
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

/**
 * Create a default compactor
 */
export function createCompactor(): Compactor {
  return new Compactor();
}