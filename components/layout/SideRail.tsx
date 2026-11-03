import Link from "next/link";
import { profile } from "@/content/profile";

/** Artoo-style fixed left rail (desktop only). */
export function SideRail() {
  return (
    <aside
      aria-label="Site rail"
      className="fixed inset-y-0 left-0 z-50 hidden w-[var(--rail)] flex-col items-center justify-between border-r border-line bg-bg xl:flex"
    >
      <Link
        href="/"
        aria-label="Home"
        className="group grid h-20 w-full place-items-center border-b border-line bg-bg-elev transition-colors hover:bg-accent"
      >
        <span className="flex flex-col items-end gap-[5px]" aria-hidden>
          <span className="block h-px w-6 bg-ink transition-colors group-hover:bg-accent-ink" />
          <span className="block h-px w-4 bg-ink transition-colors group-hover:bg-accent-ink" />
          <span className="block h-px w-5 bg-ink transition-colors group-hover:bg-accent-ink" />
        </span>
      </Link>

      <p className="label [writing-mode:vertical-rl] rotate-180 tracking-[0.3em] text-muted/70">
        Bioprocess · Process · Data
      </p>

      <ul className="flex flex-col items-center gap-8 pb-10">
        {[
          { href: profile.github, label: "Gh", name: "GitHub" },
          { href: profile.linkedin, label: "In", name: "LinkedIn" },
          { href: `mailto:${profile.email}`, label: "@", name: "Email" },
        ].map((s) => (
          <li key={s.name}>
            <a
              href={s.href}
              aria-label={s.name}
              {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="block -rotate-90 font-mono text-xs text-muted transition-colors hover:text-accent"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
