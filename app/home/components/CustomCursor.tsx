
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 }; 
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const clickable = target.closest('button') || 
                        target.closest('a') || 
                        target.closest('[data-hover="true"]');
      setIsHovering(!!clickable);
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:flex items-center justify-center will-change-transform"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        className="rounded-full bg-white border border-white flex items-center justify-center"
        animate={{
          width: isHovering ? 100 : 40,
          height: isHovering ? 100 : 40,
          opacity: isHovering ? 0.3 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <AnimatePresence>
          {isHovering && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-black font-extrabold text-[10px] uppercase tracking-widest"
            >
              Smooth
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Outer ring */}
      <motion.div 
        className="absolute w-20 h-20 border border-white rounded-full opacity-20"
        animate={{
          scale: isHovering ? 1.5 : 1,
          rotate: isHovering ? 180 : 0
        }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
};

export default CustomCursor;
