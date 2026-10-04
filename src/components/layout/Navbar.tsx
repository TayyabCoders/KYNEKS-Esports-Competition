"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";
import Button from "@/components/ui/Button";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/competitions", label: "Competitions" },
    { href: "/games", label: "Games" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/news", label: "News" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-normal ease-smooth",
          isScrolled
            ? "glass border-b border-border"
            : "bg-transparent border-transparent"
        )}
      >
        <Container>
          <div className="flex h-[72px] md:h-[80px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body text-text-secondary hover:text-lime transition-colors duration-fast relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime transition-all duration-fast group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-text-primary hover:text-lime transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}

import Container from "./Container";
