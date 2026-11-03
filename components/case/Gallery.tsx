"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Figure } from "@/lib/types";

/** Figures shown on a light "paper" mat (the originals are white-background plots). */
export function Gallery({ items }: { items: Figure[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    dialog.current?.close();
    setOpen(null);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (open !== null && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  const single = items.length === 1;
  const current = open !== null ? items[open] : null;

  return (
    <>
      <ul className={single ? "grid" : "grid gap-4 sm:grid-cols-2"}>
        {items.map((f, i) => (
          <li key={f.src}>
            <figure className="group">
              <button
                type="button"
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setOpen(i);
                }}
                className="block w-full cursor-zoom-in bg-paper p-3 transition-transform duration-500 hover:-translate-y-0.5 md:p-4"
                aria-label={`Enlarge figure: ${f.caption}`}
              >
                <span className={`relative block w-full overflow-hidden ${single ? "" : "aspect-[4/3]"}`}>
                  <Image
                    src={f.src}
                    alt={f.alt}
                    width={f.width}
                    height={f.height}
                    sizes={single ? "(min-width: 1280px) 900px, 100vw" : "(min-width: 1280px) 450px, (min-width: 640px) 50vw, 100vw"}
                    className={single ? "h-auto w-full" : "h-full w-full object-contain"}
                  />
                </span>
              </button>
              <figcaption className="mt-3 flex items-start justify-between gap-4">
                <span className="text-[0.8125rem] text-muted">{f.caption}</span>
                <span className="shrink-0 font-mono text-[0.625rem] text-muted/70">FIG {String(i + 1).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-bg-deep/95"
        aria-label={current?.caption}
      >
        {current && (
          <div className="flex h-full flex-col p-4 md:p-10">
            <div className="flex items-center justify-between gap-4 text-ink">
              <p className="font-mono text-[0.75rem] text-muted">
                {open! + 1} / {items.length} · {current.caption}
              </p>
              <button type="button" onClick={close} className="grid size-11 place-items-center border border-line-strong" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <div className="relative mt-4 flex min-h-0 flex-1 items-center justify-center">
              <div className="relative h-full w-full bg-paper">
                <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain p-2 md:p-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="font-mono text-[0.625rem] break-all text-muted/70">Source · {current.source}</p>
              {!single && (
                <div className="flex gap-2">
                  <button type="button" onClick={() => setOpen((open! - 1 + items.length) % items.length)} className="grid size-11 place-items-center border border-line-strong text-ink" aria-label="Previous figure">
                    <ChevronLeft className="size-5" />
                  </button>
                  <button type="button" onClick={() => setOpen((open! + 1) % items.length)} className="grid size-11 place-items-center border border-line-strong text-ink" aria-label="Next figure">
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
