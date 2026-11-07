import { describe, expect, it } from 'vitest'
import {
  canGoBack,
  canGoForward,
  currentEntry,
  emptySession,
  goBack,
  goForward,
  pushEntry,
} from './session'
import type { PageEntry, SessionEntry } from './session'

function currentAddress(entry: SessionEntry | null): string | null {
  return entry && entry.kind === 'page' ? entry.address : null
}

function page(address: string): PageEntry {
  return {
    kind: 'page',
    address,
    title: address,
    html: `<h1>${address}</h1>`,
    authorName: null,
    found: true,
    scroll: 0,
  }
}

describe('session history', () => {
  it('starts empty with no back or forward', () => {
    const session = emptySession()
    expect(currentEntry(session)).toBeNull()
    expect(canGoBack(session)).toBe(false)
    expect(canGoForward(session)).toBe(false)
  })

  it('back and forward only move the pointer', () => {
    let session = pushEntry(emptySession(), page('start.zz'))
    session = pushEntry(session, page('tidepool.zz'))
    session = goBack(session)
    expect(currentAddress(currentEntry(session))).toBe('start.zz')
    expect(canGoForward(session)).toBe(true)
    session = goForward(session)
    expect(currentAddress(currentEntry(session))).toBe('tidepool.zz')
  })

  it('going back then opening a new page deletes the forward pages', () => {
    let session = pushEntry(emptySession(), page('start.zz'))
    session = pushEntry(session, page('tidepool.zz'))
    session = pushEntry(session, page('lighthouse.zz'))
    session = goBack(session)
    session = goBack(session)
    session = pushEntry(session, page('kettle.zz'))
    expect(session.entries.map((entry) => (entry.kind === 'page' ? entry.address : ''))).toEqual([
      'start.zz',
      'kettle.zz',
    ])
    expect(canGoForward(session)).toBe(false)
  })

  it('stays at the ends', () => {
    let session = pushEntry(emptySession(), page('start.zz'))
    session = goBack(session)
    expect(currentAddress(currentEntry(session))).toBe('start.zz')
    session = goForward(session)
    expect(currentAddress(currentEntry(session))).toBe('start.zz')
  })
})
