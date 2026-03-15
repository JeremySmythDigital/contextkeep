/**
 * Valance Scorer - Scores content by importance for compaction
 * 
 * Uses hybrid approach:
 * - Rule-based scoring for known content types
 * - Pattern matching for content classification
 */

import { ValanceScore, ContentType, ValanceRule, ContentItem } from './types.js';

/**
 * Default valance rules for content types
 * Higher scores = more important = less likely to compact
 */
const DEFAULT_RULES: ValanceRule[] = [
  { type: 'decision', base_score: 100, boost_keywords: ['approved', 'rejected', 'finalized', 'committed'] },
  { type: 'task', base_score: 95, boost_keywords: ['active', 'in-progress', 'blocked', 'urgent'] },
  { type: 'blocker', base_score: 90, boost_keywords: ['critical', 'blocking', 'stuck', 'escalate'] },
  { type: 'verification', base_score: 85, boost_keywords: ['verified', 'passed', 'confirmed', 'validated'] },
  { type: 'fact', base_score: 80, boost_keywords: ['key', 'important', 'critical', 'essential'] },
  { type: 'code', base_score: 60, boost_keywords: ['function', 'class', 'module', 'component'] },
  { type: 'explanation', base_score: 40, reduce_keywords: ['basically', 'simply', 'just', 'obviously'] },
  { type: 'pleasantry', base_score: 10, reduce_keywords: ['please', 'thank', 'sorry', 'apologize'] },
  { type: 'error', base_score: 5, boost_keywords: ['critical', 'fatal', 'urgent'] },
  { type: 'unknown', base_score: 50 },
];

/**
 * Keywords that indicate content type
 */
const TYPE_KEYWORDS: Record<ContentType, string[]> = {
  decision: ['decided', 'approved', 'rejected', 'chosen', 'selected', 'finalized'],
  task: ['todo', 'task', 'fixme', 'hackme', 'implement', 'build', 'create'],
  blocker: ['blocked', 'blocked by', 'cannot proceed', 'stuck', 'waiting for'],
  verification: ['verified', 'confirmed', 'passed', 'validated', 'tested', 'checked'],
  fact: ['fact:', 'note:', 'important:', 'key:', 'remember:'],
  code: ['function', 'class', 'interface', 'const', 'let', 'var', 'import', 'export'],
  explanation: ['because', 'since', 'therefore', 'this means', 'in other words'],
  pleasantry: ['please', 'thank you', 'thanks', 'sorry', 'apologies', 'gladly'],
  error: ['error:', 'failed:', 'exception:', 'warning:', 'fatal:'],
  unknown: [],
};

/**
 * Valance Scorer class
 */
export class ValanceScorer {
  private rules: ValanceRule[];

  constructor(customRules?: ValanceRule[]) {
    this.rules = customRules || DEFAULT_RULES;
  }

  /**
   * Score a single content item
   */
  score(content: string, type?: ContentType): ValanceScore {
    // Detect type if not provided
    const detectedType = type || this.detectType(content);
    
    // Get base score for type
    const rule = this.rules.find(r => r.type === detectedType);
    if (!rule) {
      return { score: 50, type: 'unknown', content };
    }

    let score = rule.base_score;

    // Apply boost keywords
    if (rule.boost_keywords) {
      const contentLower = content.toLowerCase();
      for (const keyword of rule.boost_keywords) {
        if (contentLower.includes(keyword.toLowerCase())) {
          score = Math.min(100, score + 5);
        }
      }
    }

    // Apply reduce keywords
    if (rule.reduce_keywords) {
      const contentLower = content.toLowerCase();
      for (const keyword of rule.reduce_keywords) {
        if (contentLower.includes(keyword.toLowerCase())) {
          score = Math.max(0, score - 5);
        }
      }
    }

    return { score, type: detectedType, content };
  }

  /**
   * Score multiple content items
   */
  scoreAll(items: ContentItem[]): ValanceScore[] {
    return items.map(item => this.score(item.content, item.type));
  }

  /**
   * Detect content type from text
   */
  detectType(content: string): ContentType {
    const contentLower = content.toLowerCase();
    
    // Check each type's keywords
    for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
      for (const keyword of keywords) {
        if (contentLower.includes(keyword.toLowerCase())) {
          return type as ContentType;
        }
      }
    }

    return 'unknown';
  }

  /**
   * Get content that should be preserved (high valance)
   */
  getPreservable(scores: ValanceScore[], threshold: number = 80): ValanceScore[] {
    return scores.filter(s => s.score >= threshold);
  }

  /**
   * Get content that can be compacted (low valance)
   */
  getCompactable(scores: ValanceScore[], threshold: number = 40): ValanceScore[] {
    return scores.filter(s => s.score < threshold);
  }

  /**
   * Get content in the middle range
   */
  getMedium(scores: ValanceScore[], low: number = 40, high: number = 80): ValanceScore[] {
    return scores.filter(s => s.score >= low && s.score < high);
  }

  /**
   * Sort content by valance score (highest first)
   */
  sortByImportance(scores: ValanceScore[]): ValanceScore[] {
    return [...scores].sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate average valance score
   */
  averageScore(scores: ValanceScore[]): number {
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, s) => sum + s.score, 0);
    return total / scores.length;
  }
}

/**
 * Create a default scorer
 */
export function createScorer(): ValanceScorer {
  return new ValanceScorer();
}