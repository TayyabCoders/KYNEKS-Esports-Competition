import GridBackground from "./GridBackground";
import NoiseOverlay from "./NoiseOverlay";
import ParticleField from "./ParticleField";

/** Fixed atmosphere behind the whole page: drifting lime/purple light, faint grid, grain, embers. */
export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute -right-[20vmax] -top-[25vmax] h-[75vmax] w-[75vmax] animate-drift rounded-full"
        style={{ background: "radial-gradient(circle, rgba(192,254,0,0.13), transparent 62%)" }}
      />
      <div
        className="absolute -bottom-[30vmax] -left-[25vmax] h-[85vmax] w-[85vmax] animate-drift rounded-full [animation-delay:-11s]"
        style={{ background: "radial-gradient(circle, rgba(108,19,236,0.28), transparent 62%)" }}
      />
      <GridBackground
        opacity={1}
        className="[mask-image:radial-gradient(ellipse_at_50%_30%,#000,transparent_72%)]"
      />
      <NoiseOverlay opacity={0.035} />
      <ParticleField />
    </div>
  );
}
