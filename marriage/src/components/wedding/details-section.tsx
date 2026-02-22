import Image from "next/image"
import { MapPin, Clock, Utensils } from "lucide-react"

const details = [
  {
    icon: MapPin,
    title: "Ceremonia",
    line1: "Iglesia Nazareno Fuende Vida",
    line2: "Perez Quiñonez oe8-30, Quito Ecuador",
    line3: "La ceremonia comienza a las 8:30 AM",
  },
    {
    icon: Clock,
    title: "Hora del Brindis",
    line1: "The Terrace Lounge",
    line2: "Drinks and hors d'oeuvres",
    line3: "9:00 AM — 12:00 PM",
  },

  {
    icon: Utensils,
    title: "Recepción",
    line1: "Coliseo de la iglesia ",
    line2: "Cena y Celebración",
    line3: "1:00 PM en adelante",
  },
]

export function DetailsSection() {
  return (
    <section id="details" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Cuándo y dónde
          </p>
          <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl text-balance">
            Detalles de la boda
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {details.map((d) => (
            <div
              key={d.title}
              className="flex flex-col items-center border border-border bg-background px-6 py-10 text-center"
            >
              <d.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
              <h3 className="mt-4 font-serif text-xl text-foreground">
                {d.title}
              </h3>
              <div className="mt-4 flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">{d.line1}</p>
                <p className="text-sm text-muted-foreground">{d.line2}</p>
                <p className="text-sm text-muted-foreground">{d.line3}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Venue image */}
        <div className="mt-14 relative aspect-[21/9] overflow-hidden">
          <Image
            src="/images/venue.jpg"
            alt="Elegant wedding reception venue with chandeliers and floral centerpieces"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
