"use client"

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { ContactModal } from "./components/ContactModal";

const App: React.FC = () => {
  // --- State Management ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePurpose, setActivePurpose] = useState<string>('I want a novel AI/ML solution');

  // --- Refs for Animation ---
  const trailRef = useRef<HTMLDivElement>(null);

  // --- Framer Motion (Optional: Keeping your original logic if needed) ---
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // --- Modal Functions ---
  const openForm = (purpose?: string) => {
    if (purpose) setActivePurpose(purpose);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // --- Effect: Cursor Trail Animation ---
  useEffect(() => {
    const trail = trailRef.current;
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (trail) trail.style.opacity = "1";
    };

    const animateCursor = () => {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;

      if (trail) {
        trail.style.transform = `translate(${trailX - 10}px, ${trailY - 10}px)`;
      }
      animationFrameId = requestAnimationFrame(animateCursor);
    };

    document.addEventListener('mousemove', onMouseMove);
    animationFrameId = requestAnimationFrame(animateCursor);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- Effect: Intersection Observer (Scroll Animations) ---
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = "1";
          target.style.transform = "translateY(0)";
        }
      });
    }, { threshold: 0.1 });

    // Target specific elements to animate
    const elements = document.querySelectorAll('.animate-on-scroll, section h2, .glass-dark');

    elements.forEach(el => {
      const target = el as HTMLElement;
      // Set initial styles for animation
      target.style.opacity = "0";
      target.style.transform = "translateY(20px)";
      target.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, []);


  return (
    <div>
      {/* Custom Cursor Element */}
      <div ref={trailRef} id="trail" className="cursor-trail fixed top-0 left-0 w-5 h-5 bg-[#F4D35E] rounded-full pointer-events-none z-[9999] opacity-0 mix-blend-difference"></div>

      {/* Modal Form */}
      <ContactModal isOpen={isModalOpen} onClose={closeModal} initialPurpose={activePurpose} />

      {/* */}
      <Navbar onOpenForm={openForm} />

      {/* */}
      <section className="min-h-screen flex flex-col justify-between items-center text-center px-4 md:px-6 pt-32 pb-12 relative bg-[#FFFDF5] overflow-hidden">
        <div className="keynote-bg absolute inset-0 pointer-events-none">
          {/* Note: Ensure you have CSS for .glow-circle or replace with inline styles/Tailwind */}
          <div className="glow-circle glow-1"></div>
          <div className="glow-circle glow-2"></div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center w-full z-10">
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-6 text-black leading-tight animate-hero-pop">
            Artificial Intelligence <br /><span className="text-[#F4D35E]">made smooth.</span>
          </h1>
          <p className="max-w-2xl text-base md:text-xl text-gray-500 mb-10 leading-relaxed animate-hero-pop delay-1">
            From custom AI systems to generative engine optimization and real-time LLM monitoring, we help brands win in the AI-first web.
          </p>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto px-4 animate-hero-pop delay-2">
            <button onClick={() => openForm('I want to get a free GEO brand audit done')}
              className="bg-black text-white px-8 md:px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg w-full md:w-auto">
              Start with an Audit
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col items-center mt-12 z-10 animate-hero-pop delay-2">
          <div className="scroll-indicator mb-8 cursor-pointer" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M7 13l5 5 5-5M7 6l5 5 5-5" /></svg>
          </div>
        </div>
      </section>

      {/* */}
      <section id="services" className="py-24 md:py-32 px-4 md:px-6 bg-[#1A1A1A] text-white rounded-t-[3rem] md:rounded-[4rem]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div className="md:w-1/2">
            <span className="mono text-[#F4D35E] font-bold uppercase tracking-widest text-sm">Build Vertical</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-8 text-white">Custom AI Engineering.</h2>
            <p className="text-base md:text-lg text-gray-400 mb-8 leading-relaxed">End-to-end AI and ML development, from model design to deployment, delivering secure, scalable, and business-aligned intelligence.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button onClick={() => openForm('I want a novel AI/ML solution')} className="bg-[#F4D35E] text-black px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                Get in Touch
              </button>
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="glass-dark p-2 rounded-2xl rotate-1 hover:rotate-0 transition-all duration-500 bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="bg-black rounded-xl p-8 mono text-green-400 text-sm h-80 overflow-hidden border border-white/5 font-mono">
                <p className="opacity-50">// Use market ready solutions</p>
                <p className="text-white mt-4">&gt; Loading the experts [=====] 70%</p>
                <p className="mt-4 text-[#E13B35]">&gt; Critical Failure!!</p>
                <p className="mt-4 opacity-50">// TODO: just get buttr.io to do it</p>
                <p className="text-white mt-4">&gt; Loading the experts [==========] 100%</p>
                <p className="mt-4 text-[#F4D35E]">&gt; Custom AI deployed!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* */}
      <section id="geo-strategy" className="py-24 md:py-32 px-4 md:px-6 bg-[#FFFDF5] text-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="mono text-xs font-bold bg-[#F4D35E]/20 text-[#D4AF37] px-3 py-1 rounded">Strategy Vertical</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-6 leading-tight">GEO Strategy: Audit & Dominate</h2>
          </div>

          {/* */}
          <div className="flex flex-col md:flex-row gap-8 items-stretch mb-20">
            <div className="md:w-1/2 flex flex-col justify-between space-y-6">
              <h3 className="text-2xl font-bold">Why GEO Matters</h3>
              <div className="flex-grow grid grid-cols-1 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 animate-on-scroll"><h4 className="font-bold mb-1">Visibility Benchmarking</h4><p className="text-gray-500 text-sm">Deep-dive into how models cite you vs. your competitors. We reveal latent gaps.</p></div>
                <div className="bg-black text-white p-6 rounded-2xl shadow-xl animate-on-scroll"><h4 className="font-bold mb-1">Search Shift</h4><p className="text-gray-400 text-sm">In the age of AI-driven discovery, your customers no longer just search; they ask.</p></div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 animate-on-scroll"><h4 className="font-bold mb-1">Competitive Edge</h4><p className="text-gray-500 text-sm">Early optimization secures sustained visibility and competitive advantage as generative engines increasingly influence user decisions.</p></div>
              </div>
            </div>
            <div className="md:w-1/2 flex">
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-black/5 w-full">
                <h4 className="mono text-xs uppercase text-gray-400 mb-8 tracking-widest font-bold">Share of Model Analysis</h4>
                <div className="space-y-10">
                  <div><div className="flex justify-between text-sm mb-3 font-bold text-gray-300"><span>Competitor A</span><span>74%</span></div><div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden"><div className="bg-gray-200 h-full" style={{ width: '74%' }}></div></div></div>
                  <div><div className="flex justify-between text-sm mb-3 font-bold"><span>Your Brand</span><span className="text-[#F4D35E]">58%</span></div><div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden"><div className="bg-[#F4D35E] h-full" style={{ width: '58%' }}></div></div></div>
                  <div><div className="flex justify-between text-sm mb-3 font-bold text-gray-300"><span>Competitor B</span><span>32%</span></div><div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden"><div className="bg-gray-200 h-full" style={{ width: '32%' }}></div></div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button onClick={() => openForm('I want to get a free GEO brand audit done')}
              className="bg-black text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-[#F4D35E] hover:text-black transition-all shadow-xl">
              Schedule Strategy Session
            </button>
          </div>
        </div>
      </section>

      {/* */}
      <section id="saas" className="py-24 md:py-32 px-4 md:px-6 bg-[#1A1A1A] text-white rounded-t-[3rem] md:rounded-[4rem]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="relative order-2 md:order-1">
            <div className="glass-dark rounded-3xl p-6 md:p-8 text-white border-white/5 shadow-2xl bg-white/5 border backdrop-blur-md">
              <div className="flex items-center justify-between mb-8">
                <div className="font-bold mono text-[10px] opacity-40 uppercase tracking-widest">Monitor_V1.0</div>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-white/10"></div>
                  <div className="w-2 h-2 rounded-full bg-white/10"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1/2 bg-[#F4D35E] text-black p-4 md:p-5 rounded-2xl">
                    <div className="text-[10px] uppercase opacity-60 mb-1 font-bold">Sentiment</div>
                    <div className="text-xl md:text-2xl font-bold">Positive</div>
                    <div className="text-[10px] opacity-70">+8.2% surge</div>
                  </div>
                  <div className="w-1/2 glass-dark p-4 md:p-5 rounded-2xl border-white/10 bg-white/5">
                    <div className="text-[10px] uppercase opacity-60 mb-1">Position</div>
                    <div className="text-xl md:text-2xl font-bold">#1 Citation</div>
                    <div className="text-[10px] text-[#F4D35E]">GPT-4o Optimized</div>
                  </div>
                </div>
                <div className="p-4 md:p-5 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] uppercase opacity-40 mb-4 tracking-tighter">Live Scrape Feed</div>
                  <div className="flex justify-between text-xs py-2 border-b border-white/5"><span>Reddit Citations</span><span className="text-[#F4D35E]">42</span></div>
                  <div className="flex justify-between text-xs py-2 border-b border-white/5"><span>Hallucination Rate</span><span className="text-green-400">0.0%</span></div>
                  <div className="flex justify-between text-xs py-2"><span>Knowledge Sync</span><span className="text-blue-400">Stable</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="mono text-[#F4D35E] text-sm uppercase tracking-widest">SaaS Product</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 md:mb-8 leading-tight">Continuous <br />LLM Monitoring.</h2>
            <p className="text-gray-400 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">Know how you and your competitors are perceived in the mind of the engine, 24/7.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h4 className="text-[#F4D35E] font-bold mb-2">Sentiment Analytics</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Real-time detection of model bias or negative sentiment shifts.</p>
              </div>
              <div>
                <h4 className="text-[#F4D35E] font-bold mb-2">Source Tracking</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Identify exactly which websites are feeding model answers.</p>
              </div>
            </div>
            <button
              className="mt-10 md:mt-12 bg-[#F4D35E] text-black px-10 md:px-12 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-[#F4D35E]/10 w-full md:w-auto">
              Get Early Access
            </button>
          </div>
        </div>
      </section>

      {/* */}
      <footer className="py-24 px-4 bg-[#FFFDF5] text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-8">Stay smooth.</h2>
        <button onClick={() => openForm('Other query')}
          className="bg-black text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-[#F4D35E] hover:text-black transition-all">
          Book a Strategy Call
        </button>
      </footer>
    </div>
  );
};

export default App;