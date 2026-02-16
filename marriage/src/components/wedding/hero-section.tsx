import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/images/marriage1.jpeg"
        alt="Beautiful wedding venue with floral arch and garden setting"
        fill
        className="object-contain"
        priority
      />
      <div className="absolute inset-0 bg-foreground/40" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-background/80">
          We are getting married
        </p>
        <h1 className="font-serif text-5xl leading-tight text-background md:text-7xl lg:text-8xl text-balance">
          Daniel & Nelly
        </h1>
        <div className="mt-6 flex items-center gap-4">
          <span className="h-px w-12 bg-background/50" />
          <p className="text-sm uppercase tracking-[0.2em] text-background/80">
            Marzo 15, 2026
          </p>
          <span className="h-px w-12 bg-background/50" />
        </div>
        <a
          href="#rsvp"
          className="mt-10 border border-background/60 bg-background/10 px-10 py-3 text-xs uppercase tracking-[0.2em] text-background backdrop-blur-sm transition-colors hover:bg-background/20"
        >
          RSVP Now
        </a>
      </div>
    </section>
  )
}
