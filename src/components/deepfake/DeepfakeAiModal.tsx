import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Marker {
  name: string;
  description: string;
  severity: "low" | "medium" | "high";
}

interface DeepfakeAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    isDeepfake: boolean;
    confidenceScore: number;
    markers: Marker[];
    protectionRecommendations: string[];
    metadata?: any;
  } | null;
}

export const DeepfakeAiModal = ({ isOpen, onClose, result }: DeepfakeAiModalProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);
  const [aiExplanation, setAiExplanation] = useState<string>("");

  useEffect(() => {
    if (!isOpen || !result) {
      setDisplayedText("");
      setAiExplanation("");
      setIsGenerating(true);
      return;
    }

    // Use real AI service via backend
    const fetchExplanation = async () => {
      setIsGenerating(true);
      
      try {
        const res = await fetch("http://localhost:5000/api/deepfake/ai-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isDeepfake: result.isDeepfake,
            confidenceScore: result.confidenceScore,
            markers: result.markers,
            protectionRecommendations: result.protectionRecommendations,
            metadata: result.metadata
          })
        });
        const data = await res.json();
        
        if (data.success && data.explanation) {
          setAiExplanation(data.explanation);
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        // Fallback Mechanism
        setAiExplanation("AI service temporarily unavailable. Fallback Analysis: " + (result.isDeepfake ? "High probability of manipulation detected." : "Content appears authentic."));
      } finally {
        setIsGenerating(false);
      }
    };

    fetchExplanation();
  }, [isOpen, result]);

  // Direct text rendering (No typewriter effect)
  useEffect(() => {
    if (isGenerating || !aiExplanation || !isOpen) return;
    setDisplayedText(aiExplanation);
  }, [isGenerating, aiExplanation, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }} // Fast spring <300ms
            className={`w-full max-w-2xl bg-[#0f172a] border rounded-2xl overflow-hidden shadow-[0_0_50px_-15px_rgba(0,0,0,0.5)] ${
                result.isDeepfake ? 'border-red-500/30' : 'border-green-500/30'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-5 border-b bg-gradient-to-r to-transparent ${result.isDeepfake ? 'border-red-500/20 from-red-500/10' : 'border-green-500/20 from-green-500/10'}`}>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ring-1 ${result.isDeepfake ? 'bg-red-500/20 text-red-400 ring-red-500/50' : 'bg-green-500/20 text-green-400 ring-green-500/50'}`}>
                  🧠
                </span>
                Deepfake Context Engine
              </h2>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {isGenerating ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin ${result.isDeepfake ? 'border-red-500' : 'border-green-500'}`}></div>
                  <p className="text-slate-400 text-sm animate-pulse">Running advanced heuristics...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">AI Confidence Score</p>
                      <div className="flex items-end gap-2">
                        <p className={`font-bold text-2xl ${result.isDeepfake ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}>
                          {result.confidenceScore}%
                        </p>
                        <span className="text-xs text-slate-500 mb-1 relative top-[-2px]">
                           {result.isDeepfake ? "Fake Probability" : "Authentic Probability"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Analysis Status</p>
                      <p className={`font-semibold ${result.isDeepfake ? 'text-red-400' : 'text-green-400'}`}>
                        {result.isDeepfake ? 'Critical Manipulation' : 'Verified Authentic'}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0b1120] border border-[#1e293b] relative min-h-[160px]">
                    <p className="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {displayedText}
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
