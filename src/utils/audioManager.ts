/**
 * Global Audio Manager for Wedding Background Music
 * - Starts from 00:00 upon the guest's tap on "Tap to open"
 * - Continues playing smoothly across video playback, page transitions, and scrolling
 * - Stops immediately and resets to 00:00 when returning to the unopened envelope (Back or Replay Envelope)
 * - Preserves mute/unmute preference across stop/reset/restart cycles without auto-unmuting
 * - Uses a single native HTML5 Audio element to prevent duplicate or overlapping playback
 */

import { getAssetUrl } from './assets';

export const WEDDING_AUDIO_SRC = getAssetUrl(
  'assets/aistudio/New_song.mp3_a78f27ce.mpeg'
);

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isStarted = false;
  private shouldBePlaying = false;
  private isMuted = false;
  private pendingResetToZero = false;
  private playbackToken = 0;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio(WEDDING_AUDIO_SRC);
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.muted = this.isMuted;
      try {
        this.audio.volume = this.isMuted ? 0 : 0.85;
      } catch {
        // iOS Safari does not allow programmatic volume changes
      }

      this.audio.addEventListener('loadedmetadata', () => {
        if (this.pendingResetToZero && this.audio) {
          try {
            this.audio.currentTime = 0;
          } catch {
            // ignore
          }
          this.pendingResetToZero = false;
        }
      });

      this.audio.addEventListener('play', () => {
        if (!this.shouldBePlaying && this.audio) {
          this.audio.pause();
          try {
            if (this.audio.readyState >= 1) {
              this.audio.currentTime = 0;
            }
          } catch {
            // ignore
          }
          return;
        }
        this.isStarted = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.notify();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('Background audio element error:', e);
      });
    }
    return this.audio;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Audio listener error:', err);
      }
    });
  }

  getState() {
    return {
      isStarted: this.isStarted,
      isMuted: this.isMuted,
      isPlaying: this.isStarted && !this.isMuted,
    };
  }

  /**
   * Starts background music from 00:00 upon direct user interaction.
   * Preserves existing mute preference and prevents duplicate overlapping playback.
   */
  start() {
    const audio = this.initAudioElement();

    // If already actively playing for the current open session, do not interrupt
    if (this.shouldBePlaying && this.isStarted && !audio.paused) {
      return;
    }

    const token = ++this.playbackToken;
    this.shouldBePlaying = true;
    this.pendingResetToZero = false;

    try {
      if (audio.readyState >= 1) {
        audio.currentTime = 0;
      } else {
        this.pendingResetToZero = true;
      }
    } catch {
      this.pendingResetToZero = true;
    }

    try {
      audio.muted = this.isMuted;
      try {
        audio.volume = this.isMuted ? 0 : 0.85;
      } catch {
        // iOS Safari does not allow programmatic volume changes
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (token !== this.playbackToken || !this.shouldBePlaying) {
              audio.pause();
              try {
                if (audio.readyState >= 1) {
                  audio.currentTime = 0;
                }
              } catch {
                // ignore
              }
              return;
            }
            this.isStarted = true;
            this.notify();
          })
          .catch((err) => {
            console.warn('Audio playback not allowed or interrupted:', err);
          });
      } else {
        this.isStarted = true;
        this.notify();
      }
    } catch (err) {
      console.warn('Audio start error:', err);
    }
  }

  /**
   * Toggles mute state while preserving playback position and without auto-starting
   * when the invitation is still on the unopened envelope screen.
   */
  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.audio) {
      this.audio.muted = this.isMuted;
      try {
        this.audio.volume = this.isMuted ? 0 : 0.85;
      } catch {
        // iOS Safari does not allow programmatic volume changes
      }

      // If invitation is already open and audio was paused/blocked while muted, resume cleanly
      if (!this.isMuted && this.shouldBePlaying && this.audio.paused) {
        const token = ++this.playbackToken;
        try {
          const playPromise = this.audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                if (token !== this.playbackToken || !this.shouldBePlaying) {
                  this.audio?.pause();
                  return;
                }
                this.isStarted = true;
                this.notify();
              })
              .catch((err) => {
                console.warn('Audio unmute resume skipped:', err);
              });
          }
        } catch (err) {
          console.warn('Audio unmute error:', err);
        }
      }
    }

    this.notify();
  }

  /**
   * Pauses audio if explicitly needed
   */
  pause() {
    this.shouldBePlaying = false;
    this.playbackToken++;
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    this.notify();
  }

  /**
   * Immediately pauses audio and resets playback position to 00:00.
   * Preserves the guest's current mute preference.
   */
  stop() {
    this.shouldBePlaying = false;
    this.isStarted = false;
    this.playbackToken++;

    if (this.audio) {
      this.audio.pause();
      try {
        if (this.audio.readyState >= 1) {
          this.audio.currentTime = 0;
          this.pendingResetToZero = false;
        } else {
          this.pendingResetToZero = true;
        }
      } catch {
        this.pendingResetToZero = true;
      }
    }

    this.notify();
  }
}

export const audioManager = new AudioManager();
