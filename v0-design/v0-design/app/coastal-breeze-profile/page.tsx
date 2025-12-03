"use client"

import SocietyHeader from "@/components/society-header"
import SocietyHero from "@/components/society-hero"
import SocietyTabs from "@/components/society-tabs"

export default function CoastalBreezeProfile() {
  const themeStyles = `
    :root {
      --bg-coastal-breeze: #f8f9fa;
      --bg-secondary-coastal-breeze: #e9ecef;
      --header-bg-coastal-breeze: rgba(248, 249, 250, 0.8);
      --glass-coastal-breeze: rgba(108, 117, 125, 0.08);
      --border-coastal-breeze: rgba(108, 117, 125, 0.15);
      --accent-1-coastal-breeze: #6c757d;
      --accent-2-coastal-breeze: #adb5bd;
      --text-primary-coastal-breeze: #212529;
      --text-secondary-coastal-breeze: #6c757d;
    }
  `

  return (
    <div style={{ backgroundColor: "var(--bg-coastal-breeze)" }}>
      <style>{themeStyles}</style>
      <SocietyHeader theme="coastal-breeze" />
      <SocietyHero societyName="Coastal Breeze Society" societyLogo="CB" theme="coastal-breeze" />
      <SocietyTabs theme="coastal-breeze">
        <div></div>
      </SocietyTabs>
    </div>
  )
}
