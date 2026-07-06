import { HeroSection } from '@/components/home/HeroSection'
import { WhoWeAre } from '@/components/home/WhoWeAre'
import { DivisionCutouts } from '@/components/home/DivisionCutouts'
import { GarmentsBrands } from '@/components/home/GarmentsBrands'
import { NewArrivals } from '@/components/home/NewArrivals'
import { KillingOffers } from '@/components/home/KillingOffers'
import { GlobalPresence } from '@/components/home/GlobalPresence'
import { ManufacturingStory } from '@/components/home/ManufacturingStory'
import { EnquiryConsole } from '@/components/home/EnquiryConsole'
import { CoverDemo } from '@/components/ui/cover-demo'
import BulkOfferBanner from '@/components/home/BulkOfferBanner'
import { SEOFAQ } from '@/components/home/SEOFAQ'

export default function HomePage() {
  return (
    <>
      <div className="fixed inset-0 z-0">
        <HeroSection />
      </div>

      <main className="relative z-20 mx-auto max-w-[1440px] px-0 mt-[100vh]">       
          <WhoWeAre />
          <BulkOfferBanner />
          <DivisionCutouts />
          <GarmentsBrands />
          <NewArrivals />
          <KillingOffers />
          <GlobalPresence />
          <ManufacturingStory />
          <CoverDemo />
          <SEOFAQ />
          <EnquiryConsole />
      </main>
    </>
  )
}
