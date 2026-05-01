// Interface representing the structured explanation of a task's priority.
export interface PriorityExplanation {
  score: number;
  reasons: string[];
}

/**
 * Calculates the raw priority score based on business impact and technical effort.
 * Formula: (Impact * 2) / Effort.
 * Impact is weighted more heavily to prioritize value delivery.
 */
export function calculatePriorityScore(impact: number, effort: number): number {
  if (effort <= 0) return impact * 2;
  const score = (impact * 2) / effort;
  return Math.round(score * 100) / 100;
}

/**
 * Generates a human-readable explanation for the calculated priority score.
 * Used for the "Explainability" feature in the UI.
 */
export function explainPriority(impact: number, effort: number): PriorityExplanation {
  const score = calculatePriorityScore(impact, effort);
  const reasons: string[] = [];

  if (impact >= 4) {
    reasons.push('High strategic impact: This task provides significant business value.');
  }
  if (effort <= 2) {
    reasons.push('Quick Win: Low technical effort required for completion.');
  }
  if (impact > effort) {
    reasons.push('High ROI: The expected benefit outweighs the implementation cost.');
  }
  if (effort >= 4) {
    reasons.push('Complex task: High effort required, consider breaking it down into smaller sub-tasks.');
  }
  if (reasons.length === 0) {
    reasons.push('Standard priority: Balanced impact and effort ratio.');
  }

  return { score, reasons };
}