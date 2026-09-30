/* eslint-disable @next/next/no-img-element -- layered art must keep the source's absolute img stacking */
import { Marquee } from "../shared/Marquee";
import { SkyLayers } from "../shared/SkyLayers";
import { asset, productByKey } from "../shared/site-data";

const LAYER = "absolute inset-0 flex h-screen items-center justify-end py-0";
const IMG = "img-bg object-cover";
const WIDE = "absolute inset-[-20px_-60px_-40px_-60px] flex justify-center";

const home = (name: string) => asset(`img/home-page/webp/${name}.png.webp`);

/**
 * Home splash backdrop: sky, red gradient + stars, planet, clouds, spacecraft,
 * marquee, rocks and astronaut. Motion is driven by SiteShell via the
 * data-enter / data-leave / data-parallax attributes.
 */
export function SplashBackdrop() {
  return (
    <>
      {/* 0. Takeoff sky revealed on leave */}
      <section className="leave-bg bg-takeoff absolute inset-0 h-screen items-center justify-end py-0">
        <SkyLayers sky={productByKey("takeoff").sky} />
      </section>

      {/* 1. Red background + stars */}
      <section className={LAYER}>
        <div className="gradient gradient-home absolute inset-0" data-leave="opacity:2.15" />
        <div className="clouds-holder-0">
          <div className={WIDE} data-leave="opacity:2.15">
            <img src={home("stars")} className={IMG} alt="" />
            <img src={home("stars")} className={`${IMG} animation-spin-2 opacity-75 rotate-180`} alt="" />
            <img src={home("home-page-orange-rocks")} className={IMG} alt="" />
          </div>
        </div>
      </section>

      {/* 2. Atmosphere */}
      <section className={LAYER} data-leave="opacity-2" data-enter="planet">
        <div className="clouds-holder-0">
          <div className="absolute inset-0 flex justify-center" data-leave="planet-splash">
            <img src={home("home-planet-bg")} className={`planet-splash-bg ${IMG} m-auto h-auto`} alt="" />
          </div>
        </div>
      </section>

      {/* 3. Planet */}
      <section className={LAYER} data-leave="opacity-2:2" data-enter="planet">
        <div className="clouds-holder-0">
          <div className="absolute inset-0 flex justify-center" data-leave="planet-splash">
            <img
              src={asset("img/takeoff/webp/planet-yellow-sativa.png.webp")}
              className={`planet-splash animation-spin ${IMG} m-auto h-auto`}
              alt=""
            />
          </div>
        </div>
      </section>

      {/* 4. Clouds */}
      <section className={LAYER} data-leave="opacity:0.2" data-enter="opacity:0.2">
        <div className="clouds-holder-0">
          <div className={WIDE}>
            <img src={home("home-cloud-3")} className={IMG} alt="" data-parallax="0.3" />
            <img src={home("home-cloud-2")} className={IMG} alt="" data-parallax="0.6" />
            <img src={home("home-cloud-1")} className={IMG} alt="" data-parallax="0.9" />
          </div>
        </div>
      </section>

      {/* 5. Spacecraft */}
      <section className={LAYER}>
        <div className="clouds-holder-0">
          <div className={WIDE}>
            <img
              src={home("home-spaceship-page")}
              className={`${IMG} object-bottom`}
              alt=""
              data-leave="move-splash"
            />
          </div>
        </div>
      </section>

      {/* 6. Marquee */}
      <div
        className="pointer-events-none absolute inset-0 flex min-h-screen items-center justify-center"
        data-enter="marquee"
      >
        <Marquee leave="blur:0.1">
          <div className="display-2 uppercase text-white">To infinity &amp; beyond&nbsp;</div>
        </Marquee>
      </div>

      {/* 7. Rocks */}
      <section className={LAYER} data-leave="mask" data-enter="opacity:2">
        <div className="clouds-holder-0">
          <div className={WIDE}>
            <img src={home("home-rocks")} className={IMG} alt="" data-parallax="0.9" />
          </div>
        </div>
      </section>

      {/* 8. Astronaut */}
      <div className="space-bro-splash-holder absolute flex items-center justify-center" data-enter="monkey">
        <div className="space-bro-splash relative inline-block" data-leave="width-splash">
          <img src={home("home-astronaut")} className="w-full object-top" alt="" data-leave="blur-splash" />
        </div>
      </div>
    </>
  );
}
