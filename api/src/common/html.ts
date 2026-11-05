import sanitizeHtml from 'sanitize-html';

// Pages are written by strangers and shown inside our own interface, so we do
// not "escape bad things" - we only ALLOW a small list of good things.
//
// What this costs authors: no scripts, no inline styles or <style>, no images,
// no iframes/forms/embeds, no ids/classes. They can still write headings,
// paragraphs, lists, quotes, code, tables and links to other addresses.
//
// Why that is enough to contain a page: without scripts, event attributes or
// any CSS, a page cannot run code, cannot position itself over the address
// bar, and cannot send anyone to the real internet.
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'p', 'a', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i',
  'blockquote', 'code', 'pre', 'br', 'hr', 'small', 'span', 'div', 'section',
  'article', 'header', 'footer', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

export function sanitizeSiteHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ['href', 'title'] },
    // A link may be "kettle.zz" (no scheme) or "web://kettle.zz". Any other
    // scheme - javascript:, data:, http:, https: - is removed.
    allowedSchemes: ['web'],
    allowProtocolRelative: false,
  });
}

const ENTITIES: Array<[RegExp, string]> = [
  [/&lt;/g, '<'],
  [/&gt;/g, '>'],
  [/&quot;/g, '"'],
  [/&#39;|&#x27;/g, "'"],
  [/&amp;/g, '&'], // always last
];

/**
 * Plain text of ALREADY-SANITIZED html, used for search. We search the words
 * people read, not the markup, so searching "div" does not match every page.
 * Tags become spaces so "</p><p>" does not glue two words together.
 */
export function htmlToText(cleanHtml: string): string {
  let text = cleanHtml.replace(/<[^>]*>/g, ' ');
  for (const [pattern, replacement] of ENTITIES) text = text.replace(pattern, replacement);
  return text.replace(/\s+/g, ' ').trim();
}
