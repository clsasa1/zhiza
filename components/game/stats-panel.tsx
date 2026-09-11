import type { LifeState } from '@/lib/game/types'
import { cityLabel } from '@/lib/game/engine'
import { CATEGORY_COLORS, tagCategory, tagLabel } from '@/lib/game/labels'
import { MetricBar } from './metric-bar'

function formatMoney(v: number): string {
  return `${v.toLocaleString('ru-RU')} ₽`
}

export function StatsPanel({ state }: { state: LifeState }) {
  const { metrics } = state

  return (
    <section className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-3xl font-bold leading-none tracking-tight tabular-nums">
            {state.age}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {state.age === 1 ? 'год' : 'лет'}
          </span>
        </div>
        <span className="border border-border px-2 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {cityLabel(state.cityType)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-4 py-4 sm:grid-cols-3">
        <MetricBar label="Здоровье" value={metrics.health} color="var(--chart-4)" />
        <MetricBar label="Стресс" value={metrics.stress} color="var(--chart-1)" inverted />
        {metrics.intellect !== undefined && (
          <MetricBar label="Интеллект" value={metrics.intellect} color="var(--chart-3)" />
        )}
        {metrics.social !== undefined && (
          <MetricBar label="Социум" value={metrics.social} color="var(--chart-5)" />
        )}
        {metrics.money !== undefined && (
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Деньги
            </span>
            <span
              className={`font-mono text-sm font-semibold tabular-nums ${
                metrics.money < 0 ? 'text-destructive' : 'text-chart-4'
              }`}
            >
              {formatMoney(metrics.money)}
            </span>
          </div>
        )}
      </div>

      {state.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-border px-4 py-3">
          {state.tags.map((tag) => (
            <span
              key={tag}
              className={`border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                CATEGORY_COLORS[tagCategory(tag)]
              }`}
            >
              {tagLabel(tag)}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
