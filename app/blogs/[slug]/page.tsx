import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ALL_POSTS } from '../registry';

type Props = { params: Promise<{ slug: string }> };

/* ── Static params for pre-rendering ── */
export async function generateStaticParams() {
    return ALL_POSTS.map((p) => ({ slug: p.slug }));
}

/* ── Dynamic metadata per post ── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = ALL_POSTS.find((p) => p.slug === slug);
    if (!post) return {};
    return {
        title: `${post.title} — buttr.io Blog`,
        description: post.description,
    };
}

/* ── Page ── */
export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;

    // Validate slug against registry
    const meta = ALL_POSTS.find((p) => p.slug === slug);
    if (!meta) return notFound();

    // Dynamically import the blog content from its own folder's page.tsx
    let PostContent: React.ComponentType;
    try {
        const mod = await import(`@/app/blogs/${slug}/page`);
        PostContent = mod.default;
    } catch {
        return notFound();
    }

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

            {/* ── Blog content (child component from the slug folder) ── */}
            <article className="max-w-[820px] mx-auto px-6 pb-24">
                <PostContent />
            </article>
        </>
    );
}
