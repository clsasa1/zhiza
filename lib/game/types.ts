// Core Engine — pure TypeScript, no React.
// Type definitions for the "ЖИЗА" life simulator.

export type Tag =
  | `trait:${string}`
  | `status:${string}`
  | `asset:${string}`
  | `rel:${string}`

export type CityType = 'metropolis' | 'industrial' | 'provincial'
export const MAX_AGE = 70
export type BirthEraId = 'perestroika' | 'early_nineties' | 'late_nineties'
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

export interface ExtendedMetrics extends Metrics {
  maxHealth?: number
  pension?: number
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
export type IndividualParentStatus = ParentStatus

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
  birthEra: BirthEraId
  currentYear: number
  season: Season
  familyBackground: FamilyBackground
  lifePath?: LifePath
  isDead: boolean
  deathReason?: string
  cityType: CityType
  metrics: ExtendedMetrics
  tags: Tag[]
  echoQueue: EchoEntry[]
  timeline: TimelineEntry[]
  /** Уже сыгранные обычные события — чтобы они не повторялись. */
  seenEvents: string[]
  familyDecay: number
  motherStatus: IndividualParentStatus
  fatherStatus: IndividualParentStatus
  armyYearsLeft?: number
  /** @deprecated Use motherStatus/fatherStatus. */
  parentStatus?: ParentStatus
  memories: MemoryArtifact[]
  lastFamilyActionAge?: number
  lastEventAges: Record<string, number>
  lastBreakdownAge?: number
  activeSagas?: Record<string, { step: number; startAge: number }>
}

export interface LifeRunSummary {
  id: string
  age: number
  birthYear: number
  deathYear: number
  cityType: CityType
  familyBackground: FamilyBackground
  lifePath?: LifePath
  finalMoney: number
  keyMemory?: string
  deathReason: string
  verdictTitle: string
  verdictText: string
}

export interface PsychologicalVerdictInput {
  age: number
  birthYear: number
  cityType: CityType
  tags: Tag[]
  familyDecay: number
  memories: MemoryArtifact[]
  metrics: Metrics
  timeline: TimelineEntry[]
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
  motherStatus?: IndividualParentStatus
  fatherStatus?: IndividualParentStatus
  enterArmy?: boolean
  setLifePath?: LifePath
  /** Marks the choice as immediately fatal. */
  fatal?: boolean
  deathReason?: string
}

export interface GameChoice {
  text: string
  effects: ChoiceEffects
  metricConditions?: MetricConditions
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
  seasons?: Season[]
  cityTypes?: CityType[]
  minYear?: number
  maxYear?: number
  parentStatuses?: ParentStatus[]
  motherStatuses?: IndividualParentStatus[]
  fatherStatuses?: IndividualParentStatus[]
  requiresMotherAlive?: boolean
  requiresArmy?: boolean
  armyYear?: number
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
  text: string | ((state: LifeState) => string)
  choices: GameChoice[]
}
