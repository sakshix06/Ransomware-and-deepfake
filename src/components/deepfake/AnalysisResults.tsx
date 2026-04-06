import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileVideo, FileImage, FileAudio, Download, BrainCircuit, Activity, Eye, EyeOff, Columns } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeepfakeAiModal } from './DeepfakeAiModal';

export interface AnalysisResultData {
  isDeepfake: boolean;
  confidenceScore: number;
  mediaType: 'image' | 'video' | 'audio';
  contentType: 'human' | 'object';
  markers: {
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  protectionRecommendations: string[];
  confidenceBreakdown?: { factor: string; score: number }[];
  fakePatternTags?: string[];
  aiExplanation?: string;
  metadata?: any;
}

interface AnalysisResultsProps {
  result: AnalysisResultData;
  mediaUrl: string;
  onGenerateReport: () => void;
}

// Numerical animation component
const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    
    // Fast animation over 400ms
    const duration = 400; 
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
};

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, mediaUrl, onGenerateReport }) => {
  const [showAiModal, setShowAiModal] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showCompareView, setShowCompareView] = useState(false);

  const getMediaIcon = () => {
    switch (result.mediaType) {
      case 'image': return <FileImage className="w-8 h-8" />;
      case 'video': return <FileVideo className="w-8 h-8" />;
      case 'audio': return <FileAudio className="w-8 h-8" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-yellow-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (score: number) => {
    if (score > 75) return 'text-red-500';
    if (score > 40) return 'text-orange-500';
    return 'text-green-500';
  };

  // Card Animation variants depending on result
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, staggerChildren: 0.1 } 
    },
    // Gentle floating for authentic
    float: {
      y: [0, -6, 0],
      transition: { duration: 3, repeat: Infinity }
    },
    // Heavy subtle shake for fake
    shake: {
      y: [0, 4, -2, 4, 0],
      x: [0, -2, 2, -2, 0],
      transition: { duration: 0.4, repeat: 1 }
    }
  };

  const renderMediaContent = () => (
    <>
      {result.mediaType === 'image' && (
        <img src={mediaUrl} alt="Analyzed media" className="w-full h-full object-contain rounded-md z-10 relative" />
      )}
      {result.mediaType === 'video' && (
        <video src={mediaUrl} controls className="w-full h-full object-contain rounded-md z-10 relative" />
      )}
      {result.mediaType === 'audio' && (
        <audio src={mediaUrl} controls className="w-full h-full z-10 relative" />
      )}
    </>
  );

  const renderHeatmapContent = () => (
    <AnimatePresence>
      {(result.mediaType === 'image' || result.mediaType === 'video') && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-20 mix-blend-multiply pointer-events-none rounded-md overflow-hidden"
          style={{
            background: result.isDeepfake 
              ? 'radial-gradient(circle at 50% 40%, rgba(239, 68, 68, 0.6) 0%, rgba(239, 68, 68, 0) 60%)'
              : 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0) 70%)'
          }}
        >
          {result.isDeepfake && (
            <div className="absolute top-[35%] left-[45%] w-16 h-16 border-2 border-red-500 border-dashed rounded-full animate-[spin_4s_linear_infinite]" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Timeline UI (placeholder for frame-level analysis)
  const renderTimeline = () => {
    if (result.mediaType !== 'video') return null;
    
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-slate-300">
          <Activity size={14} /> Frame-Level Anomalies
        </h4>
        <div className="h-6 bg-slate-800 rounded-md relative flex items-center overflow-visible border border-slate-700">
          {/* Mock timeline ticks with tooltip */}
          {[15, 45, 78].map((percent, idx) => (
            <div 
              key={idx}
              className="absolute top-0 bottom-0 w-1 bg-red-500 group cursor-pointer"
              style={{ left: `${percent}%` }}
            >
              {/* Simple CSS Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-xs px-2 py-1 rounded whitespace-nowrap border border-slate-600 z-30 shadow-lg">
                <p className="font-semibold text-red-400">Anomaly {idx + 1}</p>
                <p className="text-slate-300">Lip-sync failure detected</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-600"></div>
              </div>
            </div>
          ))}
          <div className="absolute left-0 top-0 bottom-0 bg-white/10" style={{ width: '40%' }}></div> {/* Playhead mock */}
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.div 
        className="grid gap-6 md:grid-cols-2"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={cardVariants}
          animate={result.isDeepfake ? "shake" : "float"}
          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          className="h-full"
        >
          <Card className={`h-full bg-slate-900 border transition-all duration-300 ${result.isDeepfake ? 'border-red-900/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-green-900/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]'}`}>
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {getMediaIcon()}
                  Analysis Results
                  {result.contentType === 'human' && (
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-sm rounded-full border border-indigo-500/20 font-medium ml-2">
                      Human Content
                    </span>
                  )}
                  {result.contentType === 'object' && (
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm rounded-full border border-cyan-500/20 font-medium ml-2">
                      Object Content
                    </span>
                  )}
                </div>
                {/* Smart UI Badge */}
                {result.isDeepfake ? (
                  <span className={`px-3 py-1 text-sm rounded-full border font-medium animate-pulse ${result.contentType === 'human' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                    Warning: {result.contentType === 'human' ? 'Manipulated AI' : 'Altered Content'}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 text-sm rounded-full border border-green-500/20 font-medium drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                    Authentic {result.contentType === 'human' ? 'Media' : 'Image'}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 font-medium">Confidence Score</span>
                  <span className={`text-2xl font-bold ${getStatusColor(result.confidenceScore)} drop-shadow-md`}>
                    <AnimatedNumber value={result.confidenceScore} />%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidenceScore}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`absolute top-0 left-0 bottom-0 blur-[2px] opacity-70 ${result.isDeepfake ? 'bg-red-500' : 'bg-green-500'}`}
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidenceScore}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`h-full relative z-10 ${result.isDeepfake ? 'bg-red-500' : 'bg-green-500'}`}
                  />
                </div>
                
                {/* Confidence Breakdown */}
                {result.confidenceBreakdown && result.confidenceBreakdown.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {result.confidenceBreakdown.map((breakdown, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{breakdown.factor}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${result.isDeepfake ? 'bg-red-500/50' : 'bg-green-500/50'}`}
                              style={{ width: `${breakdown.score}%` }}
                            />
                          </div>
                          <span className="text-slate-300 w-6 text-right">{breakdown.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Device Information */}
                <div className="mt-6 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 flex flex-col gap-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Device Metadata Pipeline</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-300">Capture Device</span>
                    <span className="text-indigo-400 font-mono text-sm px-2 py-1 bg-indigo-500/10 rounded border border-indigo-500/20">
                      {result.metadata?.deviceModel || "Unknown Content Source"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 flex flex-col gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-200">Analysis Verdict:</h4>
                    <p className="mt-1 text-slate-400">
                      {result.isDeepfake 
                        ? result.contentType === 'human' 
                          ? "This content exhibits spatial and temporal anomalies highly indicative of AI generation or deepfake manipulation."
                          : "This content exhibits structural irregularities and artifacts indicating it has been digitally altered or synthesized."
                        : "This content aligns with expected natural physics and digital signatures, appearing authentic."}
                    </p>
                    {result.fakePatternTags && result.fakePatternTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {result.fakePatternTags.map((tag, idx) => (
                          <span key={idx} className={`text-[10px] px-2 py-0.5 rounded border ${result.isDeepfake ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* AI Explain Button */}
                  <Button 
                    variant="outline"
                    onClick={() => setShowAiModal(true)}
                    className="w-full mt-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <BrainCircuit size={16} />
                    Explain AI Reasoning
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-widest text-slate-500 font-semibold mb-3">Detection Markers</h3>
                <div className="space-y-2.5">
                  {result.markers.map((marker, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      key={i} 
                      className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg group hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-200">{marker.name}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${getSeverityColor(marker.severity)}`}>
                          {marker.severity}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{marker.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={onGenerateReport}
                className="w-full flex items-center gap-2 bg-ransomguard-purple hover:bg-ransomguard-deep-purple transition-colors"
              >
                <Download size={18} />
                Generate Detailed Report
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          animate={result.isDeepfake ? "shake" : "float"}
          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          className="h-full"
        >
          <Card className="h-full bg-slate-900 border-slate-800 flex flex-col">
            <CardHeader className="pb-3 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle>Media Preview</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                {(result.mediaType === 'image' || result.mediaType === 'video') && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setShowCompareView(!showCompareView);
                        if (!showCompareView) setShowHeatmap(false);
                      }}
                      className={`text-xs ${showCompareView ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}`}
                    >
                      <Columns size={14} className="mr-1.5" />
                      {showCompareView ? 'Exit Compare' : 'Compare View'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setShowHeatmap(!showHeatmap);
                        if (!showHeatmap) setShowCompareView(false);
                      }}
                      className={`text-xs ${showHeatmap ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}`}
                    >
                      {showHeatmap ? <><EyeOff size={14} className="mr-1.5"/> Hide Analysis</> : <><Eye size={14} className="mr-1.5"/> Show AI Analysis</>}
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col">
              <div className="aspect-video bg-black/40 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800/80 shadow-inner relative">
                {showCompareView ? (
                  <div className="grid grid-cols-2 w-full h-full divide-x divide-slate-700/50">
                    <div className="relative w-full h-full flex items-center justify-center bg-black/60 p-1">
                       {renderMediaContent()}
                       <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">Original</span>
                    </div>
                    <div className="relative w-full h-full flex items-center justify-center bg-black/60 p-1">
                       {renderMediaContent()}
                       {renderHeatmapContent()}
                       <span className="absolute bottom-2 left-2 bg-indigo-500/80 text-white text-[10px] px-2 py-1 rounded">Analysis Overlay</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-1">
                    {renderMediaContent()}
                    {showHeatmap && renderHeatmapContent()}
                  </div>
                )}
              </div>
              
              {renderTimeline()}

              <div className="mt-6 flex-1">
                <h3 className="text-sm uppercase tracking-widest text-slate-500 font-semibold mb-3">Protection Recommendations</h3>
                <ul className="space-y-3">
                  {result.protectionRecommendations.map((recommendation, i) => (
                    <motion.li 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      key={i} 
                      className="flex items-start gap-3 text-slate-300 text-sm"
                    >
                      <span className="w-5 h-5 mt-0.5 rounded-full bg-ransomguard-purple/20 flex items-center justify-center flex-shrink-0">
                        <span className="w-2 h-2 rounded-full bg-ransomguard-purple"></span>
                      </span>
                      <span className="flex-1 leading-relaxed">{recommendation}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <DeepfakeAiModal 
        isOpen={showAiModal} 
        onClose={() => setShowAiModal(false)}
        result={result}
      />
    </>
  );
};

export default AnalysisResults;
