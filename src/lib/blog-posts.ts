import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";

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
    coverImage:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1400&h=800&fit=crop&q=80",
    coverImageAlt: "Professional chef preparing food in a commercial kitchen",
    content: paragraph(
      "UAE event caterers are investing in modular buffet systems, induction holding equipment and durable serveware that travels well between hotel ballrooms, outdoor venues and corporate atriums.",
      "Sustainability is no longer optional for many tenders: compostable platters, refillable beverage stations and energy-efficient combi ovens are appearing on specification sheets across Dubai and Abu Dhabi.",
      "Smart monitoring — from probe thermometers linked to holding cabinets to inventory tags on high-rotation GN pans — helps teams reduce waste during peak Ramadan and year-end seasons.",
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
      "Start with guest flow: registration footprint, coffee-break stations and main-room reset times should drive your equipment list — not the other way around.",
      "Build a hire schedule that separates delivery, strike and overnight holds. Clarify power, water and access lifts with the venue before confirming chafers, bars or live cooking modules.",
      "Assign one equipment captain and one F&B lead. Shared checklists for linen, glassware and backup fuel reduce last-minute courier runs on Sheikh Zayed Road.",
    ),
  },
  {
    slug: "wedding-equipment-rental-guide-uae",
    category: "Wedding",
    dateLabel: "January 18, 2025",
    title: "The Complete Wedding Equipment Rental Guide for UAE Couples",
    excerpt:
      "Tables, chairs, linen, chafing dishes — everything you need for wedding equipment rental.",
    coverImage:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&h=800&fit=crop&q=80",
    coverImageAlt: "Elegant wedding reception table setting",
    content: paragraph(
      "Map your zones early: welcome drinks, main reception, dessert and after-party kits each need distinct furniture, linen and power plans.",
      "Chafing dish counts should follow menu and service style — plated mains need fewer units than buffet resets with multiple proteins.",
      "Book tasting-week deliveries separately from event-day installs so florists, AV and catering crews are not competing for the same service lift.",
    ),
  },
  {
    slug: "hotel-kitchen-equipment-guide",
    category: "Hotel",
    dateLabel: "December 10, 2024",
    title: "Commercial Kitchen Equipment Guide for UAE Hotels",
    excerpt:
      "Selecting the right commercial kitchen equipment for hotel operations in the UAE market.",
    coverImage:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1400&h=800&fit=crop&q=80",
    coverImageAlt: "Hotel kitchen pass with stainless equipment",
    content: paragraph(
      "Prioritise pass stability: combi ovens, holding cabinets and refrigeration that survive breakfast, banquet and in-room dining peaks without constant reconfiguration.",
      "Standardise GN sizes and pan handles across outlets so stewards can redeploy wash-area racks quickly between functions.",
      "Plan hood and floor drainage upgrades early — retrofitting during live service is costly in full hotels.",
    ),
  },
  {
    slug: "government-event-equipment-procurement",
    category: "Government",
    dateLabel: "November 22, 2024",
    title: "Equipment Procurement for Government Events in UAE",
    excerpt:
      "Best practices for procuring event equipment for government and municipality functions.",
    coverImage:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=800&fit=crop&q=80",
    coverImageAlt: "Formal government conference seating",
    content: paragraph(
      "Document traceability: supplier quotes should list brands, capacities and compliance notes for electrical and gas equipment used in public venues.",
      "Allow buffer stock for protocol changes — seating counts and VIP holding areas often shift within 48 hours of national ceremonies.",
      "Use milestone billing tied to delivery photos and signed handover sheets to keep finance and operations aligned.",
    ),
  },
  {
    slug: "ramadan-iftar-catering-setup",
    category: "F&B",
    dateLabel: "October 15, 2024",
    title: "Setting Up an Iftar Catering Operation in Dubai",
    excerpt:
      "Essential equipment and setup tips for Ramadan iftar catering services in UAE.",
    coverImage:
      "https://images.unsplash.com/photo-1606787366853-d3330f0c8b28?w=1400&h=800&fit=crop&q=80",
    coverImageAlt: "Large format buffet setup for evening service",
    content: paragraph(
      "Separate hot and cold chains: soup and rice service peaks differ from pastry and beverage waves — plan holding equipment accordingly.",
      "Queue-friendly buffet geometry reduces congestion; wide aisles and dual-sided chafers speed throughput in tent and ballroom layouts.",
      "Schedule stewarding crews for fast reset windows between Maghrib service blocks at corporate campuses and hotels.",
    ),
  },
];

function mapDbRow(row: typeof blogPosts.$inferSelect): BlogPostPublic {
  const cover = row.coverImage ?? row.images?.[0] ?? DEFAULT_COVER;
  const dateLabel = row.updatedAt
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(row.updatedAt)
    : "";

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: "Insights",
    dateLabel,
    coverImage: cover,
    coverImageAlt: row.title,
    content: row.content,
  };
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostPublic | null> {
  const db = getDb();
  if (db) {
    const [row] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    if (row?.published) return mapDbRow(row);
  }

  return STATIC_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const slugs = new Set(STATIC_BLOG_POSTS.map((p) => p.slug));

  const db = getDb();
  if (db) {
    const rows = await db
      .select({ slug: blogPosts.slug })
      .from(blogPosts)
      .where(eq(blogPosts.published, true));
    rows.forEach((r) => slugs.add(r.slug));
  }

  return [...slugs];
}

export function getRelatedPosts(
  slug: string,
  limit = 3,
): BlogPostPublic[] {
  return STATIC_BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, limit);
}
