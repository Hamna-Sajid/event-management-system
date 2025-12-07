"use client"

/**
 * @component Footer
 * 
 * Simplified footer with copyright notice
 * 
 * @remarks
 * This component displays a minimalist footer containing only:
 * - Copyright text (© 2025 IBA Event Management System)
 * - Centered layout
 * - Responsive flexbox (column on mobile, row on desktop)
 * - Subtle top border with transparency
 * 
 * Design approach:
 * - Reduced from full footer with social links and quick links
 * - Maintains brand presence without clutter
 * - Consistent with overall minimalist design
 * - Semi-transparent text for subtlety
 * 
 * @example
 * ```tsx
 * import Footer from '@/components/footer'
 * 
 * export default function LandingPage() {
 *   return (
 *     <>
 *       <Hero />
 *       <CallToAction />
 *       <Footer />
 *     </>
 *   )
 * }
 * ```
 * 
 * @category Components
 */
export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12 px-6">
        <div className="flex flex-col md:flex-row justify-center items-center text-sm text-muted-foreground">
            <p>&copy; 2025 IBA Event Management System. All rights reserved.</p>
        </div>
    </footer>
  )
}
