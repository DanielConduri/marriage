import Image from "next/image"

const timeline = [
  {
    date: "June 2019",
    title: "The First Meeting",
    description:
      "We met at a mutual friend's dinner party. What started as a conversation over wine turned into hours of laughter and the beginning of something beautiful.",
    image: "/images/marriage1.jpeg",
    imageAlt: "Emma and James walking together in a park during golden hour",
  },
  {
    date: "December 2024",
    title: "The Proposal",
    description:
      "On a snowy evening under the twinkling lights of the city, James got down on one knee and asked the question that changed everything forever.",
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
            How it all began
          </p>
          <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl text-balance">
            Our Story
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
                <p className="mt-4 leading-relaxed text-muted-foreground">
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
