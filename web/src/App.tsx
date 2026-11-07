import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ApiError,
  listPeople,
  listSites,
  navigate,
  personHistory,
  publishSite,
  searchSites,
} from './api'
import type { HistoryItem, Person, SearchResult, SiteSummary, Via } from './api'
import { normalizeAddress } from './normalize'
import {
  canGoBack,
  canGoForward,
  currentEntry,
  emptySession,
  goBack,
  goForward,
  pushEntry,
  saveScroll,
} from './session'
import type { Session } from './session'
import { AddressBar } from './components/AddressBar'
import { DirectoryPanel } from './components/DirectoryPanel'
import { HistoryPanel } from './components/HistoryPanel'
import { PageView } from './components/PageView'
import { PersonPicker } from './components/PersonPicker'
import { PublishForm } from './components/PublishForm'
import { SearchPanel } from './components/SearchPanel'

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function messageOf(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message || fallback
  return fallback
}

export default function App() {
  const [people, setPeople] = useState<Person[]>([])
  const [peopleLoading, setPeopleLoading] = useState(true)
  const [peopleError, setPeopleError] = useState<string | null>(null)
  const [personId, setPersonId] = useState<string | null>(null)

  const [sites, setSites] = useState<SiteSummary[]>([])
  const [sitesLoading, setSitesLoading] = useState(true)
  const [sitesError, setSitesError] = useState<string | null>(null)

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)

  const [session, setSession] = useState<Session>(emptySession)
  const [pageLoading, setPageLoading] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null)

  const navigateAbort = useRef<AbortController | null>(null)
  const searchAbort = useRef<AbortController | null>(null)
  const historyAbort = useRef<AbortController | null>(null)
  const scrollRef = useRef(0)

  const entry = currentEntry(session)
  const person = people.find((p) => p.id === personId) ?? null

  const loadSites = useCallback(async () => {
    setSitesLoading(true)
    setSitesError(null)
    try {
      setSites(await listSites())
    } catch (error) {
      if (!isAbort(error)) setSitesError(messageOf(error, 'Could not load the site list.'))
    } finally {
      setSitesLoading(false)
    }
  }, [])

  const loadHistory = useCallback(async (id: string) => {
    historyAbort.current?.abort()
    const controller = new AbortController()
    historyAbort.current = controller
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      setHistoryItems(await personHistory(id, controller.signal))
    } catch (error) {
      if (!isAbort(error)) {
        setHistoryError(messageOf(error, 'Could not load the history for this person.'))
      }
    } finally {
      if (historyAbort.current === controller) setHistoryLoading(false)
    }
  }, [])

  // People and the site directory load once, when the app opens.
  useEffect(() => {
    const controller = new AbortController()
    setPeopleLoading(true)
    setPeopleError(null)
    listPeople(controller.signal)
      .then((rows) => {
        setPeople(rows)
        if (rows.length > 0) setPersonId(rows[0].id)
      })
      .catch((error: unknown) => {
        if (!isAbort(error)) {
          setPeopleError(messageOf(error, 'Could not load the people list.'))
        }
      })
      .finally(() => setPeopleLoading(false))
    loadSites()
    return () => controller.abort()
  }, [loadSites])

  // Changing person starts a fresh session and loads that person's history.
  useEffect(() => {
    if (!personId) return
    setSession(emptySession())
    setSearchResults([])
    setSearchError(null)
    setPageError(null)
    setPublishError(null)
    setPublishSuccess(null)
    scrollRef.current = 0
    loadHistory(personId)
  }, [personId, loadHistory])

  function openAddress(rawAddress: string, via: Via) {
    if (!personId) return
    const address = normalizeAddress(rawAddress)
    if (!address) {
      // Invalid typed addresses and bad links never reach the API.
      if (via === 'typed') {
        setPageError('That is not an address. Use a name that ends in .zz, for example tidepool.zz.')
      }
      return
    }
    // A slow request that is still running must not overwrite a newer one.
    navigateAbort.current?.abort()
    const controller = new AbortController()
    navigateAbort.current = controller
    setPageLoading(true)
    setPageError(null)
    navigate(personId, address, via, controller.signal)
      .then((result) => {
        const saved = saveScroll(session, scrollRef.current)
        if (result.found) {
          setSession(
            pushEntry(saved, {
              kind: 'page',
              address: result.site.address,
              title: result.site.title,
              html: result.site.html,
              authorName: result.site.author.name,
              found: true,
              scroll: 0,
            }),
          )
        } else {
          setSession(
            pushEntry(saved, {
              kind: 'page',
              address: result.address,
              title: null,
              html: null,
              authorName: null,
              found: false,
              scroll: 0,
            }),
          )
        }
        scrollRef.current = 0
        loadHistory(personId)
      })
      .catch((error: unknown) => {
        if (!isAbort(error)) setPageError(messageOf(error, 'That page could not be opened. Try again.'))
      })
      .finally(() => {
        if (navigateAbort.current === controller) setPageLoading(false)
      })
  }

  function runSearch(query: string) {
    if (!personId) return
    searchAbort.current?.abort()
    const controller = new AbortController()
    searchAbort.current = controller
    setSearchLoading(true)
    setSearchError(null)
    searchSites(query, controller.signal)
      .then((results) => {
        setSearchResults(results)
        const saved = saveScroll(session, scrollRef.current)
        setSession(pushEntry(saved, { kind: 'search', query, results, scroll: 0 }))
        scrollRef.current = 0
      })
      .catch((error: unknown) => {
        if (!isAbort(error)) setSearchError(messageOf(error, 'Search did not work. Try again.'))
      })
      .finally(() => {
        if (searchAbort.current === controller) setSearchLoading(false)
      })
  }

  function moveSession(direction: 'back' | 'forward') {
    const saved = saveScroll(session, scrollRef.current)
    const next = direction === 'back' ? goBack(saved) : goForward(saved)
    if (next === saved) return
    setSession(next)
    setPageError(null)
    scrollRef.current = 0
    const nextEntry = currentEntry(next)
    if (nextEntry && nextEntry.kind === 'search') setSearchResults(nextEntry.results)
  }

  function publish(address: string, title: string, html: string) {
    if (!personId) return
    setPublishing(true)
    setPublishError(null)
    setPublishSuccess(null)
    publishSite(personId, address, title, html)
      .then((result) => {
        setPublishSuccess(
          result.replaced
            ? `Published ${result.address}. Your page there was replaced.`
            : `Published ${result.address}.`,
        )
        loadSites()
        openAddress(result.address, 'publish')
      })
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 409) {
          setPublishError(
            `${address} already belongs to someone else. Pick a different address, or choose that person above to edit it.`,
          )
        } else if (!isAbort(error)) {
          setPublishError(messageOf(error, 'Publishing did not work. Try again.'))
        }
      })
      .finally(() => setPublishing(false))
  }

  const currentAddress = entry && entry.kind === 'page' ? entry.address : ''

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <a
        href="#page-view"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to page
      </a>

      <header className="border-b border-[#313131] bg-[#181818]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <h1 className="heading-5 text-white">Small Web</h1>
            <p className="body-3 max-w-xl text-[#b3b3b3]">
              A small browser inside a web page. Pick a person, type an address that
              ends in .zz, and browse the pages people have published.
            </p>
          </div>
          {peopleError ? (
            <p role="alert" className="body-6 rounded-lg border border-[#313131] bg-[#1f1f1f] p-3 text-white">
              {peopleError}{' '}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="font-semibold underline underline-offset-4"
              >
                Try again
              </button>
            </p>
          ) : (
            <div className="w-full sm:max-w-80">
              <PersonPicker
                people={people}
                personId={personId}
                onChange={setPersonId}
                disabled={peopleLoading}
              />
            </div>
          )}
          <AddressBar
            address={currentAddress}
            canBack={canGoBack(session)}
            canForward={canGoForward(session)}
            onBack={() => moveSession('back')}
            onForward={() => moveSession('forward')}
            onGo={(raw) => openAddress(raw, 'typed')}
            disabled={!personId}
          />
          {pageError ? (
            <p role="alert" className="body-6 rounded-lg border border-[#313131] bg-[#1f1f1f] p-3 text-white">
              {pageError}
            </p>
          ) : null}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div id="page-view" className="flex min-h-80 flex-col">
          <PageView
            entry={entry}
            loading={pageLoading}
            scrollRef={scrollRef}
            onOpenResult={(address) => openAddress(address, 'search')}
            onOpenLink={(href) => openAddress(href, 'link')}
            onOpenStart={() => openAddress('start.zz', 'typed')}
          />
        </div>

        <aside className="flex flex-col gap-6">
          <SearchPanel
            results={searchResults}
            loading={searchLoading}
            error={searchError}
            onSearch={runSearch}
            onOpenResult={(address) => openAddress(address, 'search')}
            disabled={!personId}
          />
          <HistoryPanel
            items={historyItems}
            loading={historyLoading}
            error={historyError}
            onOpen={(address) => openAddress(address, 'history')}
            disabled={!personId}
          />
          <DirectoryPanel
            sites={sites}
            loading={sitesLoading}
            error={sitesError}
            onOpen={(address) => openAddress(address, 'link')}
            disabled={!personId}
          />
          <PublishForm
            personName={person ? person.name : null}
            publishing={publishing}
            error={publishError}
            success={publishSuccess}
            onPublish={publish}
            disabled={!personId}
          />
        </aside>
      </main>

      <footer className="border-t border-[#313131] bg-[#181818]">
        <p className="caption-2 mx-auto w-full max-w-6xl p-4 text-[#8a8a8a] sm:p-6">
          Small Web talks to the API at localhost:4000. Back and forward stay in this
          browser and are not recorded as visits.
        </p>
      </footer>
    </div>
  )
}
