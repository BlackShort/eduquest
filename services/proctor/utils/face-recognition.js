// Basic shape/type guard for embedding vectors.
function isValidEmbedding(embedding) {
  return (
    Array.isArray(embedding) &&
    embedding.length > 0 &&
    embedding.every((v) => typeof v === "number" && Number.isFinite(v))
  );
}

// Cosine similarity for same-length numeric vectors.
function cosineSimilarity(a, b) {
  if (!isValidEmbedding(a) || !isValidEmbedding(b)) {
    throw new Error("Invalid embedding vectors");
  }

  if (a.length !== b.length) {
    throw new Error("Embedding vectors must have same length");
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  // Return 0 instead of NaN when one vector has no magnitude.
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = {
  isValidEmbedding,
  cosineSimilarity,
};
