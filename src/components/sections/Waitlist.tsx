import Image from "next/image";
import { siteConfig } from "@/config/site";
import Container from "@/components/layout/Container";
import Icon from "@/components/common/Icon";
import Reveal from "@/components/common/Reveal";
import Countdown from "./Countdown";
import WaitlistForm from "./WaitlistForm";

const perks = ["First access when registrations open", "Squad and prize details before anyone else", "Match schedule and bracket updates"] as const;

export default function Waitlist() {
  return (
    <section id="join" className="relative scroll-mt-20 py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="chamfer relative bg-gradient-to-br from-lime/70 via-purple/60 to-purple/40 p-px">
            <div className="chamfer relative overflow-hidden bg-surface-100">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 100% 0%, rgba(192,254,0,0.16), transparent 45%), radial-gradient(circle at 0% 100%, rgba(108,19,236,0.45), transparent 55%)",
                }}
              />
              <Image
                src="/images/kyneks-icon.webp"
                width={422}
                height={450}
                alt=""
                className="pointer-events-none absolute -bottom-20 -left-16 w-[420px] opacity-[0.05]"
              />

              <div className="relative grid gap-12 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:p-14">
                <div>
                  <p className="mb-4 flex items-center gap-3 font-heading text-xs font-semibold uppercase tracking-[0.3em] text-lime">
                    <span className="h-px w-8 bg-lime" aria-hidden="true" />
                    Pre registration
                  </p>
                  <h2 className="font-display text-6xl font-extrabold uppercase leading-[0.85] tracking-tight sm:text-7xl lg:text-8xl">
                    Ready to
                    <br />
                    <span className="text-lime [filter:drop-shadow(0_0_24px_rgba(192,254,0,0.4))]">compete?</span>
                  </h2>
                  <p className="mt-6 max-w-md text-lg text-text-muted">Your next match could be the one everyone remembers. Lock your spot and be first through the door.</p>

                  <ul className="mt-8 space-y-3">
                    {perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-3 text-text-secondary">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-lime/40 bg-lime/10 text-lime">
                          <Icon name="check" className="h-3.5 w-3.5" />
                        </span>
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 hidden lg:block">
                    <Countdown target={siteConfig.launchDate} size="sm" />
                  </div>
                </div>

                <div className="border border-white/10 bg-background/60 p-5 backdrop-blur sm:p-8">
                  <h3 className="mb-6 font-display text-3xl font-extrabold uppercase">Secure your spot</h3>
                  <WaitlistForm />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
