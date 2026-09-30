"use client";

import { Howl, Howler } from "howler";
import { gsap } from "gsap";
import { asset, type SoundCue } from "./site-data";

// Volumes, sprites and cue timings mirror the source `soundHowl()` setup.
const LONG = { audioDelay: [0, 1_000_000] as [number, number] };

type Bank = Record<
  | "beep"
  | "thump"
  | "thumpSoft"
  | "disappear"
  | "splashEffect"
  | "splashSong"
  | "splashLoop"
  | "takeoff"
  | "touchdown"
  | "highpoint",
  Howl
>;

let bank: Bank | null = null;
const STORAGE_KEY = "soundMuted";

function readMuted(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

let muted = false;
const listeners = new Set<() => void>();

/** `useSyncExternalStore` bindings for the mute toggle. */
export function subscribeMuted(listener: () => void) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}
export const getMuted = () => muted;
export const getMutedServer = () => false;

function getBank(): Bank {
  if (bank) return bank;
  const src = (p: string) => [asset(`aud/${p}`)];
  bank = {
    beep: new Howl({ src: src("btn/beep.mp3"), volume: 0.05 }),
    thump: new Howl({ src: src("transition/thump.mp3"), volume: 0.6, sprite: LONG }),
    thumpSoft: new Howl({ src: src("transition/thump.mp3"), volume: 0.2, sprite: LONG }),
    disappear: new Howl({ src: src("transition/desappearance.mp3"), volume: 0.2, sprite: LONG }),
    splashEffect: new Howl({ src: src("transition/splash-transition-effect.mp3"), volume: 0.4, sprite: LONG }),
    splashSong: new Howl({ src: src("transition/splash-transition-song-new.mp3"), volume: 0.8, sprite: LONG }),
    splashLoop: new Howl({ src: src("songs/splash.mp3"), volume: 0.7, loop: true, sprite: LONG }),
    takeoff: new Howl({ src: src("songs/song-takeoff.mp3"), volume: 0, loop: true, sprite: { audioDelay: [4000, 1_000_000] } }),
    touchdown: new Howl({ src: src("songs/song-touchdown.mp3"), volume: 0, loop: true, sprite: LONG }),
    highpoint: new Howl({ src: src("songs/song-highpoint.mp3"), volume: 0, loop: true, sprite: LONG }),
  };
  return bank;
}

export function initSound() {
  muted = readMuted();
  Howler.mute(muted);
  listeners.forEach((l) => l());
  const onVisibility = () => {
    if (!muted) Howler.mute(document.hidden);
  };
  document.addEventListener("visibilitychange", onVisibility);
  return () => document.removeEventListener("visibilitychange", onVisibility);
}

export function toggleMuted() {
  muted = !muted;
  Howler.mute(muted);
  listeners.forEach((l) => l());
  try {
    window.localStorage.setItem(STORAGE_KEY, String(muted));
  } catch {
    // Storage unavailable (private mode); the toggle still works for this visit.
  }
}

export function playBeep() {
  getBank().beep.play();
}

export function playAboutOpen() {
  getBank().thumpSoft.play("audioDelay");
}

const fadeIn = (h: Howl, to: number) => gsap.fromTo(h, { volume: 0 }, { volume: to, duration: 1 });

export function playCue(cue: SoundCue) {
  const b = getBank();
  const soundtracks = { takeoff: b.takeoff, touchdown: b.touchdown, highpoint: b.highpoint };
  const stopOthers = (keep?: Howl) => {
    Object.values(soundtracks).forEach((h) => h !== keep && h.stop());
    if (keep) b.splashLoop.stop();
  };

  switch (cue) {
    case "splash-intro": {
      b.splashEffect.play("audioDelay");
      b.splashSong.play("audioDelay");
      window.setTimeout(() => {
        gsap.to(b.splashSong, { duration: 0.4, volume: 0, onComplete: () => void b.splashSong.stop() });
      }, 2900);
      window.setTimeout(() => {
        if (!b.splashLoop.playing()) b.splashLoop.play("audioDelay");
      }, 3050);
      window.setTimeout(() => b.thump.play("audioDelay"), 2950);
      stopOthers();
      return;
    }
    case "splash": {
      if (!b.splashLoop.playing()) b.splashLoop.play("audioDelay");
      window.setTimeout(() => b.thump.play("audioDelay"), 800);
      stopOthers();
      return;
    }
    default: {
      const track = soundtracks[cue];
      const target = { takeoff: 0.7, touchdown: 0.9, highpoint: 0.5 }[cue];
      b.thump.play("audioDelay");
      b.disappear.play("audioDelay");
      if (!track.playing()) {
        track.play("audioDelay");
        fadeIn(track, target);
      }
      stopOthers(track);
    }
  }
}
