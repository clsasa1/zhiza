// Core Engine — pure TypeScript, no React.
// Type definitions for the "ЖИЗА" life simulator.

export type Tag =
  | `trait:${string}`
  | `status:${string}`
  | `asset:${string}`
  | `rel:${string}`

export type CityType = 'metropolis' | 'industrial' | 'provincial'

export interface Metrics {
  health: number
  stress: number
  intellect?: number
  social?: number
  money?: number
}

export interface EchoEntry {
  targetAge: number
  eventId: string
  payload?: unknown
}

export interface TimelineEntry {
  age: number
  text: string
  /** Visual weight of the entry for the life ribbon. */
  kind?: 'neutral' | 'good' | 'bad' | 'fatal' | 'milestone'
}

export interface LifeState {
  age: number
  isDead: boolean
  deathReason?: string
  cityType: CityType
  metrics: Metrics
  tags: Tag[]
  echoQueue: EchoEntry[]
  timeline: TimelineEntry[]
  /** Уже сыгранные обычные события — чтобы они не повторялись. */
  seenEvents: string[]
}

export interface ChoiceEffects {
  health?: number
  stress?: number
  intellect?: number
  social?: number
  money?: number
  addTags?: Tag[]
  removeTags?: Tag[]
  /** Marks the choice as immediately fatal. */
  fatal?: boolean
  deathReason?: string
}

export interface GameChoice {
  text: string
  effects: ChoiceEffects
  echo?: { eventId: string; minDelay: number; maxDelay: number }
  logText: string
  logKind?: TimelineEntry['kind']
}

export interface GameEvent {
  id: string
  minAge?: number
  maxAge?: number
  /** Повседневное событие может выпадать повторно в разные годы. */
  repeatable?: boolean
  requiredTags?: Tag[]
  forbiddenTags?: Tag[]
  /** If true, this event is only reachable via the echo queue. */
  echoOnly?: boolean
  title: string
  text: string
  choices: GameChoice[]
}
