"use client"

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView, useSpring, useMotionValue } from 'framer-motion';
import { BarChart3, Activity, Play, BrainCircuit, Globe, TrendingUp, Layers} from 'lucide-react';
import FluidBackground from '../lib/shared-components/FluidBackground';
import ButterText from '../lib/shared-components/GlitchText';
import CustomCursor from '../lib/shared-components/CustomCursor';
import FeatureCard from '../lib/shared-components/ArtistCard';
import AIChat from '../lib/shared-components/AIChat';
import { AnalyticsModule } from '../lib/shared-components/types/types';
import { useRouter } from 'next/navigation';

const FEATURES: AnalyticsModule[] = [
    { 
        id: 'omps', 
        name: 'OMPS Score', 
        category: 'KPI', 
        version: 'Deep ML', 
        image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        description: 'Our proprietary Overall Market Perception Score. A single, easy-to-read KPI for brand perception health across all major LLMs.'
    },
    { 
        id: 'visibility', 
        name: 'Visibility Analytics', 
        category: 'Share of Voice', 
        version: 'Realtime', 
        image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        description: 'Tracks where your brand appears in LLM results. Understand your share of voice versus competitors in conversational search.'
    },
    { 
        id: 'sentiment', 
        name: 'Sentiment Intelligence', 
        category: 'Emotional Data', 
        version: 'Neural v4', 
        image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        description: 'AI-driven tone and emotional scoring of LLM responses. Identify early shifts in brand reputation before they hit social media.'
    },
    { 
        id: 'competitor', 
        name: 'Competitor Insights', 
        category: 'Benchmarking', 
        version: 'Cross-Model', 
        image: 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        description: 'Benchmark against category leaders. See who is winning the "recommendation war" in GPT and Claude sessions.'
    },
    { 
        id: 'prompt', 
        name: 'Prompt Library', 
        category: 'Auditing', 
        version: 'Enterprise', 
        image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        description: 'Structured, version-controlled prompts. Audit and refine how LLMs represent your brand through systematic testing.'
    },
    { 
        id: 'impact', 
        name: 'Campaign Tracking', 
        category: 'Attribution', 
        version: 'Pro', 
        image: 'https://images.pexels.com/photos/7681092/pexels-photo-7681092.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        description: 'Link visibility changes directly to marketing efforts. Measure the true impact of campaigns in the age of AI search.'
    },
];

