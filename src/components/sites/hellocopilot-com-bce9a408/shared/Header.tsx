"use client";

import { BackArrowIcon, LogoIcon, SoundWaveIcon } from "./icons";
import { ScrambleText, scrambleOnHover } from "./ScrambleText";
import { LINKS } from "./site-data";
import { useShell } from "./SiteShell";
import { TransitionLink } from "./TransitionLink";

type Variant = "splash" | "products" | "product";

const hover = scrambleOnHover({ beep: true });

function SoundToggle() {
  const { muted, toggleMute } = useShell();
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={!muted}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      className={`sound${muted ? " muted" : ""}`}
      data-hover-scramble=""
      onMouseEnter={hover}
      onClick={toggleMute}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleMute()}
    >
      <em>
        <SoundWaveIcon />
      </em>
      <span>
        <ScrambleText text="Sound" />
      </span>
    </div>
  );
}

function AboutToggle() {
  const { toggleAbout } = useShell();
  return (
    <div
      role="button"
      tabIndex={0}
      className="header-top-right nav-about triggerAbout"
      data-hover-scramble=""
      data-enter="opacity"
      data-leave="opacity"
      onMouseEnter={hover}
      onClick={toggleAbout}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleAbout()}
    >
      <span>
        <ScrambleText text="About" />
      </span>
      <span>
        <ScrambleText text="Close" />
      </span>
    </div>
  );
}

export function Header({ variant }: { variant: Variant }) {
  return (
    <header>
      {variant === "products" && (
        <div className="header-top-left" data-enter="opacity" data-leave="opacity">
          <span>
            To infinity <br />
            &amp; beyond
          </span>
        </div>
      )}

      {variant === "product" && (
        <div className="back" data-enter="opacity" data-leave="opacity">
          <TransitionLink
            href="/products/"
            leaveClass="leave-to-home"
            cue="splash"
            className="back-home fake-link"
            data-hover-scramble=""
            onMouseEnter={hover}
          >
            <em>
              <BackArrowIcon />
            </em>
            <span>
              <ScrambleText text="Back" />
              <span className="hidden sm:inline">
                {" "}
                <ScrambleText text="Home" />
              </span>
            </span>
          </TransitionLink>
        </div>
      )}

      <div className={`logo${variant === "splash" ? "" : " logo-desktop"}${variant === "products" ? " w-auto-logo" : ""}`}>
        {variant === "product" ? (
          <TransitionLink href="/products/" leaveClass="leave-to-home" cue="splash" aria-label="Copilot — products">
            <LogoIcon />
          </TransitionLink>
        ) : (
          <a href="#" className="pointer-events-none" aria-label="Copilot" tabIndex={-1}>
            <LogoIcon />
          </a>
        )}
      </div>

      {variant !== "splash" && <AboutToggle />}

      <SoundToggle />

      <div className="instagram-link">
        {variant === "splash" ? (
          <a href={LINKS.nika} target="_blank" rel="noopener" data-hover-scramble="" onMouseEnter={hover}>
            <span>
              <ScrambleText text="Site by Nika" />
            </span>
          </a>
        ) : (
          <a href={LINKS.instagram} target="_blank" rel="noopener" data-hover-scramble="" onMouseEnter={hover}>
            <span>
              <ScrambleText text="Instagram" />
            </span>
          </a>
        )}
      </div>
    </header>
  );
}
