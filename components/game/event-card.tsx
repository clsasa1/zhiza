import type { GameChoice, GameEvent } from '@/lib/game/types'

function EffectHint({ choice }: { choice: GameChoice }) {
  const e = choice.effects
  const parts: string[] = []
  const push = (label: string, v?: number) => {
    if (v === undefined || v === 0) return
    parts.push(`${label} ${v > 0 ? '+' : ''}${label === '₽' ? v.toLocaleString('ru-RU') : v}`)
  }
  push('HP', e.health)
  push('Стресс', e.stress)
  push('Инт', e.intellect)
  push('Соц', e.social)
  push('₽', e.money)
  if (e.echo || choice.echo) parts.push('эхо…')
  if (e.fatal) parts.push('РИСК СМЕРТИ')
  if (parts.length === 0) return null
  return (
    <span className="mt-1 block font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
      {parts.join('  ·  ')}
    </span>
  )
}

export function EventCard({
  event,
  onChoose,
}: {
  event: GameEvent
  onChoose: (choice: GameChoice) => void
}) {
  return (
    <div className="flex flex-col border border-border bg-card">
      <div className="border-b border-primary/60 bg-primary/10 px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
          Событие
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
                <EffectHint choice={choice} />
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
