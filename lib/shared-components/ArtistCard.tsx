"use client"
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { AnalyticsModule } from './types/types';
import { ArrowUpRight, Zap, Target } from 'lucide-react';
import { ArtistCardModal } from './ArtistCardModal';

interface FeatureCardProps {
  artist: AnalyticsModule;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ artist }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [selectedFeature, setSelectedFeature] = useState<AnalyticsModule | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-150, 150], [8, -8]), { stiffness: 400, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-8, 8]), { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const onClick = () => {
    setSelectedFeature(artist)
  }

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <>
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative h-[650px] w-full overflow-hidden border-white/5 bg-black cursor-pointer border-r last:border-r-0 perspective-1000"
      initial="rest"
      whileHover="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
      style={{ rotateX, rotateY }}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img 
          src={artist.image} 
          alt={artist.name} 
          className="h-full w-full object-cover grayscale brightness-[0.2] transition-all duration-700"
          variants={{
            rest: { scale: 1, filter: 'grayscale(100%) brightness(20%)' },
            hover: { scale: 1.1, filter: 'grayscale(30%) brightness(40%)' }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent group-hover:via-[#f5d142]/5 transition-all duration-1000" />
      </div>

      {/* Content Header */}
      <div className="absolute inset-0 p-12 md:p-16 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
           <div className="flex flex-col gap-4">
             <span className="text-[10px] font-mono border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/5 text-white/30 tracking-[0.4em] uppercase group-hover:border-[#f5d142]/30 group-hover:text-[#f5d142] transition-colors">
               {artist.version}
             </span>
             <motion.div 
              variants={{ rest: { opacity: 0, x: -10 }, hover: { opacity: 1, x: 0 } }}
              className="flex items-center gap-2 text-[#f5d142] font-mono text-[8px] uppercase tracking-widest"
             >
                <Target className="w-3 h-3" /> Live Telemetry
             </motion.div>
           </div>
           
           <motion.div
             variants={{
               rest: { opacity: 0, scale: 0.5, rotate: -45 },
               hover: { opacity: 1, scale: 1, rotate: 0 }
             }}
             className="bg-[#f5d142] text-black rounded-full p-5 shadow-2xl shadow-[#f5d142]/20"
           >
             <ArrowUpRight className="w-6 h-6" />
           </motion.div>
        </div>

        {/* Content Footer */}
        <div className="space-y-6">
          <div className="overflow-hidden">
            <motion.h3 
              className="font-heading text-5xl font-bold uppercase text-white leading-[0.85] tracking-tighter"
              variants={{
                rest: { y: 0 },
                hover: { y: -5 }
              }}
              transition={{ duration: 0.6, ease: "circOut" }}
            >
              {artist.name.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </motion.h3>
          </div>
          
          <div className="flex items-center gap-6">
            <motion.div 
              className="h-px bg-[#f5d142]"
              variants={{ rest: { width: 0 }, hover: { width: 60 } }}
              transition={{ duration: 0.8, ease: "circOut" }}
            />
            <motion.p 
              className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#f5d142]"
              variants={{
                rest: { opacity: 0.4 },
                hover: { opacity: 1, x: 8 }
              }}
            >
              {artist.category}
            </motion.p>
          </div>
          
          <motion.p
            className="text-sm text-white/30 font-light leading-relaxed max-w-[90%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            variants={{ rest: { y: 20 }, hover: { y: 0 } }}
          >
            {artist.description.substring(0, 100)}...
          </motion.p>
        </div>
      </div>

      {/* Scan Indicator Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#f5d142]/0 group-hover:bg-[#f5d142]/20 hidden group-hover:block">
        <motion.div 
          className="h-full bg-[#f5d142] w-1/4 shadow-[0_0_15px_#f5d142]"
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>

      {/* Modal / Detail View */}
      <ArtistCardModal selectedFeature={selectedFeature} setSelectedFeature={setSelectedFeature}/>
    </>
  );
};

export default FeatureCard;