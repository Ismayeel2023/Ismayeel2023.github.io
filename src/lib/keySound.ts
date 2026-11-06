/**
 * Synthesised mechanical-keyboard click (no audio files).
 *
 * One press = one short, dry hit made of two noise layers that start together:
 * a bright "tick" (switch) and a damped low "thock" (keycap bottoming out).
 * Everything decays within ~40 ms and there is no pitched tone, reverb or
 * compressor, so presses never ring, buzz or echo. A press is also ignored
 * if one just played, so fast double events can't stack up.
 */

let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let noise: AudioBuffer | null = null;
let lastAt = 0;
let muted = false;

export const setKeySoundMuted = (value: boolean) => {
  muted = value;
};

function setup() {
  if (ctx) return ctx;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  out = ctx.createGain();
  out.gain.value = 0.7;
  out.connect(ctx.destination);

  // Pre-shaped burst: noise with a fast exponential decay baked in.
  const len = Math.floor(ctx.sampleRate * 0.05);
  noise = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.12));
  return ctx;
}

function layer(ac: AudioContext, at: number, type: BiquadFilterType, freq: number, q: number, gain: number, rate: number) {
  if (!noise || !out) return;
  const src = ac.createBufferSource();
  src.buffer = noise;
  src.playbackRate.value = rate;
  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const g = ac.createGain();
  g.gain.value = gain;
  src.connect(filter).connect(g).connect(out);
  src.start(at);
}

/**
 * Play a key sound. `down` is the main press; `up` is a much quieter release
 * tick for components that track the physical key-up. `heavy` = big keys.
 */
export function playKey(phase: 'down' | 'up' = 'down', heavy = false) {
  if (muted) return;
  try {
    const ac = setup();
    if (!ac) return;
    if (ac.state === 'suspended') void ac.resume();

    const now = ac.currentTime;
    if (phase === 'down') {
      if (now - lastAt < 0.04) return; // de-duplicate stacked events
      lastAt = now;
    }
    const at = now + 0.002;
    const v = 0.94 + Math.random() * 0.12; // subtle per-press variation

    if (phase === 'down') {
      layer(ac, at, 'highpass', 3000 * v, 0.7, 0.45, 1.6 * v); // tick
      layer(ac, at, 'lowpass', (heavy ? 550 : 800) * v, 0.8, heavy ? 1.3 : 1, 0.55 * v); // thock
    } else {
      layer(ac, at, 'highpass', 2600 * v, 0.7, 0.14, 1.8 * v);
    }
  } catch {
    /* sound is a nicety; never break interaction */
  }
}

/** A single press for clicks where key-up isn't tracked. */
export function playKeystroke(heavy = false) {
  playKey('down', heavy);
}
