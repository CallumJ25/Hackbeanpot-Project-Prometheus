export const SoundEffects = {
  correct: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
      oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.log('Sound not available');
    }
  },
  incorrect: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log('Sound not available');
    }
  }
};

export const Storage = {
  save: (key, data) => {
    try { 
      localStorage.setItem(`prometheus_${key}`, JSON.stringify(data)); 
    } catch (e) {
      console.log('Storage not available');
    }
  },
  load: (key, defaultValue = null) => {
    try {
      const data = localStorage.getItem(`prometheus_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) { 
      return defaultValue; 
    }
  },
  clear: (key) => {
    try { 
      localStorage.removeItem(`prometheus_${key}`); 
    } catch (e) {
      console.log('Storage not available');
    }
  }
};
