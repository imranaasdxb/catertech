import { groq } from "next-sanity";

const postFields = groq`
  "slug": slug.current,
  title,
  excerpt,
  "category": coalesce(category, "Insights"),
  "publishedAt": publishedAt,
  "coverImage": coalesce(coverImage.asset->url, "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1400&h=800&fit=crop&q=80"),
  "coverImageAlt": coalesce(coverImage.alt, title),
  body[]{
    ...,
    asset->
  }
`;

export const allBlogPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
  | order(publishedAt desc, _updatedAt desc) {
    ${postFields}
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    ${postFields}
  }
`;

export const allBlogSlugsQuery = groq`
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))].slug.current
`;

export const relatedBlogPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && slug.current != $slug && !(_id in path("drafts.**"))]
  | order(publishedAt desc, _updatedAt desc)[0...$limit] {
    ${postFields}
  }
`;
