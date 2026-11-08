import { useState } from 'react'
import type { FormEvent } from 'react'
import { normalizeAddress } from '../normalize'

interface Props {
  personName: string | null
  publishing: boolean
  error: string | null
  success: string | null
  onPublish: (address: string, title: string, html: string) => void
  disabled: boolean
}

const field =
  'w-full rounded-lg border border-[#313131] bg-[#1f1f1f] px-3 py-2 text-sm font-medium text-white outline-none placeholder:text-[#8a8a8a] focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50'

export function PublishForm({ personName, publishing, error, success, onPublish, disabled }: Props) {
  const [address, setAddress] = useState('')
  const [title, setTitle] = useState('')
  const [html, setHtml] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    const clean = normalizeAddress(address)
    if (!clean) {
      setLocalError('Use an address like tidepool.zz, with no path after it.')
      return
    }
    if (!title.trim()) {
      setLocalError('Give the page a title.')
      return
    }
    if (!html.trim()) {
      setLocalError('Write something for the page. Headings, text, lists and links work.')
      return
    }
    setLocalError(null)
    onPublish(clean, title.trim(), html)
  }

  const message = localError ?? error

  return (
    <section aria-label="Publish a page" className="flex flex-col gap-4 rounded-2xl border border-[#313131] bg-[#181818] p-4">
      <h2 className="title-3 text-white">Publish a page</h2>
      <p className="body-6 text-[#b3b3b3]">
        {personName
          ? `Publishing as ${personName}. Scripts, styles, images and forms are removed when the page is saved.`
          : 'Choose a person first, then publish as that person.'}
      </p>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="title-5 text-[#8a8a8a]">Address</span>
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="tidepool.zz"
            disabled={disabled || publishing}
            autoComplete="off"
            spellCheck={false}
            className={field}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="title-5 text-[#8a8a8a]">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="A title for the page"
            disabled={disabled || publishing}
            maxLength={120}
            className={field}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="title-5 text-[#8a8a8a]">Page text</span>
          <textarea
            value={html}
            onChange={(event) => setHtml(event.target.value)}
            placeholder="<h1>My page</h1><p>Some words here.</p>"
            disabled={disabled || publishing}
            rows={6}
            className={`${field} resize-y`}
          />
        </label>
        {message ? (
          <p role="alert" className="body-6 rounded-lg border border-[#313131] bg-[#1f1f1f] p-3 text-white">
            {message}
          </p>
        ) : null}
        {success && !message ? (
          <p role="status" className="body-6 rounded-lg border border-[#313131] bg-[#1f1f1f] p-3 text-white">
            {success}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={disabled || publishing}
          className="motion-base self-start rounded-lg bg-white px-3 py-2 text-base font-semibold text-black transition-all duration-300 hover:bg-[#e6e6e6] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {publishing ? 'Publishing…' : 'Publish page'}
        </button>
      </form>
    </section>
  )
}
