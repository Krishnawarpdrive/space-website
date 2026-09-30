"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Loader } from "./Loader";
import { getMuted, getMutedServer, initSound, playAboutOpen, playCue, subscribeMuted, toggleMuted } from "./sound";
import type { SoundCue } from "./site-data";
import { resetLeave, runEnter, runLeave } from "./transitions";

gsap.registerPlugin(ScrollTrigger);

interface NavigateOptions {
  /** `main` class that reveals the destination sky during leave (e.g. `leave-to-takeoff`). */
  leaveClass?: string;
  cue?: SoundCue;
  /** ms to let leave animations play before routing (source: 800, 3000 from splash). */
  offset?: number;
}

interface ShellContext {
  navigate: (href: string, opts?: NavigateOptions) => void;
  aboutOpen: boolean;
  toggleAbout: () => void;
  muted: boolean;
  toggleMute: () => void;
}

const Ctx = createContext<ShellContext | null>(null);

export function useShell() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShell must be used inside <SiteShell>");
  return ctx;
}

const getMain = () => document.getElementById("main");

export function SiteShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loaded, setLoaded] = useState(false);
  // About is open only on the page it was opened on, so navigating closes it.
  const [aboutPath, setAboutPath] = useState<string | null>(null);
  const aboutOpen = aboutPath === pathname;
  const muted = useSyncExternalStore(subscribeMuted, getMuted, getMutedServer);
  const lenisRef = useRef<Lenis | null>(null);
  const leavingRef = useRef(false);

  useEffect(() => {
    history.scrollRestoration = "manual";
    return initSound();
  }, []);

  // Smooth scroll, parallax, scrubs and scroll-past-bottom are rebuilt for every page.
  useEffect(() => {
    const main = getMain();
    if (!main) return;

    window.scrollTo(0, 0);
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.5, duration: 1.3 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => bindScrubs(main), main);
    const unbindParallax = bindParallax(main);
    const unbindBottom = bindScrollPastBottom(main);
    ScrollTrigger.refresh();

    return () => {
      unbindParallax();
      unbindBottom();
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [pathname]);

  // Enter transition: after the first-load loader, then on every route change.
  useEffect(() => {
    const main = getMain();
    if (!main || !loaded) return;
    leavingRef.current = false;
    resetLeave(main);
    runEnter(main);
  }, [pathname, loaded]);

  useEffect(() => {
    getMain()?.classList.toggle("about-open", aboutOpen);
  }, [aboutOpen, pathname]);

  const handleLoaded = useCallback(() => setLoaded(true), []);

  const navigate = useCallback(
    (href: string, opts: NavigateOptions = {}) => {
      const main = getMain();
      if (!main || leavingRef.current) return;
      leavingRef.current = true;
      if (opts.cue) playCue(opts.cue);
      if (opts.leaveClass) main.classList.add(opts.leaveClass);
      lenisRef.current?.stop();
      runLeave(main);
      router.prefetch(href);
      window.setTimeout(() => router.push(href, { scroll: false }), opts.offset ?? 800);
    },
    [router],
  );

  const value = useMemo<ShellContext>(
    () => ({
      navigate,
      aboutOpen,
      toggleAbout: () => {
        if (!aboutOpen) playAboutOpen();
        setAboutPath(aboutOpen ? null : pathname);
      },
      muted,
      toggleMute: toggleMuted,
    }),
    [navigate, aboutOpen, muted, pathname],
  );

  return (
    <Ctx.Provider value={value}>
      {!loaded && <Loader pathname={pathname} onDone={handleLoaded} />}
      {children}
    </Ctx.Provider>
  );
}

