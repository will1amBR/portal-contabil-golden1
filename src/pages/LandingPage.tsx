import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingSocialProof } from '@/components/landing/LandingSocialProof'
import { LandingFeaturesDelivery } from '@/components/landing/LandingFeaturesDelivery'
import { LandingPlansComparison } from '@/components/landing/LandingPlansComparison'
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks'
import { LandingTestimonials } from '@/components/landing/LandingTestimonials'
import { LandingFaq } from '@/components/landing/LandingFaq'
import { LandingLeadForm } from '@/components/landing/LandingLeadForm'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function LandingPage() {
  const location = useLocation()
  const [selectedRegime, setSelectedRegime] = useState('simples')

  // Smooth scroll to relevant sections based on route or hash
  useEffect(() => {
    if (location.pathname === '/planos') {
      const el = document.getElementById('planos')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (location.pathname === '/contratar') {
      const el = document.getElementById('contratar')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (location.hash) {
      const targetId = location.hash.replace('#', '')
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.pathname, location.hash])

  const handleSelectPlan = (regime: string) => {
    setSelectedRegime(regime)
    const el = document.getElementById('contratar')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Header / Navigation */}
      <LandingNavbar onSelectPlanCta={handleSelectPlan} />

      <main>
        {/* 2. Hero Section */}
        <LandingHero onSelectPlanCta={handleSelectPlan} />

        {/* 3. Social Proof & Numbers Bar */}
        <LandingSocialProof />

        {/* 4. Delivered Features (Funções Entregues) */}
        <LandingFeaturesDelivery />

        {/* 5. Pricing & Full Comparison Matrix (Planos & Preços) */}
        <LandingPlansComparison onSelectPlan={handleSelectPlan} />

        {/* 6. How it Works (Passo a Passo) */}
        <LandingHowItWorks />

        {/* 7. Client Testimonials */}
        <LandingTestimonials />

        {/* 8. Frequently Asked Questions (FAQ Accordion) */}
        <LandingFaq />

        {/* 9. Lead Capture & Hiring Form (Grava no banco + anti-spam + e-mail) */}
        <LandingLeadForm selectedRegime={selectedRegime} onRegimeChange={setSelectedRegime} />
      </main>

      {/* 10. Complete Footer with CRC and links */}
      <LandingFooter />
    </div>
  )
}
