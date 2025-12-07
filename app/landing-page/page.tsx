import Header from "@/components/header"
import Hero from "@/components/hero"
import CallToAction from "@/components/call-to-action"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-premium">
      <Header />
      <Hero />
      <CallToAction />
      <Footer />
    </main>
  )
}