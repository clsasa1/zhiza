'use client'

import { useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import type { LifeState } from '@/lib/game/types'
import { audioManager, type AudioTrackKey } from '@/lib/audio/sound-manager'

function trackForState(state: LifeState | null): AudioTrackKey {
  if (!state) return 'intro'
  if (state.age >= 55) return 'oldage'
  if (state.currentYear < 2000) return 'era_90s'
  if (state.currentYear <= 2014) return 'era_2000s'
  return 'era_modern'
}

export function AudioController({ state, startAudio }: { state: LifeState | null; startAudio?: boolean }) {
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const stored = window.localStorage.getItem('zhiza-audio-muted')
    const initialMuted = stored === 'true'
    audioManager.setMuted(initialMuted)
    setMuted(initialMuted)
  }, [])

  useEffect(() => {
    if (!startAudio) return
    audioManager.playTrack(trackForState(state))
  }, [state, startAudio])

  const toggleMute = () => {
    const nextMuted = audioManager.toggleMute()
    window.localStorage.setItem('zhiza-audio-muted', String(nextMuted))
    setMuted(nextMuted)
  }

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? 'Включить звук' : 'Выключить звук'}
      title={muted ? 'Включить звук' : 'Выключить звук'}
      className="fixed right-4 top-4 z-20 border border-border bg-card/80 p-2 text-muted-foreground transition-colors hover:text-foreground"
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  )
}
