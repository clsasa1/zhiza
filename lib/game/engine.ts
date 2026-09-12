import type {
  CityType,
  GameChoice,
  GameEvent,
  LifeState,
  Metrics,
  MemoryArtifact,
  ParentStatus,
  Season,
  Tag,
  TimelineEntry,
  EraConfig,
  EraId,
  FamilyBackground,
  BirthEraId,
  PsychologicalVerdictInput,
} from './types'
import { MAX_AGE } from './types'
import { EVENTS, EVENTS_BY_ID } from './events'

// ─────────────────────────────── Balance constants
const PARENTAL_ALLOWANCE = 20_000
const DEBT_THRESHOLD = -100_000
const DEBT_STRESS_PER_YEAR = 10
const BIRTH_YEAR_BY_ERA: Record<BirthEraId, number> = {
  perestroika: 1985,
  early_nineties: 1993,
  late_nineties: 1998,
}

export const ERAS: EraConfig[] = [
  {
    id: 'era_90s',
    name: 'Конец 90-х и рубеж 2000-х',
    startYear: 1990,
    endYear: 2004,
    livingCostMultiplier: 0.7,
    stressPassiveModifier: 1,
    ambientEventsPool: ['рынок', 'пейджер', 'dial-up'],
  },
  {
    id: 'era_2000s_fat',
    name: 'Сытые нулевые',
    startYear: 2005,
    endYear: 2013,
    livingCostMultiplier: 1,
    stressPassiveModifier: -2,
    ambientEventsPool: ['ICQ', 'кредит', 'потребительский бум'],
  },
  {
    id: 'era_2014_crisis',
    name: 'Валютные качели',
    startYear: 2014,
    endYear: 2019,
    livingCostMultiplier: 1.2,
    stressPassiveModifier: 1,
    ambientEventsPool: ['курс валют', 'санкции', 'доставка'],
  },
  {
    id: 'era_pandemic',
    name: 'Пандемия',
    startYear: 2020,
    endYear: 2021,
    livingCostMultiplier: 1.1,
    stressPassiveModifier: 3,
    ambientEventsPool: ['маски', 'локдаун', 'удалёнка'],
  },
  {
    id: 'era_modern',
    name: 'Современность',
    startYear: 2022,
    endYear: 2100,
    livingCostMultiplier: 1.4,
    stressPassiveModifier: 2,
    ambientEventsPool: ['маркетплейсы', 'параллельный импорт', 'китайские авто'],
  },
]

const CITY_RULES: Record<
  CityType,
  { livingCost: number; salaryMultiplier: number; stressPerYear: number; healthPerYear: number }
> = {
  metropolis: { livingCost: 45_000, salaryMultiplier: 1.4, stressPerYear: 2, healthPerYear: 0 },
  industrial: { livingCost: 25_000, salaryMultiplier: 1, stressPerYear: 0, healthPerYear: -1 },
  provincial: { livingCost: 16_000, salaryMultiplier: 0.75, stressPerYear: -2, healthPerYear: 0 },
}

/** Зарплата в год по тегам занятости. */
const SALARY_BY_TAG: Partial<Record<Tag, number>> = {
  'status:job_office': 90_000,
  'status:freelance': 70_000,
  'status:job_business': 160_000,
}

const CITY_LABELS: Record<CityType, string> = {
  metropolis: 'Мегаполис',
  industrial: 'Промзона',
  provincial: 'Провинция',
}

export function cityLabel(city: CityType): string {
  return CITY_LABELS[city]
}

/** Stable, privacy-safe payload for an optional server-side LLM verdict. */
export function buildPsychologicalVerdictInput(
  state: LifeState,
): PsychologicalVerdictInput {
  return {
    age: state.age,
    birthYear: state.birthYear,
    cityType: state.cityType,
    tags: [...state.tags],
    familyDecay: state.familyDecay,
    memories: state.memories.slice(0, 12).map((memory) => ({ ...memory })),
    metrics: { ...state.metrics },
    timeline: state.timeline.slice(-20).map((entry) => ({ ...entry })),
  }
}

