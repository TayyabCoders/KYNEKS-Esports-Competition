import Link from "next/link";
import Logo from "@/components/common/Logo";
import Container from "./Container";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const platformLinks = [
    { href: "/competitions", label: "Competitions" },
    { href: "/games", label: "Games" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/how-it-works", label: "How It Works" },
  ];

  const companyLinks = [
    { href: "/about", label: "About" },
    { href: "/news", label: "News" },
    { href: "/contact", label: "Contact" },
  ];

  const legalLinks = [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/rules", label: "Rules" },
  ];

  const socialLinks = [
    { href: "#", label: "Discord", icon: "💬" },
    { href: "#", label: "Instagram", icon: "📷" },
    { href: "#", label: "TikTok", icon: "🎵" },
    { href: "#", label: "YouTube", icon: "▶️" },
    { href: "#", label: "X", icon: "𝕏" },
  ];

  return (
    <footer className="relative bg-surface-100 border-t border-border mt-auto">
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 bg-gradient-brand opacity-5 pointer-events-none" />

      <Container>
        <div className="py-16 md:py-20">
          {/* Brand Section */}
          <div className="mb-12 md:mb-16">
            <Link href="/" className="inline-block mb-4">
              <Logo size="lg" />
            </Link>
            <p className="text-h3 font-heading text-text-secondary mb-2">
              COMPETE. CONNECT. CONQUER.
            </p>
            <p className="text-body text-text-muted max-w-md">
              Discover competitive tournaments, build your squad, and prove yourself on the biggest stage.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            {/* Platform */}
            <div>
              <h3 className="text-label font-medium text-text-primary mb-4 uppercase tracking-wider">
                Platform
              </h3>
              <ul className="space-y-3">
                {platformLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body text-text-muted hover:text-lime transition-colors duration-fast"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-label font-medium text-text-primary mb-4 uppercase tracking-wider">
                Company
              </h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body text-text-muted hover:text-lime transition-colors duration-fast"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-label font-medium text-text-primary mb-4 uppercase tracking-wider">
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body text-text-muted hover:text-lime transition-colors duration-fast"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-label font-medium text-text-primary mb-4 uppercase tracking-wider">
                Social
              </h3>
              <ul className="space-y-3">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body text-text-muted hover:text-lime transition-colors duration-fast flex items-center gap-2"
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border">
            <p className="text-caption text-text-muted text-center">
              © {currentYear} KYNEKS. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
