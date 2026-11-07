import type { Person } from '../api'

interface Props {
  people: Person[]
  personId: string | null
  onChange: (personId: string) => void
  disabled: boolean
}

export function PersonPicker({ people, personId, onChange, disabled }: Props) {
  return (
    <label className="flex min-w-0 flex-col gap-2">
      <span className="title-5 text-[#8a8a8a]">Browsing as</span>
      <select
        value={personId ?? ''}
        disabled={disabled || people.length === 0}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Choose who is browsing"
        className="motion-base w-full rounded-lg border border-[#313131] bg-[#272727] px-3 py-2 text-sm font-medium text-white outline-none transition-colors duration-300 hover:bg-[#313131] focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="" disabled>
          {people.length === 0 ? 'No people found' : 'Choose a person'}
        </option>
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>
    </label>
  )
}
