import type {
  CityType,
  GameChoice,
  GameEvent,
  LifeState,
  Metrics,
  MemoryArtifact,
  ParentStatus,
  Tag,
  TimelineEntry,
} from './types'
import { EVENTS, EVENTS_BY_ID } from './events'

// ─────────────────────────────── Balance constants
const PARENTAL_ALLOWANCE = 20_000
const DEBT_THRESHOLD = -100_000
const DEBT_STRESS_PER_YEAR = 10
const MAX_AGE = 45

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
  }
}

// ─────────────────────────────── Инициализация
export function createNewLife(): LifeState {
  const cityType = pick<CityType>(['metropolis', 'industrial', 'provincial'])

  // Базовые характеристики зависят от архетипа города.
  const base: Record<CityType, { health: number; stress: number }> = {
    metropolis: { health: 82, stress: 18 },
    industrial: { health: 76, stress: 22 },
    provincial: { health: 88, stress: 12 },
  }

  const state: LifeState = {
    age: 0,
    isDead: false,
    cityType,
    metrics: {
      health: base[cityType].health + randInt(-4, 4),
      stress: base[cityType].stress + randInt(-4, 4),
    },
    tags: [],
    echoQueue: [],
    seenEvents: [],
    familyDecay: 0,
    parentStatus: 'healthy',
    memories: [],
    timeline: [
      {
        age: 0,
        text: `Родился в ${CITY_LABELS[cityType].toLowerCase()}. Первый крик, первый вдох, первый счёт в жизни.`,
        kind: 'milestone',
      },
    ],
  }
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
  if (state.parentStatus === 'healthy' && state.age >= 30) {
    state.parentStatus = 'aging'
  }
  if (
    state.parentStatus === 'aging' &&
    state.age >= 38 &&
    state.metrics.health < 55
  ) {
    state.parentStatus = 'ill'
  }
}

function queueFamilyEcho(state: LifeState): void {
  if (
    state.familyDecay < 5 ||
    state.parentStatus === 'deceased' ||
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
  state.metrics.stress = clamp(state.metrics.stress + city.stressPerYear)
  state.metrics.health = clamp(state.metrics.health + city.healthPerYear)
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
  const income = salary + parentalAllowance
  const delta = income - city.livingCost
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
  state.metrics.health = clamp(state.metrics.health - 35)
  state.metrics.stress = 75
  state.timeline.push({
    age: state.age,
    text: 'Хроническое выгорание и стресс привели к нервному срыву и госпитализации.',
    kind: 'bad',
  })
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
  if (state.age >= MAX_AGE) {
    // Этап 0 заканчивается на 45 годах.
    state.isDead = true
    state.deathReason = `Конец Этапа 0 (MVP): персонаж дожил до ${MAX_AGE} лет`
    state.timeline.push({
      age: state.age,
      text: 'Сорок пять лет позади. Здесь заканчивается Этап 0 — но не сама жизнь.',
      kind: 'milestone',
    })
    return true
  }
  return false
}

// ─────────────────────────────── Подбор события
function eventMatches(state: LifeState, ev: GameEvent, allowEcho = false): boolean {
  if (ev.echoOnly && !allowEcho) return false
  if (!ev.repeatable && state.seenEvents.includes(ev.id)) return false
  if (ev.minAge !== undefined && state.age < ev.minAge) return false
  if (ev.maxAge !== undefined && state.age > ev.maxAge) return false
  if (ev.cityTypes && !ev.cityTypes.includes(state.cityType)) return false
  if (ev.parentStatuses && !ev.parentStatuses.includes(state.parentStatus))
    return false
  if (ev.parentStatuses && state.familyDecay >= 5 && !allowEcho) return false
  if (ev.requiredTags && !ev.requiredTags.every((t) => state.tags.includes(t)))
    return false
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
  // 1. Приоритет — эхо-события, чей targetAge совпал.
  const dueIndex = state.echoQueue.findIndex((e) => e.targetAge <= state.age)
  if (dueIndex !== -1) {
    const entry = state.echoQueue[dueIndex]
    const echoEvent = EVENTS_BY_ID[entry.eventId]
    if (echoEvent && eventMatches(state, echoEvent, true)) {
      state.echoQueue.splice(dueIndex, 1)
      return echoEvent
    }
    entry.targetAge += 1
  }

  // Обычное событие из пула. Повторяемые бытовые события не дают годам пропадать.
  const pool = EVENTS.filter((ev) => eventMatches(state, ev))
  if (pool.length === 0) return null
  return pick(pool)
}

// ─────────────────────────────── tickYear
export function tickYear(state: LifeState): {
  nextState: LifeState
  event: GameEvent | null
} {
  const next = cloneState(state)
  if (next.isDead) return { nextState: next, event: null }

  next.age += 1
  updateParentStatus(next)

  applyMetricUnlocks(next)
  applyPassiveTick(next)
  applyCriticalStress(next)
  if (next.age > 22 && next.lastFamilyActionAge !== next.age - 1) {
    next.familyDecay = clamp(next.familyDecay + 1, 0, 10)
  }
  queueFamilyEcho(next)

  if (checkDeath(next)) return { nextState: next, event: null }

  const event = selectEvent(next)
  if (event && !event.echoOnly) {
    next.seenEvents.push(event.id)
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

  if (eff.health !== undefined)
    next.metrics.health = clamp(next.metrics.health + eff.health)
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
  if (eff.removeTags) {
    next.tags = next.tags.filter((t) => !eff.removeTags!.includes(t))
  }
  if (eff.familyDecayDelta !== undefined) {
    next.familyDecay = clamp(next.familyDecay + eff.familyDecayDelta, 0, 10)
    next.lastFamilyActionAge = next.age
  }
  if (eff.addMemory) addMemory(next, eff.addMemory)
  if (eff.parentStatus) next.parentStatus = eff.parentStatus

  const logKind: TimelineEntry['kind'] = eff.fatal
    ? 'fatal'
    : choice.logKind ?? 'neutral'
  next.timeline.push({ age: next.age, text: choice.logText, kind: logKind })

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
