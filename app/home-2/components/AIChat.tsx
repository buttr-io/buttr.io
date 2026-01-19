
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../../../lib/services/geminiService';
import { ChatMessage } from '../types/types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hey there. I can show you how LLMs perceive your brand. Want to learn about your OMPS Score? 🧈' }
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

    setTimeout(scrollToBottom, 50);

    const responseText = await sendMessageToGemini(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, originY: 1, originX: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[90vw] md:w-96 bg-white border border-black/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-[#2D2A26] p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full animate-pulse" />
                <div>
                  <h3 className="font-bold text-white text-sm tracking-tight leading-none">Buttr Intel Bot</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Live Intelligence</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="h-[400px] overflow-y-auto p-6 space-y-4 bg-[#FFFDF5]"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#2D2A26] text-white rounded-tr-none'
                        : 'bg-white text-gray-700 rounded-tl-none border border-black/5 shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none flex gap-1 border border-black/5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-5 bg-white border-t border-black/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Audit your brand visibility..."
                  className="flex-1 bg-gray-50 px-5 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#F59E0B] p-3 rounded-2xl hover:bg-amber-500 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 text-white shadow-lg shadow-amber-200"
                >
                  <Send className="w-5 h-5" />
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
        className="w-16 h-16 rounded-full bg-[#2D2A26] flex items-center justify-center shadow-2xl border border-white/10 z-50 group relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-7 h-7 text-[#F59E0B]" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    </div>
  );
};

export default AIChat;
