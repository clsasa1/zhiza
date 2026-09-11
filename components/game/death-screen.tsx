import { Button } from '@/components/ui/button'
import type { LifeState } from '@/lib/game/types'
import { cityLabel } from '@/lib/game/engine'

export function DeathScreen({
  state,
  onRestart,
}: {
  state: LifeState
  onRestart: () => void
}) {
  // Ключевые вехи — важные события, а не фоновые года.
  const milestones = state.timeline.filter(
    (t) => t.kind === 'milestone' || t.kind === 'good' || t.kind === 'bad' || t.kind === 'fatal',
  )

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col border border-border bg-card">
      <div className="border-b border-destructive/50 bg-destructive/10 px-6 py-5 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-destructive">
          Жизнь окончена
        </span>
        <h1 className="mt-1 font-sans text-4xl font-bold uppercase tracking-tight text-foreground">
          {state.age} {state.age === 1 ? 'год' : 'лет'}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-px border-b border-border bg-border">
        <div className="bg-card px-4 py-3">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Город
          </span>
          <span className="font-mono text-sm text-foreground">{cityLabel(state.cityType)}</span>
        </div>
        <div className="bg-card px-4 py-3">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Итог
          </span>
          <span className="font-mono text-sm tabular-nums text-foreground">
            {(state.metrics.money ?? 0).toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

      <p className="border-b border-border px-6 py-4 text-pretty font-mono text-sm leading-relaxed text-foreground/90">
        {state.deathReason}
      </p>

      <div className="px-6 py-4">
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Ключевые вехи
        </span>
        <ol className="flex max-h-64 flex-col gap-2 overflow-y-auto">
          {milestones.map((m, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-[10px] tabular-nums text-primary">
                {String(m.age).padStart(2, '0')}
              </span>
              <span className="flex-1 font-mono text-xs leading-relaxed text-foreground/80">
                {m.text}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-border p-4">
        <Button onClick={onRestart} className="w-full font-mono uppercase tracking-widest">
          Прожить заново
        </Button>
      </div>
    </div>
  )
}
