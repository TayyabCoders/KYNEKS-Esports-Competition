import type { CSSProperties } from "react";
import { siteConfig } from "@/config/site";
import Container from "@/components/layout/Container";
import Icon from "@/components/common/Icon";
import { buttonStyles } from "@/components/ui/Button";
import Countdown from "./Countdown";
import HeroStage from "./HeroStage";

/** Entrance stagger: every hero element waits for the intro curtain, then rises in sequence. */
const enter = (ms: number): CSSProperties => ({ animationDelay: `calc(var(--intro) + ${ms}ms)` });

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pb-16 pt-28 lg:pb-24 lg:pt-32" style={{ "--intro": "1.9s" } as CSSProperties}>
      {/* Perspective grid floor */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] overflow-hidden [mask-image:linear-gradient(to_top,#000_10%,transparent)] [perspective:520px]">
        <div className="absolute inset-x-[-60%] top-0 h-[220%] origin-top [transform:rotateX(68deg)]">
          <div
            className="h-[calc(100%+64px)] animate-grid-flow"
            style={{
              backgroundImage:
                "linear-gradient(rgba(192,254,0,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(192,254,0,0.22) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>
      </div>
      {/* Light streaks */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-10 right-[34%] -z-10 h-[130%] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-lime/50 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-10 right-[22%] -z-10 h-[130%] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-purple/60 to-transparent" />

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div>
            <p
              className="inline-flex animate-rise items-center gap-3 border border-lime/30 bg-lime/[0.06] px-4 py-2 font-heading text-[11px] font-semibold uppercase tracking-[0.3em] text-lime sm:text-xs"
              style={enter(0)}
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-lime" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
              </span>
              Registrations opening soon
            </p>

            <h1 className="mt-6 font-display text-[clamp(6rem,17vw,12.5rem)] font-extrabold uppercase leading-[0.78] tracking-tight">
              <span className="block animate-rise" style={enter(120)}>
                Jump
              </span>
              <span className="block animate-rise text-lime [filter:drop-shadow(0_0_28px_rgba(192,254,0,0.4))]" style={enter(240)}>
                <span
                  className="inline-block animate-shine bg-[linear-gradient(110deg,#C0FE00_42%,#ffffff_50%,#C0FE00_58%)] bg-[length:250%_100%] bg-clip-text pr-[0.04em] text-transparent"
                  style={{ animationDelay: "calc(var(--intro) + 1000ms)" }}
                >
                  In.
                </span>
              </span>
            </h1>

            <p className="mt-5 flex animate-rise items-center gap-4 font-heading text-sm font-semibold uppercase tracking-[0.4em] text-white sm:text-base" style={enter(360)}>
              <span className="h-px w-10 bg-lime" aria-hidden="true" />
              Karachi is waiting.
            </p>

            <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-text-muted" style={enter(460)}>
              {siteConfig.description}
            </p>

            <div className="mt-9 animate-rise" style={enter(560)}>
              <Countdown target={siteConfig.launchDate} />
            </div>

            <div className="mt-9 flex animate-rise flex-col gap-3 sm:flex-row" style={enter(680)}>
              <a href="#join" className={buttonStyles({ size: "lg" })}>
                Get early access
                <Icon name="arrowRight" className="h-5 w-5 transition-transform duration-normal group-hover:translate-x-1" />
              </a>
              <a href="#features" className={buttonStyles({ variant: "outline", size: "lg" })}>
                See what&apos;s coming
              </a>
            </div>
          </div>

          <HeroStage />
        </div>
      </Container>

      <a
        href="#features"
        aria-label="Scroll to the next section"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition-colors hover:text-lime lg:flex"
      >
        <Icon name="mouse" className="h-6 w-6 animate-cue" />
        <span className="font-heading text-[10px] uppercase tracking-[0.4em]">Scroll</span>
      </a>
    </section>
  );
}