export function eraForYear(year: number): EraConfig {
  return (
    ERAS.find((era) => year >= era.startYear && year <= era.endYear) ??
    (year < ERAS[0].startYear ? ERAS[0] : ERAS[ERAS.length - 1])
  )
}

// ─────────────────────────────── Helpers
function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v))
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Метрики, доступные в данном возрасте. */
export function unlockedMetrics(age: number): (keyof Metrics)[] {
  const keys: (keyof Metrics)[] = ['health', 'stress']
  if (age >= 7) keys.push('intellect')
  if (age >= 14) keys.push('social', 'money')
  return keys
}

/** Глубокое клонирование состояния (без внешних зависимостей). */
function cloneState(state: LifeState): LifeState {
  return {
    ...state,
    metrics: { ...state.metrics },
    tags: [...state.tags],
    echoQueue: state.echoQueue.map((e) => ({ ...e })),
    timeline: state.timeline.map((t) => ({ ...t })),
    seenEvents: [...state.seenEvents],
    memories: state.memories.map((memory) => ({ ...memory })),
    lastEventAges: { ...state.lastEventAges },
    lastBreakdownAge: state.lastBreakdownAge,
    activeSagas: state.activeSagas
      ? Object.fromEntries(
          Object.entries(state.activeSagas).map(([id, saga]) => [id, { ...saga }]),
        )
      : undefined,
  }
}

// ─────────────────────────────── Инициализация
export function createNewLife(options?: {
  birthEra?: BirthEraId
  birthYear?: number
  cityType?: CityType
  familyBackground?: FamilyBackground
}): LifeState {
  const birthEra = options?.birthEra ?? 'perestroika'
  const cityType = options?.cityType ?? pick<CityType>(['metropolis', 'industrial', 'provincial'])
  const birthYear = options?.birthYear ?? (
    birthEra === 'perestroika' ? randInt(1985, 1988) : BIRTH_YEAR_BY_ERA[birthEra]
  )
  const familyBackground = options?.familyBackground ?? pick<FamilyBackground>([
    'working_class',
    'intelligentsia',
    'single_mother',
    'commercial',
  ])

  // Базовые характеристики зависят от архетипа города.
  const base: Record<CityType, { health: number; stress: number }> = {
    metropolis: { health: 82, stress: 18 },
    industrial: { health: 76, stress: 22 },
    provincial: { health: 88, stress: 12 },
  }

  const state: LifeState = {
    age: 0,
    birthYear,
    birthEra,
    currentYear: birthYear,
    season: 'зима',
    familyBackground,
    isDead: false,
    cityType,
    metrics: {
      health: base[cityType].health + randInt(-4, 4),
      stress: base[cityType].stress + randInt(-4, 4),
      maxHealth: 100,
      pension: 0,
    },
    tags:
      familyBackground === 'working_class'
        ? ['status:family_poor', 'asset:dacha']
        : familyBackground === 'intelligentsia'
          ? ['trait:intellectual_home', 'asset:books', 'asset:piano']
          : familyBackground === 'single_mother'
            ? ['trait:hyper_care']
            : ['status:family_commercial'],
    echoQueue: [],
    seenEvents: [],
    familyDecay: 0,
    motherStatus: 'healthy',
    fatherStatus: familyBackground === 'single_mother' ? 'deceased' : 'healthy',
    armyYearsLeft: 0,
    memories: [],
    lastEventAges: {},
    activeSagas: {},
    timeline: [
      {
        age: 0,
        year: birthYear,
        season: 'зима',
        text: `Родился в ${birthYear} году в ${CITY_LABELS[cityType].toLowerCase()}. Первый крик, первый вдох, первый счёт в жизни.`,
        kind: 'milestone',
      },
    ],
  }
  if (familyBackground === 'single_mother') state.metrics.stress += 8
  if (familyBackground === 'commercial') state.metrics.money = 15_000
  return state
}

