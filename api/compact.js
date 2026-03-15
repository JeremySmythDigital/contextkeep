/**
 * Token Compaction API - Standalone Handler
 * 
 * Simplified endpoint for Vercel serverless deployment
 */

// Simple token estimation
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

// Simple valance scoring
function getValanceScore(content, type) {
  const boostKeywords = ['decision', 'task', 'blocker', 'important', 'critical', 'error', 'fix', 'done', 'verified'];
  const reduceKeywords = ['pleasantry', 'greeting', 'thanks', 'bye', 'ok', 'sure', 'yes', 'no'];
  
  let score = 50; // Default score
  
  // Boost for important keywords
  for (const keyword of boostKeywords) {
    if (content.toLowerCase().includes(keyword)) {
      score += 15;
    }
  }
  
  // Reduce for low-value keywords
  for (const keyword of reduceKeywords) {
    if (content.toLowerCase().includes(keyword)) {
      score -= 10;
    }
  }
  
  // Boost for important types
  if (['decision', 'task', 'blocker', 'verification', 'code'].includes(type)) {
    score += 20;
  }
  
  return Math.min(100, Math.max(0, score));
}

// Compaction function
function compactItems(items, maxTokens = 200000) {
  const totalTokens = items.reduce((sum, item) => sum + estimateTokens(item.content || ''), 0);
  
  if (totalTokens <= maxTokens * 0.7) {
    return {
      needed: false,
      originalTokens: totalTokens,
      message: 'No compaction needed'
    };
  }
  
  // Score and sort items
  const scoredItems = items.map(item => ({
    ...item,
    score: getValanceScore(item.content || '', item.type),
    tokens: estimateTokens(item.content || '')
  }));
  
  // Sort by score descending
  scoredItems.sort((a, b) => b.score - a.score);
  
  // Preserve high-score items, summarize low-score items
  const preserved = [];
  const toCompact = [];
  let currentTokens = 0;
  const targetTokens = maxTokens * 0.6; // 60% target
  
  for (const item of scoredItems) {
    if (item.score >= 70) {
      preserved.push(item);
      currentTokens += item.tokens;
    } else if (currentTokens + item.tokens < targetTokens) {
      preserved.push(item);
      currentTokens += item.tokens;
    } else {
      toCompact.push(item);
    }
  }
  
  // Create summary for compacted items
  const summary = toCompact.length > 0 
    ? toCompact.map(i => i.content?.substring(0, 100)).join(' | ')
    : '';
  
  return {
    needed: true,
    originalTokens: totalTokens,
    compactedTokens: currentTokens + estimateTokens(summary),
    preserved: preserved.map(i => ({
      content: i.content,
      type: i.type,
      score: i.score
    })),
    compacted: {
      count: toCompact.length,
      summary: summary.substring(0, 500)
    },
    compressionRatio: ((totalTokens - currentTokens) / totalTokens).toFixed(2)
  };
}

module.exports = async function handler(req, res) {
  // Handle GET request - status check
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'token-compaction',
      version: '1.0.0',
      endpoints: {
        'GET /api/compact': 'Service status',
        'POST /api/compact': 'Compact context (body: { items: ContentItem[], maxTokens?: number })'
      }
    });
  }

  // Handle POST request - compaction
  if (req.method === 'POST') {
    try {
      const { items, maxTokens = 200000 } = req.body;

      if (!items || !Array.isArray(items)) {
        return res.status(400).json({
          error: 'Invalid request',
          message: 'items array is required'
        });
      }

      const result = compactItems(items, maxTokens);
      
      return res.status(200).json({
        status: 'success',
        ...result
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({
        error: 'Compaction failed',
        message: errorMessage
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    error: 'Method not allowed',
    allowedMethods: ['GET', 'POST']
  });
};