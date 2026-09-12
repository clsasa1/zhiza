'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { BirthEraId, CityType, GameChoice, GameEvent, LifeState } from '@/lib/game/types'
import { createNewLife, resolveChoice, tickYear } from '@/lib/game/engine'
import { StatsPanel } from './stats-panel'
import { EventCard } from './event-card'
import { Timeline } from './timeline'
import { DeathScreen } from './death-screen'

export function Game() {
  const [state, setState] = useState<LifeState | null>(null)
  const [pendingEvent, setPendingEvent] = useState<GameEvent | null>(null)

  const start = useCallback((birthEra: BirthEraId, cityType: CityType) => {
    setState(createNewLife({ birthEra, cityType }))
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

  if (!state) return <StartScreen onStart={start} />

  if (state.isDead) {
    return (
      <DeathScreen
        state={state}
        onRestart={() => start('perestroika', 'metropolis')}
      />
    )
  }

  const awaitingChoice = pendingEvent !== null

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <StatsPanel state={state} />

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-4">
          {awaitingChoice ? (
            <EventCard event={pendingEvent} onChoose={choose} season={state.season} />
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
}: {
  onStart: (birthEra: BirthEraId, cityType: CityType) => void
}) {
  const [birthEra, setBirthEra] = useState<BirthEraId>('perestroika')
  const [cityType, setCityType] = useState<CityType>('metropolis')
  const eras: Array<{ id: BirthEraId; years: string; title: string; text: string }> = [
    { id: 'perestroika', years: '1985–1988', title: 'Перестройка и 90-е на дворе', text: 'Картриджи, рынок и сытые нулевые в юности.' },
    { id: 'early_nineties', years: '1993', title: 'Рынок вместо стабильности', text: 'Дефолт в детстве, первые деньги в лихие годы.' },
    { id: 'late_nineties', years: '1998', title: 'На пороге цифровой жизни', text: 'Двор, пейджер и взросление вместе с интернетом.' },
  ]
  const cities: Array<{ id: CityType; title: string; text: string }> = [
    { id: 'metropolis', title: 'Миллионник', text: 'Возможностей больше, аренда кусается.' },
    { id: 'industrial', title: 'Моногород', text: 'Завод рядом, здоровье и переезд дороже.' },
    { id: 'provincial', title: 'ПГТ и глубинка', text: 'Дешевле жить, сложнее найти выход.' },
  ]
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center border border-border bg-card px-8 py-12 text-center">
      <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-primary">
        Текстовый симулятор жизни
      </span>
      <h1 className="mt-3 font-sans text-6xl font-bold uppercase leading-none tracking-tight text-foreground">
        ЖИЗА
      </h1>
      <p className="mt-4 max-w-sm text-pretty font-mono text-sm leading-relaxed text-muted-foreground">
        Один ход — один год. Выбери исходную эпоху и место, а затем проживи жизнь
        от первого крика до семидесяти пяти. Каждый выбор оставляет эхо, которое догонит
        тебя годы спустя.
      </p>
      <div className="mt-8 w-full text-left">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Эпоха рождения</span>
        <div className="mt-2 grid gap-2">
          {eras.map((era) => (
            <button
              key={era.id}
              type="button"
              onClick={() => setBirthEra(era.id)}
              className={`cursor-pointer border px-4 py-3 text-left transition-all duration-200 ease-out ${
                birthEra === era.id ? 'border-primary bg-primary/10' : 'border-border hover:border-zinc-500 hover:bg-zinc-800/80'
              }`}
            >
              <span className="block font-mono text-xs text-foreground">{era.years} · {era.title}</span>
              <span className="mt-1 block font-mono text-[11px] text-muted-foreground">{era.text}</span>
            </button>
          ))}
        </div>
        <span className="mt-6 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Город детства</span>
        <div className="mt-2 grid gap-2">
          {cities.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => setCityType(city.id)}
              className={`cursor-pointer border px-4 py-3 text-left transition-all duration-200 ease-out ${
                cityType === city.id ? 'border-primary bg-primary/10' : 'border-border hover:border-zinc-500 hover:bg-zinc-800/80'
              }`}
            >
              <span className="block font-mono text-xs text-foreground">{city.title}</span>
              <span className="mt-1 block font-mono text-[11px] text-muted-foreground">{city.text}</span>
            </button>
          ))}
        </div>
      </div>
      <Button
        onClick={() => onStart(birthEra, cityType)}
        size="lg"
        className="mt-8 w-full font-mono uppercase tracking-[0.2em]"
      >
        Начать жизнь
      </Button>
    </div>
  )
}
