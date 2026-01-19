
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FFFDF5]">
      
      {/* Blob 1: Soft Cream */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] bg-[#FFF8E1] rounded-full mix-blend-multiply filter blur-[100px] opacity-60"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Blob 2: Warm Amber */}
      <motion.div
        className="absolute top-[20%] right-[-20%] w-[80vw] h-[80vw] bg-[#FFECB3] rounded-full mix-blend-multiply filter blur-[120px] opacity-40"
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Blob 3: Gentle Yellow */}
      <motion.div
        className="absolute bottom-[-20%] left-[20%] w-[90vw] h-[90vw] bg-[#FFF9C4] rounded-full mix-blend-multiply filter blur-[110px] opacity-50"
        animate={{
          x: [0, 120, -120, 0],
          y: [0, -80, 80, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Static Paper Grain Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-10 pointer-events-none"></div>
      
      {/* Soft Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-white/30 pointer-events-none" />
    </div>
  );
};

export default FluidBackground;
