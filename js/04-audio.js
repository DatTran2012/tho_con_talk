"use strict";

/* -----------------------------------------------------------------------
   SECTION 4: WEB AUDIO AMBIENT & SEASONAL SOUNDSCAPE ENGINE
------------------------------------------------------------------------ */
class CafeAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.userMuted = false;
    this.lofiTimer = null;
    this.seasonDetailTimer = null;
    this.rainGain = null;
    this.rainFilter = null;
    this.stepIdx = 0;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  getActiveSeason() {
    return (
      SEASON_THEMES.find((s) => s.id === persistentArchive.selectedSeasonTheme) ||
      SEASON_THEMES[2]
    );
  }

  toggle() {
    if (this.enabled) {
      this.userMuted = true;
      this.stop();
    } else {
      this.userMuted = false;
      this.start();
    }
    syncSoundStatusUI();
    return this.enabled;
  }

  ensureAutoStarted() {
    if (this.userMuted) return;
    this.enabled = true;
    this.ensureContext();
    if (!this.ctx) return;

    if (!this.rainGain) {
      this.startRainNoise();
    } else {
      this.updateRainVolume(persistentArchive.rainVolume || 0.45);
    }

    if (!this.seasonDetailTimer) {
      this.applySeasonSoundscape();
    }

    if (!this.lofiTimer) {
      this.startLofiLoop();
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().then(() => {
        this.updateRainVolume(persistentArchive.rainVolume || 0.45);
      }).catch(() => {});
    }
    syncSoundStatusUI();
  }

  start() {
    this.ensureContext();
    if (!this.ctx) return;
    this.enabled = true;
    this.userMuted = false;
    this.startRainNoise();
    this.applySeasonSoundscape();
    this.startLofiLoop();
    syncSoundStatusUI();
  }

  stop() {
    this.enabled = false;
    if (this.lofiTimer) {
      clearInterval(this.lofiTimer);
      this.lofiTimer = null;
    }
    if (this.seasonDetailTimer) {
      clearInterval(this.seasonDetailTimer);
      this.seasonDetailTimer = null;
    }
    if (this.rainGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.rainGain.gain.cancelScheduledValues(now);
        this.rainGain.gain.setTargetAtTime(0.0001, now, 0.08);
      } catch (err) {}
    }
    syncSoundStatusUI();
  }

  startRainNoise() {
    if (!this.ctx) return;
    const season = this.getActiveSeason();
    if (this.rainGain) {
      this.updateRainVolume(persistentArchive.rainVolume || 0.45);
      if (this.rainFilter) {
        try {
          this.rainFilter.frequency.setTargetAtTime(season.filterFreq || 950, this.ctx.currentTime, 0.2);
        } catch (err) {}
      }
      return;
    }
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = season.filterFreq || 950;

      const gain = this.ctx.createGain();
      gain.gain.value = (persistentArchive.rainVolume || 0.45) * 0.08;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
      this.rainFilter = filter;
      this.rainGain = gain;
    } catch (err) {}
  }

  applySeasonSoundscape() {
    if (!this.ctx) return;
    const season = this.getActiveSeason();
    if (this.rainFilter) {
      try {
        this.rainFilter.frequency.setTargetAtTime(season.filterFreq || 950, this.ctx.currentTime, 0.25);
      } catch (err) {}
    }
    if (this.seasonDetailTimer) clearInterval(this.seasonDetailTimer);
    this.seasonDetailTimer = setInterval(() => {
      if (!this.enabled || !this.ctx) return;
      const curSeason = this.getActiveSeason();
      if (curSeason.id === "spring_blossom") {
        const bellNotes = [1046.5, 1174.66, 1318.51, 1567.98];
        const f = bellNotes[Math.floor(Math.random() * bellNotes.length)];
        this.playChime(f, 0.45, 0.028);
      } else if (curSeason.id === "summer_breeze") {
        const f = 3800 + Math.random() * 500;
        this.playChime(f, 0.07, 0.012);
      } else if (curSeason.id === "winter_chill") {
        const f = 110 + Math.random() * 35;
        this.playChime(f, 0.35, 0.025);
      } else {
        const f = 523.25 + Math.random() * 260;
        this.playChime(f, 0.14, 0.016);
      }
    }, 3400);
  }

  updateRainVolume(val) {
    persistentArchive.rainVolume = val;
    saveArchive();
    if (this.rainGain && this.ctx && this.enabled) {
      try {
        const now = this.ctx.currentTime;
        this.rainGain.gain.cancelScheduledValues(now);
        this.rainGain.gain.setTargetAtTime(val * 0.08, now, 0.08);
      } catch (err) {}
    }
  }

  startLofiLoop() {
    if (this.lofiTimer) clearInterval(this.lofiTimer);
    this.lofiTimer = setInterval(() => {
      if (!this.enabled || !this.ctx) return;
      const chId = persistentArchive.selectedLofiChannel;
      let notes = [261.63, 329.63, 392.0, 493.88];
      if (chId === "seasonal_auto") {
        notes = this.getActiveSeason().notes;
      } else {
        const ch = LOFI_CHANNELS.find((c) => c.id === chId);
        if (ch && (!ch.requires || isSecretUnlocked(ch.requires))) notes = ch.notes;
      }
      const freq = notes[this.stepIdx % notes.length];
      this.stepIdx++;
      this.playNote(freq, 1.4, 0.032);
    }, 1650);
  }

  playNote(freq, duration = 0.8, volume = 0.04) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, this.ctx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration + 0.05);
    } catch (err) {}
  }

  playChime(freq = 587.33, duration = 0.35, volume = 0.05) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, this.ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration + 0.04);
    } catch (err) {}
  }
}

const audioEngine = new CafeAudioEngine();

function syncSoundStatusUI() {
  const btnSound = document.getElementById("btn-toggle-sound");
  if (btnSound) {
    btnSound.textContent = audioEngine.enabled ? "🔊 Đang Bật Âm Thanh" : "🔇 Đã Tắt Âm Thanh";
  }
  const welcomePill = document.getElementById("btn-welcome-sound-pill");
  if (welcomePill) {
    welcomePill.textContent = audioEngine.enabled
      ? "🔊 Âm thanh quán: Đang bật"
      : "🔇 Âm thanh quán: Đang tắt (Chạm để bật)";
  }
}
