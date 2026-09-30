"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import type { SoundCue } from "./site-data";
import { useShell } from "./SiteShell";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Adds `leave-to-*` to `main` so the destination sky is revealed during leave. */
  leaveClass?: string;
  cue?: SoundCue;
  /** ms of leave animation before routing (800 default, 3000 from the splash page). */
  offset?: number;
};

/** Internal link that runs the page-leave transition before routing (replaces Barba). */
export function TransitionLink({ href, leaveClass, cue, offset, onClick, ...rest }: Props) {
  const { navigate } = useShell();
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    if (window.location.pathname.replace(/\/$/, "") === href.replace(/\/$/, "")) return;
    navigate(href, { leaveClass, cue, offset });
  };
  return <Link href={href} onClick={handleClick} {...rest} />;
}
