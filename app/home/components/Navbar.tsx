'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type NavbarProps = {
    onOpenForm: (purpose?: string) => void;
};

export const Navbar: React.FC<NavbarProps> = ({ onOpenForm }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile breakpoint
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 900);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Close sidebar when switching to desktop
    useEffect(() => {
        if (!isMobile) setIsOpen(false);
    }, [isMobile]);

    const navLinks = [
        { href: '#services', label: 'AI Services' },
        { href: '#geo-strategy', label: 'GEO Agency' },
        { href: '#saas', label: 'SaaS Dashboard' },
        { href: '/blogs', label: 'Blogs' },
    ];

    return (
        <>
            {/* ── Desktop Navbar ── */}
            {!isMobile && (
                <nav className="fixed w-full z-50 px-4 md:px-6 py-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center glass bg-white/70 backdrop-blur-md rounded-full px-6 md:px-8 py-3 border border-black/5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <img
                                src="/buttr-logo.png"
                                alt="buttr.io logo"
                                className="h-8 w-auto md:h-10 object-contain transition-transform hover:scale-105"
                            />
                            <span className="text-xl md:text-2xl font-extrabold tracking-tighter">
                                buttr<span className="text-[#F4D35E]">.io</span>
                            </span>
                        </div>
                        <div className="flex space-x-8 font-medium text-sm uppercase tracking-widest">
                            {navLinks.map((link) =>
                                link.href.startsWith('/') ? (
                                    <Link key={link.href} href={link.href} className="nav-link hover:text-[#F4D35E] transition-colors">
                                        {link.label}
                                    </Link>
                                ) : (
                                    <a key={link.href} href={link.href} className="nav-link hover:text-[#F4D35E] transition-colors">
                                        {link.label}
                                    </a>
                                )
                            )}
                        </div>
                        <div>
                            <button
                                onClick={() => onOpenForm('I want to get a free GEO brand audit done')}
                                className="bg-black text-white px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-[#F4D35E] hover:text-black transition-colors"
                            >
                                Free Audit
                            </button>
                        </div>
                    </div>
                </nav>
            )}

            {/* ── Mobile: Logo toggle button (top-left) ── */}
            {isMobile && (
                <button
                    onClick={() => setIsOpen((v) => !v)}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    className="fixed top-4 left-4 z-[60] h-12 w-12 flex items-center justify-center rounded-full glass bg-white/80 backdrop-blur-md border border-black/5 shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                    <img
                        src="/buttr-logo.png"
                        alt="buttr.io logo"
                        className="h-7 w-auto object-contain"
                    />
                </button>
            )}

            {/* ── Mobile: Backdrop ── */}
            {isMobile && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm transition-opacity duration-300"
                    style={{
                        opacity: isOpen ? 1 : 0,
                        pointerEvents: isOpen ? 'auto' : 'none',
                    }}
                />
            )}

            {/* ── Mobile: Vertical Sidebar ── */}
            {isMobile && (
                <aside
                    className="fixed top-0 left-0 h-dvh w-[72vw] max-w-[280px] z-50 flex flex-col items-center justify-center gap-8 bg-[#FFFDF5]/[0.92] backdrop-blur-[20px] border-r border-[#F4D35E33] shadow-[4px_0_32px_rgba(0,0,0,0.08)] transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                        transform: isOpen ? 'translateX(0)' : 'translateX(-110%)',
                    }}
                >
                    {/* Logo at top of sidebar */}
                    <div className="flex flex-col items-center gap-1 pt-8">
                        <img
                            src="/buttr-logo.png"
                            alt="buttr.io logo"
                            className="h-12 w-auto object-contain"
                        />
                    </div>

                    {/* Divider */}
                    <div className="w-[40%] h-px bg-[#F4D35E66] rounded-full" />

                    {/* Nav Links */}
                    <nav className="flex flex-col items-center gap-6 font-medium text-sm uppercase tracking-widest w-full px-6">
                        {navLinks.map((link) =>
                            link.href.startsWith('/') ? (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="nav-link hover:text-[#F4D35E] transition-colors text-center"
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="nav-link hover:text-[#F4D35E] transition-colors text-center"
                                >
                                    {link.label}
                                </a>
                            )
                        )}
                    </nav>

                    {/* Divider */}
                    <div className="w-[40%] h-px bg-[#F4D35E66] rounded-full" />

                    {/* CTA Button */}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onOpenForm('I want to get a free GEO brand audit done');
                        }}
                        className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-[#F4D35E] hover:text-black transition-colors"
                    >
                        Free Audit
                    </button>
                </aside>
            )}
        </>
    );
};
