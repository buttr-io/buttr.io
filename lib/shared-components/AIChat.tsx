"use client"
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareCode, X, Send, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from './types/types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to Buttr.io. I am your Market Intelligence Analyst. How can I help you decode your brand perception? 🧈' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(scrollToBottom, 100);

    const responseText = await sendMessageToGemini(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-6 w-[90vw] md:w-[400px] bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-[#f5d142]/5"
          >
            {/* Header */}
            <div className="bg-[#050505] p-5 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <BarChart className="w-5 h-5 text-[#f5d142]" />
                <h3 className="font-heading font-bold text-white text-[10px] tracking-[0.2em] uppercase">Buttr Analyst</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={chatContainerRef} className="h-80 md:h-[450px] overflow-y-auto p-6 space-y-5 scroll-smooth custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#f5d142] text-black font-medium rounded-tr-none shadow-lg shadow-[#f5d142]/10'
                        : 'bg-white/5 text-[#fffbeb]/80 rounded-tl-none border border-white/5'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-xl flex gap-1.5 border border-white/5">
                    <span className="w-1.5 h-1.5 bg-[#f5d142]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#f5d142]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#f5d142]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-[#050505]">
              <div className="flex gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  placeholder="Ask about your brand perception..."
                  className="flex-1 bg-transparent text-white placeholder-white/20 text-xs px-2 focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#f5d142] p-2.5 rounded-lg hover:bg-white transition-all disabled:opacity-30"
                  data-hover="true"
                >
                  <Send className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#f5d142] flex items-center justify-center shadow-2xl shadow-[#f5d142]/20 border border-white/20 z-50 group"
        data-hover="true"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <div className="relative">
            <MessageSquareCode className="w-6 h-6 text-black group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full border-2 border-[#f5d142] animate-pulse" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;