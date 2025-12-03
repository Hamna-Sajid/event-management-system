"use client"

import SocietyHeader from "@/components/society-header"
import SocietyHero from "@/components/society-hero"
import SocietyTabs from "@/components/society-tabs"

export default function MidnightTealProfile() {
  const themeStyles = `
    :root {
      --bg-midnight-teal: #0a1828;
      --bg-secondary-midnight-teal: #010b1a;
      --header-bg-midnight-teal: rgba(10, 24, 40, 0.8);
      --glass-midnight-teal: rgba(0, 180, 216, 0.1);
      --border-midnight-teal: rgba(0, 180, 216, 0.2);
      --accent-1-midnight-teal: #00b4d8;
      --accent-2-midnight-teal: #48cae4;
      --text-primary-midnight-teal: #ffffff;
      --text-secondary-midnight-teal: #a0c4d4;
    }
  `

  return (
    <div style={{ backgroundColor: "var(--bg-midnight-teal)" }}>
      <style>{themeStyles}</style>
      <SocietyHeader theme="midnight-teal" />
      <SocietyHero societyName="Midnight Teal Society" societyLogo="MT" theme="midnight-teal" />
      <SocietyTabs theme="midnight-teal">
        <div></div>
      </SocietyTabs>
    </div>
  )
}
