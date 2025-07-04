import React from "react";

// Ultra-modern AI loading animation: animated gradient ring, glowing pulse, and moving dots
export default function AILoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Simpler, smaller AI orb with subtle halo */}
      <div className="relative flex items-center justify-center">
        {/* Rotating halo */}
        <span className="absolute w-14 h-14 rounded-full border-2 border-gradient-to-tr from-primary via-blue-400 to-purple-500 opacity-30 animate-ai-halo" />
        {/* Glowing orb */}
        <span className="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary via-blue-400 to-purple-500 shadow-xl animate-ai-orb" />
        {/* Shimmer */}
        <span className="absolute w-6 h-6 rounded-full bg-white/30 blur-[4px] left-1 top-1 animate-ai-shimmer" />
      </div>
      <div className="mt-4 text-center">
        <span className="block text-base font-semibold text-primary/90 tracking-wide animate-ai-text">Generating...</span>
      </div>
      <style jsx>{`
        @keyframes ai-halo {
          0% { transform: rotate(0deg) scale(1); opacity: 0.3; }
          50% { transform: rotate(180deg) scale(1.06); opacity: 0.4; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.3; }
        }
        .animate-ai-halo { animation: ai-halo 2.2s linear infinite; }
        @keyframes ai-orb {
          0%, 100% { box-shadow: 0 0 16px 4px #a5b4fc44, 0 0 0 0 #818cf844; }
          50% { box-shadow: 0 0 24px 8px #818cf8cc, 0 0 0 4px #a5b4fc33; }
        }
        .animate-ai-orb { animation: ai-orb 1.6s ease-in-out infinite; }
        @keyframes ai-shimmer {
          0% { opacity: 0.7; left: 1px; top: 1px; }
          50% { opacity: 1; left: 8px; top: 5px; }
          100% { opacity: 0.7; left: 1px; top: 1px; }
        }
        .animate-ai-shimmer { animation: ai-shimmer 1.6s ease-in-out infinite; }
        @keyframes ai-text {
          0%, 100% { letter-spacing: 0.05em; opacity: 1; }
          50% { letter-spacing: 0.12em; opacity: 0.8; }
        }
        .animate-ai-text { animation: ai-text 1.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
} 