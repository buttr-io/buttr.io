import React from 'react';

type NavbarProps = {
    onOpenForm: (purpose?: string) => void;
};

export const Navbar: React.FC<NavbarProps> = ({ onOpenForm }) => {
    return (
        <nav className="fixed w-full z-50 px-4 md:px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center glass bg-white/70 backdrop-blur-md rounded-full px-6 md:px-8 py-3 border border-black/5 shadow-sm">
                <div className="text-xl md:text-2xl font-extrabold tracking-tighter">buttr<span className="text-[#F4D35E]">.io</span></div>
                <div className="hidden md:flex space-x-8 font-medium text-sm uppercase tracking-widest">
                    <a href="#services" className="nav-link hover:text-[#F4D35E] transition-colors">AI Services</a>
                    <a href="#geo-strategy" className="nav-link hover:text-[#F4D35E] transition-colors">GEO Agency</a>
                    <a href="#saas" className="nav-link hover:text-[#F4D35E] transition-colors">SaaS Dashboard</a>
                    <a href="#" className="nav-link hover:text-[#F4D35E] transition-colors">Blogs</a>
                </div>
                <div>
                    <button onClick={() => onOpenForm('I want to get a free GEO brand audit done')}
                        className="bg-black text-white px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-[#F4D35E] hover:text-black transition-colors">
                        Free Audit
                    </button>
                </div>
            </div>
        </nav>
    );
};
