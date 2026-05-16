"use client";

import AdminGalleryUpload, {
  type AdminGalleryUploadHandle,
} from "@/components/admin/AdminGalleryUpload";
import { AdminBlockingOverlay, AdminSuccessModal } from "@/components/admin/AdminFormOverlays";
import RichText, { isRichTextBodyEmpty } from "@/app/admin/ui/Richtext";
import { ADMIN_PURPLE, admin } from "@/components/admin/adminTheme";
import Link from "next/link";
import { FormEvent, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function NewBlogPage() {
  const router = useRouter();
  const galleryRef = useRef<AdminGalleryUploadHandle>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [blockingOpen, setBlockingOpen] = useState(false);
  const [blockingTitle, setBlockingTitle] = useState("");
  const [blockingSubtitle, setBlockingSubtitle] = useState("");
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const dismissSuccessStayHere = useCallback(() => {
    setCreatedId(null);
    setFormKey((k) => k + 1);
    setError("");
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const content = String(fd.get("content") || "");
    if (isRichTextBodyEmpty(content)) {
      setError("Please add body content for the post.");
      return;
    }

    setBlockingOpen(true);
    setBlockingTitle("Uploading images…");
    setBlockingSubtitle("Sending files to CaterTech storage. Please wait.");
    const commit = await galleryRef.current!.commitPendingUploads();
    if (!commit.ok) {
      setBlockingOpen(false);
      setError(commit.message);
      return;
    }

    setBlockingTitle("Creating post…");
    setBlockingSubtitle("Saving your article.");
    const payload = {
      title: String(fd.get("title") || ""),
      excerpt: String(fd.get("excerpt") || "") || undefined,
      content,
      images: commit.urls,
      published: fd.get("published") === "on",
    };
    setLoading(true);
    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    setBlockingOpen(false);
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    const row = (await res.json()) as { id: string };
    setCreatedId(row.id);
  }

  function continueAfterSuccess() {
    const id = createdId;
    setCreatedId(null);
    if (id) router.push(`/admin/blogs/${id}`);
  }

  return (
    <>
      <AdminBlockingOverlay
        open={blockingOpen}
        title={blockingTitle}
        subtitle={blockingSubtitle}
      />
      <AdminSuccessModal
        open={Boolean(createdId)}
        title="Post created"
        message="Images were uploaded (if any) and your draft or published post was saved."
        confirmLabel="Open post"
        onConfirm={() => continueAfterSuccess()}
        onDismiss={dismissSuccessStayHere}
      />
    <div className={`${admin.page} ${admin.formCenterPage}`}>
      <div className={admin.formCenterInnerWide}>
        <div className="mb-8 text-center md:text-left">
          <Link
            href="/admin/blogs"
            className={`${admin.link} inline-flex text-xs font-semibold uppercase tracking-wide`}
          >
            ← Back to blog
          </Link>
          <h1 className={`${admin.h1} mt-4`}>New blog post</h1>
          <p className={`${admin.muted} mt-2 max-w-xl mx-auto md:mx-0`}>
            Compose your article. You can publish immediately or save as draft.
          </p>
        </div>

        <form key={formKey} onSubmit={onSubmit} className={admin.formModernCard}>
          <div>
            <p className={admin.formSectionTitle}>Post overview</p>
            <p className={admin.formSectionDesc}>Title and images for listings and social previews.</p>
            <div className="space-y-4 md:space-y-5">
              <div>
                <label htmlFor="blog-title" className={admin.labelModern}>
                  Title <span className="text-red-500 font-normal">*</span>
                </label>
                <input
                  id="blog-title"
                  name="title"
                  required
                  autoComplete="off"
                  placeholder="Headline readers will see first"
                  className={admin.fieldModern}
                />
              </div>
              <div>
                <p className={admin.labelModern}>Images</p>
                <AdminGalleryUpload
                  ref={galleryRef}
                  id="blog-gallery-file"
                  hint="First preview becomes the saved cover once you publish. Images upload only when you click Create."
                />
              </div>
            </div>
          </div>

          <div className={admin.formDivider} />

          <div>
            <p className={admin.formSectionTitle}>Summary</p>
            <p className={admin.formSectionDesc}>A short teaser for cards and search results.</p>
            <label htmlFor="blog-excerpt" className="sr-only">
              Excerpt
            </label>
            <textarea
              id="blog-excerpt"
              name="excerpt"
              rows={3}
              placeholder="One or two sentences…"
              className={`${admin.fieldModern} min-h-[96px] resize-y`}
            />
          </div>

          <div className={admin.formDivider} />

          <div>
            <p className={admin.formSectionTitle}>Body</p>
            <p className={admin.formSectionDesc}>
              Use the editor for headings, lists, links, and embedded media. Saves as HTML.
            </p>
            <RichText name="content" defaultHtml="" embed editorMinHeight={320} />
          </div>

          <div className={admin.formDivider} />

          <div>
            <p className={admin.formSectionTitle}>Publishing</p>
            <p className={admin.formSectionDesc}>Draft stays private until you enable this.</p>
            <div className={admin.togglePanel}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="published" className={admin.checkbox} />
                <span className="text-sm">
                  <span className="font-medium text-[#1a1a1a] block">Published</span>
                  <span className={`${admin.hint} mt-0`}>Visible on the public blog when checked.</span>
                </span>
              </label>
            </div>
          </div>

          {error ? (
            <p className={`${admin.error} mt-6 rounded-xl border border-red-100 bg-red-50/80 px-4 py-3`}>
              {error}
            </p>
          ) : null}

          <div className={admin.formFooter}>
            <Link href="/admin/blogs" className={`${admin.secondaryBtn} w-full sm:w-auto justify-center`}>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || blockingOpen}
              className={`${admin.primaryBtn} w-full sm:w-auto min-w-[160px] justify-center shadow-[0_8px_24px_rgba(75,38,164,0.25)]`}
              style={{ backgroundColor: ADMIN_PURPLE }}
            >
              {loading ? "Creating…" : "Create post"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
