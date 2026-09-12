'use client'

import { useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import type { LifeState } from '@/lib/game/types'
import { audioManager, type AudioTrackKey } from '@/lib/audio/sound-manager'

function trackForState(state: LifeState | null): AudioTrackKey {
  if (!state) return 'intro'
  if (state.age >= 50) return 'oldage'
  if (state.age < 25) return 'era_90s'
  if (state.currentYear < 2000) return 'era_90s'
  if (state.currentYear <= 2014) return 'era_2000s'
  return 'era_modern'
}

export function AudioController({ state, startAudio }: { state: LifeState | null; startAudio?: boolean }) {
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(0.3)
  const [showVolume, setShowVolume] = useState(false)

  useEffect(() => {
    audioManager.init()
    setMuted(audioManager.getMutedStatus())
    setVolume(audioManager.getVolume())
  }, [])

  useEffect(() => {
    if (!startAudio) return
    audioManager.playTrack(trackForState(state))
  }, [state, startAudio])

  const toggleMute = () => {
    const nextMuted = audioManager.toggleMute()
    setMuted(nextMuted)
  }

  return (
    <div
      className="group fixed right-4 top-4 z-20 flex items-center gap-2 border border-border bg-card/80 p-1 text-zinc-500 backdrop-blur-sm transition-colors hover:text-zinc-300"
      onClick={() => setShowVolume(true)}
      onMouseLeave={() => setShowVolume(false)}
    >
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? 'Включить звук' : 'Выключить звук'}
        title={muted ? 'Включить звук' : 'Выключить звук'}
        className="p-1 transition-colors hover:text-zinc-300"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${showVolume ? 'w-[72px] opacity-100' : 'w-0 opacity-0 group-hover:w-[72px] group-hover:opacity-100'}`}>
        <label className="sr-only" htmlFor="ambient-volume">Громкость фоновой музыки</label>
        <input
          id="ambient-volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => {
            const nextVolume = Number(event.target.value)
            audioManager.setVolume(nextVolume)
            setVolume(nextVolume)
          }}
          className="h-1 w-[72px] cursor-pointer appearance-none rounded bg-zinc-800 accent-zinc-400"
        />
      </div>
    </div>
  )
}
