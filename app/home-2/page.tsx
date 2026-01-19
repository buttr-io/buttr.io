"use client"

import { motion, useScroll, useTransform } from "framer-motion";
import CustomCursor from "./components/CustomCursor";
import FluidBackground from "./components/FluidBackground";
import AIChat from "./components/AIChat";
import { ArrowRight, BarChart3, BrainCircuit, ExternalLink, LineChart, Mail, Search, Sparkles } from "lucide-react";
import SoftText from "./components/SoftText";
import WaitlistForm from "./components/WaitlistForm";
import { useState } from "react";

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToWaitlist = () => {
    const el = document.getElementById('hero-waitlist');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Highlight effect for the input
    setTimeout(() => {
      const input = el?.querySelector('input');
      input?.focus();
    }, 800);
  };

  return (
    <div className="relative min-h-screen text-[#2D2A26] selection:bg-[#F59E0B] selection:text-white overflow-x-hidden bg-[#FFFDF5]">
      <CustomCursor />
      <FluidBackground />
      <WaitlistForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* <AIChat /> */}
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-8 bg-[#FFFDF5]/80 backdrop-blur-md border-b border-black/[0.02]">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <motion.div 
            whileHover={{ rotate: 90 }}
            className="w-10 h-10 bg-[#F59E0B] rounded-2xl flex items-center justify-center transform transition-all duration-500 shadow-lg shadow-amber-200"
          >
             <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </motion.div>
          <span className="text-2xl font-bold tracking-tight">buttr<span className="text-[#F59E0B]">.io</span></span>
        </div>
        
        <div className="hidden md:flex gap-10 text-xs font-extrabold uppercase tracking-widest text-gray-400">
          <a href="#problem" className="hover:text-black transition-colors">The Shift</a>
          <a href="#features" className="hover:text-black transition-colors">Intelligence</a>
          <a href="#how-it-works" className="hover:text-black transition-colors">Workflow</a>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2D2A26] text-white border border-black/5 px-8 py-3 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
        >
          Get Early Access
        </button>
      </nav>

      {/* HERO SECTION */}
      <header className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 pt-20">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-5xl w-full text-center z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white rounded-full mb-10 shadow-sm border border-black/5"
          >
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500">Smooth Market Intelligence for the LLM Era</span>
          </motion.div>

          <h1 className="text-6xl md:text-[8rem] font-serif leading-[0.85] mb-10 italic">
            Your brand, <br />
            <SoftText text="Decoded by AI." />
          </h1>

          <p className="text-lg md:text-2xl text-gray-500 max-w-3xl mx-auto mb-14 font-light leading-relaxed">
            Understand how Large Language Models like ChatGPT, Gemini, and Claude perceive, rank, and describe your brand. 
            Track visibility, sentiment, and share of AI mind.
          </p>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2D2A26] text-white px-12 py-6 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-2xl hover:shadow-amber-200/50 mx-auto group"
          >
            Join the Waitlist <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
             <div className="flex flex-col items-center gap-2">
                <span className="text-black">GPT-5</span>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
             </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-black">Claude 3.5</span>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s'}} />
             </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-black">Gemini 3.0</span>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s'}} />
             </div>
          </div>
        </motion.div>
      </header>

      {/* PROBLEM SECTION */}
      <section id="problem" className="py-32 px-6 md:px-12 bg-[#2D2A26] text-white rounded-[4rem] mx-4 md:mx-8 mb-32 overflow-hidden relative scroll-mt-24">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F59E0B] rounded-full blur-[150px] opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[#F59E0B] font-bold tracking-widest uppercase text-xs mb-6 block">The Market Shift</span>
            <h2 className="text-5xl md:text-7xl font-serif leading-tight italic mb-8">
              Discovery isn't search. <br />
              <span className="text-white/40">It's a conversation.</span>
            </h2>
            <p className="text-xl text-white/60 leading-relaxed font-light mb-10">
              Customers no longer just search; they ask. Buttr.io tracks how your brand appears in AI-generated answers. 
              Think of it as your marketing team’s visibility radar.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="text-5xl font-serif text-[#F59E0B] mb-2">73%</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Consumers discovering <br />brands via LLMs</div>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="text-5xl font-serif text-[#F59E0B] mb-2">Instant</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Latency in market <br />data extraction</div>
              </div>
            </div>
          </div>
          <div className="relative">
             <motion.div 
               initial={{ rotate: -5, y: 50, opacity: 0 }}
               whileInView={{ rotate: 0, y: 0, opacity: 1 }}
               className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl"
             >
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center">
                       <BarChart3 className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">LLM Visibility</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/30">Real-time Mindshare</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full border border-green-500/30">Live Data</div>
                </div>
                
                <div className="space-y-6">
                  {[
                    { label: "GPT Share of Voice", value: 84, color: "#F59E0B" },
                    { label: "Claude Sentiment", value: 92, color: "#FBBF24" },
                    { label: "Gemini Mention Rate", value: 67, color: "#D97706" }
                  ].map((metric, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                        <span className="text-white/60">{metric.label}</span>
                        <span className="text-white">{metric.value}%</span>
                      </div>
                      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${metric.value}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className="h-full rounded-full" 
                          style={{ backgroundColor: metric.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                   <div className="text-center">
                      <div className="text-2xl font-serif text-[#F59E0B]">4.8/5</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Trust Index</div>
                   </div>
                   <div className="text-center">
                      <div className="text-2xl font-serif text-[#F59E0B]">+12%</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/30 font-bold">MoM Growth</div>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-32 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center mb-24">
          <span className="text-amber-600 font-extrabold tracking-widest uppercase text-xs mb-6 block">Intelligence Suite</span>
          <h2 className="text-5xl md:text-7xl font-serif italic mb-6">Measurable AI Visibility.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">Buttr.io gives you real-time insights into your brand’s standing in the world of AI-generated answers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: BrainCircuit, 
              title: 'OMPS Score', 
              desc: 'Our proprietary machine-learned KPI for overall brand perception health across all major LLMs.',
              accent: 'bg-amber-100 text-amber-600'
            },
            { 
              icon: Search, 
              title: 'Prompt Auditing', 
              desc: 'Test and version-control prompts to see how slight phrasing shifts change your brand profile.',
              accent: 'bg-orange-100 text-orange-600'
            },
            { 
              icon: LineChart, 
              title: 'Competitor Benchmarking', 
              desc: 'See who is leading your category in the AI search ecosystem with direct side-by-side metrics.',
              accent: 'bg-yellow-100 text-yellow-600'
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -12 }}
              className="group p-12 bg-white rounded-[3rem] border border-black/[0.03] shadow-sm hover:shadow-2xl hover:border-amber-100 transition-all duration-500"
            >
              <div className={`w-16 h-16 ${feature.accent} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed font-light">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-32 px-6 md:px-12 bg-white/50 border-y border-black/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
             <h2 className="text-4xl md:text-5xl font-serif italic mb-4">The Churning Process</h2>
             <p className="text-gray-400">From raw LLM responses to structured market intelligence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { step: "01", title: "Simulation", desc: "We query 10+ LLMs with thousands of brand-specific prompts." },
              { step: "02", title: "Parsing", desc: "Outputs are structured and sentiment-analyzed by our agents." },
              { step: "03", title: "Scoring", desc: "Data is normalized into your custom OMPS brand health score." },
              { step: "04", title: "Action", desc: "Visual dashboards deliver actionable campaign attribution." }
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="text-[8rem] font-serif absolute -top-16 -left-4 text-black/[0.02] pointer-events-none select-none group-hover:text-amber-500/5 transition-colors">
                  {step.step}
                </div>
                <div className="relative pt-8">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <span className="w-6 h-px bg-[#F59E0B]" />
                    {step.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION - NEW FOOTER WAITLIST */}
      <section className="py-48 px-6 md:px-12 text-center bg-[#FFFDF5] relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-amber-100/30 to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mb-10 inline-block p-4 bg-white rounded-3xl shadow-xl border border-black/5"
          >
             <Sparkles className="w-8 h-8 text-[#F59E0B]" />
          </motion.div>
          <h2 className="text-5xl md:text-[6rem] font-serif italic mb-10 leading-[0.9]">
            Ready to decode <br />your visibility?
          </h2>
          <p className="text-xl text-gray-500 mb-16 max-w-xl mx-auto leading-relaxed font-light">
            Join the elite marketing teams already tracking their brand health in the age of AI search.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2D2A26] text-white px-10 py-5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl hover:shadow-amber-200/50 mx-auto"
          >
            Claim Audit Spot <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 md:px-12 bg-white border-t border-black/[0.03]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#F59E0B] rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                  <div className="w-3 h-3 bg-white rounded-sm rotate-45" />
                </div>
                <span className="font-bold text-xl tracking-tighter">buttr.io</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs text-center md:text-left">
                The world's first market intelligence platform built specifically for the age of conversational search.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-10 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-400">
              <a href="mailto:contact@buttr.io" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                <Mail className="w-3 h-3" /> Contact Us
              </a>
              <a href="#" className="hover:text-amber-500 transition-colors">Twitter</a>
              <a href="#" className="hover:text-amber-500 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-amber-500 transition-colors flex items-center gap-1">
                API Docs <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-black/[0.03] pt-10 gap-6">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              © 2025 Buttr Platforms Inc. 🧈
            </p>
            <div className="flex gap-8 text-[9px] font-bold text-gray-300 uppercase tracking-widest">
              <a href="#" className="hover:text-black">Privacy Policy</a>
              <a href="#" className="hover:text-black">Terms of Service</a>
              <a href="#" className="hover:text-black">Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;