// Mirror of api/src/common/address.ts. One address is one host name ending
// in .zz, with no paths, queries or fragments. Every place that compares or
// stores an address must go through this function, so typing, links and
// history all agree on the same page.

const SCHEME = /^[a-z][a-z0-9+.-]*:\/\//
const ADDRESS = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+zz$/

export function normalizeAddress(input: unknown): string | null {
  if (typeof input !== 'string') return null
  let address = input.trim().toLowerCase()
  address = address.replace(SCHEME, '')
  address = address.split(/[?#]/)[0]
  address = address.replace(/\/+$/, '')
  return ADDRESS.test(address) ? address : null
}
