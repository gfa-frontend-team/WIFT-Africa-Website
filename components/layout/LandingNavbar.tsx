"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { Logo } from "@/components/shared/Logo";
import { useProfileCountContext } from "@/hooks/useProfile";

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { isAuthenticated } = useProfileCountContext();

  console.log(isAuthenticated, "isAuthenticated");

  const navItems = [
    { path: "/about", label: "About Us" },
    { path: "#success-stories", label: "Success Stories" },
    { path: "#benefits", label: "Benefits" },
  ];

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    // If it's a page navigation (doesn't start with #), let it behave normally or use router
    if (!path.startsWith("#")) {
      setIsMobileMenuOpen(false);
      return;
    }

    e.preventDefault();
    const targetId = path.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      const offset = 80; // Account for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-5 w-auto" />
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isHashLink = item.path.startsWith("#");

              if (isHashLink && isHome) {
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={(e) => handleSmoothScroll(e, item.path)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {item.label}
                  </a>
                );
              }

              if (isHashLink && !isHome) {
                return (
                  <Link
                    key={item.path}
                    href={`/${item.path}`}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              }

              // Normal link (e.g. /about)
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden lg:flex items-center space-x-2 mr-2">
              <ModeToggle />
              <a
                href="https://www.linkedin.com/company/wift-africa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/wiftafrica"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/wiftafrica"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com/@wiftafrica"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
            {isAuthenticated ? (
              <Link
                href="/feed"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors sm:px-4"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors sm:px-4"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/register"
              className="px-3 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors sm:px-4"
            >
              Get Started
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const isHashLink = item.path.startsWith("#");

                if (isHashLink && isHome) {
                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      onClick={(e) => handleSmoothScroll(e, item.path)}
                      className="block px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      {item.label}
                    </a>
                  );
                }

                if (isHashLink && !isHome) {
                  return (
                    <Link
                      key={item.path}
                      href={`/${item.path}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {item.label}
                    </Link>
                  );
                }

                // Normal link
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile Auth Links */}
              <div className="border-t border-border pt-4 mt-4 space-y-2">
                {isAuthenticated ? (
                  <Link
                    href={"/feed"}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </div>

              {/* Social Icons - Mobile */}
              <div className="border-t border-border pt-4 mt-4">
                <p className="text-xs font-medium text-muted-foreground mb-3 px-4">
                  Follow Us
                </p>
                <div className="flex items-center justify-center space-x-3 px-4">
                  <a
                    href="https://www.linkedin.com/company/wift-africa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/20 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 text-primary" />
                  </a>
                  <a
                    href="https://www.facebook.com/wiftafrica"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/20 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5 text-primary" />
                  </a>
                  <a
                    href="https://www.instagram.com/wiftafrica"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/20 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5 text-primary" />
                  </a>
                  <a
                    href="https://www.youtube.com/@wiftafrica"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/20 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5 text-primary" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
