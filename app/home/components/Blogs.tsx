'use client';

import Link from 'next/link';

export interface BlogMeta {
    slug: string;        // folder name → URL path
    title: string;
    description: string;
    date: string;        // e.g. "March 2026"
    tag?: string;        // optional category pill
    coverColor?: string; // optional accent color for the card top bar
}

interface BlogsProps {
    posts: BlogMeta[];
    /** When true, shows a section heading and "View all" link (for home-page embedding) */
    preview?: boolean;
}

export function Blogs({ posts, preview = false }: BlogsProps) {
    const displayed = preview ? posts.slice(0, 3) : posts;

    return (
        <section className="w-full max-w-[1100px] mx-auto">
            {/* ── Section header (only in preview / home embed mode) ── */}
            {preview && (
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="inline-block bg-[#F4D35E26] border border-[#F4D35E59] rounded-full px-3.5 py-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase text-[#9a7d10] mb-3">
                            Latest Insights
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1A1A] m-0">
                            From the buttr<span className="text-[#F4D35E]">.io</span> blog
                        </h2>
                    </div>
                    <Link
                        href="/blogs"
                        className="text-[0.8rem] font-bold tracking-[0.06em] uppercase text-[#1A1A1A] no-underline border-b-2 border-[#F4D35E] pb-0.5 whitespace-nowrap"
                    >
                        View all →
                    </Link>
                </div>
            )}

            {/* ── Card grid ── */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
                {displayed.length === 0 ? (
                    <p className="text-[#aaa] col-span-full text-center py-12">
                        No posts yet — check back soon!
                    </p>
                ) : (
                    displayed.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                    ))
                )}
            </div>
        </section>
    );
}

/* ── Individual card ── */
function BlogCard({ post }: { post: BlogMeta }) {
    const accent = post.coverColor ?? '#F4D35E';

    return (
        <Link
            href={`/blogs/${post.slug}`}
            className="flex flex-col rounded-[1.25rem] bg-white/75 backdrop-blur-md border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.05)] overflow-hidden no-underline text-inherit transition-[transform,box-shadow] duration-[250ms] ease-out hover:-translate-y-[5px] hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)]"
        >
            {/* Accent bar — dynamic color must stay inline */}
            <div style={{ height: 4, background: accent, width: '100%' }} />

            <div className="p-6 flex flex-col gap-3 flex-grow">
                {/* Tag pill — dynamic color must stay inline */}
                {post.tag && (
                    <span
                        className="self-start rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold tracking-[0.1em] uppercase text-[#7a6500]"
                        style={{
                            background: `${accent}22`,
                            border: `1px solid ${accent}66`,
                        }}
                    >
                        {post.tag}
                    </span>
                )}

                {/* Title */}
                <h3 className="text-[1.1rem] font-extrabold tracking-tight leading-snug text-[#1A1A1A] m-0">
                    {post.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#666] leading-relaxed m-0 flex-grow line-clamp-3">
                    {post.description}
                </p>

                {/* Footer row */}
                <div className="flex justify-between items-center pt-2 mt-auto">
                    <span className="text-[0.72rem] text-[#bbb] font-medium">
                        {post.date}
                    </span>
                    <span
                        className="text-[0.78rem] font-bold tracking-[0.04em]"
                        style={{ color: accent === '#F4D35E' ? '#b89400' : accent }}
                    >
                        Read →
                    </span>
                </div>
            </div>
        </Link>
    );
}
