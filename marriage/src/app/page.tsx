import { Navigation } from "@/components/wedding/navigation"
import { HeroSection } from "@/components/wedding/hero-section"
import { Countdown } from "@/components/wedding/countdown"
import { OurStory } from "@/components/wedding/our-story"
import { DetailsSection } from "@/components/wedding/details-section"
import { GallerySection } from "@/components/wedding/gallery-section"
import { RsvpSection } from "@/components/wedding/rsvp-section"
import { Footer } from "@/components/wedding/footer"

export default function WeddingPage() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <Countdown />
      <OurStory />
      <DetailsSection />
      <GallerySection />
      <RsvpSection />
      <Footer />
    </main>
  )
}
