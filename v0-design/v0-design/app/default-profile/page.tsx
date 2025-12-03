"use client"

import SocietyHeader from "@/components/society-header"
import SocietyHero from "@/components/society-hero"
import SocietyTabs from "@/components/society-tabs"

export default function DefaultProfile() {
  const themeStyles = `
    :root {
      --bg-default: #110205;
      --bg-secondary-default: #2b070e;
      --header-bg-default: rgba(17, 2, 5, 0.8);
      --glass-default: rgba(212, 34, 67, 0.1);
      --border-default: rgba(212, 34, 67, 0.2);
      --accent-1-default: #d02243;
      --accent-2-default: #aa1c37;
      --text-primary-default: #ffffff;
      --text-secondary-default: #b0b0b0;
    }
  `

  return (
    <div style={{ backgroundColor: "var(--bg-default)" }}>
      <style>{themeStyles}</style>
      <SocietyHeader theme="default" />
      <SocietyHero societyName="Default IEMS Society" societyLogo="DI" theme="default" />
      <SocietyTabs theme="default">
        <div></div>
      </SocietyTabs>
    </div>
  )
}
