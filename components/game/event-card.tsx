import type { GameChoice, GameEvent, Season } from '@/lib/game/types'

export function EventCard({
  event,
  onChoose,
  season,
}: {
  event: GameEvent
  onChoose: (choice: GameChoice) => void
  season: Season
}) {
  return (
    <div className="flex flex-col border border-border bg-card">
      <div className="border-b border-primary/60 bg-primary/10 px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
          Событие · {season}
        </span>
        <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-foreground">
          {event.title}
        </h2>
      </div>

      <p className="px-5 py-5 text-pretty font-mono text-sm leading-relaxed text-foreground/90">
        {event.text}
      </p>

      <div className="flex flex-col gap-px border-t border-border bg-border">
        {event.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => onChoose(choice)}
            className="group bg-card px-5 py-4 text-left transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
          >
            <span className="flex items-start gap-3">
              <span className="font-mono text-sm text-primary">{`>`}</span>
              <span className="flex-1">
                <span className="font-mono text-sm font-medium text-foreground group-hover:text-primary">
                  {choice.text}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
