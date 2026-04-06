import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2, RotateCcw } from 'lucide-react';

const INITIAL_MESSAGE: Message = { 
  role: 'assistant', 
  content: "Hello! I am the Vanguard AI Engine. I protect this system. Do you have any questions about RansomGuard's protection features?" 
};

const FALLBACK_RESPONSES = [
  "RansomGuard uses advanced behavioral analysis to detect threats in real-time. I'm currently operating in heuristic mode.",
  "Your system is protected. RansomGuard provides 24/7 monitoring and 1-click recovery for all your critical data.",
  "I'm currently maintaining a secure connection. RansomGuard's 99.9% detection rate ensures your safety.",
  "RansomGuard is fully operational. We specialize in deepfake analysis and ransomware neutralization.",
  "All systems nominal. I'm here to assist with any questions about our advanced protection protocols."
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RansomGuardChatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ransomware/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg.content,
          history: messages 
        }),
      });

      if (!response.ok) throw new Error('API down');

      const data = await response.json();
      const botReply = data.reply || FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: botReply }
      ]);
    } catch (error) {
      const fallbackReply = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: fallbackReply }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 w-80 sm:w-96 bg-slate-900 border border-ransomguard-purple shadow-2xl shadow-ransomguard-purple/20 rounded-2xl flex flex-col z-50 overflow-hidden"
          style={{ height: '500px', maxHeight: '80vh' }}
        >
          {/* Header */}
          <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-ransomguard-purple flex items-center justify-center shadow-[0_0_10px_#9b87f5]">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Vanguard AI Engine</h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleClearChat}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                title="Clear Chat"
              >
                <RotateCcw size={16} />
              </button>
              <button 
                onClick={onClose} 
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            {messages.map((msg, idx) => (
              <motion.div
                initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                  msg.role === 'user' ? 'bg-blue-500/20' : 'bg-ransomguard-purple/20'
                }`}>
                  {msg.role === 'user' ? <User size={12} className="text-blue-400" /> : <Bot size={12} className="text-ransomguard-purple" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex gap-3 flex-row">
                <div className="w-6 h-6 rounded-full bg-ransomguard-purple/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={12} className="text-ransomguard-purple" />
                </div>
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-ransomguard-purple" />
                  <span className="text-xs text-slate-400">Processing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-700 bg-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about RansomGuard..."
                className="w-full bg-slate-900 border border-slate-700 text-sm text-white rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-ransomguard-purple transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center bg-ransomguard-purple text-white rounded-full hover:bg-ransomguard-deep-purple transition-colors disabled:opacity-50 disabled:hover:bg-ransomguard-purple"
              >
                <Send size={16} className="-ml-0.5" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
