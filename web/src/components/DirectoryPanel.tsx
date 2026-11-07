import type { SiteSummary } from '../api'

interface Props {
  sites: SiteSummary[]
  loading: boolean
  error: string | null
  onOpen: (address: string) => void
  disabled: boolean
}

export function DirectoryPanel({ sites, loading, error, onOpen, disabled }: Props) {
  return (
    <section aria-label="All pages" className="flex flex-col gap-4 rounded-2xl border border-[#313131] bg-[#181818] p-4">
      <h2 className="title-3 text-white">All pages</h2>
      {error ? (
        <p role="alert" className="body-6 rounded-lg border border-[#313131] bg-[#1f1f1f] p-3 text-white">
          {error}
        </p>
      ) : null}
      {loading ? (
        <div aria-label="Loading pages" className="flex flex-col gap-4">
          <div className="h-4 w-full animate-pulse rounded bg-[#272727]" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-[#272727]" />
          <div className="h-4 w-full animate-pulse rounded bg-[#272727]" />
        </div>
      ) : sites.length === 0 ? (
        <p className="body-6 text-[#8a8a8a]">No pages yet. Publish the first one below.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sites.map((site) => (
            <li key={site.address}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onOpen(site.address)}
                className="motion-base block w-full rounded-lg border border-[#313131] bg-[#1f1f1f] p-3 text-left transition-colors duration-300 hover:bg-[#272727] focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="title-4 block text-white">{site.title}</span>
                <span className="caption-5 mt-2 block text-[#8a8a8a]">
                  {site.address} · {site.author.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
