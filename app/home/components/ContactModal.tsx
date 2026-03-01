import { addToWaitlist } from "@/lib/services/postgressDB";
import React, { useState, useEffect } from "react";

export type FormValues = {
    name: string;
    email: string;
    contact_number: string;
    brand: string;
    purpose: string;
}

const recordWaitlistSignup = async (data: FormValues) => {
    const existing = JSON.parse(localStorage.getItem('buttr_waitlist') || '[]');
    localStorage.setItem('buttr_waitlist', JSON.stringify([...existing, { ...data, date: new Date().toISOString() }]));

    // API Call
    return new Promise((resolve, reject) => setTimeout(async () => {
        try {
            const res = await addToWaitlist(data);
            resolve(res);
        } catch (error) {
            reject(error);
        }
    }, 1500));
};

type ContactModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialPurpose?: string;
};

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, initialPurpose = 'I want a novel AI/ML solution' }) => {
    const [formStep, setFormStep] = useState<'input' | 'loading' | 'success' | 'error'>('input');
    const [formValues, setFormValues] = useState<FormValues>({
        name: '',
        email: '',
        contact_number: '',
        brand: '',
        purpose: initialPurpose
    });

    useEffect(() => {
        if (isOpen) {
            setFormStep('input');
            setFormValues(prev => ({ ...prev, purpose: initialPurpose }));
        }
    }, [isOpen, initialPurpose]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        if (form.checkValidity()) {
            setFormStep('loading');
            try {
                await recordWaitlistSignup(formValues);
                setFormStep('success');
            } catch (error) {
                console.error("Failed to submit form:", error);
                setFormStep('error');
            }
        }
    };

    return (
        <div
            id="contactModal"
            className={`modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300 ${isOpen ? 'active opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
                }`}
            onClick={onClose}
        >
            <div
                className={`modal-content bg-white p-8 md:p-10 shadow-2xl relative w-full max-w-lg rounded-3xl mx-4 transition-all duration-300 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                {formStep === 'input' ? (
                    <div id="formContainer">
                        <h3 className="text-3xl font-extrabold mb-2">Let's connect.</h3>
                        <p className="text-gray-500 mb-8 text-sm">Tell us about your project and we'll get back to you within 24 hours.</p>

                        <form id="strategyForm" onSubmit={handleFormSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold mb-1">Purpose</label>
                                <div className="relative">
                                    <select
                                        id="field-purpose"
                                        className="input-field w-full bg-gray-50 border border-gray-200 rounded-lg p-3 appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-[#F4D35E]"
                                        value={formValues.purpose}
                                        onChange={(e) => setFormValues({ ...formValues, purpose: e.target.value })}
                                    >
                                        <option value="I want a novel AI/ML solution">I want a novel AI/ML solution</option>
                                        <option value="I want to get a free GEO brand audit done">I want to get a free GEO brand audit done</option>
                                        <option value="I want to discuss my GEO strategy">I want to discuss my GEO strategy</option>
                                        <option value="I want to join the waitlist for the GEO monitoring Saas">I want to join the waitlist for the GEO monitoring Saas</option>
                                        <option value="Other query">Other query</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Your Name *</label>
                                <input
                                    id="field-name"
                                    value={formValues.name}
                                    type="text"
                                    className="input-field w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F4D35E]"
                                    onChange={e => {
                                        setFormValues({ ...formValues, name: e.target.value })
                                    }}
                                    placeholder="John Doe" required />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Email *</label>
                                <input
                                    id="field-email"
                                    value={formValues.email}
                                    type="email"
                                    className="input-field w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F4D35E]"
                                    onChange={e => {
                                        setFormValues({ ...formValues, email: e.target.value })
                                    }}
                                    placeholder="john@company.com" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Phone (Optional)</label>
                                    <input
                                        value={formValues.contact_number}
                                        type="text"
                                        id="field-phone"
                                        className="input-field w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F4D35E]"
                                        placeholder="+1-234-567"
                                        onChange={e => {
                                            const newNumber = e.target.value;
                                            if (newNumber != "" &&
                                                (newNumber[newNumber.length - 1] < "0" || newNumber[newNumber.length - 1] > "9") || // Number check
                                                (newNumber.length > 20) // Number check
                                            ) return

                                            setFormValues({ ...formValues, contact_number: newNumber })
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Brand / Website (Optional)</label>
                                    <input
                                        type="text"
                                        value={formValues.brand}
                                        id="field-website"
                                        className="input-field w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F4D35E]"
                                        onChange={e => {
                                            setFormValues({ ...formValues, brand: e.target.value })
                                        }}
                                        placeholder="brand.com" />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold mt-4 hover:bg-[#F4D35E] hover:text-black transition-all shadow-lg">
                                Send Request
                            </button>
                        </form>
                    </div>
                ) : formStep === 'loading' ? (
                    <div id="loadingMessage" className="text-center py-12 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 border-4 border-[#F4D35E]/30 border-t-[#F4D35E] rounded-full animate-spin mx-auto mb-6"></div>
                        <h3 className="text-2xl font-bold mb-2">Sending request...</h3>
                        <p className="text-gray-500">Please wait while we process your details.</p>
                    </div>
                ) : formStep === 'success' ? (
                    <div id="successMessage" className="text-center py-12 animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-[#F4D35E]/20 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h3 className="text-3xl font-extrabold mb-4">Thank you!</h3>
                        <p className="text-gray-500 leading-relaxed mb-8">We have received your details. Our team will be in touch with you soon to smooth out your AI strategy.</p>
                        <button key="close-success" onClick={onClose} className="text-black font-bold underline hover:text-[#D4AF37]">Close</button>
                    </div>
                ) : formStep === 'error' ? (
                    <div id="errorMessage" className="text-center py-12 animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        </div>
                        <h3 className="text-3xl font-extrabold mb-4">Oops something went wrong!</h3>
                        <p className="text-gray-500 leading-relaxed mb-8">This is unusual, we have taken a note of this failure. Meanwhile please reach us out by emailing contact@buttr.io</p>
                        <button key="close-error" onClick={onClose} className="text-black font-bold underline hover:text-red-500">Close</button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
