import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  content: string;
}

const allBlogModules = import.meta.glob<string>("../content/blog/*.md?raw", {
  eager: true,
  import: "default",
});

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  for (const [path, module] of Object.entries(allBlogModules)) {
    const slug = path.split("/").pop()?.replace(".md", "") || "";
    const contentString = typeof module === "string" ? module : module.default;
    const { data, content } = matter(contentString);

    posts.push({
      slug,
      title: data.title || slug,
      date: data.date || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      content,
    });
  }

  return posts.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const found = Object.entries(allBlogModules).find(([path]) => {
    return path.includes(`content/blog/${slug}.md`);
  });

  if (!found) {
    return null;
  }

  const [, module] = found;

  const contentString = typeof module === "string" ? module : module.default;
  const { data, content } = matter(contentString);

  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    content,
  };
}