// ─────────────────────────────── Открытие метрик по возрасту
function applyMetricUnlocks(state: LifeState): void {
  const keys = unlockedMetrics(state.age)
  if (keys.includes('intellect') && state.metrics.intellect === undefined) {
    state.metrics.intellect = 50 + randInt(-6, 6)
    state.timeline.push({
      age: state.age,
      text: 'Пошёл в школу. Открылась характеристика «Интеллект».',
      kind: 'milestone',
    })
  }

  if (keys.includes('social') && state.metrics.social === undefined) {
    state.metrics.social = 50 + randInt(-6, 6)
    state.metrics.money = 0
    state.timeline.push({
      age: state.age,
      text: 'Подростковый возраст. Открылись «Социальность» и «Деньги».',
      kind: 'milestone',
    })
  }
}

function updateParentStatus(state: LifeState): void {
  if (state.motherStatus === 'healthy' && state.age >= 30) {
    state.motherStatus = 'aging'
  }
  if (state.motherStatus === 'aging' && state.age >= 38 && state.metrics.health < 55) {
    state.motherStatus = 'ill'
  }
  if (state.fatherStatus === 'healthy' && state.age >= 30) state.fatherStatus = 'aging'
  if (state.fatherStatus === 'aging' && state.age >= 38 && state.metrics.health < 55) state.fatherStatus = 'ill'
}

function queueFamilyEcho(state: LifeState): void {
  if (
    state.familyDecay < 5 ||
    state.motherStatus === 'deceased' ||
    state.age < 34 ||
    state.age > 42 ||
    state.echoQueue.some((entry) => entry.eventId === 'echo_parent_death_alone')
  ) {
    return
  }

  state.echoQueue.push({
    targetAge: state.age,
    eventId: 'echo_parent_death_alone',
  })
}

function queueHistoricalEchoes(state: LifeState): void {
  if (state.currentYear !== 2020) return
  const eventId = state.tags.includes('status:freelance') || state.tags.includes('status:delivery_business')
    ? 'echo_lockdown_delivery'
    : state.tags.includes('status:job_business')
      ? 'echo_lockdown_cash_gap'
      : undefined
  if (!eventId || state.lastEventAges[eventId] !== undefined) return
  state.echoQueue.push({ targetAge: state.age, eventId })
}

function addMemory(state: LifeState, memory: MemoryArtifact): void {
  const normalized = {
    ...memory,
    age: memory.age || state.age,
    emotionalWeight: Math.max(1, Math.min(10, memory.emotionalWeight)),
  }
  const existing = state.memories.find((item) => item.id === normalized.id)
  if (existing) return
  state.memories.push(normalized)
  state.memories.sort((a, b) => b.emotionalWeight - a.emotionalWeight)
  if (state.memories.length > 12) state.memories.length = 12
}

