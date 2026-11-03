import Link from "next/link";
import { MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { HeroVisual } from "./HeroVisual";

const band = [
  { value: "1,500", label: "Anaerobic-digestion records compiled & modelled", href: "/work/anaerovision" },
  { value: "92.7%", label: "Out-of-fold accuracy diagnosing inhibition type", href: "/work/anaerovision" },
  { value: "544.2 kW", label: "Energy balance closed against a ≈544 kW hand calc", href: "/work/biogas-process-simulation" },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero-pin relative">
      <div className="sticky top-0 flex min-h-dvh flex-col overflow-x-clip pt-16 md:pt-20">
      <div className="container-site relative grid flex-1 grid-cols-1 items-center gap-y-6 py-8 xl:grid-cols-12 xl:gap-x-8 xl:py-0">
        {/* Left: index block */}
        <Reveal className="order-3 hidden xl:order-1 xl:col-span-3 xl:block" delay={0.3}>
          <p className="font-mono text-sm text-ink">/01</p>
          <div className="mt-3 h-px w-full max-w-[180px] bg-line-strong">
            <div className="h-px bg-ink" style={{ width: "calc(50% + 50% * var(--morph))" }} />
          </div>
          <p className="mt-5 text-base font-medium">Engineering Portfolio</p>
          <ul className="mt-3 space-y-1.5 text-[0.8125rem] text-muted">
            <li><Link className="hover:text-ink" href="/work/anaerovision">Biogas &amp; anaerobic digestion</Link></li>
            <li><Link className="hover:text-ink" href="/work/biogas-process-simulation">Process simulation</Link></li>
            <li><Link className="hover:text-ink" href="/work/biopredict">Fermentation &amp; ML</Link></li>
          </ul>
          <p
            aria-hidden
            className="morph-cue label mt-10 items-center gap-3"
            style={{ opacity: "calc(1 - var(--morph) * 3)" }}
          >
            <span className="relative block h-8 w-px overflow-hidden bg-line-strong">
              <span className="absolute inset-x-0 top-0 h-3 animate-[cue_1.8s_ease-in-out_infinite] bg-accent" />
            </span>
            Scroll · reactor → data
          </p>
        </Reveal>

        {/* Centre: bioreactor → data cloud */}
        <div className="order-2 xl:col-span-5">
          <HeroVisual className="mx-auto aspect-[52/47] w-full max-w-[min(560px,82vw)] xl:max-w-none" />
        </div>

        {/* Right: statement */}
        <div className="order-1 xl:order-3 xl:col-span-4">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 bg-bg-elev px-3.5 py-2 text-[0.8125rem]">
              <MapPin aria-hidden className="size-3.5 text-accent" />
              {profile.title} · {profile.location.split(",")[0]} → {profile.relocation.toLowerCase()}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1
              id="hero-title"
              className="mt-6 text-[2.5rem] leading-[1.02] font-medium tracking-[-0.03em] text-balance sm:text-5xl xl:text-[3.25rem]"
            >
              {profile.headline.lead}{" "}
              <span className="font-serif font-normal tracking-[-0.01em] text-accent italic">{profile.headline.emphasis}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-muted">{profile.statement}</p>
          </Reveal>
          <Reveal delay={0.24} className="mt-8 flex flex-wrap gap-3">
            <Button href="/work">View work</Button>
            <Button href={profile.cv} variant="ghost" download>
              Download CV
            </Button>
          </Reveal>
        </div>
      </div>

      {/* Bottom band: verified figures */}
      <div className="border-t border-line bg-bg-elev/60">
        <div className="container-site grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <div className="border-line py-6 sm:col-span-2 xl:col-span-1 xl:border-r xl:pr-8">
            <p className="label">Latest</p>
            <p className="mt-3 text-[0.9375rem] font-medium">Mitacs Globalink Research Intern, 2026</p>
            <p className="mt-1 text-[0.8125rem] text-muted">Memorial University of Newfoundland, Canada</p>
          </div>
          {band.map((b, i) => (
            <Link
              key={b.value}
              href={b.href}
              className="group border-t border-line py-6 transition-colors sm:border-t-0 xl:px-8 [&:not(:last-child)]:xl:border-r"
            >
              <p className="label">{String(i + 1).padStart(2, "0")} · Verified</p>
              <p className="mt-3 font-mono text-2xl tracking-tight text-ink transition-colors group-hover:text-accent">{b.value}</p>
              <p className="mt-1 text-[0.8125rem] text-muted">{b.label}</p>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
