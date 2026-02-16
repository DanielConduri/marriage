import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground py-12 text-center text-background">
      <div className="mx-auto max-w-4xl px-6">
        <h3 className="font-serif text-3xl md:text-4xl">Daniel & Nelly</h3>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-background/30" />
          <Heart className="h-4 w-4 text-accent" fill="currentColor" />
          <span className="h-px w-8 bg-background/30" />
        </div>
        <p className="mt-4 text-sm text-background/60">
          Marzo 15, 2026 — San Diego, Quito
        </p>
        <p className="mt-6 text-xs text-background/40">
          {"We can't wait to celebrate with you."}
        </p>
      </div>
    </footer>
  )
}
