"use client"

import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.1)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d02243] to-[#84162b] flex items-center justify-center">
                <span className="text-white font-bold text-sm">IE</span>
              </div>
              <span className="text-white font-semibold">IEMS</span>
            </div>
            <p className="text-sm text-[rgba(255,255,255,0.6)]">
              Your gateway to premium IBA events and networking opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[rgba(255,255,255,0.6)]">
              <li>
                <a href="#" className="hover:text-[#d02243] transition">
                  Browse Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d02243] transition">
                  My Registrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d02243] transition">
                  About IBA
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d02243] transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-[rgba(255,255,255,0.6)]">
              <li>
                <a href="#" className="hover:text-[#d02243] transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d02243] transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d02243] transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d02243] transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-[rgba(255,255,255,0.6)]">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-[#d02243]" />
                <a href="mailto:info@iems.com" className="hover:text-[#d02243] transition">
                  info@iems.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-[#d02243]" />
                <a href="tel:+923001234567" className="hover:text-[#d02243] transition">
                  +92 300 123 4567
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-[#d02243] mt-0.5" />
                <span>Karachi, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[rgba(255,255,255,0.1)] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[rgba(255,255,255,0.5)]">
            <p>&copy; 2025 IBA Event Management System. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#d02243] transition">
                Twitter
              </a>
              <a href="#" className="hover:text-[#d02243] transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-[#d02243] transition">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
