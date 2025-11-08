export const extractHighlights = (text = "") => {
  const rules = [
    { key: "Refund", match: /refund|non-refundable/i, tip: "Refund policy found." },
    { key: "Termination", match: /terminate|termination/i, tip: "Termination clause present." },
    { key: "Liability", match: /liabilit(y|ies)/i, tip: "Liability terms detected." },
    { key: "Dispute", match: /arbitration|dispute|jurisdiction/i, tip: "Dispute resolution mentioned." },
    { key: "Privacy", match: /privacy|data|personal information/i, tip: "Privacy/data clause exists." },
  ];
  return rules
    .filter((r) => r.match.test(text))
    .map((r) => ({ title: r.key, note: r.tip }));
};
