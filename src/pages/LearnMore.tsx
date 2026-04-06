import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ParticlesBackground } from '@/components/dashboard/ParticlesBackground';
import { RansomGuardChatbot } from '@/components/chat/RansomGuardChatbot';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Clock, Zap, Activity, BrainCircuit, RotateCcw, 
  ScanLine, Lock, RefreshCw, UserCheck, Briefcase, Frame 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const LearnMore = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: "Detection Rate", value: "99.9%", icon: <ShieldCheck className="w-8 h-8 text-ransomguard-purple mb-4" /> },
    { label: "Active Monitoring", value: "24/7", icon: <Clock className="w-8 h-8 text-ransomguard-purple mb-4" /> },
    { label: "Response Time", value: "< 50ms", icon: <Zap className="w-8 h-8 text-ransomguard-purple mb-4" /> }
  ];

  const features = [
    { title: "Real-Time Monitoring", desc: "Constant surveillance of file systems and network traffic to catch anomalies instantly.", icon: <Activity className="w-6 h-6 text-emerald-400" /> },
    { title: "AI-Based Detection", desc: "Neural networks trained to recognize heuristic patterns of both known and zero-day threats.", icon: <BrainCircuit className="w-6 h-6 text-indigo-400" /> },
    { title: "One-Click Recovery", desc: "Instantly restore affected data safely from immutable cold storage backups.", icon: <RotateCcw className="w-6 h-6 text-blue-400" /> },
    { title: "Deepfake Detection", desc: "Dual-mode scanning validating human and object textures against synthetic manipulations.", icon: <Frame className="w-6 h-6 text-purple-400" /> }
  ];

  const flowSteps = [
    { title: "Scan System", icon: <ScanLine className="w-5 h-5 text-white" /> },
    { title: "Detect Threat", icon: <ShieldCheck className="w-5 h-5 text-white" /> },
    { title: "Analyze Behavior", icon: <BrainCircuit className="w-5 h-5 text-white" /> },
    { title: "Block Attack", icon: <Lock className="w-5 h-5 text-white" /> },
    { title: "Recover Data", icon: <RefreshCw className="w-5 h-5 text-white" /> }
  ];

  const useCases = [
    { title: "Personal Use", desc: "Secure your personal photos, documents, and identity from digital extortion.", icon: <UserCheck className="w-6 h-6 text-yellow-500" /> },
    { title: "Business Security", desc: "Protect enterprise networks, client databases, and maintain flawless operational continuity.", icon: <Briefcase className="w-6 h-6 text-red-500" /> },
    { title: "Social Media Protection", desc: "Verify content authenticity and shield your online persona from deepfake defamation.", icon: <UserCheck className="w-6 h-6 text-blue-500" /> } // Note: re-used UserCheck lightly
  ];

  return (
    <div className="min-h-screen bg-ransomguard-dark-bg flex flex-col relative overflow-hidden">
      <ParticlesBackground />
      <Navbar />

      <main className="flex-1 pt-32 pb-20 relative z-10 px-4 max-w-6xl mx-auto w-full">
        
        {/* Header content */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight gradient-text"
          >
            Ultimate Digital Shield
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Discover over-engineered, uncompromising protection against the world's most advanced digital threats.
          </motion.p>
        </div>

        {/* 1. Stats Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_20px_-10px_#9b87f5]"
              >
                {stat.icon}
                <h3 className="text-4xl font-extrabold text-white mb-2">{stat.value}</h3>
                <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 2. Key Features */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="group p-6 bg-slate-900 border border-slate-800 hover:border-ransomguard-purple/50 rounded-2xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. How It Works (Flow) */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Defense Lifecycle</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {flowSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex flex-col items-center relative z-10"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 border border-ransomguard-purple/30 rounded-2xl flex items-center justify-center shadow-[0_0_15px_-5px_#9b87f5] mb-4">
                    {step.icon}
                  </div>
                  <p className="text-sm font-medium text-slate-300 whitespace-nowrap">{step.title}</p>
                </motion.div>
                {idx < flowSteps.length - 1 && (
                  <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-ransomguard-purple/10 via-ransomguard-purple/50 to-ransomguard-purple/10"></div>
                )}
                {idx < flowSteps.length - 1 && (
                  <div className="block md:hidden w-px h-8 bg-gradient-to-b from-ransomguard-purple/10 via-ransomguard-purple/50 to-ransomguard-purple/10 my-2"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* 4. Use Cases */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Who Is This For?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((useCase, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-800 rounded-lg">{useCase.icon}</div>
                  <h3 className="font-bold text-white">{useCase.title}</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. CTA */}
        <section className="text-center py-12 border-t border-slate-800">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to secure your digital presence?</h2>
          <Button 
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            size="lg" 
            className="bg-ransomguard-purple hover:bg-purple-600 text-white px-8 py-6 rounded-xl text-lg shadow-[0_0_20px_theme('colors.purple.500/30')] transition-all"
          >
            Start Protection <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="mt-4 text-sm text-gray-500">Click to connect with our AI Security Assistant</p>
        </section>

      </main>
      
      <Footer />

      {/* Floating Chatbot Widget */}
      <RansomGuardChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </div>
  );
};

export default LearnMore;
