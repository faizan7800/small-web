// Session history: a list plus a pointer, kept in the browser, one list per
// person. Back and forward only move the pointer. They are not visits, so
// they never call the API. Going back and then opening a new page deletes
// everything after the pointer, so the old forward pages are lost.

import type { SearchResult } from './api'

export interface PageEntry {
  kind: 'page'
  address: string
  title: string | null
  html: string | null
  authorName: string | null
  found: boolean
  scroll: number
}

export interface SearchEntry {
  kind: 'search'
  query: string
  results: SearchResult[]
  scroll: number
}

export type SessionEntry = PageEntry | SearchEntry

export interface Session {
  entries: SessionEntry[]
  index: number
}

export function emptySession(): Session {
  return { entries: [], index: -1 }
}

export function currentEntry(session: Session): SessionEntry | null {
  if (session.index < 0 || session.index >= session.entries.length) return null
  return session.entries[session.index]
}

export function canGoBack(session: Session): boolean {
  return session.index > 0
}

export function canGoForward(session: Session): boolean {
  return session.index >= 0 && session.index < session.entries.length - 1
}

// Add a new entry. Everything after the pointer is deleted first.
export function pushEntry(session: Session, entry: SessionEntry): Session {
  const kept = session.entries.slice(0, session.index + 1)
  const entries = [...kept, entry]
  return { entries, index: entries.length - 1 }
}

export function goBack(session: Session): Session {
  if (!canGoBack(session)) return session
  return { ...session, index: session.index - 1 }
}

export function goForward(session: Session): Session {
  if (!canGoForward(session)) return session
  return { ...session, index: session.index + 1 }
}

export function saveScroll(session: Session, scroll: number): Session {
  const entry = currentEntry(session)
  if (!entry) return session
  const entries = session.entries.slice()
  entries[session.index] = { ...entry, scroll }
  return { ...session, entries }
}
