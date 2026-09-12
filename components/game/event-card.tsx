import type { GameChoice, GameEvent, LifeState, Season } from '@/lib/game/types'
import { HISTORICAL_CONTEXT } from '@/lib/game/world-history'

export function EventCard({
  event,
  onChoose,
  season,
  state,
}: {
  event: GameEvent
  onChoose: (choice: GameChoice) => void
  season: Season
  state: LifeState
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
        <p className="mt-1 text-xs italic text-zinc-400">
          {HISTORICAL_CONTEXT[state.currentYear]}
        </p>
      </div>

      <p className="px-5 py-5 text-pretty font-mono text-sm leading-relaxed text-foreground/90">
        {typeof event.text === 'function' ? event.text(state) : event.text}
      </p>

      <div className="flex flex-col gap-px border-t border-border bg-border">
        {event.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => onChoose(choice)}
            className="group cursor-pointer bg-card px-5 py-4 text-left transition-all duration-200 ease-out hover:translate-x-0.5 hover:border-zinc-500 hover:bg-zinc-800/80 active:scale-[0.99] focus:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            <span className="flex items-start gap-3">
              <span className="font-mono text-sm text-primary transition-transform duration-200 ease-out group-hover:translate-x-1">{`>`}</span>
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
