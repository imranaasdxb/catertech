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

const EXCLUDED_BLOG_SLUGS = new Set(["how-to-plan-a-corporate-event-dubai"]);

function paragraph(...texts: string[]) {
  return texts.map((t) => `<p>${t}</p>`).join("");
}

export const STATIC_BLOG_POSTS: BlogPostPublic[] = [
  {
    slug: "top-catering-equipment-trends-2025",
    category: "F&B",
    dateLabel: "April 12, 2025",
    title: "Top Catering Equipment Trends Shaping UAE Events in 2025",
    excerpt:
      "From sustainable serving ware to smart kitchen appliances, what's changing in UAE's catering space.",
    coverImage: DEFAULT_COVER,
    coverImageAlt: "Professional chef preparing food in a commercial kitchen",
    content: paragraph(
      "UAE event caterers are investing in modular buffet systems, induction holding equipment and durable serveware that travels well between hotel ballrooms, outdoor venues and corporate atriums.",
      "Sustainability is no longer optional for many tenders: compostable platters, refillable beverage stations and energy-efficient combi ovens are appearing on specification sheets across Dubai and Abu Dhabi.",
      "Smart monitoring from probe thermometers linked to holding cabinets to inventory tags on high-rotation GN pans helps teams reduce waste during peak Ramadan and year-end seasons."
    ),
  },
  {
    slug: "wedding-equipment-rental-guide-uae",
    category: "Wedding",
    dateLabel: "January 18, 2025",
    title: "The Complete Wedding Equipment Rental Guide for UAE Couples",
    excerpt:
      "Tables, chairs, linen, chafing dishes - everything you need for wedding equipment rental.",
    coverImage:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&h=800&fit=crop&q=80",
    coverImageAlt: "Elegant wedding reception table setting",
    content: paragraph(
      "Map your zones early: welcome drinks, main reception, dessert and after-party kits each need distinct furniture, linen and power plans.",
      "Chafing dish counts should follow menu and service style; plated mains need fewer units than buffet resets with multiple proteins.",
      "Book tasting-week deliveries separately from event-day installs so florists, AV and catering crews are not competing for the same service lift."
    ),
  },
];

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

function filterExcludedPosts(posts: BlogPostPublic[]) {
  return posts.filter((post) => !EXCLUDED_BLOG_SLUGS.has(post.slug));
}

function mergeWithStaticPosts(posts: BlogPostPublic[]) {
  const seenSlugs = new Set(posts.map((post) => post.slug));
  return filterExcludedPosts(
    sortPostsByDate([
      ...posts,
      ...STATIC_BLOG_POSTS.filter((post) => !seenSlugs.has(post.slug)),
    ]),
  );
}

function mergeSlugs(primary: string[], fallback: string[]) {
  const seen = new Set(primary);
  return [...primary, ...fallback.filter((slug) => slug && !seen.has(slug))];
}

export async function getAllBlogPosts(): Promise<BlogPostPublic[]> {
  const client = getSanityClient();
  if (!client) return filterExcludedPosts(sortPostsByDate([...STATIC_BLOG_POSTS]));

  try {
    const rows = await client.fetch<SanityPostResult[]>(allBlogPostsQuery);
    return mergeWithStaticPosts(rows.map(mapSanityPost));
  } catch (error) {
    console.error("[blog-posts] Sanity fetch failed, using static posts:", error);
    return filterExcludedPosts(sortPostsByDate([...STATIC_BLOG_POSTS]));
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostPublic | null> {
  if (EXCLUDED_BLOG_SLUGS.has(slug)) return null;

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

  return STATIC_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const staticSlugs = STATIC_BLOG_POSTS.map((post) => post.slug);
  const client = getSanityClient();
  if (!client) return staticSlugs;

  try {
    const rows = await client.fetch<string[]>(allBlogSlugsQuery);
    return mergeSlugs(rows.filter(Boolean), staticSlugs).filter(
      (slug) => !EXCLUDED_BLOG_SLUGS.has(slug),
    );
  } catch (error) {
    console.error("[blog-posts] Sanity slug fetch failed, using static slugs:", error);
    return staticSlugs;
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
      return mergeWithStaticPosts(rows.map(mapSanityPost))
        .filter((p) => p.slug !== slug)
        .slice(0, limit);
    } catch {
      // Keep local pages usable before Sanity is fully configured.
    }
  }

  return filterExcludedPosts(STATIC_BLOG_POSTS.filter((p) => p.slug !== slug)).slice(
    0,
    limit,
  );
}

export async function getLatestBlogPosts(limit = 4): Promise<BlogPostPublic[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}
