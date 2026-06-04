import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostArticle from "@/components/sections/BlogPostArticle";
import {
  getAllBlogSlugs,
  getBlogPostBySlug,
  getRelatedPosts,
} from "@/lib/blog-posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Blog | CaterTech" };
  return {
    title: `${post.title} | CaterTech Blog`,
    description: post.excerpt || undefined,
  };
}

export default async function PublicBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  return <BlogPostArticle post={post} related={related} />;
}
