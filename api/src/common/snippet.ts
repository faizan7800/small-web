// A short piece of page text around the first place a search word appears.
export function makeSnippet(text: string, query: string, width = 160): string {
  const lower = text.toLowerCase();
  let first = -1;
  for (const term of query.toLowerCase().split(/[^\p{L}\p{N}]+/u)) {
    if (term.length < 2) continue;
    const at = lower.indexOf(term);
    if (at !== -1 && (first === -1 || at < first)) first = at;
  }
  if (first === -1) return text.length > width ? text.slice(0, width).trim() + '…' : text;
  const start = Math.max(0, first - 50);
  const end = Math.min(text.length, start + width);
  return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
}
