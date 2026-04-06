import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Loader2, UserCheck, Box } from 'lucide-react';
import { motion } from 'framer-motion';

interface HumanScannerProps {
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | null;
  onComplete: (type: 'human' | 'object') => void;
}

const HumanScanner: React.FC<HumanScannerProps> = ({ mediaUrl, mediaType, onComplete }) => {
  const [status, setStatus] = useState<'loading_model' | 'scanning' | 'human' | 'object'>('loading_model');
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let active = true;

    const detectHuman = async () => {
      try {
        if (mediaType === 'audio') {
          // Audio inherently doesn't have visual human presence for coco-ssd
          setStatus('object');
          setTimeout(() => active && onComplete('object'), 2000);
          return;
        }

        // Wait for tfjs backend to be ready
        await tf.ready();

        setStatus('scanning');
        const model = await cocoSsd.load({ base: 'lite_mobilenet_v2' }); // fast model

        let mediaElement: HTMLImageElement | HTMLVideoElement | null = null;
        
        // Wait briefly to ensure media is mounted and loaded
        await new Promise(r => setTimeout(r, 500));

        if (mediaType === 'image' && imageRef.current) {
          mediaElement = imageRef.current;
        } else if (mediaType === 'video' && videoRef.current) {
          // ensure video has some data loaded
          mediaElement = videoRef.current;
          if (mediaElement.readyState < 2) {
             await new Promise((resolve) => {
               if(mediaElement) mediaElement.onloadeddata = resolve;
               else resolve(null);
             });
          }
        }

        if (!mediaElement) {
          setStatus('object');
          setTimeout(() => active && onComplete('object'), 2000);
          return;
        }

        const predictions = await model.detect(mediaElement);
        const hasHuman = predictions.some(p => p.class === 'person' && p.score > 0.4);

        if (hasHuman) {
          setStatus('human');
          setTimeout(() => active && onComplete('human'), 1500);
        } else {
          setStatus('object');
          setTimeout(() => active && onComplete('object'), 2500);
        }

      } catch (err) {
        console.error("Error in human detection:", err);
        // Fallback to assuming human found so we don't break the flow on error
        setStatus('human');
        setTimeout(() => active && onComplete('human'), 1500);
      }
    };

    detectHuman();

    return () => {
      active = false;
    };
  }, [mediaUrl, mediaType, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="relative">
        {mediaType === 'image' && (
          <img 
            ref={imageRef} 
            src={mediaUrl} 
            alt="Scanning target" 
            className="w-full max-w-sm h-64 object-cover rounded-2xl border-2 border-ransomguard-purple/40 shadow-[0_0_30px_theme('colors.purple.500/20')] opacity-70"
            crossOrigin="anonymous"
          />
        )}
        {mediaType === 'video' && (
          <video 
            ref={videoRef} 
            src={mediaUrl} 
            className="w-full max-w-sm h-64 object-cover rounded-2xl border-2 border-ransomguard-purple/40 shadow-[0_0_30px_theme('colors.purple.500/20')] opacity-70"
            crossOrigin="anonymous"
            muted
            playsInline
          />
        )}
        
        {/* Scanning Effect Overlay */}
        {(status === 'loading_model' || status === 'scanning') && (
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-ransomguard-purple shadow-[0_0_10px_#a855f7]"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}

        {status === 'human' && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-2 border-slate-900"
          >
            <UserCheck size={20} className="text-slate-900" />
          </motion.div>
        )}

        {status === 'object' && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="absolute -bottom-2 -right-2 bg-indigo-500 rounded-full p-2 border-2 border-slate-900"
          >
            <Box size={20} className="text-white" />
          </motion.div>
        )}
      </div>

      <div className="text-center h-12">
        {status === 'loading_model' && (
          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 className="animate-spin w-5 h-5 text-ransomguard-purple" />
            <p>Initializing Content Scanner...</p>
          </div>
        )}
        {status === 'scanning' && (
          <div className="flex items-center space-x-2 text-ransomguard-purple">
            <Loader2 className="animate-spin w-5 h-5" />
            <p className="font-medium animate-pulse">Scanning for content type...</p>
          </div>
        )}
        {status === 'human' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 font-semibold text-lg"
          >
            Human Detected - Proceeding to Deepfake Analysis
          </motion.div>
        )}
        {status === 'object' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-indigo-400 font-semibold text-lg"
          >
            Object Detected - Analyzing Authenticity
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HumanScanner;
