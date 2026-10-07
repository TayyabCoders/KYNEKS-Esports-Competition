import Image from "next/image";

/**
 * Cinematic page-load curtain. Pure CSS: it plays once, wipes upward and removes itself,
 * no JS or state needed. Hero entrance delays are tuned to land right as it lifts.
 */
export default function Intro() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] flex animate-intro-out flex-col items-center justify-center bg-background motion-reduce:hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 20%, rgba(192,254,0,0.12), transparent 40%), radial-gradient(circle at 20% 85%, rgba(108,19,236,0.3), transparent 45%)",
        }}
      />
      <div className="relative flex animate-intro-logo flex-col items-center">
        <Image
          src="/images/kyneks-icon.webp"
          width={422}
          height={450}
          alt=""
          priority
          className="h-24 w-auto drop-shadow-[0_0_30px_rgba(112,0,255,0.6)] sm:h-32"
        />
        <div className="mt-8 h-[3px] w-44 overflow-hidden rounded-full bg-white/10">
          <div className="h-full origin-left animate-bar-fill bg-gradient-to-r from-purple to-lime" />
        </div>
        <p className="mt-4 font-heading text-[10px] font-semibold uppercase tracking-[0.4em] text-white/50">Entering the arena</p>
      </div>
    </div>
  );
}
