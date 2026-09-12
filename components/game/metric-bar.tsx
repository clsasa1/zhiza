interface MetricBarProps {
  label: string
  value: number
  /** oklch/hsl color string for the fill. */
  color: string
  /** When true, a full bar is bad (e.g. stress). */
  inverted?: boolean
}

export function MetricBar({ label, value, color, inverted }: MetricBarProps) {
  const pct = Math.max(0, Math.min(100, value))
  // Low health / high stress should read as danger.
  const danger = inverted ? pct >= 70 : pct <= 25

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-wider">
        <span className="text-muted-foreground">{label}</span>
        <span className={danger ? 'text-destructive' : 'text-foreground'}>
          {Math.round(pct)}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
