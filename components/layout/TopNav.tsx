"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { profile } from "@/content/profile";
import { navLinks } from "./nav";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500 xl:left-[var(--rail)]",
        scrolled ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <div className="container-site flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="text-[1.0625rem] font-medium tracking-[-0.01em]" aria-label="Louay Ouhibi, home">
          Louay Ouhibi<span className="text-accent">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-10">
            {navLinks.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-2 text-sm transition-colors hover:text-ink",
                      active ? "text-ink" : "text-muted",
                    )}
                  >
                    {l.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-1 left-1/2 h-px -translate-x-1/2 bg-ink transition-all duration-500",
                        active ? "w-full" : "w-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={profile.cv}
            download=""
            className="hidden h-11 items-center gap-2.5 bg-bg-elev px-5 text-sm transition-colors hover:bg-accent hover:text-accent-ink md:inline-flex"
          >
            Download CV <Download aria-hidden className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center border border-line md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 z-40 flex flex-col justify-between bg-bg-deep px-5 pt-10 pb-8 md:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {navLinks.map((l, i) => (
                  <li key={l.href} className="border-b border-line">
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 py-5 text-3xl tracking-[-0.02em]"
                    >
                      <span className="font-mono text-xs text-accent">/0{i + 1}</span>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-4">
              <a href={profile.cv} download="" className="inline-flex h-12 items-center justify-center gap-2 bg-accent text-accent-ink">
                Download CV <Download aria-hidden className="size-4" />
              </a>
              <div className="label flex justify-between">
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href={`mailto:${profile.email}`}>Email</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
