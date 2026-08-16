import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { z } from "zod"

const contentDir = path.join(process.cwd(), "content")

export const baseFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional().default(false),
})

export const postFrontmatterSchema = baseFrontmatterSchema.extend({
  related: z.array(z.string()).optional(),
})

export const projectFrontmatterSchema = baseFrontmatterSchema.extend({
  status: z.enum(["Idea", "Planning", "Building", "Completed", "Archived"]).optional().default("Idea"),
  techStack: z.array(z.string()).optional(),
  demoUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  related: z.array(z.string()).optional(),
})

export const noteFrontmatterSchema = baseFrontmatterSchema.extend({
  related: z.array(z.string()).optional(), // Slugs of related notes/projects/posts
})

export const journeyFrontmatterSchema = baseFrontmatterSchema.extend({
  category: z.enum(["Life", "Career", "Project", "Learning"]).optional().default("Life"),
  related: z.array(z.string()).optional(),
})

export const labFrontmatterSchema = baseFrontmatterSchema.extend({
  status: z.enum(["Planned", "Running", "Success", "Failed", "Abandoned"]).optional().default("Planned"),
  related: z.array(z.string()).optional(),
})

export const capsuleFrontmatterSchema = baseFrontmatterSchema.extend({
  related: z.array(z.string()).optional(),
})

export type BaseFrontmatter = z.infer<typeof baseFrontmatterSchema>
export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>
export type NoteFrontmatter = z.infer<typeof noteFrontmatterSchema>
export type JourneyFrontmatter = z.infer<typeof journeyFrontmatterSchema>
export type LabFrontmatter = z.infer<typeof labFrontmatterSchema>
export type CapsuleFrontmatter = z.infer<typeof capsuleFrontmatterSchema>

export interface ContentItem<T = BaseFrontmatter> {
  slug: string
  source: string
  metadata: T
}

export async function getFiles(directory: string): Promise<string[]> {
  const fullPath = path.join(contentDir, directory)
  if (!fs.existsSync(fullPath)) return []
  
  return fs.readdirSync(fullPath).filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
}

export async function getFileContent<T = BaseFrontmatter>(
  directory: string,
  fileName: string,
  schema: z.ZodType<T> = baseFrontmatterSchema as any
): Promise<ContentItem<T> | null> {
  const fullPath = path.join(contentDir, directory, fileName)
  if (!fs.existsSync(fullPath)) return null

  const fileContent = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContent)

  const parsedMetadata = schema.safeParse(data)
  if (!parsedMetadata.success) {
    console.error(`Invalid frontmatter for ${fileName}:`, parsedMetadata.error)
    return null
  }

  const slug = fileName.replace(/\.mdx?$/, "")

  return {
    slug,
    source: content,
    metadata: parsedMetadata.data,
  }
}

export async function getAllContent<T = BaseFrontmatter>(
  directory: string,
  schema: z.ZodType<T> = baseFrontmatterSchema as any
): Promise<ContentItem<T>[]> {
  const files = await getFiles(directory)
  const items: ContentItem<T>[] = []

  for (const file of files) {
    const content = await getFileContent<T>(directory, file, schema)
    // Only return non-drafts in production
    if (content) {
      if (process.env.NODE_ENV === "production" && (content.metadata as any).draft) {
        continue
      }
      items.push(content)
    }
  }

  return items.sort((a, b) => {
    const dateA = new Date((a.metadata as any).date).getTime()
    const dateB = new Date((b.metadata as any).date).getTime()
    return dateB - dateA
  })
}
