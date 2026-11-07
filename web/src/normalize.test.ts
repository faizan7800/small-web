import { describe, expect, it } from 'vitest'
import { normalizeAddress } from './normalize'

describe('normalizeAddress', () => {
  it('lowercases and strips a trailing slash', () => {
    expect(normalizeAddress(' Tidepool.ZZ/ ')).toBe('tidepool.zz')
  })

  it('strips a scheme', () => {
    expect(normalizeAddress('web://tidepool.zz')).toBe('tidepool.zz')
    expect(normalizeAddress('http://tidepool.zz')).toBe('tidepool.zz')
  })

  it('strips a fragment and a query', () => {
    expect(normalizeAddress('tidepool.zz#top')).toBe('tidepool.zz')
    expect(normalizeAddress('tidepool.zz?x=1')).toBe('tidepool.zz')
  })

  it('rejects a path', () => {
    expect(normalizeAddress('tidepool.zz/tides')).toBeNull()
  })

  it('rejects a real world host and a javascript link', () => {
    expect(normalizeAddress('http://example.com')).toBeNull()
    expect(normalizeAddress('javascript:alert(1)')).toBeNull()
  })

  it('rejects empty and non string input', () => {
    expect(normalizeAddress('')).toBeNull()
    expect(normalizeAddress(null)).toBeNull()
    expect(normalizeAddress(42)).toBeNull()
  })
})
