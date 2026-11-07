import { useState } from 'react'
import type { SearchResult } from '../api'

interface Props {
  results: SearchResult[]
  loading: boolean
  error: string | null
  onSearch: (query: string) => void
  onOpenResult: (address: string) => void
  disabled: boolean
}

export function SearchPanel({ results, loading, error, onSearch, onOpenResult, disabled }: Props) {
  const [query, setQuery] = useState('')

  return (
    <section aria-label="Search" className="flex flex-col gap-4 rounded-2xl border border-[#313131] bg-[#181818] p-4">
      <h2 className="title-3 text-white">Search</h2>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          if (query.trim()) onSearch(query.trim())
        }}
      >
        <label className="sr-only" htmlFor="search-box">
          Search the small web
        </label>
        <input
          id="search-box"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search, for example fog"
          disabled={disabled}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-lg border border-[#313131] bg-[#1f1f1f] px-3 py-2 text-sm font-medium text-white outline-none placeholder:text-[#8a8a8a] focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !query.trim()}
          className="motion-base shrink-0 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#e6e6e6] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search
        </button>
      </form>
      {error ? (
        <p role="alert" className="body-6 rounded-lg border border-[#313131] bg-[#1f1f1f] p-3 text-white">
          {error}
        </p>
      ) : null}
      {loading ? (
        <div aria-label="Loading search results" className="flex flex-col gap-4">
          <div className="h-4 w-full animate-pulse rounded bg-[#272727]" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-[#272727]" />
          <div className="h-4 w-full animate-pulse rounded bg-[#272727]" />
        </div>
      ) : results.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {results.map((result) => (
            <li key={result.address}>
              <button
                type="button"
                onClick={() => onOpenResult(result.address)}
                className="motion-base block w-full rounded-lg border border-[#313131] bg-[#1f1f1f] p-3 text-left transition-colors duration-300 hover:bg-[#272727] focus-visible:outline-2 focus-visible:outline-white"
              >
                <span className="title-4 block text-white">{result.title}</span>
                <span className="caption-5 mt-2 block text-[#8a8a8a]">{result.address}</span>
                <span className="body-6 mt-2 block text-[#b3b3b3]">{result.snippet}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="body-6 text-[#8a8a8a]">
          Search looks at the words on each page, not the code behind it.
        </p>
      )}
    </section>
  )
}
