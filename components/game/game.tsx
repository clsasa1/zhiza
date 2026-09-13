'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { BirthEraId, CityType, FamilyBackground, GameChoice, GameEvent, LifeState } from '@/lib/game/types'
import { createNewLife, resolveChoice, tickYear } from '@/lib/game/engine'
import { StatsPanel } from './stats-panel'
import { EventCard } from './event-card'
import { Timeline } from './timeline'
import { DeathScreen } from './death-screen'
import { AudioController } from '@/components/audio-controller'
import { audioManager, type AudioTrackKey } from '@/lib/audio/sound-manager'

export function Game() {
  const [state, setState] = useState<LifeState | null>(null)
  const [pendingEvent, setPendingEvent] = useState<GameEvent | null>(null)
  const [audioStarted, setAudioStarted] = useState(false)

  const start = useCallback((birthEra: BirthEraId, cityType: CityType, birthYear: number, familyBackground: FamilyBackground) => {
    const nextState = createNewLife({ birthEra, birthYear, cityType, familyBackground })
    audioManager.init()
    audioManager.playTrack(trackForState(nextState))
    setAudioStarted(true)
    setState(nextState)
    setPendingEvent(null)
  }, [])

  const liveYear = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.isDead) return prev
      const { nextState, event } = tickYear(prev)
      setPendingEvent(event)
      return nextState
    })
  }, [])

  const choose = useCallback(
    (choice: GameChoice) => {
      setState((prev) => {
        if (!prev) return prev
        return resolveChoice(prev, choice, pendingEvent?.id)
      })
      setPendingEvent(null)
    },
    [pendingEvent],
  )

  if (!state) {
    return (
      <>
        <AudioController state={state} startAudio={audioStarted} />
        <StartScreen
          onStart={start}
          onAudioStart={() => {
            audioManager.init()
            audioManager.setMuted(false)
            audioManager.playTrack('intro')
            setAudioStarted(true)
          }}
        />
      </>
    )
  }

  function trackForState(state: LifeState): AudioTrackKey {
    if (state.age >= 50) return 'oldage'
    if (state.age < 25) return 'era_90s'
    if (state.currentYear < 2000) return 'era_90s'
    if (state.currentYear <= 2014) return 'era_2000s'
    return 'era_modern'
  }

  if (state.isDead) {
    return (
      <>
        <AudioController state={state} startAudio={audioStarted} />
        <DeathScreen
          state={state}
          onRestart={() => start('perestroika', 'metropolis', 1986, 'working_class')}
        />
      </>
    )
  }

  const awaitingChoice = pendingEvent !== null

  return (
    <>
      <AudioController state={state} startAudio={audioStarted} />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <StatsPanel state={state} />

        <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <div className="flex flex-col gap-4">
            {awaitingChoice ? (
              <EventCard event={pendingEvent} onChoose={choose} season={state.season} state={state} />
            ) : (
              <IdleCard state={state} />
            )}

            <Button
              onClick={liveYear}
              disabled={awaitingChoice}
              size="lg"
              className="w-full font-mono text-sm uppercase tracking-[0.2em] disabled:opacity-40"
            >
              {awaitingChoice ? 'Сделай выбор ↑' : 'Прожить год →'}
            </Button>
          </div>

          <div className="lg:h-[32rem]">
            <Timeline entries={state.timeline} birthYear={state.birthYear} />
          </div>
        </div>
      </div>
    </>
  )
}

function IdleCard({ state }: { state: LifeState }) {
  const last = state.timeline[state.timeline.length - 1]
  return (
    <div className="flex min-h-[12rem] flex-col justify-center border border-dashed border-border bg-card px-6 py-8 text-center">
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {state.age === 0 ? 'Начало пути' : `${state.age} лет позади`}
      </span>
      <p className="mt-2 text-pretty font-mono text-sm leading-relaxed text-foreground/80">
        {last?.text ?? 'Жизнь идёт своим чередом.'}
      </p>
      <p className="mt-4 font-mono text-xs text-muted-foreground">
        Нажми «Прожить год», чтобы двигаться дальше.
      </p>
    </div>
  )
}

function StartScreen({
  onStart,
  onAudioStart,
}: {
  onStart: (birthEra: BirthEraId, cityType: CityType, birthYear: number, familyBackground: FamilyBackground) => void
  onAudioStart: () => void
}) {
  const [fate] = useState(() => rollFate())
  const cityLabels: Record<CityType, string> = { metropolis: 'Миллионник', industrial: 'Моногород', provincial: 'Глубинка / ПГТ' }
  const familyLabels: Record<FamilyBackground, string> = { working_class: 'работяги', intelligentsia: 'интеллигенция', single_mother: 'мать-одиночка', commercial: 'коммерческая семья' }
  return (
    <div
      className="mx-auto flex w-full max-w-lg flex-col items-center border border-border bg-card px-8 py-12 text-center"
      onPointerDownCapture={onAudioStart}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-primary">
        Текстовый симулятор жизни
      </span>
      <h1 className="mt-3 font-sans text-6xl font-bold uppercase leading-none tracking-tight text-foreground">
        ЖИЗА
      </h1>
      <p className="mt-4 max-w-sm text-pretty font-mono text-sm leading-relaxed text-muted-foreground">
        Один ход — один год. Место рождения не выбирают. Каждый выбор оставляет эхо,
        которое догонит тебя годы спустя.
      </p>
      <div className="mt-8 w-full border border-primary/50 bg-primary/5 px-5 py-6 text-left">
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Точка отсчёта</span>
        <h2 className="mt-2 font-sans text-2xl font-bold uppercase text-foreground">{fate.year} год, {cityLabels[fate.cityType]}</h2>
        <p className="mt-3 font-mono text-sm leading-relaxed text-muted-foreground">{fate.punch}</p>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">Семья: {familyLabels[fate.familyBackground]}</p>
      </div>
      <Button
        onClick={() => onStart(fate.birthEra, fate.cityType, fate.year, fate.familyBackground)}
        size="lg"
        className="mt-8 w-full font-mono uppercase tracking-[0.2em]"
      >
        РОДИТЬСЯ В ЭТОТ МИР
      </Button>
      <span className="mt-4 font-mono text-[10px] text-muted-foreground">Все жизни начинаются в одной точке. Дальше всё зависит от твоих решений.</span>
    </div>
  )
}

type Fate = { year: number; birthEra: BirthEraId; cityType: CityType; familyBackground: FamilyBackground; punch: string }

function rollFate(): Fate {
  const year = 1985
  const cityType = weightedPick<CityType>(['metropolis', 'industrial', 'provincial'], [30, 45, 25])
  const familyBackground = weightedPick<FamilyBackground>(['working_class', 'intelligentsia', 'single_mother'], [45, 30, 25])
  const punch = cityType === 'industrial' ? 'За стеной гудит завод, в подъезде пахнет углём. Здесь работу обещают раньше, чем свободу.' : cityType === 'provincial' ? 'Автобус ходит два раза в день, новости приходят от соседей. До большого мира сначала нужно доехать.' : 'Пятиэтажки тянутся до горизонта. Здесь тесно, дорого и всё же есть куда податься.'
  return { year, birthEra: 'perestroika', cityType, familyBackground, punch }
}

function weightedPick<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  let roll = Math.random() * total
  for (let i = 0; i < items.length; i += 1) {
    roll -= weights[i]
    if (roll < 0) return items[i]
  }
  return items[items.length - 1]
}
