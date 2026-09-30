// Content model for hellocopilot.com — every value below is taken verbatim from the
// live site markup / theme CSS (see docs/research/hellocopilot-com-bce9a408/).

export const ASSET_ROOT = "/sites/hellocopilot-com-bce9a408/shared";
export const asset = (path: string) => `${ASSET_ROOT}/${path}`;

export type ProductKey = "takeoff" | "touchdown" | "highpoint";
export type SoundCue =
  | "splash-intro"
  | "splash"
  | "takeoff"
  | "touchdown"
  | "highpoint";

/** One image in a layered sky / art stack. */
export interface Layer {
  src: string;
  /** Mouse-parallax depth (`scroll-zoom-depth`); omitted = no parallax. */
  depth?: number;
  /** Inline rotate used on source (e.g. mirrored star layer). */
  rotate180?: boolean;
  className?: string;
  /** Scroll scrub targets (at 100% page progress). */
  scrub?: { y?: number; x?: number; rotate?: number; zoom?: number };
  enterOpacity?: boolean;
}

export interface Sky {
  gradientClass: string;
  holderClass: string;
  /** Tailwind inset override matching the source inline `inset` style. */
  insetClass: string;
  layers: Layer[];
}

export interface Product {
  key: ProductKey;
  href: `/${string}/`;
  route: string;
  name: string;
  navLabel: string;
  navClass: "nav-1" | "nav-2" | "nav-3";
  leaveClass: `leave-to-${ProductKey}`;
  cue: SoundCue;
  /** CSS custom properties applied to `main` on the product page. */
  vars: { clipBorder: string; color2: string; colorNextPage: string };
  textColorClass: "text-orange" | "text-blue" | "text-green";
  thc: string;
  weight: string;
  tagline: string;
  copy: [string, string];
  spec: { label: string; value: string }[];
  productImage: string;
  planet: string;
  sky: Sky;
  darkClass: string;
  artGroupClass: string;
  art: Layer[];
  /** The art as it appears inside the products-page "transitioner". */
  transitionerArt: Layer[];
}

const TAKEOFF_SKY: Sky = {
  gradientClass: "gradient-takeoff",
  holderClass: "clouds-holder-1",
  insetClass: "inset-[0_-60px_-60px_-60px]",
  layers: [6, 5, 4, 3, 2, 1, 0].map((n, i) => ({
    src: asset(`img/takeoff/webp/${n}.png.webp`),
    depth: Number((0.3 * (i + 1)).toFixed(1)),
  })),
};

const TOUCHDOWN_SKY: Sky = {
  gradientClass: "gradient-touchdown",
  holderClass: "clouds-holder-2",
  insetClass: "inset-[0_-20px_-30px_-20px]",
  layers: [
    { src: asset("img/touchdown/webp/2.png.webp") },
    { src: asset("img/touchdown/webp/2.png.webp"), depth: 0.3, rotate180: true },
    { src: asset("img/touchdown/webp/1.png.webp"), depth: 0.5 },
    { src: asset("img/touchdown/webp/0.png.webp"), depth: 1 },
  ],
};

const HIGHPOINT_SKY: Sky = {
  gradientClass: "gradient-hightpoint",
  holderClass: "clouds-holder-3",
  insetClass: "inset-[0_-50px_-60px_-50px]",
  layers: [3, 2, 1, 0].map((n, i) => ({
    src: asset(`img/highpoint/webp/${n}.png.webp`),
    depth: 0.5 * (i + 1),
  })),
};

const SPEC_BASE = (strain: string, thc: string, cbd: string) => [
  { label: "Strain", value: strain },
  { label: "Weight", value: "5g" },
  { label: "Whole Flower", value: "1/8 oz" },
  { label: "THC", value: thc },
  { label: "CBD", value: cbd },
];

const BG = "linear-gradient(180deg, rgba(49, 14, 0, 0.40) 0%, rgba(30, 0, 0, 0.40) 100%)";
export const BG_GRADIENT = BG;

