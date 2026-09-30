"use client";

import { ABOUT_COPY } from "./site-data";
import { useShell } from "./SiteShell";

/** Overlay + "Who we are" popup. Visibility is driven by `main.about-open` (theme CSS). */
export function AboutPopup({ borderColor }: { borderColor?: string }) {
  const { toggleAbout } = useShell();
  return (
    <>
      <div className="about-overlay triggerAbout" aria-hidden="true" onClick={toggleAbout} />
      <div
        role="dialog"
        aria-label={ABOUT_COPY.heading}
        className="fookin-a-box aboutPopup fixed z-2"
        data-leave="opacity"
        style={borderColor ? ({ "--clip-border-color": borderColor } as React.CSSProperties) : undefined}
      >
        <h2 className="h5 heading-clip-mirrored absolute z-1 w-full p-4 font-medium uppercase leading-[1.25]">
          <span>{ABOUT_COPY.heading}</span>
        </h2>
        <div className="clip-shape-border-mirrored" />
        <div className="clip-shape-mirrored p-12">
          <div className="my-2 pt-12">
            <h4 className="h5 font-primary mb-6 uppercase">{ABOUT_COPY.subheading}</h4>
            <div>
              {ABOUT_COPY.paragraphs.map((text) => (
                <p key={text.slice(0, 24)}>{text}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
