// Core Engine — pure TypeScript, no React.
// Type definitions for the "ЖИЗА" life simulator.

export type Tag =
  | `trait:${string}`
  | `status:${string}`
  | `asset:${string}`
  | `rel:${string}`

export type CityType = 'metropolis' | 'industrial' | 'provincial'
export type FamilyBackground =
  | 'working_class'
  | 'intelligentsia'
  | 'single_mother'
  | 'commercial'
export type LifePath = 'street' | 'office' | 'commerce'
export type Season = 'зима' | 'весна' | 'лето' | 'осень'
export type EraId =
  | 'era_90s'
  | 'era_2000s_fat'
  | 'era_2014_crisis'
  | 'era_pandemic'
  | 'era_modern'

export interface EraConfig {
  id: EraId
  name: string
  startYear: number
  endYear: number
  livingCostMultiplier: number
  stressPassiveModifier: number
  ambientEventsPool: string[]
}

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
  year?: number
  season?: Season
  text: string
  /** Visual weight of the entry for the life ribbon. */
  kind?: 'neutral' | 'good' | 'bad' | 'fatal' | 'milestone'
}

export interface LifeState {
  age: number
  birthYear: number
  currentYear: number
  season: Season
  familyBackground: FamilyBackground
  lifePath?: LifePath
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
  lastEventAges: Record<string, number>
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
  setLifePath?: LifePath
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
  weight?: number
  cityTypes?: CityType[]
  minYear?: number
  maxYear?: number
  parentStatuses?: ParentStatus[]
  metricConditions?: MetricConditions
  requiredTags?: Tag[]
  requiredAnyTags?: Tag[]
  conditionAny?: Array<{ requiredTags?: Tag[]; metricConditions?: MetricConditions }>
  familyBackgrounds?: FamilyBackground[]
  lifePaths?: LifePath[]
  forbiddenTags?: Tag[]
  /** If true, this event is only reachable via the echo queue. */
  echoOnly?: boolean
  title: string
  text: string
  choices: GameChoice[]
}
