"use strict";

/* ============================================================
   Web Audio API - osnovna infrastruktura
   ============================================================ */

// AudioContext ustvarimo lazy (šele ob prvi interakciji), ker
// brskalniki zahtevajo uporabniško gesto za predvajanje zvoka.
let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Pomožnik: ovojnica glasnosti (attack -> decay/release).
function envelope(gain, ctx, { attack = 0.005, peak = 0.5, decay = 0.3, start = 0 }) {
  const t = ctx.currentTime + start;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

// Pomožnik: en oscilator z ovojnico.
function playTone(ctx, { type = "sine", freq = 440, attack, peak, decay, start = 0, freqEnd = null }) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t = ctx.currentTime + start;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (freqEnd !== null) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, t + (attack || 0) + (decay || 0.3));
  }

  envelope(gain, ctx, { attack, peak, decay, start });

  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + (attack || 0) + (decay || 0.3) + 0.05);
}

// Pomožnik: buffer belega šuma za tolkala / aplavz / činele.
function makeNoiseBuffer(ctx, seconds) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function playNoise(ctx, { seconds = 0.3, peak = 0.5, decay = 0.3, filterType = null, filterFreq = 1000 }) {
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = makeNoiseBuffer(ctx, seconds);

  let node = src;
  if (filterType) {
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = filterFreq;
    src.connect(filter);
    node = filter;
  }

  envelope(gain, ctx, { attack: 0.005, peak, decay });
  node.connect(gain).connect(ctx.destination);
  src.start();
  src.stop(ctx.currentTime + seconds + 0.05);
}

/* ============================================================
   Ločena funkcija za vsak tip zvoka
   ============================================================ */

function soundBeep() {
  const ctx = getCtx();
  playTone(ctx, { type: "square", freq: 880, attack: 0.005, peak: 0.4, decay: 0.18 });
}

function soundAirhorn() {
  const ctx = getCtx();
  // Več zamaknjenih frekvenc daje "debel" airhorn zvok.
  [0, 0.06, 0.12].forEach((start) => {
    playTone(ctx, { type: "sawtooth", freq: 330, attack: 0.02, peak: 0.3, decay: 0.5, start });
    playTone(ctx, { type: "sawtooth", freq: 440, attack: 0.02, peak: 0.25, decay: 0.5, start });
  });
}

function soundDrum() {
  const ctx = getCtx();
  // Kick: sinus, ki pade po frekvenci.
  playTone(ctx, { type: "sine", freq: 160, freqEnd: 50, attack: 0.005, peak: 0.9, decay: 0.25 });
  // Malo šuma za "udarec".
  playNoise(ctx, { seconds: 0.12, peak: 0.3, decay: 0.1, filterType: "lowpass", filterFreq: 400 });
}

function soundCymbal() {
  const ctx = getCtx();
  // Visokopasovno filtriran šum = činele.
  playNoise(ctx, { seconds: 0.9, peak: 0.35, decay: 0.8, filterType: "highpass", filterFreq: 6000 });
}

function soundLaugh() {
  const ctx = getCtx();
  // Serija hitrih "ha-ha" tonov z rahlim padanjem višine.
  const base = 300;
  for (let i = 0; i < 5; i++) {
    playTone(ctx, {
      type: "triangle",
      freq: base - i * 15,
      freqEnd: base - i * 15 + 60,
      attack: 0.01,
      peak: 0.3,
      decay: 0.12,
      start: i * 0.14,
    });
  }
}

function soundApplause() {
  const ctx = getCtx();
  // Aplavz = daljši pasovno filtriran šum z rahlim narastom.
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const seconds = 1.6;

  src.buffer = makeNoiseBuffer(ctx, seconds);
  filter.type = "bandpass";
  filter.frequency.value = 2500;
  filter.Q.value = 0.6;

  const t = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.5, t + 0.15);
  gain.gain.setValueAtTime(0.5, t + seconds - 0.5);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + seconds);

  src.connect(filter).connect(gain).connect(ctx.destination);
  src.start();
  src.stop(t + seconds + 0.05);
}

function soundAlarm() {
  const ctx = getCtx();
  // Izmenjava dveh tonov = sirena / alarm.
  const freqs = [800, 600, 800, 600, 800];
  freqs.forEach((f, i) => {
    playTone(ctx, { type: "square", freq: f, attack: 0.01, peak: 0.3, decay: 0.18, start: i * 0.2 });
  });
}

function soundWow() {
  const ctx = getCtx();
  // Drseča frekvenca navzgor pa navzdol = "wow".
  playTone(ctx, { type: "sine", freq: 300, freqEnd: 900, attack: 0.05, peak: 0.4, decay: 0.35 });
  playTone(ctx, { type: "sine", freq: 900, freqEnd: 400, attack: 0.05, peak: 0.4, decay: 0.35, start: 0.35 });
}

function soundGong() {
  const ctx = getCtx();
  // Več neharmoničnih parcialov z dolgim upadom = kovinski gong.
  [1, 1.6, 2.3, 3.1].forEach((mult, i) => {
    playTone(ctx, {
      type: "sine",
      freq: 120 * mult,
      attack: 0.01,
      peak: 0.35 / (i + 1),
      decay: 2.2,
    });
  });
}

/* ============================================================
   Konfiguracija gumbov (zvok + videz)
   ============================================================ */

const SOUNDS = [
  { key: "1", label: "Beep", emoji: "📟", color: "#e74c3c", play: soundBeep },
  { key: "2", label: "Airhorn", emoji: "📢", color: "#e67e22", play: soundAirhorn },
  { key: "3", label: "Boben", emoji: "🥁", color: "#f1c40f", play: soundDrum },
  { key: "4", label: "Činele", emoji: "🎶", color: "#2ecc71", play: soundCymbal },
  { key: "5", label: "Smeh", emoji: "😂", color: "#1abc9c", play: soundLaugh },
  { key: "6", label: "Aplavz", emoji: "👏", color: "#3498db", play: soundApplause },
  { key: "7", label: "Alarm", emoji: "🚨", color: "#9b59b6", play: soundAlarm },
  { key: "8", label: "Wow", emoji: "🤩", color: "#e84393", play: soundWow },
  { key: "9", label: "Gong", emoji: "🔔", color: "#607d8b", play: soundGong },
];

/* ============================================================
   Gradnja UI + dogodki
   ============================================================ */

const board = document.getElementById("board");
const padsByKey = {};

function triggerPad(sound, padEl) {
  try {
    sound.play();
  } catch (err) {
    console.error("Napaka pri predvajanju zvoka:", err);
  }
  // Vizualna animacija "stiska".
  padEl.classList.add("active");
  setTimeout(() => padEl.classList.remove("active"), 150);
}

SOUNDS.forEach((sound) => {
  const pad = document.createElement("button");
  pad.className = "pad";
  pad.style.setProperty("--pad-color", sound.color);
  pad.setAttribute("aria-label", `${sound.label} (tipka ${sound.key})`);
  pad.innerHTML = `
    <span class="hotkey">${sound.key}</span>
    <span class="emoji">${sound.emoji}</span>
    <span class="label">${sound.label}</span>
  `;

  pad.addEventListener("click", () => triggerPad(sound, pad));

  board.appendChild(pad);
  padsByKey[sound.key] = { sound, pad };
});

// Tipkovnične bližnjice 1-9.
document.addEventListener("keydown", (e) => {
  if (e.repeat) return; // ne sprožaj ob držanju tipke
  const entry = padsByKey[e.key];
  if (entry) {
    triggerPad(entry.sound, entry.pad);
  }
});
