import { getSanityClient } from "@/sanity/lib/client";
import { sanityImageUrl } from "@/sanity/lib/image";
import {
  allBlogPostsQuery,
  allBlogSlugsQuery,
  blogPostBySlugQuery,
  relatedBlogPostsQuery,
} from "@/sanity/lib/queries";

export type BlogPostPublic = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  dateLabel: string;
  coverImage: string;
  coverImageAlt: string;
  content: string;
};

type SanitySpan = {
  _type?: string;
  text?: string;
  marks?: string[];
};

type SanityBlock = {
  _type?: string;
  style?: string;
  listItem?: "bullet" | "number";
  children?: SanitySpan[];
  asset?: { url?: string };
  alt?: string;
};

type SanityPostResult = Omit<BlogPostPublic, "dateLabel" | "content"> & {
  publishedAt?: string | null;
  body?: SanityBlock[] | null;
};

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1400&h=800&fit=crop&q=80";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateLabel(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function markText(span: SanitySpan) {
  let text = escapeHtml(span.text ?? "");
  const marks = new Set(span.marks ?? []);
  if (marks.has("strong")) text = `<strong>${text}</strong>`;
  if (marks.has("em")) text = `<em>${text}</em>`;
  if (marks.has("underline")) text = `<u>${text}</u>`;
  return text;
}

function portableTextToHtml(blocks?: SanityBlock[] | null) {
  if (!blocks?.length) return "";

  const parts: string[] = [];
  let openList: "ul" | "ol" | null = null;

  const closeList = () => {
    if (openList) {
      parts.push(`</${openList}>`);
      openList = null;
    }
  };

  for (const block of blocks) {
    if (block._type === "image" && block.asset?.url) {
      closeList();
      const alt = escapeHtml(block.alt ?? "");
      const src = sanityImageUrl(block.asset.url, { width: 1200 });
      parts.push(`<img src="${escapeHtml(src)}" alt="${alt}" />`);
      continue;
    }

    if (block._type !== "block") continue;

    const text = (block.children ?? []).map(markText).join("").trim();
    if (!text) continue;

    if (block.listItem === "bullet" || block.listItem === "number") {
      const tag = block.listItem === "number" ? "ol" : "ul";
      if (openList !== tag) {
        closeList();
        openList = tag;
        parts.push(`<${tag}>`);
      }
      parts.push(`<li>${text}</li>`);
      continue;
    }

    closeList();

    const tag =
      block.style === "h2"
        ? "h2"
        : block.style === "h3"
          ? "h3"
          : block.style === "blockquote"
            ? "blockquote"
            : "p";
    parts.push(`<${tag}>${text}</${tag}>`);
  }

  closeList();
  return parts.join("");
}

function mapSanityPost(row: SanityPostResult): BlogPostPublic {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: row.category ?? "Insights",
    dateLabel: formatDateLabel(row.publishedAt),
    coverImage: row.coverImage || DEFAULT_COVER,
    coverImageAlt: row.coverImageAlt || row.title,
    content: portableTextToHtml(row.body),
  };
}

function parsePostDate(post: BlogPostPublic) {
  const parsed = new Date(post.dateLabel);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function sortPostsByDate(posts: BlogPostPublic[]) {
  return [...posts].sort((left, right) => parsePostDate(right) - parsePostDate(left));
}

export async function getAllBlogPosts(): Promise<BlogPostPublic[]> {
  const client = getSanityClient();
  if (!client) return [];

  try {
    const rows = await client.fetch<SanityPostResult[]>(allBlogPostsQuery);
    return sortPostsByDate(rows.map(mapSanityPost));
  } catch (error) {
    console.error("[blog-posts] Sanity fetch failed:", error);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostPublic | null> {
  const client = getSanityClient();
  if (client) {
    try {
      const row = await client.fetch<SanityPostResult | null>(blogPostBySlugQuery, {
        slug,
      });
      if (row) return mapSanityPost(row);
    } catch {
      // Keep local pages usable before Sanity is fully configured.
    }
  }

  return null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const client = getSanityClient();
  if (!client) return [];

  try {
    const rows = await client.fetch<string[]>(allBlogSlugsQuery);
    return rows.filter(Boolean);
  } catch (error) {
    console.error("[blog-posts] Sanity slug fetch failed:", error);
    return [];
  }
}

export async function getRelatedPosts(
  slug: string,
  limit = 3
): Promise<BlogPostPublic[]> {
  const client = getSanityClient();
  if (client) {
    try {
      const rows = await client.fetch<SanityPostResult[]>(relatedBlogPostsQuery, {
        slug,
        limit,
      });
      return sortPostsByDate(rows.map(mapSanityPost))
        .filter((p) => p.slug !== slug)
        .slice(0, limit);
    } catch {
      // Keep local pages usable before Sanity is fully configured.
    }
  }

  return [];
}

export async function getLatestBlogPosts(limit = 4): Promise<BlogPostPublic[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}
