/**
 * Semantic Embeddings - Group semantically similar content
 *
 * Uses embedding-based similarity to identify related content
 * before compression decisions.
 */
import { ContentItem } from './types.js';
/**
 * Simple embedding generator (placeholder for actual embedding model)
 * In production, would use OpenAI embeddings or similar
 */
export declare function generateEmbedding(text: string): number[];
/**
 * Calculate cosine similarity between two embeddings
 */
export declare function cosineSimilarity(a: number[], b: number[]): number;
/**
 * Group semantically similar content
 */
export declare function groupBySemantic(items: ContentItem[], threshold?: number): ContentItem[][];
/**
 * Find duplicate or near-duplicate content
 */
export declare function findDuplicates(items: ContentItem[], threshold?: number): Map<number, number[]>;
/**
 * Semantic cluster - group related content for compression
 */
export interface SemanticCluster {
    centroid: string;
    items: ContentItem[];
    avgScore: number;
}
/**
 * Cluster content by semantic similarity
 */
export declare function clusterContent(items: ContentItem[], maxClusters?: number): SemanticCluster[];
//# sourceMappingURL=embeddings.d.ts.map