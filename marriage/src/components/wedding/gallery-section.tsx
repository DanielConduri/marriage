"use client"

import Image from "next/image"

const images = [
  { src: "/images/marriage1.jpeg", alt: "Wedding ceremony setup in garden" },
  { src: "/images/marriage1.jpeg", alt: "Couple walking in the park" },
  { src: "/images/marriage1.jpeg", alt: "Reception venue decorated beautifully" },
  { src: "/images/marriage1.jpeg", alt: "Engagement moment" },
]

export function GallerySection() {
  return (
    <section id="gallery" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Moments to cherish
          </p>
          <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl text-balance">
            Gallery
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden ${
                i === 0 || i === 3 ? "aspect-[2/3]" : "aspect-[3/2]"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
