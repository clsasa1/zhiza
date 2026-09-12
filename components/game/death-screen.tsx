import { Button } from '@/components/ui/button'
import type { LifeState } from '@/lib/game/types'
import { cityLabel } from '@/lib/game/engine'
import { tagLabel } from '@/lib/game/labels'

export function DeathScreen({
  state,
  onRestart,
}: {
  state: LifeState
  onRestart: () => void
}) {
  const memories = [...state.memories]
    .sort((a, b) => b.emotionalWeight - a.emotionalWeight)
    .slice(0, 3)
  const keyTrace = getKeyTrace(state)

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col border border-border bg-card">
      <div className="border-b border-destructive/50 bg-destructive/10 px-6 py-5 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-destructive">
          Жизнь окончена
        </span>
        <h1 className="mt-1 font-sans text-4xl font-bold uppercase tracking-tight text-foreground">
          {state.age} {state.age === 1 ? 'год' : 'лет'}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-px border-b border-border bg-border">
        <div className="bg-card px-4 py-3">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Город
          </span>
          <span className="font-mono text-sm text-foreground">{cityLabel(state.cityType)}</span>
        </div>
        <div className="bg-card px-4 py-3">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Остаток
          </span>
          <span className="font-mono text-sm tabular-nums text-foreground">
            {(state.metrics.money ?? 0).toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

      <p className="border-b border-border px-6 py-4 text-pretty font-mono text-sm leading-relaxed text-foreground/90">
        {state.deathReason}
      </p>

      <div className="border-b border-border px-6 py-5">
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Перед тем как всё погасло, вспомнилось...
        </span>
        {memories.length > 0 ? (
          <ol className="flex flex-col gap-3">
            {memories.map((memory) => (
              <li key={memory.id} className="flex gap-3">
                <span className="font-mono text-[10px] tabular-nums text-primary">
                  {String(memory.age).padStart(2, '0')}
                </span>
                <span className="font-mono text-xs leading-relaxed text-foreground/80">
                  {memory.text}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="font-mono text-xs leading-relaxed text-foreground/80">
            Перед глазами не пронеслось почти ничего. Серые обои, бесконечная лента новостей в телефоне и тяжёлое чувство, что жизнь так и не началась, хотя уже закончилась.
          </p>
        )}
      </div>

      <div className="grid gap-2 border-b border-border px-6 py-4 font-mono text-xs text-muted-foreground">
        <p>Стаж: <span className="text-foreground">{state.age} лет</span></p>
        <p>Деньги к концу: <span className="text-foreground">{(state.metrics.money ?? 0).toLocaleString('ru-RU')} ₽</span></p>
        <p>Ключевой след: <span className="text-foreground">{keyTrace}</span></p>
      </div>

      <div className="border-t border-border p-4">
        <Button onClick={onRestart} className="w-full font-mono uppercase tracking-widest">
          Прожить заново
        </Button>
      </div>
    </div>
  )
}

function getKeyTrace(state: LifeState): string {
  const money = state.metrics.money ?? 0
  const social = state.metrics.social ?? 0
  const memories = state.memories
  const youthMemories = memories.filter((memory) => memory.category === 'youth').length

  if (money >= 150_000 && state.metrics.stress >= 75) {
    return 'Человек, который всю жизнь копил на потом, но «потом» так и не наступило.'
  }
  if (social >= 70 && state.familyDecay <= 2) {
    return 'Тот, кто умел быть рядом, даже когда вокруг рушился мир.'
  }
  if (memories.length === 0) {
    return 'Очередная тень в переходе: пришёл ниоткуда, ушёл в никуда, не оставив после себя даже долгов.'
  }
  if (
    state.tags.includes('trait:boevoy') &&
    (state.tags.includes('status:uklonist') || state.age < 30)
  ) {
    return 'Вечный бунтарь, сломавший зубы о бетонную стену обстоятельств.'
  }
  if (youthMemories >= 2 && state.birthYear <= 1988) {
    return 'Тот, чья молодость так и осталась согрета кострами за гаражами в 90-х.'
  }
  if (
    (state.tags.includes('status:job_business') || state.tags.includes('trait:boss')) &&
    social < 35 &&
    (state.tags.includes('status:divorced') || state.familyDecay >= 5)
  ) {
    return 'Строитель чужого счастья, забывший построить своё собственное.'
  }
  if (
    state.tags.includes('status:ipoteka') &&
    (state.tags.includes('status:ulcer') || state.tags.includes('status:debt_hole'))
  ) {
    return 'Человек, променявший живую жизнь на стопку оплаченных квитанций.'
  }
  if (state.birthYear <= 1988 && state.metrics.money !== undefined && state.metrics.money < 0) {
    return 'Свидетель великих строек и больших надежд, растерявший всё в мутной воде перемен.'
  }
  if (state.tags.includes('trait:belated_grief') || state.parentStatus === 'deceased') {
    return 'Тот, кто искренне пытался быть хорошим сыном, но вечно опаздывал на поезд.'
  }
  if (state.tags.includes('rel:child_born') && state.familyDecay <= 2) {
    return 'Тихий труженик, чьё тепло навсегда останется в детских ладонях.'
  }
  if (state.tags.includes('trait:boss')) {
    return 'Человек, который построил надёжный гараж, но так и не решился сказать главное.'
  }
  if (state.tags.includes('asset:kvartira')) {
    return `Человек, у которого осталась ${tagLabel('asset:kvartira').toLowerCase()}.`
  }
  return 'Человек, который до последнего пытался успеть всё.'
}
