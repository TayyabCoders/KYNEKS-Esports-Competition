import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Squad from "@/components/sections/Squad";
import Waitlist from "@/components/sections/Waitlist";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <Squad />
      <Waitlist />
    </>
  );
}
