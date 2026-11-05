import { htmlToText, sanitizeSiteHtml } from './html.js';

describe('sanitizeSiteHtml', () => {
  it('removes scripts together with their contents', () => {
    expect(sanitizeSiteHtml('<p>hi</p><script>alert(1)</script>')).toBe('<p>hi</p>');
  });

  it('removes event handler attributes and inline styles', () => {
    const out = sanitizeSiteHtml('<a href="kettle.zz" onclick="evil()" style="position:fixed">x</a>');
    expect(out).toBe('<a href="kettle.zz">x</a>');
  });

  it('removes javascript:, data: and http(s): links but keeps the text', () => {
    expect(sanitizeSiteHtml('<a href="javascript:alert(1)">x</a>')).toBe('<a>x</a>');
    expect(sanitizeSiteHtml('<a href="data:text/html,hi">x</a>')).toBe('<a>x</a>');
    expect(sanitizeSiteHtml('<a href="https://example.com">x</a>')).toBe('<a>x</a>');
    expect(sanitizeSiteHtml('<a href="//example.com">x</a>')).toBe('<a>x</a>');
  });

  it('keeps bare-address and web:// links', () => {
    expect(sanitizeSiteHtml('<a href="kettle.zz">k</a>')).toBe('<a href="kettle.zz">k</a>');
    expect(sanitizeSiteHtml('<a href="web://kettle.zz">k</a>')).toBe('<a href="web://kettle.zz">k</a>');
  });

  it('drops elements that could escape the page', () => {
    for (const dirty of [
      '<iframe src="x"></iframe>',
      '<img src=x onerror=alert(1)>',
      '<form action="x"><input></form>',
      '<style>body{display:none}</style>',
      '<svg onload=alert(1)></svg>',
      '<meta http-equiv="refresh" content="0;url=x">',
    ]) {
      expect(sanitizeSiteHtml(dirty)).not.toMatch(/<(iframe|img|form|input|style|svg|meta)/i);
    }
  });
});

describe('htmlToText', () => {
  it('strips tags without gluing words together', () => {
    expect(htmlToText('<h1>Tide</h1><p>Low  water</p>')).toBe('Tide Low water');
  });

  it('decodes entities so people can search for what they read', () => {
    expect(htmlToText('<p>salt &amp; pepper &lt;3</p>')).toBe('salt & pepper <3');
  });
});
