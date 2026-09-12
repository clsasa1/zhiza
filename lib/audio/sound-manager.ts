import { Howl } from 'howler'

export type AudioTrackKey = 'intro' | 'era_90s' | 'era_2000s' | 'era_modern' | 'oldage'

class AudioManager {
  private currentTrack: Howl | null = null
  private currentKey: AudioTrackKey | null = null
  private muted = false
  private volume = 0.3
  private initialized = false
  private readonly tracks: Record<AudioTrackKey, string> = {
    intro: '/audio/ambient_intro.mp3',
    era_90s: '/audio/ambient_90s.mp3',
    era_2000s: '/audio/ambient_2000s.mp3',
    era_modern: '/audio/ambient_modern.mp3',
    oldage: '/audio/ambient_oldage.mp3',
  }

  init(): void {
    if (this.initialized || typeof window === 'undefined') return
    const savedVolume = Number.parseFloat(window.localStorage.getItem('zhiza_audio_volume') ?? '')
    if (Number.isFinite(savedVolume)) this.volume = Math.max(0, Math.min(1, savedVolume))
    const savedMute = window.localStorage.getItem('zhiza_audio_muted')
      ?? window.localStorage.getItem('zhiza-audio-muted')
    if (savedMute !== null) this.muted = savedMute === 'true'
    this.initialized = true
  }

  playTrack(key: AudioTrackKey): void {
    if (this.currentKey === key && this.currentTrack) {
      if (!this.muted && !this.currentTrack.playing()) this.currentTrack.play()
      return
    }

    const nextTrack = new Howl({
      src: [this.tracks[key]],
      html5: true,
      loop: true,
      volume: 0,
      onload: () => {
        if (this.currentTrack !== nextTrack || this.muted) return
        nextTrack.play()
        nextTrack.fade(0, this.volume, 2000)
      },
      onloaderror: (_id, error) => {
        console.warn(`Ambient track unavailable: ${this.tracks[key]}`, error)
      },
    })
    const oldTrack = this.currentTrack

    if (oldTrack) {
      oldTrack.fade(oldTrack.volume(), 0, 1500)
      window.setTimeout(() => {
        oldTrack.stop()
        oldTrack.unload()
      }, 1600)
    }

    this.currentTrack = nextTrack
    this.currentKey = key

    if (!this.muted && nextTrack.state() === 'loaded') {
      nextTrack.play()
      nextTrack.fade(0, this.volume, 2000)
    }
  }

  toggleMute(): boolean {
    this.muted = !this.muted
    this.persistMute()
    if (this.muted) {
      this.currentTrack?.fade(this.currentTrack.volume(), 0, 500)
      window.setTimeout(() => this.currentTrack?.pause(), 500)
    } else if (this.currentTrack) {
      this.currentTrack.play()
      this.currentTrack.fade(0, this.volume, 500)
    }
    return this.muted
  }

  setMuted(muted: boolean): void {
    if (this.muted === muted) return
    this.toggleMute()
  }

  setVolume(value: number): void {
    this.volume = Math.max(0, Math.min(1, value))
    if (this.currentTrack && !this.muted) this.currentTrack.volume(this.volume)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('zhiza_audio_volume', this.volume.toString())
    }
  }

  getVolume(): number {
    return this.volume
  }

  getMutedStatus(): boolean {
    return this.muted
  }

  private persistMute(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('zhiza_audio_muted', String(this.muted))
    }
  }
}

export const audioManager = new AudioManager()
