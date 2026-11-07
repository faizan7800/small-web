import { useEffect, useState } from 'react'

interface Props {
  address: string
  canBack: boolean
  canForward: boolean
  onBack: () => void
  onForward: () => void
  onGo: (rawAddress: string) => void
  disabled: boolean
}

const navButton =
  'motion-base flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#313131] bg-[#272727] text-base font-semibold text-white transition-all duration-300 hover:bg-[#313131] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#272727]'

export function AddressBar({
  address,
  canBack,
  canForward,
  onBack,
  onForward,
  onGo,
  disabled,
}: Props) {
  const [value, setValue] = useState(address)

  useEffect(() => {
    setValue(address)
  }, [address])

  return (
    <form
      className="flex w-full items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        if (value.trim()) onGo(value)
      }}
    >
      <button
        type="button"
        onClick={onBack}
        disabled={!canBack || disabled}
        aria-label="Go back"
        title="Back"
        className={navButton}
      >
        ←
      </button>
      <button
        type="button"
        onClick={onForward}
        disabled={!canForward || disabled}
        aria-label="Go forward"
        title="Forward"
        className={navButton}
      >
        →
      </button>
      <label className="sr-only" htmlFor="address-bar">
        Address
      </label>
      <input
        id="address-bar"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={address ? address : 'Type an address, for example start.zz'}
        disabled={disabled}
        autoComplete="off"
        spellCheck={false}
        className="min-w-0 flex-1 rounded-lg border border-[#313131] bg-[#1f1f1f] px-3 py-2 text-base font-medium text-white outline-none placeholder:text-[#8a8a8a] focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="motion-base shrink-0 rounded-lg bg-white px-3 py-2 text-base font-semibold text-black transition-all duration-300 hover:bg-[#e6e6e6] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Go
      </button>
    </form>
  )
}
