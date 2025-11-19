export const playSignal = (type: 'alert' | 'finish') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'alert') {
    // Gentle chime
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } else {
    // Finish signal (longer)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  }
};

export const playContinuousSignal = (): (() => void) => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return () => {};

  let intervalId: number | null = null;
  let currentCtx: AudioContext | null = null;

  const playOnce = () => {
    const ctx = new AudioContext();
    currentCtx = ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Repeating beep sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);

    // Clean up context after sound finishes
    setTimeout(() => {
      ctx.close();
    }, 400);
  };

  // Play immediately
  playOnce();

  // Then repeat every 800ms
  intervalId = window.setInterval(playOnce, 800);

  // Return stop function
  return () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (currentCtx) {
      currentCtx.close();
      currentCtx = null;
    }
  };
};
