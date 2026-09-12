import { Game } from '@/components/game/game'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 py-6 sm:py-10">
      <div className="mb-6 flex w-full max-w-5xl items-center justify-between">
        <span className="font-sans text-lg font-bold uppercase tracking-widest text-foreground">
          ЖИЗА
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Этап 0 · 0–70 лет
        </span>
      </div>
      <div className="w-full">
        <Game />
      </div>
    </main>
  )
}
