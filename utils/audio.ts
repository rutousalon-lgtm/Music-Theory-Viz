let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playNote = (frequency: number, duration: number = 0.5, type: OscillatorType = 'sine') => {
  const ctx = initAudio();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
};

export const playChord = (frequencies: number[], duration: number = 1.0) => {
    frequencies.forEach(freq => playNote(freq, duration, 'triangle'));
}
