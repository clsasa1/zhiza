'use client'

import { useEffect, useRef } from 'react'
import type { TimelineEntry } from '@/lib/game/types'

const KIND_ACCENT: Record<NonNullable<TimelineEntry['kind']>, string> = {
  neutral: 'border-l-border',
  good: 'border-l-chart-4',
  bad: 'border-l-destructive',
  fatal: 'border-l-destructive',
  milestone: 'border-l-primary',
}

const KIND_TEXT: Record<NonNullable<TimelineEntry['kind']>, string> = {
  neutral: 'text-muted-foreground',
  good: 'text-foreground/90',
  bad: 'text-foreground/90',
  fatal: 'text-destructive',
  milestone: 'text-foreground',
}

export function Timeline({
  entries,
  birthYear,
}: {
  entries: TimelineEntry[]
  birthYear: number
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries.length])

  return (
    <section className="flex h-full flex-col border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Лента жизни
        </span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3"
      >
        <ol className="flex flex-col gap-2.5">
          {entries.map((entry, i) => {
            const kind = entry.kind ?? 'neutral'
            return (
              <li
                key={i}
                className={`border-l-2 pl-3 ${KIND_ACCENT[kind]}`}
              >
                <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                  {entry.year ?? birthYear + entry.age} | {String(entry.age).padStart(2, '0')} лет
                </span>
                <p className={`text-pretty font-mono text-xs leading-relaxed ${KIND_TEXT[kind]}`}>
                  {entry.text}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