/** `[data-scrub-*]`, `[data-scrub-1]`, `[data-scrub-text]` and `.scrollerIndicator` — source `animationScrub()` + `anims()`. */
function bindScrubs(main: HTMLElement) {
  main.querySelectorAll<HTMLElement>("[data-scrub]").forEach((el) => {
    const [y = 0, x = 0, rotate = 0, zoom = 1] = (el.dataset.scrub ?? "0").split(",").map(Number);
    gsap.to(el, {
      yPercent: y,
      xPercent: x,
      rotate,
      scale: zoom,
      ease: "none",
      scrollTrigger: { trigger: main, start: "top top", end: "bottom bottom", scrub: true },
    });
  });

  main.querySelectorAll("[data-scrub-1]").forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: 0, rotate: 0.001 },
      { yPercent: -10, rotate: 0.001, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom", scrub: true } },
    );
  });

  const words = main.querySelectorAll("[data-scrub-text] .single-word-inner");
  if (words.length) {
    gsap.fromTo(
      words,
      { yPercent: 120, rotate: 0.001 },
      { yPercent: 0, rotate: 0.001, ease: "none", stagger: 0.1, scrollTrigger: { start: "12% top", end: "+=30%", scrub: true } },
    );
  }

  // Source targets `.mainTrigger`, which product pages lack, so it scrubs over the whole document.
  const indicator = main.querySelector(".scrollerIndicator");
  if (indicator) {
    gsap.to(indicator, {
      scaleX: 1,
      ease: "none",
      force3D: false,
      scrollTrigger: { trigger: main, start: "top top", end: "bottom bottom", scrub: 1 },
    });
  }
}

/** Mouse parallax on `[data-parallax="depth"]` — pointer:fine only, source `anims()`. */
function bindParallax(main: HTMLElement) {
  if (window.matchMedia("(pointer: coarse)").matches) return () => {};
  const els = [...main.querySelectorAll<HTMLElement>("[data-parallax]"), ...document.querySelectorAll<HTMLElement>(".loading-screen [data-parallax]")];
  let frame = 0;
  let lastX = 0;
  let lastY = 0;
  const onMove = (event: MouseEvent) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      if (Math.abs(dx - lastX) < 2 && Math.abs(dy - lastY) < 2) return;
      lastX = dx;
      lastY = dy;
      els.forEach((el) => {
        const depth = parseFloat(el.dataset.parallax ?? "1") || 1;
        gsap.to(el, { x: (dx / cx) * -20 * depth, y: (dy / cy) * -30 * depth, ease: "power2.out", duration: 4 });
      });
    });
  };
  window.addEventListener("mousemove", onMove, { passive: true });
  return () => {
    window.removeEventListener("mousemove", onMove);
    cancelAnimationFrame(frame);
    els.forEach((el) => gsap.to(el, { x: 0, y: 0, ease: "power2.out", duration: 1.5 }));
  };
}

/** Wheel past the bottom fills `--down-scroll-progress`; at 100 the `.fake-link` fires. Source `scrollModule`. */
function bindScrollPastBottom(main: HTMLElement) {
  let progress = 0;
  let last = 0;
  let triggered = false;
  let resetTimer = 0;
  const onWheel = (event: WheelEvent) => {
    const now = Date.now();
    if (now - last <= 100) return;
    last = now;
    const atBottom = window.scrollY >= main.scrollHeight - window.innerHeight - 100;
    if (atBottom && !main.classList.contains("pageTransitionLeave")) {
      if (event.deltaY > 0) {
        gsap.to(main, {
          "--down-scroll-progress": Math.min(100, progress + event.deltaY * 0.3),
          ease: "power2.out",
          duration: 0.5,
          onUpdate: () => {
            progress = Number(gsap.getProperty(main, "--down-scroll-progress")) || 0;
            if (progress >= 100 && !triggered) {
              triggered = true;
              main.querySelector<HTMLElement>(".fake-link")?.click();
            }
          },
        });
      } else if (event.deltaY < 0) {
        gsap.to(main, { "--down-scroll-progress": Math.max(0, progress - event.deltaY * 0.05), ease: "power2.out", duration: 0.2 });
      }
    }
    if (!atBottom && progress > 0) {
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        progress = 0;
        gsap.to(main, { "--down-scroll-progress": 0, ease: "power4.out", duration: 0.4 });
      }, 200);
    }
  };
  window.addEventListener("wheel", onWheel, { passive: true });
  return () => {
    window.removeEventListener("wheel", onWheel);
    window.clearTimeout(resetTimer);
  };
}
