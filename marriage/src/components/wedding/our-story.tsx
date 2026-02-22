import Image from "next/image"

const timeline = [
  {
    date: "Mayo 2021",
    title: "El primer encuentro",
    description:
      `Nos conocimos en una reunión de jóvenes de la iglesia. 
      Ambos estábamos un poco nerviosos, y la música fue el medio por el cual logramos conectar.
      Fue el comienzo de una hermosa amistad que rápidamente se convirtió en un propósito.
      `,
    image: "/images/marriage4.jpeg",
    imageAlt: "Emma and James walking together in a park during golden hour",
  },
  {
    date: "Febrero 2026",
    title: "La propuesta",
    description:
      "En una tarde nevada bajo las luces centelleantes de la ciudad, Nelly se arrodilló e hizo la pregunta que lo cambió todo para siempre.",
    image: "/images/marriage1.jpeg",
    imageAlt: "Romantic proposal scene with warm lighting and candles",
  },
]

export function OurStory() {
  return (
    <section id="story" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Cómo empezó todo
          </p>
          <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl text-balance">
            Nuestra historia
          </h2>
        </div>

        <div className="mt-16 flex flex-col gap-20">
          {timeline.map((item, i) => (
            <div
              key={item.date}
              className={`flex flex-col items-center gap-8 md:flex-row ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex w-full flex-col md:w-2/3">
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  {item.date}
                </p>
                <h3 className="mt-2 font-serif text-2xl text-foreground md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground text-justify">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