export const PRODUCTS: Product[] = [
  {
    key: "takeoff",
    href: "/take-off/",
    route: "/take-off",
    name: "Take Off",
    navLabel: "Take off",
    navClass: "nav-1",
    leaveClass: "leave-to-takeoff",
    cue: "takeoff",
    vars: { clipBorder: "#F28C51", color2: "#D25A3C", colorNextPage: "#83efff" },
    textColorClass: "text-orange",
    thc: "21% THC",
    weight: "5g",
    tagline: "Mind & body tension release increased energy",
    copy: [
      "Buckle up and grab your snack stash, because 'Take Off' is the sativa that's here to launch your day into orbit. Fuel your creativity, soar through tasks, and wave goodbye to brain fog. ",
      "Fasten your seatbelt for a ride that's more uplifting than your favorite playlist. Get ready to reach new heights – just don't forget to bring the snacks onboard.",
    ],
    spec: SPEC_BASE("Tangie strain", "21%", "5%"),
    productImage: asset("img/takeoff/webp/sativa-product.png.webp"),
    planet: asset("img/takeoff/webp/planet-yellow-sativa.png.webp"),
    sky: TAKEOFF_SKY,
    darkClass: "bg-takeoff-dark",
    artGroupClass: "img-takeoff-group",
    art: [
      { src: asset("img/takeoff/page/webp/big-spaceship.png.webp"), className: "img-takeoff-spaceship", scrub: { y: 5 } },
      { src: asset("img/takeoff/page/webp/planet-floor-version-2.png.webp"), className: "img-takeoff-floor" },
      { src: asset("img/takeoff/page/webp/astronaut.png.webp"), className: "img-takeoff-monkey" },
    ],
    transitionerArt: [
      { src: asset("img/takeoff/page/webp/big-spaceship.png.webp"), className: "img-takeoff-spaceship" },
      { src: asset("img/takeoff/page/webp/planet-floor-version-2.png.webp"), className: "img-takeoff-floor" },
      { src: asset("img/takeoff/page/webp/astronaut.png.webp"), className: "img-takeoff-monkey" },
    ],
  },
  {
    key: "touchdown",
    href: "/touch-down/",
    route: "/touch-down",
    name: "Touch Down",
    navLabel: "Touch down",
    navClass: "nav-2",
    leaveClass: "leave-to-touchdown",
    cue: "touchdown",
    vars: { clipBorder: "#83efff", color2: "#83efff", colorNextPage: "#A7DB8D" },
    textColorClass: "text-blue",
    thc: "25% THC",
    weight: "5g",
    tagline: "A Cosmic Calm in Every Way",
    copy: [
      "The indicia that brings you down gently, like a feathered touchdown from cloud nine. ",
      "Whether you're looking to unwind, decompress, or just take a breather, this bud's got your back...and your couch. Prepare for a smooth descent into tranquility, where the only turbulence is in your giggles.",
    ],
    spec: SPEC_BASE("Northern Lights", "25%", "8%"),
    productImage: asset("img/touchdown/webp/indica-product.png.webp"),
    planet: asset("img/touchdown/webp/plante-blue-indica.png.webp"),
    sky: TOUCHDOWN_SKY,
    darkClass: "bg-touchdown-dark",
    artGroupClass: "img-touchdown-group",
    art: [
      { src: asset("img/touchdown/page/webp/planet-background-blue.png.webp"), className: "img-touchdown-planet", scrub: { y: -5 } },
      { src: asset("img/touchdown/page/webp/planet-blue-half-indica.png.webp"), className: "img-touchdown-floor", scrub: { y: -20, x: 6, rotate: -4, zoom: 1.2 } },
      { src: asset("img/touchdown/page/webp/astronaut.png.webp"), className: "img-touchdown-monkey", scrub: { y: -55, x: 5, rotate: 50, zoom: 1.6 } },
    ],
    transitionerArt: [
      { src: asset("img/touchdown/page/webp/planet-background-blue.png.webp"), className: "img-touchdown-planet" },
      { src: asset("img/touchdown/page/webp/planet-blue-half-indica.png.webp"), className: "img-touchdown-floor" },
      { src: asset("img/touchdown/page/webp/astronaut.png.webp"), className: "img-touchdown-monkey" },
    ],
  },
  {
    key: "highpoint",
    href: "/high-point/",
    route: "/high-point",
    name: "High Point",
    navLabel: "High Point",
    navClass: "nav-3",
    leaveClass: "leave-to-highpoint",
    cue: "highpoint",
    vars: { clipBorder: "#A7DB8D", color2: "#A7DB8D", colorNextPage: "#F28C51" },
    textColorClass: "text-green",
    thc: "18% THC",
    weight: "5g",
    tagline: "Ride the Wave of Euphoria",
    copy: [
      "Like a first-class upgrade for your mind and body. This hybrid cannabis blend will have you soaring without the turbulence.",
      "Buckle up and get ready to reach new heights of relaxation and giggles. No in-flight meal required, just good vibes and a window seat to chill.",
    ],
    spec: SPEC_BASE("Blue Dream", "18%", "1%"),
    productImage: asset("img/highpoint/webp/hybrid-product.png.webp"),
    planet: asset("img/highpoint/webp/planet-green-hybrid.png.webp"),
    sky: HIGHPOINT_SKY,
    darkClass: "bg-highpoint-dark",
    artGroupClass: "img-highpoint-group",
    art: [
      { src: asset("img/highpoint/page/webp/planet-background.png.webp"), className: "img-highpoint-planet", scrub: { y: -50 } },
      { src: asset("img/highpoint/page/webp/spaceship.png.webp"), className: "img-highpoint-spaceship", scrub: { y: -10 } },
      { src: asset("img/highpoint/page/webp/cloud-top-left.png.webp"), className: "img-highpoint-cloud-left", scrub: { y: -3 }, enterOpacity: true },
      { src: asset("img/highpoint/page/webp/astronaut.png.webp"), className: "img-highpoint-monkey", scrub: { y: -90, zoom: 1.5 } },
      { src: asset("img/highpoint/page/webp/planet-floor.png.webp"), className: "img-highpoint-floor", scrub: { y: -8 } },
    ],
    transitionerArt: [
      { src: asset("img/highpoint/page/webp/planet-background.png.webp"), className: "img-highpoint-planet", scrub: { y: 1 } },
      { src: asset("img/highpoint/page/webp/spaceship.png.webp"), className: "img-highpoint-spaceship", scrub: { y: -10 } },
      { src: asset("img/highpoint/page/webp/astronaut.png.webp"), className: "img-highpoint-monkey", scrub: { y: -90, zoom: 1.5 } },
      { src: asset("img/highpoint/page/webp/planet-floor.png.webp"), className: "img-highpoint-floor", scrub: { y: -8 } },
    ],
  },
];

