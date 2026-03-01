import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog — buttr.io',
    description:
        'Insights on AI visibility, GEO strategy, and the future of brand discoverability in the age of LLMs.',
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen bg-[#FFFDF5] font-sans">
            {/* ── Shared Hero Header ── */}
            <section className="pt-28 pb-12 text-center relative overflow-hidden">
                {/* Glow blob */}
                <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[#F4D35E1F] rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                    <span className="inline-block bg-[#F4D35E26] border border-[#F4D35E66] rounded-full px-4 py-1 text-[0.7rem] font-bold tracking-[0.12em] uppercase text-[#9a7d10] mb-5">
                        Insights &amp; Perspectives
                    </span>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-[#1A1A1A] mb-4">
                        The buttr<span className="text-[#F4D35E]">.io</span> Blog
                    </h1>

                    <p className="text-lg text-[#555] max-w-[540px] mx-auto leading-relaxed">
                        AI visibility, GEO strategy, and the future of brand discoverability
                        in the age of large language models.
                    </p>
                </div>
            </section>

            {/* ── Page-specific content ── */}
            {children}
        </main>
    );
}
