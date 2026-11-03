import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { Em, IndexLabel } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";

const facts = [
  ["Degree", "Engineering Degree, Industrial Biology · INSAT, 2021–2026"],
  ["Latest", "Mitacs Globalink Research Intern · Memorial University, Canada"],
  ["Status", `${profile.availability} · ${profile.relocation}`],
  ["Languages", "Arabic · French · English (C1) · German (beginner)"],
] as const;

export function ProfileIntro() {
  return (
    <section aria-labelledby="profile-title" className="border-t border-line py-28 md:py-40">
      <div className="container-site grid grid-cols-1 items-center gap-14 xl:grid-cols-12 xl:gap-16">
        <Reveal className="xl:col-span-5">
          <figure className="corners mx-auto max-w-md border border-line bg-bg-deep/60 xl:max-w-none">
            <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[0.6875rem] text-muted">
              <span>FIG. 00</span>
              <span>{profile.location}</span>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/profile/louay-ouhibi.jpg"
                alt="Portrait of Louay Ouhibi, Bioprocess Engineer"
                fill
                sizes="(min-width: 1280px) 40vw, (min-width: 768px) 448px, 100vw"
                className="object-cover object-[50%_20%]"
              />
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-deep/80 to-transparent" />
            </div>
            <figcaption className="flex items-center justify-between gap-4 border-t border-line px-5 py-4">
              <span>
                <span className="block text-[0.9375rem] font-medium">
                  {profile.name}
                  <span className="text-accent">.</span>
                </span>
                <span className="mt-0.5 block font-mono text-[0.6875rem] text-muted">{profile.title}</span>
              </span>
              <span className="flex items-center gap-2">
                {[
                  { href: profile.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
                  { href: profile.github, label: "GitHub", Icon: GitHubIcon },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${profile.name} on ${label} (opens in a new tab)`}
                    title={label}
                    className="grid size-10 place-items-center border border-line-strong text-muted transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                ))}
              </span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.1} className="xl:col-span-7">
          <IndexLabel index="02">Profile</IndexLabel>
          <h2
            id="profile-title"
            className="mt-6 max-w-2xl text-[2rem] leading-[1.08] font-medium tracking-[-0.02em] text-balance md:text-[2.75rem]"
          >
            Biology, process engineering and code, <Em>in one engineer.</Em>
          </h2>
          <div className="mt-8 max-w-xl space-y-4 text-[0.9375rem] leading-[1.75] text-muted">
            <p>{profile.profileLong[0]}</p>
            <p>{profile.profileLong[1]}</p>
          </div>
          <dl className="mt-10 max-w-xl divide-y divide-line border-y border-line">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5">
                <dt className="label pt-0.5">{k}</dt>
                <dd className="text-[0.875rem]">{v}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/about"
            className="group mt-10 inline-flex items-center gap-3 border-b border-line-strong pb-2 text-sm transition-colors hover:border-accent hover:text-accent"
          >
            Full profile
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
