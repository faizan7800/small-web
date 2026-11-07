import type { HistoryItem } from '../api'

interface Props {
  items: HistoryItem[]
  loading: boolean
  error: string | null
  onOpen: (address: string) => void
  disabled: boolean
}

function when(at: string): string {
  const date = new Date(at)
  if (Number.isNaN(date.getTime())) return at
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function HistoryPanel({ items, loading, error, onOpen, disabled }: Props) {
  return (
    <section aria-label="History" className="flex flex-col gap-4 rounded-2xl border border-[#313131] bg-[#181818] p-4">
      <h2 className="title-3 text-white">History</h2>
      {error ? (
        <p role="alert" className="body-6 rounded-lg border border-[#313131] bg-[#1f1f1f] p-3 text-white">
          {error}
        </p>
      ) : null}
      {loading ? (
        <div aria-label="Loading history" className="flex flex-col gap-4">
          <div className="h-4 w-full animate-pulse rounded bg-[#272727]" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-[#272727]" />
          <div className="h-4 w-full animate-pulse rounded bg-[#272727]" />
        </div>
      ) : items.length === 0 ? (
        <p className="body-6 text-[#8a8a8a]">
          No visits yet for this person. Open a page and it will show up here.
        </p>
      ) : (
        <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onOpen(item.address)}
                className="motion-base block w-full rounded-lg border border-[#313131] bg-[#1f1f1f] p-3 text-left transition-colors duration-300 hover:bg-[#272727] focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="title-4 block text-white">
                  {item.title ?? item.address}
                </span>
                <span className="caption-5 mt-2 block text-[#8a8a8a]">
                  {item.address} · {item.via} · {when(item.at)}
                  {item.found ? '' : ' · No page there'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
