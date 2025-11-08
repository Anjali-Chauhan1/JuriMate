export const calculateRisk = (text = "") => {
  const t = text.toLowerCase();
  const redFlags = ["non-refundable", "penalty", "termination", "indemnify", "waiver", "binding", "arbitration"];
  let score = 10;
  redFlags.forEach((w) => {
    if (t.includes(w)) score += 12;
  });
  score = Math.min(100, score);
  return score;
};
