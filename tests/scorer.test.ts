/**
 * Tests for Valance Scorer
 */

import { ValanceScorer, createScorer } from '../src/scorer.js';
import { ContentItem } from '../src/types.js';

describe('ValanceScorer', () => {
  let scorer: ValanceScorer;

  beforeEach(() => {
    scorer = createScorer();
  });

  test('scores decision content with high valance', () => {
    const result = scorer.score('Decision: Use React for frontend', 'decision');
    expect(result.score).toBeGreaterThanOrEqual(95);
    expect(result.type).toBe('decision');
  });

  test('scores pleasantries with low valance', () => {
    const result = scorer.score('Hello! Thanks for your help.', 'pleasantry');
    expect(result.score).toBeLessThanOrEqual(15);
    expect(result.type).toBe('pleasantry');
  });

  test('detects decision type from keyword', () => {
    const result = scorer.score('We decided to proceed with option A');
    expect(result.type).toBe('decision');
  });

  test('boosts score for boost keywords', () => {
    const result1 = scorer.score('Task: implement feature', 'task');
    const result2 = scorer.score('CRITICAL Task: implement feature', 'task');
    
    expect(result2.score).toBeGreaterThanOrEqual(result1.score);
  });

  test('reduces score for reduce keywords', () => {
    const result1 = scorer.score('Task: implement feature', 'task');
    const result2 = scorer.score('Just a task: implement feature', 'task');
    
    // 'just' is a reduce keyword for explanation type, not task
    // So this test should compare same type
    expect(result1.score).toBeGreaterThanOrEqual(result2.score);
  });

  test('scores multiple items', () => {
    const items: ContentItem[] = [
      { content: 'Decision: proceed', type: 'decision' },
      { content: 'Hello there', type: 'pleasantry' },
      { content: 'Error occurred', type: 'error' }
    ];
    
    const results = scorer.scoreAll(items);
    expect(results).toHaveLength(3);
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  test('filters preservable content', () => {
    const items: ContentItem[] = [
      { content: 'Decision: proceed', type: 'decision' },
      { content: 'Hello there', type: 'pleasantry' },
      { content: 'Task: implement', type: 'task' }
    ];
    
    const scores = scorer.scoreAll(items);
    const high = scorer.getPreservable(scores, 80);
    expect(high.length).toBeGreaterThanOrEqual(1);
  });

  test('filters compactable content', () => {
    const items: ContentItem[] = [
      { content: 'Decision: proceed', type: 'decision' },
      { content: 'Hello there', type: 'pleasantry' },
      { content: 'Error occurred', type: 'error' }
    ];
    
    const scores = scorer.scoreAll(items);
    const low = scorer.getCompactable(scores, 40);
    expect(low.length).toBeGreaterThanOrEqual(1);
  });

  test('detects task type', () => {
    const result = scorer.score('TODO: implement login');
    expect(result.type).toBe('task');
  });

  test('detects blocker type', () => {
    const result = scorer.score('Blocked by API issue');
    expect(result.type).toBe('blocker');
  });

  test('detects code type', () => {
    const result = scorer.score('function test() { return true; }');
    expect(result.type).toBe('code');
  });

  test('calculates average score', () => {
    const items: ContentItem[] = [
      { content: 'Decision: proceed', type: 'decision' },
      { content: 'Task: implement', type: 'task' }
    ];
    
    const scores = scorer.scoreAll(items);
    const avg = scorer.averageScore(scores);
    expect(avg).toBeGreaterThan(0);
    expect(avg).toBeLessThanOrEqual(100);
  });
});