// ─────────────────────────────── Passive Tick (с 18 лет)
function applyPassiveTick(state: LifeState): void {
  const city = CITY_RULES[state.cityType]
  const era = eraForYear(state.currentYear)
  state.metrics.stress = clamp(
    state.metrics.stress + city.stressPerYear + era.stressPassiveModifier,
  )
  const biologicalChange =
    state.age < 18
      ? 2
      : state.age <= 30
        ? (state.metrics.stress < 50 ? 1 : 0)
        : state.age <= 45
          ? 0
          : state.age <= 55
            ? -2
            : -4
  const lifestylePenalty =
    state.age >= 36
      ? (state.tags.includes('status:kurit') ? 1 : 0) +
        (state.tags.includes('status:pyet') ? 1 : 0)
      : 0
  const disabilityPenalty = state.tags.includes('trait:invalidnost') ? 1 : 0
  if (state.age >= 60 && !state.tags.includes('status:aging_body')) {
    state.tags.push('status:aging_body')
    state.timeline.push({
      age: state.age,
      year: state.currentYear,
      text: 'Тело стало отдельным собеседником: лестница, давление и список таблеток.',
      kind: 'milestone',
    })
  }
  const maxHealth =
    state.age >= 60 ? 50 : state.age >= 45 ? 70 : 100
  state.metrics.maxHealth = maxHealth
  state.metrics.health = Math.min(
    maxHealth,
    clamp(
      state.metrics.health + biologicalChange + city.healthPerYear - lifestylePenalty - disabilityPenalty,
      0,
      maxHealth,
    ),
  )
  if (state.age < 18) return

  const salary = Object.entries(SALARY_BY_TAG).reduce(
    (sum, [tag, amount]) =>
      state.tags.includes(tag as Tag)
        ? sum + Math.round((amount ?? 0) * city.salaryMultiplier)
        : sum,
    0,
  )

  const parentalAllowance =
    state.age <= 21 ? PARENTAL_ALLOWANCE : 0
  const pension = state.age >= 60 ? 15_000 : 0
  state.metrics.pension = pension
  const income = salary + parentalAllowance + pension
  const delta = income - Math.round(city.livingCost * era.livingCostMultiplier)
  state.metrics.money = (state.metrics.money ?? 0) + delta

  // Долговая яма
  if ((state.metrics.money ?? 0) < DEBT_THRESHOLD) {
    state.metrics.stress = clamp(state.metrics.stress + DEBT_STRESS_PER_YEAR)
    if (!state.tags.includes('status:debt_hole')) {
      state.tags.push('status:debt_hole')
      state.timeline.push({
        age: state.age,
        text: 'Долги перевалили за критическую отметку. Коллекторы звонят по утрам — статус «Долговая яма».',
        kind: 'bad',
      })
    }
  } else if (state.tags.includes('status:debt_hole')) {
    state.tags = state.tags.filter((t) => t !== 'status:debt_hole')
    state.timeline.push({
      age: state.age,
      text: 'Удалось выбраться из долговой ямы. Дышится свободнее.',
      kind: 'good',
    })
  }
}

function applyCriticalStress(state: LifeState): void {
  if (state.metrics.stress < 100) return
  if (state.lastBreakdownAge !== undefined && state.age - state.lastBreakdownAge < 5) {
    state.metrics.health = Math.max(10, state.metrics.health - 8)
    return
  }
  state.metrics.health = Math.max(20, clamp(state.metrics.health - 15))
  state.metrics.stress = 60
  state.lastBreakdownAge = state.age
  state.timeline.push({
    age: state.age,
    text: 'Хроническое выгорание и стресс привели к нервному срыву и госпитализации.',
    kind: 'bad',
  })
}

function randomSeason(): Season {
  return pick<Season>(['зима', 'весна', 'лето', 'осень'])
}

// ─────────────────────────────── Смерть
function checkDeath(state: LifeState): boolean {
  if (state.isDead) return true
  if (state.metrics.health <= 0) {
    state.isDead = true
    state.deathReason =
      state.deathReason ?? `Здоровье подвело в ${state.age} лет`
    state.metrics.health = 0
    state.timeline.push({
      age: state.age,
      text: state.deathReason,
      kind: 'fatal',
    })
    return true
  }
  if (state.age >= 65 && Math.random() < Math.min(0.9, 0.1 * (state.age - 63))) {
    state.isDead = true
    state.deathReason = 'Сердце не выдержало возрастной нагрузки.'
    state.timeline.push({ age: state.age, text: state.deathReason, kind: 'fatal' })
    return true
  }
  if (state.age >= MAX_AGE) {
    state.isDead = true
    state.deathReason = `Жизнь завершилась в ${MAX_AGE} лет`
    state.timeline.push({
      age: state.age,
      text: 'Семь десятилетий позади. В ленте осталось больше воспоминаний, чем планов.',
      kind: 'milestone',
    })
    return true
  }
  return false
}

