"use client"

import Image from "next/image"

const images = [
  { src: "/images/dan27.jpg", alt: "Wedding ceremony setup in garden" },
  { src: "/images/dan26.jpg", alt: "Couple walking in the park" },
  { src: "/images/dan35.jpg", alt: "Reception venue decorated beautifully" },
  { src: "/images/dan33.jpg", alt: "Engagement moment" },
  { src: "/images/marriage2.jpeg", alt: "Engagement moment" },
  { src: "/images/dan29.jpg", alt: "Engagement moment" },
]

function AnimatedImage({ src, alt, aspect }: { src: string; alt: string; aspect: string }) {
  return (
    <div className={`group relative ${aspect} rounded-xl overflow-hidden shadow-lg cursor-pointer`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-black/0 transition-all duration-500" />

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
        <span className="text-white text-lg tracking-wide">
   
        </span>
      </div>
    </div>
  )
}

export function GallerySection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">

        <div className="text-center">
          <h2 className="font-serif text-4xl md:text-5xl">Gallery</h2>
        </div>

        <div className="mt-14 space-y-10">

          {/* BLOQUE SUPERIOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedImage {...images[0]} aspect="aspect-[2/3]" />

            <div className="grid gap-6">
              <AnimatedImage {...images[1]} aspect="aspect-[3/2]" />
              <AnimatedImage {...images[2]} aspect="aspect-[3/2]" />
            </div>
          </div>

          {/* BLOQUE INFERIOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-6">
              <AnimatedImage {...images[3]} aspect="aspect-[3/2]" />
              <AnimatedImage {...images[4]} aspect="aspect-[3/2]" />
            </div>

            <AnimatedImage {...images[5]} aspect="aspect-[2/3]" />
          </div>

        </div>
      </div>
    </section>
  )
}