"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    satisfaction: 5,
    contentQuality: 5,
    organization: 5,
    likedMost: "",
    improvements: "",
    otherComments: "",
    futureAttendance: "maybe",
    topicInterests: [] as string[],
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSliderChange = (field: string, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTextChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, futureAttendance: value }))
  }

  const handleCheckboxChange = (topic: string) => {
    setFormData((prev) => ({
      ...prev,
      topicInterests: prev.topicInterests.includes(topic)
        ? prev.topicInterests.filter((t) => t !== topic)
        : [...prev.topicInterests, topic],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Feedback submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      window.history.back()
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#110205] via-[#1a0509] to-[#110205]">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Success Message */}
        {submitted && (
          <div className="mb-6 p-4 rounded-lg glass border border-[#d02243]/50 bg-[rgba(208,34,67,0.1)]">
            <p className="text-white text-center font-semibold">
              Thank you! Your feedback has been submitted successfully.
            </p>
          </div>
        )}

        {/* Main Form Card */}
        <div className="glass rounded-2xl p-8 border border-[rgba(255,255,255,0.15)]">
          {/* Event Context */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Event Feedback</h1>
            <p className="text-[rgba(255,255,255,0.7)]">
              Feedback for: <span className="font-semibold text-[#d02243]">Annual Tech Fest - Day 1</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section A: Overall Experience */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-[rgba(255,255,255,0.1)] pb-3">
                Overall Experience
              </h2>

              {/* Question 1: Satisfaction */}
              <div>
                <label className="block text-white font-medium mb-3">
                  How satisfied were you with the overall event?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.satisfaction}
                    onChange={(e) => handleSliderChange("satisfaction", Number.parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none cursor-pointer accent-[#d02243]"
                  />
                  <span className="text-[#d02243] font-bold text-lg w-12 text-center">{formData.satisfaction}/10</span>
                </div>
              </div>

              {/* Question 2: Content Quality */}
              <div>
                <label className="block text-white font-medium mb-3">
                  How would you rate the quality of content/speakers/activities?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.contentQuality}
                    onChange={(e) => handleSliderChange("contentQuality", Number.parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none cursor-pointer accent-[#d02243]"
                  />
                  <span className="text-[#d02243] font-bold text-lg w-12 text-center">
                    {formData.contentQuality}/10
                  </span>
                </div>
              </div>

              {/* Question 3: Organization */}
              <div>
                <label className="block text-white font-medium mb-3">
                  How well was the event organized (timing, venue, logistics)?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.organization}
                    onChange={(e) => handleSliderChange("organization", Number.parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none cursor-pointer accent-[#d02243]"
                  />
                  <span className="text-[#d02243] font-bold text-lg w-12 text-center">{formData.organization}/10</span>
                </div>
              </div>
            </div>

            {/* Section B: Open-Ended Feedback */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-[rgba(255,255,255,0.1)] pb-3">
                Your Feedback
              </h2>

              {/* Question 4: What you liked */}
              <div>
                <label className="block text-white font-medium mb-2">What did you like most about the event?</label>
                <textarea
                  value={formData.likedMost}
                  onChange={(e) => handleTextChange("likedMost", e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] focus:ring-1 focus:ring-[#d02243] resize-none"
                  rows={4}
                />
              </div>

              {/* Question 5: Areas for improvement */}
              <div>
                <label className="block text-white font-medium mb-2">
                  What areas need improvement for the next time?
                </label>
                <textarea
                  value={formData.improvements}
                  onChange={(e) => handleTextChange("improvements", e.target.value)}
                  placeholder="Share your suggestions..."
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] focus:ring-1 focus:ring-[#d02243] resize-none"
                  rows={4}
                />
              </div>

              {/* Question 6: Other comments (Optional) */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Any other comments or suggestions? <span className="text-[rgba(255,255,255,0.5)]">(Optional)</span>
                </label>
                <textarea
                  value={formData.otherComments}
                  onChange={(e) => handleTextChange("otherComments", e.target.value)}
                  placeholder="Additional feedback..."
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] focus:ring-1 focus:ring-[#d02243] resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Section C: Society & Future Events */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-[rgba(255,255,255,0.1)] pb-3">
                Future Engagement
              </h2>

              {/* Question 7: Future attendance */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Are you likely to attend another event by this society?
                </label>
                <div className="space-y-2">
                  {["yes", "maybe", "no"].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="futureAttendance"
                        value={option}
                        checked={formData.futureAttendance === option}
                        onChange={(e) => handleRadioChange(e.target.value)}
                        className="w-4 h-4 accent-[#d02243] cursor-pointer"
                      />
                      <span className="text-white capitalize group-hover:text-[#d02243] transition-colors">
                        {option === "yes" ? "Yes, definitely" : option === "maybe" ? "Maybe" : "No"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 8: Topic interests */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Which future topics or types of events would you like to see more of?
                </label>
                <div className="space-y-2">
                  {["Workshops", "Networking Events", "Seminars", "Competitions", "Social Gatherings"].map((topic) => (
                    <label key={topic} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.topicInterests.includes(topic)}
                        onChange={() => handleCheckboxChange(topic)}
                        className="w-4 h-4 rounded accent-[#d02243] cursor-pointer"
                      />
                      <span className="text-white group-hover:text-[#d02243] transition-colors">{topic}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-3 pt-6 border-t border-[rgba(255,255,255,0.1)]">
              <Button
                type="submit"
                disabled={submitted}
                className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {submitted ? "Feedback Submitted" : "Submit Feedback"}
              </Button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
              >
                <ChevronLeft size={18} />
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