// ─────────────────────────────── Подбор события
function eventMatches(state: LifeState, ev: GameEvent, allowEcho = false): boolean {
  const inArmy = state.tags.includes('status:in_army')
  if (inArmy && !ev.requiresArmy && !ev.requiredTags?.includes('status:in_army')) return false
  if (!inArmy && ev.requiresArmy) return false
  if (ev.armyYear !== undefined && state.armyYearsLeft !== ev.armyYear) return false
  if (ev.echoOnly && !allowEcho) return false
  if (!ev.repeatable && state.seenEvents.includes(ev.id)) return false
  if (ev.repeatable) {
    const lastSeen = state.lastEventAges[ev.id]
    if (lastSeen !== undefined && state.age - lastSeen < 4) return false
  }
  if (ev.minAge !== undefined && state.age < ev.minAge) return false
  if (ev.maxAge !== undefined && state.age > ev.maxAge) return false
  if (ev.minYear !== undefined && state.currentYear < ev.minYear) return false
  if (ev.maxYear !== undefined && state.currentYear > ev.maxYear) return false
  if (ev.seasons && !ev.seasons.includes(state.season)) return false
  if (ev.cityTypes && !ev.cityTypes.includes(state.cityType)) return false
  if (ev.parentStatuses && !ev.parentStatuses.includes(state.motherStatus))
    return false
  if (ev.motherStatuses && !ev.motherStatuses.includes(state.motherStatus)) return false
  if (ev.fatherStatuses && !ev.fatherStatuses.includes(state.fatherStatus)) return false
  if (ev.requiresMotherAlive && state.motherStatus === 'deceased') return false
  if (
    state.motherStatus === 'deceased' &&
    ev.id !== 'abandoned_dacha' &&
    (ev.requiresMotherAlive ||
      ev.title.toLowerCase().includes('мам') ||
      (typeof ev.text === 'string' && /мам|матер|мать/i.test(ev.text)))
  ) return false
  if (ev.parentStatuses && state.familyDecay >= 5 && !allowEcho) return false
  if (ev.requiredTags && !ev.requiredTags.every((t) => state.tags.includes(t)))
    return false
  if (ev.requiredAnyTags && !ev.requiredAnyTags.some((t) => state.tags.includes(t)))
    return false
  if (ev.familyBackgrounds && !ev.familyBackgrounds.includes(state.familyBackground))
    return false
  if (ev.lifePaths && (!state.lifePath || !ev.lifePaths.includes(state.lifePath)))
    return false
  if (ev.conditionAny && !ev.conditionAny.some((condition) => {
    const tagsMatch = !condition.requiredTags || condition.requiredTags.every((tag) => state.tags.includes(tag))
    const metricsMatch = !condition.metricConditions || Object.entries(condition.metricConditions).every(([metric, range]) => {
      const value = state.metrics[metric as keyof Metrics]
      return typeof value === 'number' && (range.min === undefined || value >= range.min) && (range.max === undefined || value <= range.max)
    })
    return tagsMatch && metricsMatch
  })) return false
  if (ev.forbiddenTags && ev.forbiddenTags.some((t) => state.tags.includes(t)))
    return false
  if (ev.metricConditions) {
    for (const [metric, condition] of Object.entries(ev.metricConditions)) {
      const value = state.metrics[metric as keyof Metrics]
      if (value === undefined) return false
      if (condition?.min !== undefined && value < condition.min) return false
      if (condition?.max !== undefined && value > condition.max) return false
    }
  }
  return true
}

