import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')


export async function getMarkdownBySlug(slug: string[]) {
  const fullPath = path.join(CONTENT_DIR, ...slug) + '.md'

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const file = fs.readFileSync(fullPath, 'utf8')
  const { content, data } = matter(file)

  const processed = await remark().use(html).process(content)

  return {
    html: processed.toString(),
    frontmatter: data
  }
}

export interface BlogPostMeta {
  slug: string[]
  title: string
  description?: string
  date?: string
}

export function getAllBlogPosts(): BlogPostMeta[] {
  const slugs = getAllMarkdownSlugs()
  return slugs.map((slug) => {
    const fullPath = path.join(CONTENT_DIR, ...slug) + '.md'
    const file = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(file)
    return {
      slug,
      title: (data.title as string) ?? slug[slug.length - 1],
      description: data.description as string | undefined,
      date: data.date as string | undefined,
    }
  })
}

export function getAllMarkdownSlugs(): string[][] {
  function walk(dir: string, acc: string[] = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    let result: string[][] = []

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        result = result.concat(walk(fullPath, [...acc, entry.name]))
      } else if (entry.name.endsWith('.md')) {
        result.push([...acc, entry.name.replace('.md', '')])
      }
    }

    return result
  }

  return walk(CONTENT_DIR)
}
