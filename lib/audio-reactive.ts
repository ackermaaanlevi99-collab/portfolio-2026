// Motor de audio reactivo. El sonido se genera en el navegador con Web Audio (osciladores y filtro).
// No reproduce música grabada ni carga archivos, así que no hay material con copyright.
// Solo se crea desde un gesto del usuario: nunca se reproduce solo.

export interface AudioEngine {
  /** Inicia el sonido. Debe llamarse desde un gesto del usuario (clic). */
  start: () => Promise<void>;
  /** Apaga el sonido con un desvanecimiento y libera el contexto. */
  stop: () => Promise<void>;
  /** Nivel de volumen actual, de 0 a 1 (RMS de la señal de salida). */
  level: () => number;
  isRunning: () => boolean;
  dispose: () => void;
}

const TARGET_GAIN = 0.08;
const FADE_SECONDS = 0.4;

export function createAudioEngine(): AudioEngine {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let analyser: AnalyserNode | null = null;
  let samples: Float32Array<ArrayBuffer> | null = null;
  let oscillators: OscillatorNode[] = [];
  let extras: AudioNode[] = [];
  let running = false;

  function releaseNodes() {
    for (const osc of oscillators) {
      try {
        osc.stop();
      } catch {
        // El oscilador ya estaba detenido.
      }
      osc.disconnect();
    }
    for (const node of extras) node.disconnect();
    oscillators = [];
    extras = [];
    master?.disconnect();
    analyser?.disconnect();
    master = null;
    analyser = null;
    samples = null;
  }

  return {
    async start() {
      if (running) return;
      const Ctor: typeof AudioContext | undefined =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) throw new Error('Web Audio no disponible');

      const context = new Ctor();
      ctx = context;
      if (context.state === 'suspended') await context.resume();

      const gain = context.createGain();
      gain.gain.value = 0;
      const node = context.createAnalyser();
      node.fftSize = 256;
      const buffer = new Float32Array(new ArrayBuffer(node.fftSize * 4));

      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      filter.Q.value = 0.7;

      // Dos osciladores ligeramente desafinados: un pad grave y sin picos.
      const low = context.createOscillator();
      low.type = 'sawtooth';
      low.frequency.value = 110;
      const high = context.createOscillator();
      high.type = 'triangle';
      high.frequency.value = 165;
      high.detune.value = -7;

      // El LFO mueve el corte del filtro: el sonido "respira" lentamente.
      const lfo = context.createOscillator();
      lfo.frequency.value = 0.08;
      const lfoDepth = context.createGain();
      lfoDepth.gain.value = 300;
      lfo.connect(lfoDepth);
      lfoDepth.connect(filter.frequency);

      low.connect(filter);
      high.connect(filter);
      filter.connect(gain);
      gain.connect(node);
      node.connect(context.destination);

      low.start();
      high.start();
      lfo.start();
      gain.gain.linearRampToValueAtTime(TARGET_GAIN, context.currentTime + FADE_SECONDS);

      master = gain;
      analyser = node;
      samples = buffer;
      oscillators = [low, high, lfo];
      extras = [lfoDepth, filter, gain, node];
      running = true;
    },

    async stop() {
      if (!running || !ctx || !master) {
        running = false;
        return;
      }
      running = false;
      const context = ctx;
      const gain = master;
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.linearRampToValueAtTime(0, context.currentTime + FADE_SECONDS);
      await new Promise((resolve) => window.setTimeout(resolve, FADE_SECONDS * 1000 + 50));
      releaseNodes();
      ctx = null;
      await context.close();
    },

    level() {
      if (!running || !analyser || !samples) return 0;
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
      const rms = Math.sqrt(sum / samples.length);
      return Math.min(1, rms * 6);
    },

    isRunning() {
      return running;
    },

    dispose() {
      running = false;
      releaseNodes();
      if (ctx) {
        void ctx.close();
        ctx = null;
      }
    },
  };
}
