export function riskFromProbabilityPercent(probPercent) {
  const p = Number(probPercent);
  if (!Number.isFinite(p)) return null;

  const clamped = Math.min(100, Math.max(0, p));

  // Thresholds (0-100):
  // - 0–24   Low
  // - 25–49  Moderate
  // - 50–74  High
  // - 75–100 Critical
  if (clamped < 25) return "Low";
  if (clamped < 50) return "Moderate";
  if (clamped < 75) return "High";
  return "Critical";
}

