"use client";

import RichText, { isRichTextBodyEmpty } from "@/app/admin/ui/Richtext";
import AdminGalleryUpload, {
  type AdminGalleryUploadHandle,
} from "@/components/admin/AdminGalleryUpload";
import { AdminBlockingOverlay, AdminSuccessModal } from "@/components/admin/AdminFormOverlays";
import { AdminTypedDeleteDialog } from "@/components/admin/AdminTypedDeleteDialog";
import { ADMIN_PURPLE, admin, adminCardShadow } from "@/components/admin/adminTheme";
import { blogPosts } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

type Row = InferSelectModel<typeof blogPosts>;

type Props = {
  post: Row;
  variant?: "page" | "modal";
  /** After delete from API success */
  onDeleted?: () => void;
};

export default function BlogEditClient({ post, variant = "page", onDeleted }: Props) {
  const router = useRouter();
  const galleryRef = useRef<AdminGalleryUploadHandle>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [blockingOpen, setBlockingOpen] = useState(false);
  const [blockingTitle, setBlockingTitle] = useState("");
  const [blockingSubtitle, setBlockingSubtitle] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [typedDeleteOpen, setTypedDeleteOpen] = useState(false);

  const isModal = variant === "modal";
  const galleryInitial = post.images?.length
    ? [...post.images]
    : post.coverImage
      ? [post.coverImage]
      : [];

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
    setBlockingSubtitle("Sending any new files to CaterTech storage.");
    const commit = await galleryRef.current!.commitPendingUploads();
    if (!commit.ok) {
      setBlockingOpen(false);
      setError(commit.message);
      return;
    }

    setBlockingTitle("Saving post…");
    setBlockingSubtitle("Updating your article.");
    const payload = {
      title: String(fd.get("title") || ""),
      excerpt: String(fd.get("excerpt") || "") || null,
      content,
      images: commit.urls,
      published: fd.get("published") === "on",
    };
    setLoading(true);
    const res = await fetch(`/api/admin/blogs/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    setBlockingOpen(false);

    if (!res.ok) {
      setError((await res.text()) || "Save failed");
      return;
    }
    void router.refresh();
    setShowSaved(true);
  }

  async function runDelete() {
    const res = await fetch(`/api/admin/blogs/${post.id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    setTypedDeleteOpen(false);
    void Promise.resolve().then(() => {
      if (onDeleted) onDeleted();
      else router.push("/admin/blogs");
    });
  }

  const formSurface = isModal ? admin.formModernCard : admin.formCard;
  const formStyle = isModal ? undefined : adminCardShadow;

  return (
    <>
      <AdminBlockingOverlay
        open={blockingOpen}
        title={blockingTitle}
        subtitle={blockingSubtitle}
      />
      <AdminSuccessModal
        open={showSaved}
        title="Saved"
        message="Your post and images were updated successfully."
        confirmLabel="OK"
        onConfirm={() => setShowSaved(false)}
        onDismiss={() => setShowSaved(false)}
      />
      <AdminTypedDeleteDialog
        open={typedDeleteOpen}
        noun="post"
        highlight={post.title}
        onCancel={() => setTypedDeleteOpen(false)}
        onConfirm={runDelete}
      />

      <div className={isModal ? "space-y-1" : admin.page}>
        {!isModal ? (
          <div className="mb-6">
            <Link href="/admin/blogs" className={`${admin.link} text-xs font-semibold uppercase tracking-wide`}>
              ← Back to blog
            </Link>
            <h1 className={`${admin.h1} mt-4`}>Edit post</h1>
            <p className={`${admin.muted} mt-1`}>Update copy, imagery, and publish state.</p>
          </div>
        ) : null}

        <form onSubmit={(e) => void onSubmit(e)} className={formSurface} style={formStyle}>
          <div>
            <label className={admin.labelModern}>Title</label>
            <input name="title" defaultValue={post.title} required className={admin.fieldModern} />
          </div>
          <div>
            <p className={admin.labelModern}>Images</p>
            <AdminGalleryUpload
              key={post.id}
              ref={galleryRef}
              id={`blog-gallery-${post.id}`}
              defaultUrls={galleryInitial}
              hint="First image is saved as cover/OG. New files upload only when you click Save."
            />
          </div>
          <div>
            <label className={admin.labelModern}>Excerpt</label>
            <textarea name="excerpt" rows={3} defaultValue={post.excerpt ?? ""} className={admin.fieldModern} />
          </div>
          <div>
            <label className={admin.labelModern}>Content</label>
            <RichText key={post.id} name="content" defaultHtml={post.content} embed editorMinHeight={320} />
          </div>
          <label className={`${admin.checkRow} mt-4 cursor-pointer items-center gap-2`}>
            <input type="checkbox" name="published" defaultChecked={post.published} className={admin.checkbox} />
            Published
          </label>

          {error ? <p className={`${admin.error} mt-4`}>{error}</p> : null}

          <div className="flex flex-wrap gap-3 pt-5">
            <button
              type="submit"
              disabled={loading || blockingOpen}
              className={`${admin.primaryBtn} ${isModal ? "text-xs py-3" : ""}`}
              style={{ backgroundColor: ADMIN_PURPLE }}
            >
              {loading ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setTypedDeleteOpen(true)}
              className={`${admin.dangerBtn} ${isModal ? "text-xs py-3" : ""}`}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
