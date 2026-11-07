// All calls to the NestJS API. Shapes come from the backend code, not from
// guessing: people.service.ts, sites.service.ts, visits.service.ts.

export const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export interface Person {
  id: string
  name: string
}

export interface SiteSummary {
  address: string
  title: string
  author: { id: string; name: string }
}

export interface SearchResult {
  address: string
  title: string
  snippet: string
  score: number
}

export interface SitePage {
  address: string
  title: string
  html: string
  author: { id: string; name: string }
}

export type NavigateResult =
  | { found: true; site: SitePage }
  | { found: false; address: string }

export type Via = 'typed' | 'link' | 'search' | 'history' | 'publish'

export interface HistoryItem {
  id: string
  address: string
  title: string | null
  at: string
  via: Via
  found: boolean
}

export interface PublishResult {
  address: string
  title: string
  replaced: boolean
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

function errorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message?: unknown }).message
    if (typeof message === 'string') return message
    if (Array.isArray(message)) return message.join(' ')
  }
  return fallback
}

async function request<T>(
  path: string,
  init: RequestInit | undefined,
  signal: AbortSignal | undefined,
  fallback: string,
): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API}${path}`, { ...init, signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'The API did not answer. Check that it is running on port 4000.')
  }
  const body = await readBody(res)
  if (!res.ok) throw new ApiError(res.status, errorMessage(body, fallback))
  return body as T
}

export function listPeople(signal?: AbortSignal): Promise<Person[]> {
  return request<Person[]>('/people', undefined, signal, 'Could not load the people list.')
}

export function listSites(signal?: AbortSignal): Promise<SiteSummary[]> {
  return request<SiteSummary[]>('/sites', undefined, signal, 'Could not load the site list.')
}

export function searchSites(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  return request<SearchResult[]>(
    `/search?q=${encodeURIComponent(query)}`,
    undefined,
    signal,
    'Search did not work. Try again.',
  )
}

export function navigate(
  personId: string,
  address: string,
  via: Via,
  signal?: AbortSignal,
): Promise<NavigateResult> {
  return request<NavigateResult>(
    '/navigate',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ personId, address, via }),
    },
    signal,
    'That page could not be opened. Try again.',
  )
}

export function personHistory(
  personId: string,
  signal?: AbortSignal,
): Promise<HistoryItem[]> {
  return request<HistoryItem[]>(
    `/people/${encodeURIComponent(personId)}/history`,
    undefined,
    signal,
    'Could not load the history for this person.',
  )
}

export function publishSite(
  authorId: string,
  address: string,
  title: string,
  html: string,
  signal?: AbortSignal,
): Promise<PublishResult> {
  return request<PublishResult>(
    '/sites',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ authorId, address, title, html }),
    },
    signal,
    'Publishing did not work. Try again.',
  )
}
