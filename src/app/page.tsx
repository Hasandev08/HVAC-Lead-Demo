import { ComfortClub } from "@/components/site/ComfortClub";
import { Contact } from "@/components/site/Contact";
import { Financing } from "@/components/site/Financing";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { MobileCallBar } from "@/components/site/MobileCallBar";
import { Reviews } from "@/components/site/Reviews";
import { ServiceArea } from "@/components/site/ServiceArea";
import { Services } from "@/components/site/Services";
import { WhyUs } from "@/components/site/WhyUs";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <WhyUs />
        <ComfortClub />
        <Financing />
        <Reviews />
        <ServiceArea />
        <Contact />
      </main>
      <Footer />
      {/* Clears the fixed mobile call bar so the footer isn't trapped under it. */}
      <div className="h-20 sm:hidden" aria-hidden="true" />
      <MobileCallBar />
    </>
  );
}
