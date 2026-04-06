import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AiExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiInsight: {
    threatType: string;
    killChainStage: string;
    riskScore: number;
    explanation: string;
    recommendedAction: string;
  } | null;
}

export const AiExplanationModal = ({ isOpen, onClose, aiInsight }: AiExplanationModalProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = aiInsight?.explanation || "Analyzing security context...";

  // Typewriter effect
  useEffect(() => {
    if (!isOpen) { 
        setDisplayedText(""); 
        return; 
    }
    
    let i = 0;
    setDisplayedText("");
    const intervalId = setInterval(() => {
      setDisplayedText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(intervalId);
      }
    }, 15); // Adjust typing speed here
    
    return () => clearInterval(intervalId);
  }, [isOpen, fullText]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-[0_0_40px_-10px_rgba(155,135,245,0.3)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1e293b] bg-gradient-to-r from-[#1e293b]/50 to-transparent">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-ransomguard-purple/20 flex items-center justify-center text-ransomguard-purple ring-1 ring-ransomguard-purple/50">🧠</span>
                AI Threat Analysis
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
              {aiInsight ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Detection</p>
                      <p className="font-semibold text-red-400">{aiInsight.threatType}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Kill Chain Stage</p>
                      <p className="font-semibold text-orange-400">{aiInsight.killChainStage}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 col-span-2 md:col-span-1">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Risk Score</p>
                      <div className="flex items-center gap-2">
                        <p className={`font-bold text-xl ${aiInsight.riskScore > 75 ? 'text-red-500' : 'text-yellow-500'}`}>
                          {aiInsight.riskScore}/100
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0b1120] border border-[#1e293b] relative">
                    <p className="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {displayedText}
                      <span className="inline-block w-2 h-4 ml-1 bg-ransomguard-purple animate-pulse align-middle"></span>
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/10 flex gap-4 items-start">
                    <div className="mt-1">✅</div>
                    <div>
                      <h4 className="font-semibold text-green-400 mb-1">Recommended Action</h4>
                      <p className="text-green-300/80 text-sm leading-relaxed">{aiInsight.recommendedAction}</p>
                    </div>
                  </div>
                </>
              ) : (
                 <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-ransomguard-purple border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400">Consulting neural networks...</p>
                 </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-[#1e293b] bg-slate-900/50 text-xs text-slate-500 flex justify-between items-center">
              <span>Security Vanguard Engine v2.0</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Secure Connection
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
