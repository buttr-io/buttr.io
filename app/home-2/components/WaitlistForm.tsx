import { addToWaitlist } from "@/lib/services/postgressDB";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Mail, Phone, Sparkles, User, X } from "lucide-react";
import { useRef, useState } from "react";

export type WaitlistData = {
  email: string;
  name: string;
  contact_number: string;
}

/**
 * MOCK RECORDING LOGIC
 */
const recordWaitlistSignup = async (data: WaitlistData) => {
  const existing = JSON.parse(localStorage.getItem('buttr_waitlist') || '[]');
  localStorage.setItem('buttr_waitlist', JSON.stringify([...existing, { ...data, date: new Date().toISOString() }]));
  
  // console.info(`%c 🧈 Buttr.io Waitlist: New Signup Captured!`, 'background: #F59E0B; color: #fff; padding: 5px; border-radius: 5px;', data);
  
  // API Call
  return new Promise((resolve) => setTimeout(() =>{
    const res = addToWaitlist(data)
    resolve(res)
  }, 1500));
};


// Reusable Waitlist Form Component
const WaitlistForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState<WaitlistData>({
    email: '',
    name: '',
    contact_number: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await recordWaitlistSignup(formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#2D2A26]/40 backdrop-blur-md"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-black/5"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8 md:p-12">
            {!isSubmitted ? (
              <>
                <div className="mb-8">
                  <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-2xl flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <h2 className="text-3xl font-serif italic mb-2">Claim your brand audit.</h2>
                  <p className="text-gray-400 font-light">Join the waitlist for early access to our LLM visibility engine.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      required
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-amber-200 transition-all text-sm"
                      value={formData.name}
                      onChange={e => {
                        if(e.target.value.length > 50) return;
                        setFormData({...formData, name: e.target.value})
                      }}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      required
                      type="email"
                      placeholder="Work Email"
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-amber-200 transition-all text-sm"
                      value={formData.email}
                      onChange={e => {
                        if(e.target.value.length > 50) return;
                        setFormData({...formData, email: e.target.value})
                      }}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      type="tel"
                      placeholder="Contact Number"
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-amber-200 transition-all text-sm"
                      value={formData.contact_number}
                      onChange={e => {
                        const newNumber = e.target.value;
                        if(newNumber != "" && 
                          (newNumber[newNumber.length - 1] < "0" || newNumber[newNumber.length - 1] > "9") || // Number check
                          (newNumber.length > 20) // Number check
                        ) return
                        
                        setFormData({...formData, contact_number: newNumber})
                      }}
                    />
                  </div>
                  
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-[#2D2A26] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50 mt-6"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Secure Spot <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center py-8"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-serif italic mb-2">You're in.</h3>
                  <p className="text-gray-400 font-light max-w-xs mx-auto">We've recorded your details. Our team will reach out shortly to schedule your audit. 🧈</p>
                </div>
                <button 
                  onClick={onClose}
                  className="mt-4 text-xs font-extrabold uppercase tracking-widest text-[#F59E0B] hover:text-amber-600 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default WaitlistForm;