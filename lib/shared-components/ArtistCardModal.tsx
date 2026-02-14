import { AnimatePresence, motion } from "framer-motion"
import { AnalyticsModule } from "./types/types"
import { Dispatch } from "react"

import { X } from 'lucide-react';

export const ArtistCardModal = ({ setSelectedFeature, selectedFeature }: {setSelectedFeature: Dispatch<React.SetStateAction<AnalyticsModule | null>>, selectedFeature?: AnalyticsModule | null }) =>  {
    return (
        <AnimatePresence>
            {selectedFeature && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedFeature(null)}
                className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl"
            >
                <motion.div
                initial={{ scale: 0.9, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 100 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-6xl bg-[#080808] border border-white/10 rounded-[50px] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(245,209,66,0.05)]"
                >
                <button onClick={() => setSelectedFeature(null)} className="absolute top-10 right-10 z-20 p-5 rounded-full bg-white/5 text-white hover:bg-[#f5d142] hover:text-black transition-all group">
                    <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                </button>
                <div className="w-full md:w-1/2 h-[400px] md:h-auto overflow-hidden">
                    <img src={selectedFeature.image} className="w-full h-full object-cover grayscale brightness-[0.3] hover:grayscale-0 hover:brightness-100 transition-all duration-1000" />
                </div>
                <div className="w-full md:w-1/2 p-16 md:p-24 flex flex-col justify-center">
                    <span className="text-[#f5d142] text-[10px] font-mono tracking-[0.5em] uppercase mb-8">{selectedFeature.version}</span>
                    <h3 className="text-5xl md:text-7xl font-heading font-bold uppercase mb-6 leading-none tracking-tighter text-white">{selectedFeature.name}</h3>
                    <p className="text-white/30 text-2xl font-light uppercase tracking-[0.2em] mb-12">{selectedFeature.category}</p>
                    <div className="w-32 h-1 bg-[#f5d142] mb-16" />
                    <p className="text-white/60 text-xl font-light leading-relaxed mb-20 italic">
                    "{selectedFeature.description}"
                    </p>
                    <button className="bg-white text-black py-6 px-16 uppercase font-bold text-xs tracking-[0.4em] hover:bg-[#f5d142] transition-colors w-fit rounded-xl">Initialize Strategy</button>
                </div>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
    )
}