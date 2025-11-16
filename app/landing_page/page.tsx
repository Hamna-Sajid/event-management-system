import Header from "@/components/header"
import Hero from "@/components/hero"
import UpcomingEvents from "@/components/upcoming-events"
import CallToAction from "@/components/call-to-action"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#110205] via-[#1a0509] to-[#110205]">
      <Header />
      <Hero />
      <UpcomingEvents />
      <CallToAction />
      <Footer />
    </main>
  )
}