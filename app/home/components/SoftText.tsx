
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

interface SoftTextProps {
  text: string;
  className?: string;
}

const SoftText: React.FC<SoftTextProps> = ({ text, className = '' }) => {
  return (
    <span className={`relative inline-block font-black tracking-tighter italic ${className}`}>
      {/* Main Soft Gradient Text */}
      <motion.span
        className="absolute inset-0 z-10 block bg-gradient-to-r from-[#B47000] via-[#F59E0B] to-[#B47000] bg-[length:200%_auto] bg-clip-text text-transparent"
        animate={{
          backgroundPosition: ['0% center', '200% center'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-hidden="true"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </motion.span>
      
      <span 
        className="block text-transparent bg-clip-text bg-[#F59E0B] opacity-20"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent' 
        }}
      >
        {text}
      </span>
      
      {/* Subtle Glow */}
      <span
        className="absolute inset-0 -z-10 block bg-[#F59E0B] bg-clip-text text-transparent blur-2xl opacity-10"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </span>
    </span>
  );
};

export default SoftText;
