import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private readonly STORAGE_KEY = 'wedding_invitation_music_enabled';
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private synthGainNode: GainNode | null = null;
  private synthInterval: any = null;
  private isSynthRunning = false;
  private userExplicitlyMuted = false;
  private interactionListenersAttached = false;
  private isPlayAttemptInProgress = false;
  private fadeAnimationId: number | null = null;

  public readonly isPlaying = signal<boolean>(false);
  public readonly isMuted = signal<boolean>(false);
  public readonly isAudioReady = signal<boolean>(false);
  public readonly targetVolume = 0.32;

  // constructor() {
  //   this.initAudio();
  //   this.tryAutoplay();
  // }

  initAudio(): void {
    if (typeof window === 'undefined') return;

    try {
      this.audio = new Audio();
      this.audio.src = 'assets/music/Kesariya.mp3';
      this.audio.loop = true;
      this.audio.volume = this.targetVolume;
      this.audio.preload = 'auto';

      this.audio.addEventListener('play', () => {
        this.isPlaying.set(true);
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying.set(false);
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('HTML5 Audio fallback to Web Audio Synthesizer', e);
        this.isAudioReady.set(true);
      });

      this.audio.addEventListener('canplaythrough', () => {
        this.isAudioReady.set(true);
      });
    } catch (err) {
      console.warn('Audio initialization notice:', err);
    }
  }

  /**
   * Attempts autoplay immediately on page open.
   * If the browser blocks unprompted autoplay, registers one-time interaction
   * listeners (click, touch, scroll, keydown) to start playing on the first gesture.
   */
  public tryAutoplay(): void {
    if (typeof window === 'undefined') return;

    // Avoid autoplaying on admin route
    if (window.location.pathname.toLowerCase().includes('/admin')) {
      return;
    }

    if (this.isPlaying() || this.userExplicitlyMuted || this.isPlayAttemptInProgress) {
      return;
    }

    this.play()
      .then((started) => {
        if (!started) {
          this.attachInteractionAutoplay();
        }
      })
      .catch(() => {
        this.attachInteractionAutoplay();
      });
  }

  private attachInteractionAutoplay(): void {
    if (this.interactionListenersAttached || typeof window === 'undefined') return;
    this.interactionListenersAttached = true;

    const unlockEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown', 'wheel'];

    const onUserInteract = () => {
      if (!this.isPlaying() && !this.userExplicitlyMuted) {
        this.play();
      }
      cleanup();
    };

    const cleanup = () => {
      unlockEvents.forEach((evt) => {
        window.removeEventListener(evt, onUserInteract, true);
        document.removeEventListener(evt, onUserInteract, true);
      });
      this.interactionListenersAttached = false;
    };

    unlockEvents.forEach((evt) => {
      window.addEventListener(evt, onUserInteract, { capture: true, once: true, passive: true });
      document.addEventListener(evt, onUserInteract, { capture: true, once: true, passive: true });
    });
  }

  public async play(): Promise<boolean> {
    if (this.isMuted()) {
      this.unmute();
    }
    this.userExplicitlyMuted = false;

    if (this.isPlayAttemptInProgress) {
      return false;
    }

    if (this.audio) {
      this.isPlayAttemptInProgress = true;
      try {
        this.cancelFade();
        this.audio.volume = 0;
        const promise = this.audio.play();
        if (promise !== undefined) {
          await promise;
          this.fadeVolume(this.targetVolume, 1200);
          this.isPlaying.set(true);
          this.savePref(true);
          this.isPlayAttemptInProgress = false;
          return true;
        }
      } catch (err: any) {
        this.isPlayAttemptInProgress = false;
        // NotAllowedError is normal browser behavior when autoplaying before user gesture.
        // We gracefully activate interaction listeners instead of logging loud warnings.
        if (err?.name !== 'NotAllowedError') {
          console.warn('Audio playback notice:', err);
        }
        return false;
      }
    } else {
      this.startSynth();
      return true;
    }
    this.isPlayAttemptInProgress = false;
    return false;
  }

  public pause(): void {
    this.userExplicitlyMuted = true;
    if (this.audio && !this.audio.paused) {
      this.fadeVolume(0, 600, () => {
        this.audio?.pause();
        this.isPlaying.set(false);
      });
    } else if (this.isSynthRunning) {
      this.stopSynth();
    }
    this.savePref(false);
  }

  public toggle(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  public mute(): void {
    this.cancelFade();
    this.userExplicitlyMuted = true;
    this.isMuted.set(true);
    if (this.audio) {
      this.audio.muted = true;
    }
    this.savePref(false);
  }

  public unmute(): void {
    this.userExplicitlyMuted = false;
    this.isMuted.set(false);
    if (this.audio) {
      this.audio.muted = false;
      this.audio.volume = Math.max(0, Math.min(1, this.targetVolume));
    }
  }

  private cancelFade(): void {
    if (this.fadeAnimationId !== null) {
      cancelAnimationFrame(this.fadeAnimationId);
      this.fadeAnimationId = null;
    }
  }

  private fadeVolume(targetVol: number, durationMs: number, onComplete?: () => void): void {
    if (!this.audio) return;
    this.cancelFade();

    const safeTargetVol = Math.max(0, Math.min(1, targetVol));
    const startVol = Math.max(0, Math.min(1, this.audio.volume));
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = Math.max(0, now - startTime);
      const progress = durationMs > 0 ? Math.min(elapsed / durationMs, 1) : 1;
      const nextVol = Math.max(0, Math.min(1, startVol + (safeTargetVol - startVol) * progress));

      if (this.audio) {
        this.audio.volume = nextVol;
      }

      if (progress < 1) {
        this.fadeAnimationId = requestAnimationFrame(step);
      } else {
        this.fadeAnimationId = null;
        if (this.audio) {
          this.audio.volume = safeTargetVol;
        }
        if (onComplete) onComplete();
      }
    };

    this.fadeAnimationId = requestAnimationFrame(step);
  }

  private savePref(enabled: boolean): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(this.STORAGE_KEY, enabled ? 'true' : 'false');
      } catch (e) { }
    }
  }

  /**
   * Procedural Indian Wedding Ambient Synthesizer
   * Creates gentle tanpura drone and soothing bansuri flute notes using Web Audio API.
   */
  private startSynth(): void {
    if (this.isSynthRunning || typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.audioContext = new AudioCtx();

      const masterGain = this.audioContext.createGain();
      masterGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      masterGain.connect(this.audioContext.destination);
      this.synthGainNode = masterGain;

      // Base drone (Sa + Pa)
      const baseSa = 220; // A3
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseSa, this.audioContext.currentTime);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseSa * 1.5, this.audioContext.currentTime);

      const droneGain = this.audioContext.createGain();
      droneGain.gain.setValueAtTime(0.08, this.audioContext.currentTime);
      osc1.connect(droneGain);
      osc2.connect(droneGain);
      droneGain.connect(masterGain);

      osc1.start();
      osc2.start();

      // Melodic notes sequence (Raag Yaman notes: Sa, Re, Ga, Ma#, Pa, Dha, Ni)
      const scale = [baseSa, baseSa * 1.125, baseSa * 1.25, baseSa * 1.406, baseSa * 1.5, baseSa * 1.6875, baseSa * 1.875];
      let noteIndex = 0;

      this.synthInterval = setInterval(() => {
        if (!this.audioContext || this.audioContext.state === 'closed') return;
        const noteOsc = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();
        const now = this.audioContext.currentTime;

        const freq = scale[noteIndex % scale.length];
        noteIndex = (noteIndex + 1 + Math.floor(Math.random() * 2)) % scale.length;

        noteOsc.type = 'sine';
        noteOsc.frequency.setValueAtTime(freq, now);

        // Flute attack and smooth decay
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.4);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        noteOsc.connect(noteGain);
        noteGain.connect(masterGain);

        noteOsc.start(now);
        noteOsc.stop(now + 3.0);
      }, 2600);

      this.isSynthRunning = true;
      this.isPlaying.set(true);
      this.savePref(true);
    } catch (e) {
      console.warn('Web Audio Synthesizer init exception:', e);
    }
  }

  private stopSynth(): void {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) { }
      this.audioContext = null;
    }
    this.isSynthRunning = false;
    this.isPlaying.set(false);
  }
}