export const AppContent = () => {


    // 
    // Required on the client component specifically because of gh-pages only rendering the HTML, CSS and JS pages
    //     
    // START: coming-soon page redirection
    const router = useRouter()
    useEffect(() => {
        router.replace('/coming-soon')
    }, [router])
    // END: coming-soon page redirection

    
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Hero Mouse Tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [0, 1000], [10, -10]), { stiffness: 60, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [0, 1000], [-10, 10]), { stiffness: 60, damping: 20 });

    // Scroll Orchestration
    const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.75]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
    const heroBlur = useTransform(scrollYProgress, [0, 0.18], ["blur(0px)", "blur(30px)"]);
    const dashOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
    const dashY = useTransform(scrollYProgress, [0.1, 0.4], [150, 0]);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<AnalyticsModule | null>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

    const scrollToSection = (id: string) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
        window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        }
    };

    return <div 
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="relative min-h-screen text-[#fffbeb] selection:bg-[#f5d142] selection:text-black cursor-auto md:cursor-none overflow-x-hidden bg-[#050505]"
                >
            <CustomCursor />
            <FluidBackground />
            <AIChat />
            
            {/* Cinematic Load Shimmer Overlay */}
            <motion.div 
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1], delay: 0.5 }}
            className="fixed inset-0 bg-[#f5d142] z-[120] pointer-events-none"
            />
            
            <motion.div 
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 1.8, ease: "circInOut" }}
            className="fixed top-0 left-0 w-full h-1 bg-[#f5d142] z-[130] origin-left shadow-[0_0_50px_#f5d142]"
            />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-8 mix-blend-difference">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="font-heading text-2xl font-bold tracking-tighter text-[#f5d142] flex items-center gap-2"
            >
                <div className="w-8 h-8 bg-[#f5d142] rounded-sm flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-black" />
                </div>
                BUTTR.IO
            </motion.div>
            
            <div className="hidden md:flex gap-12 text-xs font-bold tracking-widest uppercase text-white/50">
                {['Home', 'Analysis', 'Strategic Tooling'].map((item, i) => (
                <motion.button 
                    key={item}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + i * 0.1 }}
                    onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                    className="hover:text-[#f5d142] transition-colors bg-transparent border-none cursor-pointer"
                    data-hover="true"
                >
                    {item}
                </motion.button>
                ))}
            </div>
            
            <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 }}
                className="hidden md:inline-block bg-white text-black px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#f5d142] transition-all rounded-sm border-none cursor-pointer shadow-xl shadow-white/5"
                data-hover="true"
            >
                Request Demo
            </motion.button>
            </nav>

            {/* Cinematic Hero Section */}
            <header className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden perspective-1000">
            <motion.div 
                style={{ rotateX, rotateY, scale: heroScale, opacity: heroOpacity, filter: heroBlur }} 
                className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-20"
            >
                {/* Hero Content Left */}
                <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 1.2 } }
                }}
                className="text-left"
                >
                <motion.div
                    variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
                    className="mb-8 inline-flex items-center gap-4 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[#f5d142] text-[10px] font-mono tracking-[0.4em] uppercase"
                >
                    <div className="w-2 h-2 rounded-full bg-[#f5d142] animate-pulse" />
                    Latent Space Telemetry v2.5
                </motion.div>
                
                <motion.h1 
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                    className="text-[8vw] lg:text-[6.5vw] font-black leading-[0.82] tracking-tighter mb-8 uppercase font-heading text-white"
                >
                    Your Brand, <br/>
                    <ButterText text="Decoded" className="text-[#f5d142] italic" />
                </motion.h1>
                
                <motion.p 
                    variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                    className="text-xl md:text-2xl text-white/40 max-w-xl font-light leading-relaxed mb-12"
                >
                    Decode how LLMs like GPT-4o Gemini and Claude perceive your reputation. <span className="text-white">AISO intelligence for the next web.</span>
                </motion.p>

                <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                    className="flex flex-col md:flex-row gap-6 pointer-events-auto"
                >
                    <button className="bg-[#f5d142] text-black px-12 py-5 rounded-sm font-bold uppercase tracking-widest text-sm hover:scale-110 transition-transform active:scale-95" data-hover="true">
                    Join Early Access
                    </button>
                    <button className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors" data-hover="true">
                    Watch Engine <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"><Play className="w-3 h-3 fill-current" /></div>
                    </button>
                </motion.div>
                </motion.div>

                {/* Hero Visual Right: Intelligence Radar Cluster */}
                <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 1.4 }}
                className="hidden lg:block relative"
                >
                <div className="relative aspect-square w-full max-w-lg mx-auto bg-white/[0.01] border border-white/5 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(245,209,66,0.03)] group">
                    {/* Animated Rings */}
                    <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-dashed border-[#f5d142]/10 rounded-full"
                    />
                    <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-10 border border-dashed border-white/5 rounded-full"
                    />
                    
                    {/* Core Visual */}
                    <div className="relative z-10 w-56 h-56 bg-black border border-[#f5d142]/20 rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(245,209,66,0.1)] transition-transform duration-500 group-hover:scale-105">
                        <div className="text-[10px] font-mono text-[#f5d142]/50 tracking-[0.3em] mb-1">REAL-TIME OMPS</div>
                        <div className="text-6xl font-heading font-black text-white">84.2</div>
                        <div className="flex gap-1.5 mt-3">
                        {[1,2,3,4,5,6].map(i => <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }} className={`w-1 h-4 rounded-full ${i < 6 ? 'bg-[#f5d142]' : 'bg-white/10'}`} />)}
                        </div>
                    </div>

                    {/* Interactive Nodes */}
                    {[
                    { icon: BrainCircuit, label: 'Perception', top: '10%', right: '15%', val: 'Positive' },
                    { icon: Globe, label: 'Network', bottom: '20%', left: '5%', val: 'Global' },
                    { icon: Activity, label: 'Velocity', top: '25%', left: '10%', val: '+12.4%' }
                    ].map((node, i) => (
                    <motion.div 
                        key={i}
                        style={{ top: node.top, right: node.right, bottom: node.bottom, left: node.left }}
                        whileHover={{ scale: 1.2, zIndex: 20 }}
                        className="absolute pointer-events-auto p-5 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl flex flex-col items-center gap-1 group/node backdrop-blur-md"
                        data-hover="true"
                    >
                        <node.icon className="w-5 h-5 text-[#f5d142]" />
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover/node:text-white/60 transition-colors">{node.label}</span>
                        <span className="text-[11px] font-heading font-bold text-white">{node.val}</span>
                    </motion.div>
                    ))}
                </div>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="absolute bottom-12 flex flex-col items-center gap-2 text-[8px] uppercase tracking-[0.6em] text-white/10"
            >
                SCROLL TO ANALYZE
                <motion.div 
                animate={{ scaleY: [0, 1, 0], y: [0, 10, 20] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-px h-16 bg-gradient-to-b from-[#f5d142]/50 to-transparent" 
                />
            </motion.div>
            </header>

            {/* Live Home Intelligence Section */}
            <section id="home" className="relative py-32 px-6 bg-[#080808] border-y border-white/5">
            <motion.div 
                style={{ opacity: dashOpacity, y: dashY }}
                className="max-w-7xl mx-auto"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Bar Graph Area */}
                <div className="lg:col-span-8 bg-white/[0.01] border border-white/10 rounded-[40px] p-12 relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-16 relative z-10">
                    <div className="space-y-1">
                        <h4 className="font-heading text-xl font-bold uppercase flex items-center gap-4 text-white">
                        <Activity className="w-6 h-6 text-[#f5d142]" /> Perception Vector
                        </h4>
                        <p className="text-[11px] text-white/30 uppercase tracking-[0.2em]">Aggregate reputation health across major clusters</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-heading font-black text-[#f5d142]">+28.4%</div>
                        <div className="text-[9px] uppercase font-bold text-white/20 tracking-widest">W.O.W GROWTH</div>
                    </div>
                    </div>

                    <div className="h-72 flex items-end gap-2.5 relative z-10">
                    {[45, 60, 55, 80, 75, 90, 85, 95, 100, 92, 88, 96, 100].map((val, i) => (
                        <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${val}%` }}
                        transition={{ delay: i * 0.05, duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                        className="flex-1 bg-gradient-to-t from-[#f5d142]/5 via-[#f5d142]/20 to-[#f5d142] rounded-t-sm relative group/bar"
                        >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover/bar:opacity-30 transition-opacity" />
                        {val === 100 && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1.5 rounded-md text-[9px] font-bold whitespace-nowrap shadow-2xl tracking-widest">SYSTEM PEAK</div>
                        )}
                        </motion.div>
                    ))}
                    </div>
                    
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />
                </div>

                {/* Model Breakdown Area */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="p-10 bg-[#f5d142] text-black rounded-[40px] shadow-2xl shadow-[#f5d142]/5">
                        <h4 className="font-heading text-lg font-bold uppercase mb-10 flex items-center gap-3">
                        <BrainCircuit className="w-5 h-5" /> Model Distribution
                        </h4>
                        <div className="space-y-8">
                        {['GPT-4o (OpenAI)', 'Claude 3.5 (Anthropic)', 'Gemini 1.5 (Google)'].map((m, i) => (
                            <div key={m} className="space-y-3">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-tight">
                                <span>{m}</span>
                                <span>{90 - i * 8}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                                <motion.div 
                                whileInView={{ width: `${90 - i * 8}%` }} 
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="h-full bg-black" 
                                />
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    
                    <div className="p-10 border border-white/10 rounded-[40px] bg-white/[0.02] flex items-center gap-8 group">
                        <div className="w-14 h-14 bg-[#f5d142]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#f5d142] group-hover:text-black transition-all duration-500">
                        <Layers className="w-7 h-7" />
                        </div>
                        <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5d142] mb-1">Latency Layer</div>
                        <div className="text-2xl font-heading font-bold text-white">142ms <span className="text-white/20 text-sm font-light">API Mean</span></div>
                        </div>
                    </div>
                </div>
                </div>
            </motion.div>
            </section>

            {/* Strategic Tooling Section (Restored to 6 items) */}
            <section id="strategic-tooling" className="py-40 bg-[#050505] px-6">
            <div className="max-w-[1700px] mx-auto">
                <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12"
                >
                <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase leading-none">
                    Strategic <br/> <span className="text-[#f5d142]">Tooling</span>
                </h2>
                <p className="text-white/30 text-xl font-light max-w-xl italic leading-relaxed">A specialized intelligence suite designed to decode the latent perception of modern conversational engines.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-white/5 rounded-[50px] overflow-hidden">
                {FEATURES.map((feature) => (
                    <FeatureCard key={feature.id} artist={feature as any} />
                ))}
                </div>
            </div>
            </section>

            {/* Analysis Section (Problem) */}
            <section id="analysis" className="py-48 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                >
                <h2 className="text-6xl md:text-9xl font-heading font-bold uppercase leading-[0.82] mb-16 tracking-tighter">
                    The AI <br/> <span className="text-[#f5d142]">Threshold</span>
                </h2>
                <div className="space-y-12">
                    <div className="flex gap-10 group">
                    <div className="w-1.5 bg-[#f5d142]/20 group-hover:bg-[#f5d142] transition-all duration-700 h-24" />
                    <p className="text-2xl text-white/60 font-light leading-relaxed">
                        Today, 73% of consumers explore brands via LLMs before ever clicking a blue link. Traditional SEO is dead—<span className="text-white italic">AISO is your only path to visibility.</span>
                    </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/10 group hover:border-[#f5d142]/30 transition-all">
                        <div className="text-5xl font-heading font-black mb-3 text-white">90%</div>
                        <div className="text-[11px] uppercase font-bold tracking-[0.2em] text-white/20 group-hover:text-white/50">Drop in Search CTR</div>
                        </div>
                        <div className="p-10 rounded-3xl bg-[#f5d142] text-black">
                        <div className="text-5xl font-heading font-black mb-3">+400%</div>
                        <div className="text-[11px] uppercase font-bold tracking-[0.2em] text-black/40">Lift in AI Rec Share</div>
                        </div>
                    </div>
                </div>
                </motion.div>

                <div className="relative group">
                <div className="absolute inset-0 bg-[#f5d142] opacity-5 rounded-full blur-[120px] animate-pulse" />
                <div className="aspect-square bg-white/[0.02] rounded-full border border-white/10 flex items-center justify-center overflow-hidden relative">
                    <Globe className="w-48 h-48 text-white/5 group-hover:text-[#f5d142]/20 transition-all duration-1000" />
                    <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border border-dashed border-[#f5d142]/10 rounded-full"
                    />
                    <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-16 border border-dashed border-white/5 rounded-full"
                    />
                    
                    <div className="absolute bg-[#0a0a0a] border border-[#f5d142]/40 p-6 rounded-2xl shadow-2xl flex items-center gap-4 -rotate-6 group-hover:rotate-0 transition-transform">
                        <BarChart3 className="w-6 h-6 text-[#f5d142]" />
                        <div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Share of Mind</div>
                        <div className="text-xl font-heading font-bold">+12.4%</div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* Integrations (CTA) */}
            <section id="integrations" className="py-48 px-6 relative bg-black overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 bg-radial-gradient from-[#f5d142]/5 to-transparent pointer-events-none" />
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="text-6xl md:text-[9vw] font-heading font-bold mb-16 uppercase tracking-tighter text-white"
                >
                Stay <span className="text-[#f5d142]">Smooth</span>.
                </motion.h2>
                <p className="text-2xl text-white/40 mb-20 font-light max-w-2xl mx-auto leading-relaxed italic">
                Secure your brand's standing in the conversational age. Decode your reputation across the LLM stack.
                </p>
                <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 max-w-xl mx-auto">
                <input 
                    type="email" 
                    placeholder="Corporate email" 
                    className="bg-transparent px-8 py-5 focus:outline-none text-white text-lg flex-grow placeholder:text-white/10" 
                />
                <button className="bg-[#f5d142] text-black px-12 py-5 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-all shadow-2xl shadow-[#f5d142]/10">Join Waitlist</button>
                </div>
            </div>
            </section>

            <footer className="py-24 px-12 border-t border-white/5 bg-[#050505]">
            <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                <div>
                <div className="font-heading text-4xl font-black text-[#f5d142] mb-6">BUTTR.IO</div>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.5em]">Intelligence for the AISO Era</p>
                </div>
                <div className="flex flex-wrap gap-x-20 gap-y-6 text-[11px] font-bold uppercase tracking-widest text-white/20">
                <a href="#" className="hover:text-[#f5d142] transition-colors">Documentation</a>
                <a href="#" className="hover:text-[#f5d142] transition-colors">Privacy Protocol</a>
                <a href="#" className="hover:text-[#f5d142] transition-colors">Strategy Kit</a>
                <a href="#" className="hover:text-[#f5d142] transition-colors">Terminal Access</a>
                </div>
            </div>
            <div className="max-w-[1700px] mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-white/5 uppercase tracking-[0.3em] gap-4">
                <span>© 2025 Buttr Intelligence Cluster. Cluster: US-WEST-1</span>
                <div className="flex gap-10">
                    <span>Latency: 12ms</span>
                    <span>Uptime: 99.99%</span>
                </div>
            </div>
        </footer>
    </div>
}
export default AppContent;