"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import Logo from "@/components/common/Logo";
import Icon from "@/components/common/Icon";
import { buttonStyles } from "@/components/ui/Button";
import Container from "./Container";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll state + progress bar (progress is written straight to the DOM, no re-render)
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setIsScrolled(y > 24);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Highlight the section currently crossing the middle of the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const item of siteConfig.nav) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-all duration-normal ease-smooth",
          isScrolled ? "glass border-white/10" : "border-transparent bg-transparent"
        )}
      >
        <Container>
          <div className={cn("flex items-center justify-between transition-all duration-normal ease-smooth", isScrolled ? "h-16" : "h-[72px] md:h-20")}>
            <Link href="#top" aria-label={`${siteConfig.name} home`} className="shrink-0">
              <Logo size="md" priority />
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
              {siteConfig.nav.map((item) => {
                const isActive = active === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "group relative py-2 font-heading text-sm font-medium uppercase tracking-wider transition-colors duration-fast",
                      isActive ? "text-lime" : "text-text-secondary hover:text-white"
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-lime shadow-[0_0_10px_#C0FE00] transition-transform duration-normal ease-smooth",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <a href="#join" className={buttonStyles({ size: "sm", className: "hidden sm:inline-flex" })}>
                Notify me
                <Icon name="arrowRight" className="h-4 w-4" />
              </a>
              <button
                type="button"
                className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-lime lg:hidden"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <Icon name="menu" className="h-7 w-7" />
              </button>
            </div>
          </div>
        </Container>
        <div
          ref={progressRef}
          aria-hidden="true"
          className="h-px origin-left scale-x-0 bg-gradient-to-r from-purple via-lime to-lime shadow-[0_0_12px_rgba(192,254,0,0.8)]"
        />
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} active={active} />
    </>
  );
}
