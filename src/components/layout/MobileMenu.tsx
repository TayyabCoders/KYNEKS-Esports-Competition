"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import Logo from "@/components/common/Logo";
import Icon from "@/components/common/Icon";
import { buttonStyles } from "@/components/ui/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  active: string;
}

/** Full-screen menu. Always mounted so it can animate both ways; `invisible` removes it from the tab order when closed. */
export default function MobileMenu({ isOpen, onClose, active }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-0 z-[60] overflow-hidden bg-background transition-[clip-path,visibility] duration-[650ms] ease-[cubic-bezier(0.76,0,0.24,1)] lg:hidden",
        isOpen ? "visible [clip-path:circle(150%_at_calc(100%-36px)_36px)]" : "invisible [clip-path:circle(0%_at_calc(100%-36px)_36px)]"
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 90% 5%, rgba(192,254,0,0.14), transparent 40%), radial-gradient(circle at 0% 100%, rgba(108,19,236,0.4), transparent 55%)",
        }}
      />
      <div className="relative flex h-full flex-col px-6 pb-8 pt-4">
        <div className="flex h-14 items-center justify-between">
          <Logo size="md" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-lime"
          >
            <Icon name="close" className="h-7 w-7" />
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-10 flex-1">
          <ul>
            {siteConfig.nav.map((item, i) => (
              <li
                key={item.id}
                className={cn(
                  "border-b border-white/10 transition-all duration-500 ease-out",
                  isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                )}
                style={{ transitionDelay: isOpen ? `${250 + i * 70}ms` : "0ms" }}
              >
                <a
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-baseline justify-between py-5 font-display text-5xl font-extrabold uppercase tracking-tight transition-colors",
                    active === item.id ? "text-lime" : "text-white hover:text-lime"
                  )}
                >
                  {item.label}
                  <span className="font-heading text-xs font-medium tracking-widest text-white/30">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={cn("transition-all duration-500 ease-out", isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")}
          style={{ transitionDelay: isOpen ? "600ms" : "0ms" }}
        >
          <a href="#join" onClick={onClose} className={buttonStyles({ size: "lg", className: "w-full" })}>
            Get early access
            <Icon name="arrowRight" className="h-5 w-5" />
          </a>
          <p className="mt-4 text-center font-heading text-[11px] uppercase tracking-[0.3em] text-white/40">{siteConfig.tagline}</p>
        </div>
      </div>
    </div>
  );
}
