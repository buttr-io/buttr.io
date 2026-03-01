import type { Metadata } from 'next';
import Link from 'next/link';
import { ALL_POSTS } from '../registry';

export const metadata: Metadata = {
    title: 'Why buttr.io — LLM Visibility Intelligence | buttr.io Blog',
    description:
        'How buttr.io tracks your brand across ChatGPT, Gemini, Claude and Perplexity — and turns the AI black box into measurable insight.',
};

const meta = ALL_POSTS.find((p) => p.slug === 'why-buttr')!;

export default function WhyButtrPage() {
    return (
        <>
            {/* ── Post header ── */}
            <div className="max-w-[820px] mx-auto px-6 pb-0">
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold tracking-[0.06em] uppercase text-[#888] no-underline hover:text-[#1A1A1A] transition-colors"
                >
                    ← All posts
                </Link>

                {/* Tag + date */}
                <div className="flex items-center gap-3 mt-8 mb-4">
                    {meta.tag && (
                        <span className="bg-[#F4D35E26] border border-[#F4D35E66] rounded-full px-3.5 py-1 text-[0.65rem] font-bold tracking-[0.1em] uppercase text-[#9a7d10]">
                            {meta.tag}
                        </span>
                    )}
                    {meta.date && (
                        <span className="text-[0.8rem] text-[#aaa]">{meta.date}</span>
                    )}
                </div>

                {/* Post title */}
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.15] text-[#1A1A1A] mt-0 mb-3">
                    {meta.title}
                </h2>

                <p className="text-[1.05rem] text-[#777] leading-relaxed mb-10">
                    {meta.description}
                </p>

                {/* Accent divider */}
                <div className="h-[3px] w-12 bg-[#F4D35E] rounded-full mb-12" />
            </div>

            {/* ── Article body (child component) ── */}
            <article className="max-w-[820px] mx-auto px-6 pb-24">
                <WhyButtrContent />
            </article>
        </>
    );
}

/* ─────────────────────────────────────────────
   Article body component
   ───────────────────────────────────────────── */
function WhyButtrContent() {
    return (
        <div className="text-base leading-[1.8] text-[#333]">
            {/* The Problem */}
            <section className="mb-12">
                <h2 className="text-[1.6rem] font-extrabold mb-4 border-l-4 border-[#F4D35E] pl-4 text-[#1A1A1A]">
                    The Problem
                </h2>
                <p className="mb-4">
                    Consumers are no longer searching — they are <em>asking</em>.{' '}
                    <strong>73% of consumers</strong> are discovering new products via
                    LLMs, but brands are flying blind.
                </p>
                <ul className="pl-6 flex flex-col gap-2.5 list-disc">
                    <li>
                        <strong>The New Behavior:</strong> Users ask ChatGPT for
                        recommendations instead of Googling.
                    </li>
                    <li>
                        <strong>The Blind Spot:</strong> Traditional SEO tracks links;
                        buttr.io tracks if AI is recommending you.
                    </li>
                    <li>
                        <strong>The Risk:</strong> In the AI era, there is often only one
                        answer — if it isn&apos;t you, you don&apos;t exist.
                    </li>
                </ul>
            </section>

            {/* Value Proposition */}
            <section className="mb-12 bg-[#F9F8F0] p-8 rounded-[1.25rem]">
                <h2 className="text-[1.6rem] font-extrabold mb-6 text-[#1A1A1A]">
                    Market Visibility, Made Measurable
                </h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                    {[
                        {
                            title: 'UNDERSTAND',
                            body: 'Audit the "black box" to track brand appearance across ChatGPT, Gemini, Claude, and Perplexity.',
                        },
                        {
                            title: 'MEASURE',
                            body: 'Use machine-learned metrics to benchmark recommendation frequency and sentiment.',
                        },
                        {
                            title: 'IMPROVE',
                            body: 'Shape decisions by optimizing data points and high-authority domains that feed AI training sets.',
                        },
                        {
                            title: 'MONITOR',
                            body: 'Watch shifting trends and real-time fluctuations in AI rankings.',
                        },
                    ].map((item) => (
                        <div key={item.title} className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <h3 className="font-extrabold text-[0.75rem] tracking-[0.1em] text-[#F4D35E] mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-[#555]">{item.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core AI Metrics */}
            <section className="mb-12 overflow-x-auto">
                <h2 className="text-[1.6rem] font-extrabold mb-4 text-[#1A1A1A]">
                    Core AI Metrics
                </h2>
                <table className="w-full border-collapse text-[0.9rem]">
                    <thead>
                        <tr className="bg-[#F4F4EE]">
                            {['Metric', 'Description', 'Measures'].map((h) => (
                                <th key={h} className="p-3 text-left border border-[#E5E5DC] font-bold">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            {
                                metric: 'Sentiment Index',
                                desc: 'Average tone (-1 to +1) of AI responses.',
                                measures: 'The "Vibe" check.',
                            },
                            {
                                metric: 'Organic Visibility',
                                desc: 'Presence in category-specific queries.',
                                measures: 'AI Recall.',
                            },
                            {
                                metric: 'Unprompted Share of Voice',
                                desc: 'Mention % vs. rivals in generic chats.',
                                measures: 'Market Dominance.',
                            },
                        ].map((row) => (
                            <tr key={row.metric}>
                                {[row.metric, row.desc, row.measures].map((cell) => (
                                    <td key={cell} className="p-3 border border-[#E5E5DC]">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Model intelligence */}
            <section className="mb-12">
                <h2 className="text-[1.6rem] font-extrabold mb-5 text-[#1A1A1A]">
                    Model-Specific Intelligence
                </h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
                    {[
                        {
                            model: 'Google Gemini',
                            detail: 'Learns from YouTube, Maps, images, and live news.',
                            quote: '"Sees the new, cool things brands are doing right now."',
                        },
                        {
                            model: 'ChatGPT',
                            detail: 'Trusts high-authority sources and historical data.',
                            quote: '"May view brands through a more traditional/historical lens."',
                        },
                    ].map((item) => (
                        <div key={item.model} className="border border-[#E5E5DC] rounded-2xl p-6">
                            <h3 className="text-[1.1rem] font-extrabold mb-2">{item.model}</h3>
                            <p className="text-sm text-[#666] mb-3">{item.detail}</p>
                            <p className="bg-[#FFF9DC] rounded-lg p-3 text-sm italic text-[#555]">
                                {item.quote}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Roadmap */}
            <section className="mb-12">
                <h2 className="text-[1.6rem] font-extrabold mb-5 text-center text-[#1A1A1A]">
                    Your Ladder to Brand Growth
                </h2>
                <div className="flex flex-col gap-3">
                    {[
                        { week: 1, desc: 'Deep brand study.' },
                        { week: 2, desc: 'Identify customer questions and create prompts.' },
                        { week: 3, desc: 'Analyze appearance across LLMs.' },
                        { week: 4, desc: 'Position analysis and report building.' },
                        { week: 5, desc: 'Insights and success plan delivery.' },
                    ].map((item) => (
                        <div
                            key={item.week}
                            className="flex items-center gap-4 px-5 py-4 border border-[#E5E5DC] rounded-xl bg-white"
                        >
                            <span className="font-extrabold text-[#F4D35E] whitespace-nowrap text-[0.9rem]">
                                Week {item.week}
                            </span>
                            <p className="m-0 text-[0.9rem]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-[#1A1A1A] text-white rounded-[1.5rem] p-10 text-center">
                <p className="mb-2 text-base">Ready to own the narrative?</p>
                <a
                    href="mailto:contact@buttr.io"
                    className="inline-block font-mono text-[#F4D35E] text-lg no-underline font-bold"
                >
                    contact@buttr.io
                </a>
            </section>
        </div>
    );
}
