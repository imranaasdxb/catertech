type Props = {
  excerpt?: string;
  content: string;
};

const proseClassName = [
  "blog-article-prose",
  "text-[17px] leading-[1.85] text-[#3d3d45]",
  "[&_p]:mb-6 [&_p:last-child]:mb-0",
  "[&_p+p]:mt-0",
  "[&_strong]:font-semibold [&_strong]:text-ink",
  "[&_em]:italic",
  "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-primary/30 hover:[&_a]:decoration-primary",
  "[&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:text-[1.65rem] [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-ink",
  "[&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:text-ink",
  "[&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/25 [&_blockquote]:bg-[#faf9f7] [&_blockquote]:py-4 [&_blockquote]:pl-5 [&_blockquote]:pr-4 [&_blockquote]:text-[1.05rem] [&_blockquote]:italic [&_blockquote]:text-[#2a2a32]",
  "[&_ul]:my-7 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-6",
  "[&_ol]:my-7 [&_ol]:list-decimal [&_ol]:space-y-2.5 [&_ol]:pl-6",
  "[&_li]:pl-1 [&_li]:leading-[1.75]",
  "[&_img]:my-10 [&_img]:w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-border/80 [&_img]:shadow-[0_12px_40px_rgba(15,15,15,0.06)]",
  "[&_hr]:my-12 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border",
].join(" ");

export default function BlogArticleBody({ excerpt, content }: Props) {
  const hasContent = Boolean(content?.trim());

  return (
    <div className="max-w-[42rem]">
      {excerpt?.trim() ? (
        <p className="mb-10 border-l-[3px] border-primary/30 pl-5 text-[1.125rem] font-medium leading-[1.75] text-[#2a2a32] md:text-[1.25rem] md:leading-[1.72]">
          {excerpt}
        </p>
      ) : null}

      {hasContent ? (
        <div className={proseClassName} dangerouslySetInnerHTML={{ __html: content }} />
      ) : null}
    </div>
  );
}
