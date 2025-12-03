"use client"

import SocietyHeader from "@/components/society-header"
import SocietyHero from "@/components/society-hero"
import SocietyTabs from "@/components/society-tabs"

export default function SlateGrayProfile() {
  const themeStyles = `
    :root {
      --bg-slate-gray: #212529;
      --bg-secondary-slate-gray: #343a40;
      --header-bg-slate-gray: rgba(33, 37, 41, 0.8);
      --glass-slate-gray: rgba(255, 193, 7, 0.1);
      --border-slate-gray: rgba(255, 193, 7, 0.2);
      --accent-1-slate-gray: #ffc107;
      --accent-2-slate-gray: #ffdb58;
      --text-primary-slate-gray: #ffffff;
      --text-secondary-slate-gray: #c0c0c0;
    }
  `

  return (
    <div style={{ backgroundColor: "var(--bg-slate-gray)" }}>
      <style>{themeStyles}</style>
      <SocietyHeader theme="slate-gray" />
      <SocietyHero societyName="Slate Gray Society" societyLogo="SG" theme="slate-gray" />
      <SocietyTabs theme="slate-gray">
        <div></div>
      </SocietyTabs>
    </div>
  )
}
