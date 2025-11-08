export const simplifyText = (text = "") => {
  if (!text.trim()) return "";
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/[.!?]\s*/)
    .filter(Boolean)
    .slice(0, 5);
  return sentences
    .map((s, i) => `• ${s.trim()}${i === sentences.length - 1 ? "." : ""}`)
    .join("\n");
};