function selectEvent(state: LifeState): GameEvent | null {
  const adaptEvent = (event: GameEvent): GameEvent => {
    return {
      ...event,
      text: typeof event.text === 'function' ? event.text(state) : event.text,
      choices:
        event.choices.map((choice) => {
          const adaptedChoice =
            event.id === 'mother_train_bag' &&
            !state.tags.includes('status:dorm') &&
            choice.text === 'Забрать и тащить в общагу'
              ? { ...choice, text: 'Забрать и тащить на съёмную квартиру' }
              : choice
          return {
            ...adaptedChoice,
            text:
              typeof adaptedChoice.text === 'function'
                ? adaptedChoice.text(state)
                : adaptedChoice.text,
          }
        }),
    }
  }
  // 1. Приоритет — эхо-события, чей targetAge совпал.
  const dueIndex = state.echoQueue.findIndex((e) => e.targetAge <= state.age)
  if (dueIndex !== -1) {
    const entry = state.echoQueue[dueIndex]
    const echoEvent = EVENTS_BY_ID[entry.eventId]
    if (echoEvent && eventMatches(state, echoEvent, true)) {
      state.echoQueue.splice(dueIndex, 1)
      return adaptEvent(echoEvent)
    }
    entry.targetAge += 1
  }

  // Обычное событие из пула. Повторяемые бытовые события не дают годам пропадать.
  const pool = EVENTS.filter((ev) => eventMatches(state, ev))
  if (pool.length === 0) return null
  const thematic = pool.filter((event) => (event.weight ?? 10) > 1)
  const weightedPool = thematic.length > 0 ? thematic : pool
  const weighted = weightedPool.map((event) => {
    let weight = event.weight ?? 10
    if (event.requiredTags?.some((tag) => state.tags.includes(tag))) weight *= 4
    if (event.familyBackgrounds?.includes(state.familyBackground)) weight *= 4
    if (event.lifePaths?.includes(state.lifePath ?? 'street')) weight *= 4
    return { event, weight }
  })
  const total = weighted.reduce((sum, item) => sum + item.weight, 0)
  let roll = Math.random() * total
  for (const item of weighted) {
    roll -= item.weight
    if (roll < 0)                 return adaptEvent(item.event)
  }
  const selected = weighted[weighted.length - 1].event
  return adaptEvent(selected)
}

// ─────────────────────────────── tickYear
export function tickYear(state: LifeState): {
  nextState: LifeState
  event: GameEvent | null
} {
  const next = cloneState(state)
  if (next.isDead) return { nextState: next, event: null }

  next.age += 1
  next.season = randomSeason()
  next.currentYear = next.birthYear + next.age
  if (next.age >= 18) {
    next.tags = next.tags.filter(
      (tag) =>
        tag !== 'status:high_school' &&
        tag !== 'status:school' &&
        tag !== 'status:school_track',
    )
  }
  if (next.age >= 23) {
    const hadStudentTag = next.tags.some((tag) => tag.includes('student'))
    next.tags = next.tags.filter((tag) => !tag.includes('student'))
    if (hadStudentTag && !next.tags.includes('status:graduate')) {
      next.tags.push('status:graduate')
    }
  }
  updateParentStatus(next)

  applyMetricUnlocks(next)
  applyPassiveTick(next)
  applyCriticalStress(next)
  if (next.age > 22 && next.lastFamilyActionAge !== next.age - 1) {
    next.familyDecay = clamp(next.familyDecay + 1, 0, 10)
  }
  queueFamilyEcho(next)
  queueHistoricalEchoes(next)

  if (checkDeath(next)) return { nextState: next, event: null }

  const event = selectEvent(next)
  if (next.tags.includes('status:in_army') && next.armyYearsLeft !== undefined) {
    next.armyYearsLeft -= 1
    if (next.armyYearsLeft <= 0) {
      next.tags = next.tags.filter((tag) => tag !== 'status:in_army')
      if (!next.tags.includes('status:demob')) next.tags.push('status:demob')
      if (!next.tags.includes('status:served_army')) next.tags.push('status:served_army')
    }
  }
  if (event && !event.echoOnly) {
    next.seenEvents.push(event.id)
    next.lastEventAges[event.id] = next.age
  } else if (event) {
    next.lastEventAges[event.id] = next.age
  }

  return { nextState: next, event }
}

