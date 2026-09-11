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

export interface MetricCondition {
  min?: number
  max?: number
}

export interface MetricConditions {
  health?: MetricCondition
  stress?: MetricCondition
  intellect?: MetricCondition
  social?: MetricCondition
  money?: MetricCondition
}

export type ParentStatus = 'healthy' | 'aging' | 'ill' | 'deceased'

export interface MemoryArtifact {
  age: number
  id: string
  text: string
  category: 'family' | 'regret' | 'youth' | 'triumph'
  emotionalWeight: number
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
  familyDecay: number
  parentStatus: ParentStatus
  memories: MemoryArtifact[]
  lastFamilyActionAge?: number
}

export interface ChoiceEffects {
  health?: number
  stress?: number
  intellect?: number
  social?: number
  money?: number
  addTags?: Tag[]
  randomTags?: { chance: number; tags: Tag[] }
  removeTags?: Tag[]
  addMemory?: MemoryArtifact
  familyDecayDelta?: number
  parentStatus?: ParentStatus
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
  cityTypes?: CityType[]
  parentStatuses?: ParentStatus[]
  metricConditions?: MetricConditions
  requiredTags?: Tag[]
  forbiddenTags?: Tag[]
  /** If true, this event is only reachable via the echo queue. */
  echoOnly?: boolean
  title: string
  text: string
  choices: GameChoice[]
}
