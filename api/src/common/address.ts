// An address is how a page is asked for and how it is linked to.
// In this small web every address is a host name ending in ".zz", like "tidepool.zz".
// There are no paths, queries or fragments: one site = one address = one page.

const SCHEME = /^[a-z][a-z0-9+.-]*:\/\//;
const ADDRESS = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+zz$/;

/**
 * Turns whatever a person typed (or a link contained) into the one canonical
 * form of an address, or returns null if it cannot be an address at all.
 *
 *   " Tidepool.ZZ/ "      -> "tidepool.zz"
 *   "web://tidepool.zz"   -> "tidepool.zz"
 *   "tidepool.zz#top"     -> "tidepool.zz"
 *   "http://example.com"  -> null   (no real network)
 *   "javascript:alert(1)" -> null
 *
 * Every place that compares or stores addresses MUST go through this function.
 */
export function normalizeAddress(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  let address = input.trim().toLowerCase();
  address = address.replace(SCHEME, '');
  address = address.split(/[?#]/)[0];
  address = address.replace(/\/+$/, '');
  return ADDRESS.test(address) ? address : null;
}
