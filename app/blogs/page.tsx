import Link from 'next/link';
import { Blogs } from '@/app/home/components/Blogs';
import { ALL_POSTS } from './registry';

export default function BlogsIndexPage() {
    return (
        <>
            {/* ── Back to home ── */}
            <div className="max-w-[1100px] mx-auto px-6 pb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold tracking-[0.06em] uppercase text-[#888] no-underline hover:text-[#1A1A1A] transition-colors"
                >
                    ← Back to home
                </Link>
            </div>

            {/* ── Posts grid ── */}
            <div className="px-6 pb-24">
                <Blogs posts={ALL_POSTS} />
            </div>
        </>
    );
}
