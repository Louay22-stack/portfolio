import { ArrowUpRight, Download, Mail, Phone } from "lucide-react";
import { profile } from "@/content/profile";
import { Em, IndexLabel } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export function ContactBlock() {
  const links = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
    { label: "Phone", value: profile.phone, href: profile.phoneHref, icon: Phone },
    { label: "LinkedIn", value: "in/louay-ouhibi", href: profile.linkedin, icon: ArrowUpRight, external: true },
    { label: "GitHub", value: "Louay22-stack", href: profile.github, icon: ArrowUpRight, external: true },
    { label: "Curriculum vitae", value: "Download PDF", href: profile.cv, icon: Download, download: true },
  ];
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 border-t border-line py-28 md:py-40">
      <div className="container-site grid grid-cols-1 gap-16 xl:grid-cols-12">
        <Reveal className="xl:col-span-7">
          <IndexLabel index="07">Contact</IndexLabel>
          <h2 id="contact-title" className="mt-8 text-[2.75rem] leading-[1] font-medium tracking-[-0.03em] text-balance md:text-7xl">
            Let&apos;s talk about <Em>your process.</Em>
          </h2>
          <p className="mt-8 max-w-lg text-[0.9375rem] leading-relaxed text-muted">
            Open to engineering roles in biogas and biomethane, fermentation and low-carbon bioprocesses, as well as R&amp;D
            and doctoral opportunities. {profile.availability}, {profile.relocation.toLowerCase()}.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="xl:col-span-5 xl:pt-16">
          <ul className="border-t border-line">
            {links.map((l) => (
              <li key={l.label} className="border-b border-line">
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(l.download ? { download: "" } : {})}
                  className="group flex items-center justify-between gap-4 py-5"
                >
                  <span>
                    <span className="label block">{l.label}</span>
                    <span className="mt-1 block text-[1.0625rem] break-all transition-colors group-hover:text-accent">{l.value}</span>
                  </span>
                  <l.icon aria-hidden className="size-5 shrink-0 text-muted transition-colors group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
