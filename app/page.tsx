import Link from "next/link"
import { HeroSection } from "@/components/landing/hero-section"
import { BenefitsSection as FeaturesSection } from "@/components/landing/benefits-section"
import { ValuePropositionSection } from "@/components/landing/value-proposition-section"
import { StoreSection } from "@/components/landing/store-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      <Header />
      <main>
        <HeroSection />
        <ValuePropositionSection /> {/* #beneficios */}
        <StoreSection /> {/* New Store Preview Section */}
        <HowItWorksSection /> {/* #como-funciona */}
        <FeaturesSection /> {/* #recursos (was BenefitsSection) */}
        <TestimonialsSection /> {/* #depoimentos */}
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

