import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { SearchResult } from '../api'
import type { SessionEntry } from '../session'

interface Props {
  entry: SessionEntry | null
  loading: boolean
  scrollRef: RefObject<number>
  onOpenResult: (address: string) => void
  onOpenLink: (href: string) => void
  onOpenStart: () => void
}

function Skeleton() {
  return (
    <div aria-label="Loading page" className="flex flex-col gap-4 p-6 sm:p-8">
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-[#272727]" />
      <div className="h-4 w-full animate-pulse rounded bg-[#272727]" />
      <div className="h-4 w-full animate-pulse rounded bg-[#272727]" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-[#272727]" />
      <div className="h-4 w-full animate-pulse rounded bg-[#272727]" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-[#272727]" />
    </div>
  )
}

function ResultList({
  results,
  onOpenResult,
}: {
  results: SearchResult[]
  onOpenResult: (address: string) => void
}) {
  if (results.length === 0) {
    return (
      <p className="body-3 p-6 text-[#b3b3b3] sm:p-8">
        Nothing matched that search. Try another word from a page, for example fog.
      </p>
    )
  }
  return (
    <ul className="flex flex-col">
      {results.map((result) => (
        <li key={result.address} className="border-b border-[#313131] last:border-b-0">
          <button
            type="button"
            onClick={() => onOpenResult(result.address)}
            className="motion-base block w-full rounded-lg p-4 text-left transition-colors duration-300 hover:bg-[#1f1f1f] focus-visible:outline-2 focus-visible:outline-white sm:p-6"
          >
            <span className="title-2 block text-white">{result.title}</span>
            <span className="caption-4 mt-2 block text-[#8a8a8a]">
              {result.address} · Score {result.score.toFixed(3)}
            </span>
            <span className="body-6 mt-2 block text-[#b3b3b3]">{result.snippet}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export function PageView({ entry, loading, scrollRef, onOpenResult, onOpenLink, onOpenStart }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)

  // Restore the scroll position this entry had when it was left.
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    box.scrollTop = entry ? entry.scroll : 0
    scrollRef.current = entry ? entry.scroll : 0
  }, [entry, scrollRef])

  if (loading) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[#313131] bg-[#181818]">
        <Skeleton />
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-start justify-center gap-4 overflow-y-auto rounded-2xl border border-[#313131] bg-[#181818] p-6 sm:p-8">
        <h2 className="heading-5 text-white">Start with a page</h2>
        <p className="body-3 max-w-xl text-[#b3b3b3]">
          Pick a person above, then type an address or open the start page. Every page
          here lives at an address that ends in .zz.
        </p>
        <button
          type="button"
          onClick={onOpenStart}
          className="motion-base rounded-lg bg-white px-3 py-2 text-base font-semibold text-black transition-all duration-300 hover:bg-[#e6e6e6] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white"
        >
          Open start.zz
        </button>
        <p className="caption-2 text-[#8a8a8a]">
          Try searching for fog, or opening tidepool.zz and following a link from it.
        </p>
      </div>
    )
  }

  if (entry.kind === 'search') {
    return (
      <div
        ref={boxRef}
        onScroll={(event) => {
          scrollRef.current = event.currentTarget.scrollTop
        }}
        className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[#313131] bg-[#181818]"
      >
        <div className="border-b border-[#313131] p-4 sm:p-6">
          <h2 className="heading-6 text-white">Search results</h2>
          <p className="body-6 mt-2 text-[#b3b3b3]">
            Results for {entry.query}. Going back brings you to this same list.
          </p>
        </div>
        <ResultList results={entry.results} onOpenResult={onOpenResult} />
      </div>
    )
  }

  if (!entry.found) {
    return (
      <div
        ref={boxRef}
        onScroll={(event) => {
          scrollRef.current = event.currentTarget.scrollTop
        }}
        className="flex min-h-0 flex-1 flex-col items-start justify-center gap-4 overflow-y-auto rounded-2xl border border-[#313131] bg-[#181818] p-6 sm:p-8"
      >
        <h2 className="heading-5 text-white">No page at {entry.address}</h2>
        <p className="body-3 max-w-xl text-[#b3b3b3]">
          That address does not exist yet. It is still saved in history, and someone
          can publish a page there later.
        </p>
        <button
          type="button"
          onClick={onOpenStart}
          className="motion-base rounded-lg bg-white px-3 py-2 text-base font-semibold text-black transition-all duration-300 hover:bg-[#e6e6e6] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white"
        >
          Open start.zz
        </button>
      </div>
    )
  }

  return (
    <div
      ref={boxRef}
      onScroll={(event) => {
        scrollRef.current = event.currentTarget.scrollTop
      }}
      className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[#313131] bg-[#181818]"
    >
      <div className="border-b border-[#313131] p-4 sm:p-6">
        <h2 className="heading-6 text-white">{entry.title ?? entry.address}</h2>
        <p className="caption-4 mt-2 text-[#8a8a8a]">
          {entry.address}
          {entry.authorName ? ` · Written by ${entry.authorName}` : ''}
        </p>
      </div>
      <div className="p-4 sm:p-6">
        <div
          className="site-page"
          onClick={(event) => {
            const target = event.target as HTMLElement
            const link = target.closest('a')
            if (!link) return
            event.preventDefault()
            const href = link.getAttribute('href')
            if (href) onOpenLink(href)
          }}
          dangerouslySetInnerHTML={{ __html: entry.html ?? '' }}
        />
      </div>
    </div>
  )
}
