import Image, { type ImageProps } from "next/image";
import { isSanityCdnUrl, sanityImageUrl } from "@/sanity/lib/image";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  sanityWidth?: number;
  sanityHeight?: number;
};

/** Sanity CDN images skip Next.js optimizer (avoids dev timeouts) and use CDN transforms instead. */
export default function BlogCoverImage({
  src,
  alt,
  sanityWidth = 900,
  sanityHeight,
  ...props
}: Props) {
  const fromSanity = isSanityCdnUrl(src);
  const resolvedSrc = fromSanity
    ? sanityImageUrl(src, { width: sanityWidth, height: sanityHeight })
    : src;

  return <Image src={resolvedSrc} alt={alt} unoptimized={fromSanity} {...props} />;
}
