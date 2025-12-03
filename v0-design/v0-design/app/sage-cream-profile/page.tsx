"use client"

import SocietyHeader from "@/components/society-header"
import SocietyHero from "@/components/society-hero"
import SocietyTabs from "@/components/society-tabs"

export default function SageCreamProfile() {
  const themeStyles = `
    :root {
      --bg-sage-cream: #f7f7f0;
      --bg-secondary-sage-cream: #f2f2e7;
      --header-bg-sage-cream: rgba(247, 247, 240, 0.8);
      --glass-sage-cream: rgba(143, 188, 143, 0.1);
      --border-sage-cream: rgba(143, 188, 143, 0.2);
      --accent-1-sage-cream: #8fbc8f;
      --accent-2-sage-cream: #a2be9e;
      --text-primary-sage-cream: #2d3d2d;
      --text-secondary-sage-cream: #6b7b6b;
    }
  `

  return (
    <div style={{ backgroundColor: "var(--bg-sage-cream)" }}>
      <style>{themeStyles}</style>
      <SocietyHeader theme="sage-cream" />
      <SocietyHero societyName="Sage & Cream Society" societyLogo="SC" theme="sage-cream" />
      <SocietyTabs theme="sage-cream">
        <div></div>
      </SocietyTabs>
    </div>
  )
}