export const productByKey = (key: ProductKey) =>
  PRODUCTS.find((p) => p.key === key) as Product;

export const ABOUT_COPY = {
  heading: "About",
  subheading: "Who we are",
  paragraphs: [
    "Buckle Up for High-Flying Fun! 🚀 At Copilot, we're not your average cannabis company – we're the co-conspirators of your next cosmic escapade. ",
    "Our mission? To elevate your vibes, tickle your funny bone, and make your journey to cloud ☁️ nine one for the books. From the chillest indicas to the zaniest sativas and everything in between, we've got the goods to make your adventure out-of-this-world. 🤩",
  ],
};

export const LINKS = {
  instagram: "https://www.instagram.com/copilot.world/",
  nika: "https://nika.agency/?utm_source=Copilot&utm_medium=footer_link&utm_campaign=website_build",
  underAge: "https://earth.google.com/",
};

/** Every image the source preloads behind the loader (`#imagesLoaded`). */
export const PRELOAD_IMAGES = [
  ...[
    "home-astronaut", "home-cloud-1", "home-cloud-2", "home-cloud-3", "home-page-orange-rocks",
    "home-planet-bg", "home-rocks", "home-spaceship-page", "stars",
  ].map((n) => asset(`img/home-page/webp/${n}.png.webp`)),
  ...PRODUCTS.flatMap((p) => [
    ...p.sky.layers.map((l) => l.src),
    p.productImage,
    p.planet,
    ...p.art.map((l) => l.src),
  ]),
];
