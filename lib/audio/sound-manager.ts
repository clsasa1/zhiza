import { Howl } from 'howler'

export type AudioTrackKey = 'intro' | 'era_90s' | 'era_2000s' | 'era_modern' | 'oldage'

class AudioManager {
  private currentTrack: Howl | null = null
  private currentKey: AudioTrackKey | null = null
  private muted = false
  private readonly volume = 0.3
  private readonly tracks: Record<AudioTrackKey, string> = {
    intro: '/audio/ambient_intro.mp3',
    era_90s: '/audio/ambient_90s.mp3',
    era_2000s: '/audio/ambient_2000s.mp3',
    era_modern: '/audio/ambient_modern.mp3',
    oldage: '/audio/ambient_oldage.mp3',
  }

  playTrack(key: AudioTrackKey): void {
    if (this.currentKey === key && this.currentTrack?.playing()) return

    const nextTrack = new Howl({
      src: [this.tracks[key]],
      html5: true,
      loop: true,
      volume: 0,
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

    if (!this.muted) {
      nextTrack.play()
      nextTrack.fade(0, this.volume, 2000)
    }
  }

  toggleMute(): boolean {
    this.muted = !this.muted
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

  getMutedStatus(): boolean {
    return this.muted
  }
}

export const audioManager = new AudioManager()
