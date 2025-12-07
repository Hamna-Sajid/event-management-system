/**
 * @component LoadingScreen
 * 
 * Reusable loading screen with animated blobs and spinner
 * 
 * @remarks
 * Full-screen loading overlay with:
 * - Animated gradient blobs matching hero design
 * - Rotating spinner with gradient colors
 * - "Loading..." text with bouncing dots
 * 
 * @category Components
 */
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Animated background gradient with blobs */}
      <div className="absolute inset-0 bg-gradient-premium">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl opacity-30 animate-blob" />
        <div
          className="absolute bottom-10 right-1/4 w-80 h-80 bg-magenta/20 rounded-full blur-3xl opacity-30 animate-blob"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl opacity-25 animate-blob"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute bottom-1/3 left-10 w-[28rem] h-[28rem] bg-electric-blue/15 rounded-full blur-3xl opacity-25 animate-blob"
          style={{ animationDelay: "6s" }}
        />
      </div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Rotating spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-electric-blue border-r-magenta animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <div className="flex items-center gap-2">
          <span className="text-white text-xl font-semibold">Loading</span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
          </span>
        </div>
      </div>
    </div>
  )
}
