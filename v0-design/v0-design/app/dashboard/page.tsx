import DashboardHeader from "@/components/dashboard-header"
import DashboardHero from "@/components/dashboard-hero"
import PersonalizedAccess from "@/components/personalized-access"
import EventFeed from "@/components/event-feed"
import SocietiesSpotlight from "@/components/societies-spotlight"
import Footer from "@/components/footer"

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#110205] via-[#1a0509] to-[#110205]">
      <DashboardHeader />
      <DashboardHero />
      <PersonalizedAccess />
      <EventFeed />
      <SocietiesSpotlight />
      <Footer />
    </main>
  )
}
