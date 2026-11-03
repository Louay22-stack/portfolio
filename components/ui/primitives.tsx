import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  external?: boolean;
  download?: boolean;
  className?: string;
};

export function Button({ href, children, variant = "solid", external, download, className }: ButtonProps) {
  const cls = cn(
    "group inline-flex h-12 items-center gap-3 px-6 text-sm tracking-wide transition-colors duration-300",
    variant === "solid"
      ? "bg-accent text-accent-ink hover:bg-[#d6b47f]"
      : "border border-line-strong text-ink hover:border-accent hover:text-accent",
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </>
  );
  if (external || download) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: "" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function IndexLabel({ index, children, className }: { index: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn("label flex items-center gap-3", className)}>
      <span className="text-accent">/{index}</span>
      <span aria-hidden className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </p>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-line px-2.5 py-1 font-mono text-[0.6875rem] tracking-wide text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  index,
  label,
  heading,
  id,
  className,
}: { index: string; label: string; heading: ReactNode; id?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <IndexLabel index={index}>{label}</IndexLabel>
      <h2 id={id} className="max-w-3xl text-[2rem] leading-[1.08] font-medium tracking-[-0.02em] text-balance md:text-[2.75rem]">
        {heading}
      </h2>
    </div>
  );
}

/** Editorial emphasis in serif italic */
export function Em({ children }: { children: ReactNode }) {
  return <em className="font-serif font-normal tracking-normal text-accent italic">{children}</em>;
}