// ─────────────────────────────── resolveChoice
export function resolveChoice(
  state: LifeState,
  choice: GameChoice,
  sourceEventId?: string,
): LifeState {
  const next = cloneState(state)
  const eff = choice.effects

  if (eff.health !== undefined) {
    const nextHealth = next.metrics.health + eff.health
    const minimumSafeHealth = !eff.fatal ? (next.age < 16 ? 15 : 10) : 0
    const healthCap = next.metrics.maxHealth ?? 100
    next.metrics.health = Math.min(
      healthCap,
      clamp(Math.max(nextHealth, minimumSafeHealth), 0, healthCap),
    )
  }
  if (eff.stress !== undefined)
    next.metrics.stress = clamp(next.metrics.stress + eff.stress)
  if (eff.intellect !== undefined && next.metrics.intellect !== undefined)
    next.metrics.intellect = clamp(next.metrics.intellect + eff.intellect)
  if (eff.social !== undefined && next.metrics.social !== undefined)
    next.metrics.social = clamp(next.metrics.social + eff.social)
  if (eff.money !== undefined)
    next.metrics.money = (next.metrics.money ?? 0) + eff.money

  if (eff.addTags) {
    for (const t of eff.addTags) if (!next.tags.includes(t)) next.tags.push(t)
  }
  if (eff.randomTags && Math.random() < eff.randomTags.chance) {
    for (const t of eff.randomTags.tags) {
      if (!next.tags.includes(t)) next.tags.push(t)
    }
  }
  if (eff.removeTags) {
    next.tags = next.tags.filter((t) => !eff.removeTags!.includes(t))
  }
  if (eff.addTags?.includes('status:breakup') || eff.addTags?.includes('status:divorced')) {
    next.tags = next.tags.filter(
      (tag) => !tag.startsWith('rel:') || tag === 'rel:child_born',
    )
  }
  if (eff.familyDecayDelta !== undefined) {
    next.familyDecay = clamp(next.familyDecay + eff.familyDecayDelta, 0, 10)
    next.lastFamilyActionAge = next.age
  }
  if (eff.addMemory) addMemory(next, eff.addMemory)
  if (eff.parentStatus) {
    next.parentStatus = eff.parentStatus
    next.motherStatus = eff.parentStatus
  }
  if (eff.motherStatus) next.motherStatus = eff.motherStatus
  if (eff.fatherStatus) next.fatherStatus = eff.fatherStatus
  if (eff.motherStatus === 'deceased') {
    next.tags = next.tags.filter((tag) => tag !== 'status:mother_deceased')
    next.tags.push('status:mother_deceased')
  }
  if (eff.setLifePath) next.lifePath = eff.setLifePath
  if (eff.enterArmy) {
    next.armyYearsLeft = next.currentYear < 2008 ? 2 : 1
    next.tags = next.tags.filter((tag) =>
      ![
        'status:job_office',
        'status:job_business',
        'status:job_factory',
        'status:delivery_business',
        'status:freelance',
        'status:student',
        'status:student_budget',
        'status:student_paid',
        'status:dorm',
      ].includes(tag),
    )
    if (!next.tags.includes('status:in_army')) next.tags.push('status:in_army')
  }

  const logKind: TimelineEntry['kind'] = eff.fatal
    ? 'fatal'
    : choice.logKind ?? 'neutral'
  next.timeline.push({
    age: next.age,
    year: next.currentYear,
    season: next.season,
    text: choice.logText,
    kind: logKind,
  })

  // Заложить будущее эхо-событие.
  if (choice.echo) {
    const delay = randInt(choice.echo.minDelay, choice.echo.maxDelay)
    next.echoQueue.push({
      targetAge: next.age + delay,
      eventId: choice.echo.eventId,
      payload: { from: sourceEventId },
    })
  }

  // Фатальный выбор.
  if (eff.fatal) {
    next.isDead = true
    next.deathReason =
      eff.deathReason ?? `Роковой выбор оборвал жизнь в ${next.age} лет`
    next.metrics.health = 0
  }

  // Смерть от обнуления здоровья после эффектов.
  if (!next.isDead && next.metrics.health <= 0) {
    next.isDead = true
    next.deathReason = `Здоровье подвело в ${next.age} лет`
    next.metrics.health = 0
    next.timeline.push({
      age: next.age,
      text: next.deathReason,
      kind: 'fatal',
    })
  }

  return next
}

export { MAX_AGE }
