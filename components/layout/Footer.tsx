import Link from "next/link";
import { profile } from "@/content/profile";
import { navLinks } from "./nav";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-site grid gap-10 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <p className="text-lg font-medium">
            Louay Ouhibi<span className="text-accent">.</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {profile.title}: anaerobic digestion, fermentation and data-driven process decisions.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="label mb-4">Index</p>
          <ul className="space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition-colors hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="label mb-4">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            <li><a className="text-muted hover:text-ink" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
            <li><a className="text-muted hover:text-ink" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
            <li><a className="text-muted hover:text-ink" href={`mailto:${profile.email}`}>{profile.email}</a></li>
            <li><a className="text-muted hover:text-ink" href={profile.cv} download="">Curriculum vitae (PDF)</a></li>
          </ul>
        </div>
      </div>
      <div className="container-site flex flex-col justify-between gap-2 border-t border-line py-6 font-mono text-[0.6875rem] text-muted md:flex-row">
        <span>© 2026 Louay Ouhibi</span>
        <span>{profile.location} · {profile.relocation}</span>
      </div>
    </footer>
  );
}
