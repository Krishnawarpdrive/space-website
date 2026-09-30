"use client";

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

// Eases registered by the source theme.
CustomEase.create("primary-ease", "0.62, 0.05, 0.01, 0.99");
CustomEase.create("primary-ease-out", ".34, 1.56, 0.64, 1");
CustomEase.create("elastic-css", ".2, 1.33, .25 ,1");
CustomEase.create("ease-in-css", ".25, 1, 0.1 ,1");
const SPLASH_BLUR_EASE = CustomEase.create(
  "splash-blur",
  "M0,0 C0.5,0 0.741,0.047 0.785,0.073 0.88,0.13 0.9,0.23 1,1 ",
);

/**
 * Elements opt in with space-separated tokens, each optionally carrying a delay:
 *   data-leave="opacity:2.15 planet-splash"   data-enter="planet"
 * Token names match the source attribute suffixes (`transition-leave-<name>`).
 */
type Runner = (el: Element, delay: number) => gsap.core.Tween | void;

const LEAVE: Record<string, Runner> = {
  "blur-splash": (el) =>
    gsap.to(el, { duration: 1.6, delay: 0.7, yPercent: -40, opacity: 0.4, filter: "blur(20px)", scale: 5, ease: SPLASH_BLUR_EASE }),
  "width-splash": (el) => gsap.to(el, { delay: 0.6, duration: 1.5, scale: 2.8, rotate: "1deg", ease: "expo.in" }),
  "planet-splash": (el) => gsap.to(el, { delay: 0.2, duration: 2, filter: "blur(20px)", scale: 3, yPercent: 40, ease: "expo.in" }),
  "move-splash": (el) =>
    gsap.to(el, {
      duration: 3,
      transformOrigin: "top center",
      scale: 2,
      ease: "expo.inOut",
      force3D: true,
      onComplete: () => void ((el as HTMLElement).style.display = "none"),
    }),
  blur: (el, d) => gsap.to(el, { duration: 0.6, delay: d, rotate: "3deg", opacity: 0, filter: "blur(80px)", scale: 4 }),
  "scale-opacity": (el) => gsap.to(el, { duration: 0.7, opacity: 0, filter: "blur(20px)", scale: 1.8, ease: "power4.out" }),
  "reveal-bottom": (el) => gsap.to(el, { duration: 0.6, y: "-100%", ease: "power4.out" }),
  "from-box": (el) => gsap.to(el, { duration: 1.2, scale: 1, opacity: 1, ease: "ease-in-css" }),
  opacity: (el, d) => gsap.to(el, { duration: 0.4, opacity: 0, delay: d }),
  "opacity-2": (el, d) => gsap.to(el, { duration: 0.3, opacity: 0, delay: d }),
  mask: (el) => gsap.to(el, { opacity: 0, duration: 1 }),
  "mask-2": (el) => gsap.to(el, { opacity: 0, duration: 1 }),
  "opacity-filter": (el) => gsap.to(el, { filter: "opacity(0)", duration: 1 }),
  "translate-y": (el) => gsap.to(el, { duration: 0.3, y: "-100%", opacity: 0 }),
};

const ENTER: Record<string, Runner> = {
  monkey: (el) =>
    gsap.from(el, { scale: 4, filter: "blur(40px)", transformOrigin: "top center", duration: 3, ease: "power4.out" }),
  planet: (el) =>
    gsap.from(el, { scale: 0, filter: "blur(10px)", yPercent: 30, transformOrigin: "top center", duration: 4, ease: "power3.out" }),
  marquee: (el) =>
    gsap.fromTo(
      el,
      { maskImage: "linear-gradient(to right, black -90%, transparent 0%)" },
      { duration: 5, delay: 1, maskImage: "linear-gradient(to right, black 100%, transparent 190%)", ease: "power4.out" },
    ),
  btn: (el, d) => gsap.from(el, { yPercent: 120, duration: 0.7, ease: "expo.inOut", delay: d }),
  "btn-2": (el, d) => gsap.from(el, { yPercent: -120, duration: 0.7, ease: "expo.inOut", delay: d }),
  "from-top": (el) => gsap.from(el, { yPercent: -100, duration: 2, ease: "power3.out" }),
  "scale-opacity": (el) => gsap.from(el, { duration: 0.8, opacity: 0, filter: "blur(20px)", scale: 1.8, ease: "power4.out" }),
  "scale-rotate": (el) => gsap.from(el, { duration: 0.8, filter: "blur(80px)", scale: 0.6, ease: "power4.out" }),
  "scale-rotate-bounce": (el) => gsap.from(el, { duration: 0.5, y: "-80%", filter: "blur(80px)", ease: "back.out(1.01)" }),
  "opacity-y": (el) => gsap.from(el, { filter: "blur(80px)", opacity: 0, duration: 0.4, ease: "power2.out" }),
  "reveal-bottom": (el) => gsap.from(el, { duration: 0.8, delay: 0.2, y: "110%", ease: "power4.out" }),
  opacity: (el, d) => gsap.from(el, { opacity: 0, duration: 1, delay: d }),
  "opacity-filter": (el) => gsap.from(el, { filter: "opacity(0)", duration: 1 }),
  "move-down": (el) => gsap.to(el, { yPercent: 18, duration: 2.5, ease: "ease-in-css" }),
};

function run(root: ParentNode, attr: "data-enter" | "data-leave", table: Record<string, Runner>) {
  root.querySelectorAll(`[${attr}]`).forEach((el) => {
    const tokens = (el.getAttribute(attr) ?? "").split(/\s+/).filter(Boolean);
    tokens.forEach((token) => {
      const [name, delay] = token.split(":");
      table[name]?.(el, delay ? parseFloat(delay) : 0);
    });
  });
}

export function runLeave(main: HTMLElement) {
  main.classList.remove("pageTransitionEnter");
  main.classList.add("pageTransitionLeave");
  run(main, "data-leave", LEAVE);
}

/**
 * Next.js reuses DOM nodes between routes that render the same tree (e.g. product → product),
 * so leave-tween inline styles and leave classes would otherwise leak into the next page.
 * Barba replaced the container on source; this restores that clean slate.
 */
export function resetLeave(main: HTMLElement) {
  const touched = main.querySelectorAll("[data-leave], [data-enter]");
  gsap.killTweensOf(touched);
  gsap.set(touched, { clearProps: "opacity,filter,transform,scale,rotate,translate,maskImage,display" });
  main.classList.remove("pageTransitionLeave");
  [...main.classList].filter((c) => c.startsWith("leave-to-")).forEach((c) => main.classList.remove(c));
}

export function runEnter(main: HTMLElement) {
  main.classList.add("pageTransitionEnter");
  run(main, "data-enter", ENTER);

  // Word reveal for `[data-enter-reveal-text]` headings (primary-ease, stagger .07).
  const words = main.querySelectorAll("[data-enter-reveal-text] .single-word-inner");
  if (words.length) {
    gsap.fromTo(words, { yPercent: 120, rotate: 0.001 }, { yPercent: 0, rotate: 0.001, ease: "primary-ease", duration: 1.47, stagger: 0.07 });
  }
}
