import type { BlogMeta } from '@/app/home/components/Blogs';

/**
 * Master registry of all blog posts.
 *
 * Convention:
 *  - `slug` must match the folder name under `app/blogs/`
 *  - Each slug folder must contain a `page.tsx` that exports a default React component
 *
 * To add a new post:
 * 1. Create `app/blogs/<your-slug>/page.tsx`
 * 2. Add an entry here
 */
export const ALL_POSTS: BlogMeta[] = [
    {
        slug: 'why-buttr',
        title: 'Why buttr.io — LLM Visibility Intelligence',
        description:
            'How buttr.io tracks your brand across ChatGPT, Gemini, Claude and Perplexity — and turns the AI black box into measurable insight.',
        date: 'March 2026',
        tag: 'Deep Dive',
        coverColor: '#F4D35E',
    },
];
