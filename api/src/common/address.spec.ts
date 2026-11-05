import { normalizeAddress } from './address.js';

describe('normalizeAddress', () => {
  it('lowercases, trims and strips trailing slashes', () => {
    expect(normalizeAddress('  Tidepool.ZZ/ ')).toBe('tidepool.zz');
  });

  it('accepts the web:// scheme and drops query and fragment', () => {
    expect(normalizeAddress('web://tidepool.zz')).toBe('tidepool.zz');
    expect(normalizeAddress('tidepool.zz#top')).toBe('tidepool.zz');
    expect(normalizeAddress('tidepool.zz?x=1')).toBe('tidepool.zz');
  });

  it('allows subdomains and hyphens', () => {
    expect(normalizeAddress('night-bus.city.zz')).toBe('night-bus.city.zz');
  });

  it('rejects things that cannot be addresses', () => {
    expect(normalizeAddress('http://example.com')).toBeNull();
    expect(normalizeAddress('javascript:alert(1)')).toBeNull();
    expect(normalizeAddress('tidepool')).toBeNull();
    expect(normalizeAddress('tidepool.zz/tides')).toBeNull();
    expect(normalizeAddress('-bad-.zz')).toBeNull();
    expect(normalizeAddress('')).toBeNull();
    expect(normalizeAddress(42)).toBeNull();
  });
});
