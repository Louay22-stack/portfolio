import { Button } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[80dvh] flex-col justify-center pt-24">
      <p className="label text-accent">Error 404 · Process upset detected</p>
      <h1 className="mt-6 max-w-3xl text-5xl leading-[1] font-medium tracking-[-0.03em] md:text-7xl">
        This stream doesn&apos;t <span className="font-serif font-normal text-accent italic">lead anywhere.</span>
      </h1>
      <p className="mt-6 max-w-md text-[0.9375rem] text-muted">
        The page you&apos;re looking for has been moved, renamed or never existed. Back to the main line:
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/">Home</Button>
        <Button href="/work" variant="ghost">
          View projects
        </Button>
      </div>
    </div>
  );
}
