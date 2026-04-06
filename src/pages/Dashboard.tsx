import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "sonner";
import { ParticlesBackground } from "../components/dashboard/ParticlesBackground";
import { PhysicsEngine } from "../components/dashboard/PhysicsEngine";
import { AnimatedCharts } from "../components/dashboard/AnimatedCharts";
import { AiExplanationModal } from "../components/dashboard/AiExplanationModal";

type LiveData = {
  threats: number;
  systemsOnline: string;
  coverage: number;
  status: string;
  activity: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
};

const Dashboard = () => {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");
  
  // Auto-Improvement state
  const [interactionCount, setInteractionCount] = useState(0);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // Sound Effect with AudioContext
  const playAlertSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "square"; // More aggressive sound
      
      // Siren wobble effect
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.2);
      oscillator.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.4);
      oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.6);
      oscillator.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.8);
      oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 1.0);
      oscillator.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 1.5); // drop off
      
      gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime); // Louder
      gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime + 1.0);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.5);
    } catch(err) {
      console.error("Audio unlock failed");
    }
  }, []);

  /* ================= FETCH LIVE DATA ================= */
  const fetchLiveData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ransomware/live-status");
      const data = await res.json();
      setLiveData(data);
      
      if (data.status === "At Risk" && !aiSuggestion) {
         setAiSuggestion("High risk detected in network zone Alpha. Consider initiating a system scan mode.");
      } else if (data.status === "Protected") {
         setAiSuggestion("All systems nominal. Continual monitoring enabled via Vanguard AI Engine.");
      }
    } catch(err) {
      console.warn("Backend offline");
    }
  };

  useEffect(() => {
    fetchLiveData();
    const i = setInterval(fetchLiveData, 5000);
    return () => clearInterval(i);
  }, []);

  /* ================= ACTIONS ================= */
  const simulateThreat = async () => {
    trackInteraction();
    playAlertSound();
    toast.error("Simulated Ransomware Threat Detected!", {
      description: "Emergency protocols engaged. Risk score elevated.",
    });
    
    await fetch("http://localhost:5000/api/ransomware/simulate-threat", { method: "POST" });
    fetchLiveData();
  };

  const clearThreats = async () => {
    trackInteraction();
    toast.success("Threats Neutralized", {
      description: "Returning to normal operational state.",
    });
    await fetch("http://localhost:5000/api/ransomware/clear-threats", { method: "POST" });
    setAiInsight(null);
    setAiSuggestion("System restored. Standard physics engaged.");
    fetchLiveData();
  };

  const explainThreat = async () => {
    trackInteraction();
    setIsAiModalOpen(true);
    if (aiInsight) return; // Cache hit
    
    setLoadingAI(true);
    try {
      const res = await fetch("http://localhost:5000/api/ransomware/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threats: liveData?.threats ?? 0,
        }),
      });
      const data = await res.json();
      setAiInsight(data.aiResponse);
    } catch(err) {
      toast.error("AI Neural Net unreachable.");
    } finally {
      setLoadingAI(false);
    }
  };

  // Tracking engine
  const trackInteraction = () => {
    setInteractionCount(prev => {
      const current = prev + 1;
      if (current === 5) {
         toast("💡 AI Notice: You interact heavily with manual controls. Consider enabling auto-remediation.", { duration: 4000 });
      }
      return current;
    });
  };

  /* ================= CALCULATIONS ================= */
  const riskScore = aiInsight?.riskScore ?? Math.min((liveData?.threats ?? 0) * 20, 90);
  const coverage = Math.max(100 - riskScore, 0);
  const activity = liveData?.activity?.[activeTab] ?? [0,0,0,0,0,0];
  const labels = activeTab === "daily" 
    ? ["12am", "4am", "8am", "12pm", "4pm", "8pm"] 
    : activeTab === "weekly" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] 
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  // Framer Motion Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col pt-24 pb-12 px-8" onClick={() => trackInteraction()}>
      {/* Background Layer */}
      <ParticlesBackground />
      
      {/* Content wrapper to float above particles */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-4 mb-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-ransomguard-purple via-blue-400 to-emerald-400 drop-shadow-[0_0_15px_#9b87f5]">
              RansomGuard Command Center
            </h1>
            <p className="text-slate-400 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Real-time ransomware orbital observation grid
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md rounded-lg p-3 text-sm border border-slate-700 max-w-sm flex items-start gap-3 shadow-[0_0_20px_-5px_#0ea5e9]">
            <span className="text-xl">🤖</span>
            <p className="text-slate-300 italic">"{aiSuggestion || 'AI Engine initialising telemetry...'}"</p>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-wrap gap-4 mb-4">
          <motion.button variants={itemVariants} whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px 0px rgba(239, 68, 68, 0.5)" }} whileTap={{ scale: 0.95 }} onClick={simulateThreat} className="bg-red-500/10 border border-red-500 text-red-500 font-bold px-6 py-3 rounded-xl backdrop-blur-sm transition-colors hover:bg-red-500 hover:text-white flex items-center gap-2">
            🚨 Inject Threat Event
          </motion.button>
          
          <motion.button variants={itemVariants} whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px 0px rgba(16, 185, 129, 0.5)" }} whileTap={{ scale: 0.95 }} onClick={clearThreats} className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 font-bold px-6 py-3 rounded-xl backdrop-blur-sm transition-colors hover:bg-emerald-500 hover:text-white flex items-center gap-2" disabled={!liveData?.threats}>
            ✅ Neutralize Payload
          </motion.button>
          
          <motion.button variants={itemVariants} whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px 0px rgba(155, 135, 245, 0.5)" }} whileTap={{ scale: 0.95 }} onClick={explainThreat} className="bg-ransomguard-purple/10 border border-ransomguard-purple text-ransomguard-purple font-bold px-6 py-3 rounded-xl backdrop-blur-sm transition-colors hover:bg-ransomguard-purple hover:text-white flex items-center gap-2 w-full sm:w-auto md:ml-auto">
            🧠 Explain Threat (AI)
          </motion.button>
        </motion.div>

        {/* Top KPI Cards */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <motion.div variants={itemVariants} className={`relative overflow-hidden rounded-2xl p-6 bg-slate-900 border ${riskScore > 50 ? 'border-red-500 shadow-[0_0_20px_-5px_#ef4444]' : 'border-emerald-500 shadow-[0_0_20px_-5px_#10b981]'} backdrop-blur-md`}>
            <p className="text-slate-400 font-medium tracking-wide uppercase text-sm mb-2">Shield Status</p>
            <h2 className={`text-3xl font-bold ${riskScore > 50 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
              {riskScore > 50 ? 'CRITICAL RISK' : 'ORBIT SECURE'}
            </h2>
            <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${coverage}%` }} transition={{ duration: 1 }} className={`h-full ${riskScore > 50 ? 'bg-red-500' : 'bg-emerald-500'}`}></motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative rounded-2xl p-6 bg-slate-900 border border-slate-700 shadow-xl backdrop-blur-md">
            <p className="text-slate-400 font-medium tracking-wide uppercase text-sm mb-2">Active Threats Dropping</p>
            <h2 className="text-4xl font-black text-rose-500 tabular-nums tracking-tighter">{liveData?.threats ?? 0}</h2>
            {/* Matter.js Physics Engine Container */}
            <PhysicsEngine threats={liveData?.threats ?? 0} />
          </motion.div>

          <motion.div variants={itemVariants} className="relative rounded-2xl p-6 bg-slate-900 border border-slate-700 shadow-xl backdrop-blur-md flex flex-col">
            <p className="text-slate-400 font-medium tracking-wide uppercase text-sm mb-2">Confidence Score</p>
            <div className="flex-1 flex items-center justify-center">
               <div className="relative">
                 <svg className="w-24 h-24 transform -rotate-90">
                   <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                   <motion.circle 
                      cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={`${251.2 * (Math.abs(100 - riskScore) / 100)} 251.2`} 
                      className={`${riskScore > 50 ? 'text-red-500' : 'text-blue-500'}`} 
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                   />
                 </svg>
                 <span className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-white">
                   {100 - riskScore}%
                 </span>
               </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts & Graphs container */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-[0_0_30px_-10px_rgba(155,135,245,0.2)] backdrop-blur-lg">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
               <h3 className="text-xl font-bold text-white tracking-wide">Telemetry History</h3>
               <p className="text-slate-400 text-sm">Security events recorded over timeline</p>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 mt-4 md:mt-0 relative">
              {['daily', 'weekly', 'monthly'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors z-10 ${activeTab === t ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {activeTab === t && (
                    <motion.div layoutId="activeTab" className="absolute inset-0 bg-ransomguard-purple rounded-md -z-10 shadow-[0_0_10px_#9b87f5]" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatedCharts data={activity} riskScore={riskScore} labels={labels} />
        </motion.div>
      </div>

      <AiExplanationModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        aiInsight={aiInsight}
      />
    </div>
  );
};

export default Dashboard;
