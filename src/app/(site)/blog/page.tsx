import BlogIndexClient from "./BlogIndexClient";
import { getAllBlogPosts } from "@/lib/blog-posts";

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  return <BlogIndexClient posts={posts} />;
}
