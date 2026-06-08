import { getSanityClient } from "@/sanity/lib/client";
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
    slug: "how-to-plan-a-corporate-event-dubai",
    category: "Corporate",
    dateLabel: "March 2, 2025",
    title: "How to Plan a Flawless Corporate Event in Dubai",
    excerpt:
      "A practical guide to venue selection, equipment rental, and coordination for corporate events.",
    coverImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1400&h=800&fit=crop&q=80",
    coverImageAlt: "Corporate conference and event setup",
    content: paragraph(
      "Start with guest flow: registration footprint, coffee-break stations and main-room reset times should drive your equipment list, not the other way around.",
      "Build a hire schedule that separates delivery, strike and overnight holds. Clarify power, water and access lifts with the venue before confirming chafers, bars or live cooking modules.",
      "Assign one equipment captain and one F&B lead. Shared checklists for linen, glassware and backup fuel reduce last-minute courier runs on Sheikh Zayed Road."
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

  return blocks
    .map((block) => {
      if (block._type === "image" && block.asset?.url) {
        const alt = escapeHtml(block.alt ?? "");
        return `<img src="${escapeHtml(block.asset.url)}" alt="${alt}" />`;
      }

      if (block._type !== "block") return "";

      const text = (block.children ?? []).map(markText).join("").trim();
      if (!text) return "";

      if (block.listItem === "bullet") return `<ul><li>${text}</li></ul>`;
      if (block.listItem === "number") return `<ol><li>${text}</li></ol>`;

      const tag =
        block.style === "h2"
          ? "h2"
          : block.style === "h3"
            ? "h3"
            : block.style === "blockquote"
              ? "blockquote"
              : "p";
      return `<${tag}>${text}</${tag}>`;
    })
    .filter(Boolean)
    .join("");
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

function mergeWithStaticPosts(posts: BlogPostPublic[]) {
  const seenSlugs = new Set(posts.map((post) => post.slug));
  return [
    ...posts,
    ...STATIC_BLOG_POSTS.filter((post) => !seenSlugs.has(post.slug)),
  ];
}

export async function getAllBlogPosts(): Promise<BlogPostPublic[]> {
  const client = getSanityClient();
  if (!client) return STATIC_BLOG_POSTS;

  try {
    const rows = await client.fetch<SanityPostResult[]>(allBlogPostsQuery);
    return mergeWithStaticPosts(rows.map(mapSanityPost));
  } catch {
    return STATIC_BLOG_POSTS;
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

  return STATIC_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const client = getSanityClient();
  if (client) {
    try {
      const rows = await client.fetch<string[]>(allBlogSlugsQuery);
      return rows.filter(Boolean);
    } catch {
      // Keep local pages usable before Sanity is fully configured.
    }
  }

  return STATIC_BLOG_POSTS.map((p) => p.slug);
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

  return STATIC_BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, limit);
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPostPublic[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}
