/**
 * Semantic Embeddings - Group semantically similar content
 *
 * Uses embedding-based similarity to identify related content
 * before compression decisions.
 */
/**
 * Simple embedding generator (placeholder for actual embedding model)
 * In production, would use OpenAI embeddings or similar
 */
export function generateEmbedding(text) {
    // Simple hash-based pseudo-embedding
    // In production, use: OpenAI text-embedding-3-small or similar
    const dimensions = 128;
    const embedding = new Array(dimensions).fill(0);
    const words = text.toLowerCase().split(/\s+/);
    for (const word of words) {
        const hash = hashWord(word);
        for (let i = 0; i < dimensions; i++) {
            embedding[i] += Math.sin(hash * (i + 1)) * 0.1;
        }
    }
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
    return embedding.map(v => v / (magnitude || 1));
}
/**
 * Hash a word to a number
 */
function hashWord(word) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash) + word.charCodeAt(i);
        hash = hash & hash;
    }
    return hash;
}
/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a, b) {
    if (a.length !== b.length)
        return 0;
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        magnitudeA += a[i] * a[i];
        magnitudeB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}
/**
 * Group semantically similar content
 */
export function groupBySemantic(items, threshold = 0.8) {
    const groups = [];
    const groupEmbeddings = [];
    for (const item of items) {
        const embedding = generateEmbedding(item.content);
        // Find best matching group
        let bestGroup = -1;
        let bestSimilarity = threshold;
        for (let i = 0; i < groupEmbeddings.length; i++) {
            const similarity = cosineSimilarity(embedding, groupEmbeddings[i]);
            if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestGroup = i;
            }
        }
        if (bestGroup >= 0) {
            groups[bestGroup].push(item);
        }
        else {
            groups.push([item]);
            groupEmbeddings.push(embedding);
        }
    }
    return groups;
}
/**
 * Find duplicate or near-duplicate content
 */
export function findDuplicates(items, threshold = 0.95) {
    const duplicates = new Map();
    const embeddings = items.map(i => generateEmbedding(i.content));
    for (let i = 0; i < items.length; i++) {
        const similar = [];
        for (let j = i + 1; j < items.length; j++) {
            if (cosineSimilarity(embeddings[i], embeddings[j]) > threshold) {
                similar.push(j);
            }
        }
        if (similar.length > 0) {
            duplicates.set(i, similar);
        }
    }
    return duplicates;
}
/**
 * Cluster content by semantic similarity
 */
export function clusterContent(items, maxClusters = 10) {
    if (items.length === 0)
        return [];
    const groups = groupBySemantic(items);
    const clusters = [];
    for (const group of groups) {
        if (group.length === 0)
            continue;
        // Find centroid (item closest to average embedding)
        const embeddings = group.map(i => generateEmbedding(i.content));
        const avgEmbedding = embeddings[0].map((_, i) => embeddings.reduce((sum, e) => sum + e[i], 0) / embeddings.length);
        let bestIdx = 0;
        let bestSim = 0;
        for (let i = 0; i < embeddings.length; i++) {
            const sim = cosineSimilarity(embeddings[i], avgEmbedding);
            if (sim > bestSim) {
                bestSim = sim;
                bestIdx = i;
            }
        }
        clusters.push({
            centroid: group[bestIdx].content,
            items: group,
            avgScore: 0, // Would be filled by scorer
        });
    }
    // Limit to max clusters, keeping largest groups
    return clusters
        .sort((a, b) => b.items.length - a.items.length)
        .slice(0, maxClusters);
}
//# sourceMappingURL=embeddings.js.map