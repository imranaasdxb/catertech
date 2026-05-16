"use client";

import AdminGalleryUpload, {
  type AdminGalleryUploadHandle,
} from "@/components/admin/AdminGalleryUpload";
import { AdminBlockingOverlay, AdminSuccessModal } from "@/components/admin/AdminFormOverlays";
import RichText from "@/app/admin/ui/Richtext";
import { ProductCategorySelects } from "@/components/admin/ProductCategorySelects";
import { ADMIN_PURPLE, admin } from "@/components/admin/adminTheme";
import Link from "next/link";
import { FormEvent, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
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

    setBlockingOpen(true);
    setBlockingTitle("Uploading images…");
    setBlockingSubtitle("Sending files to CaterTech storage. Please wait.");
    const commit = await galleryRef.current!.commitPendingUploads();
    if (!commit.ok) {
      setBlockingOpen(false);
      setError(commit.message);
      return;
    }

    setBlockingTitle("Creating product…");
    setBlockingSubtitle("Saving your catalogue entry.");
    const payload = {
      title: String(fd.get("title") || ""),
      description: String(fd.get("description") || "") || undefined,
      categoryId: (() => {
        const raw = fd.get("categoryId");
        const s = typeof raw === "string" ? raw.trim() : "";
        return s === "" ? null : s;
      })(),
      subCategoryId: (() => {
        const raw = fd.get("subCategoryId");
        const s = typeof raw === "string" ? raw.trim() : "";
        return s === "" ? null : s;
      })(),
      images: commit.urls,
      published: fd.get("published") === "on",
      isFeatured: fd.get("isFeatured") === "on",
      isAvailable: fd.get("isAvailable") !== "off",
    };

    setLoading(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    setBlockingOpen(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: unknown };
      setError(JSON.stringify(data.error ?? "Save failed"));
      return;
    }
    const row = (await res.json()) as { id: string };
    setCreatedId(row.id);
  }

  function continueAfterSuccess() {
    const id = createdId;
    setCreatedId(null);
    if (id) router.push(`/admin/products/${id}`);
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
        title="Product created"
        message="Images are on storage and your product was saved. You can edit it anytime."
        confirmLabel="Open product"
        onConfirm={() => continueAfterSuccess()}
        onDismiss={dismissSuccessStayHere}
      />
    <div className={`${admin.page} ${admin.formCenterPage}`}>
      <div className={admin.formCenterInner}>
        <div className="mb-8 text-center md:text-left">
          <Link
            href="/admin/products"
            className={`${admin.link} inline-flex text-xs font-semibold uppercase tracking-wide`}
          >
            ← Back to products
          </Link>
          <h1 className={`${admin.h1} mt-4`}>New product</h1>
          <p className={`${admin.muted} mt-2 max-w-lg mx-auto md:mx-0`}>
            Add a catalogue item. Changes apply when you create the product.
          </p>
        </div>

        <form key={formKey} onSubmit={onSubmit} className={admin.formModernCard}>
          <div>
            <p className={admin.formSectionTitle}>Basic details</p>
            <p className={admin.formSectionDesc}>Name and describe what customers will see.</p>
            <div>
              <label htmlFor="product-title" className={admin.labelModern}>
                Title <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                id="product-title"
                name="title"
                required
                autoComplete="off"
                placeholder="e.g. Commercial gas range 6-burner"
                className={admin.fieldModern}
              />
            </div>
          </div>

          <div className={admin.formDivider} />

          <div>
            <p className={admin.formSectionTitle}>Merchandising</p>
            <p className={admin.formSectionDesc}>Optional category grouping for the storefront and product form.</p>
            <div className="grid grid-cols-1 gap-4 md:gap-5">
              <div>
                <ProductCategorySelects
                  hint='Add options under “Category master” on the products list (next to “New product”).'
                />
              </div>
            </div>
          </div>

          <div className={admin.formDivider} />

          <div>
            <p className={admin.formSectionTitle}>Description</p>
            <p className={admin.formSectionDesc}>
              Rich text: formatting, lists, and embedded images or video (stored as HTML).
            </p>
            <RichText name="description" defaultHtml="" embed editorMinHeight={220} />
          </div>

          <div className={admin.formDivider} />

          <div>
            <p className={admin.formSectionTitle}>Gallery</p>
            <p className={admin.formSectionDesc}>
              Add previews here; first image becomes primary after you click Create. Files upload to Cloudflare R2 when you save this form.
            </p>
            <AdminGalleryUpload ref={galleryRef} id="product-gallery-file" />
          </div>

          <div className={admin.formDivider} />

          <div>
            <p className={admin.formSectionTitle}>Visibility</p>
            <p className={admin.formSectionDesc}>Control how this product appears in the storefront.</p>
            <div className={admin.togglePanel}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="published" className={admin.checkbox} />
                <span className="text-sm">
                  <span className="font-medium text-[#1a1a1a] block">Published</span>
                  <span className={`${admin.hint} mt-0`}>Live on the site when enabled.</span>
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isFeatured" className={admin.checkbox} />
                <span className="text-sm">
                  <span className="font-medium text-[#1a1a1a] block">Featured</span>
                  <span className={`${admin.hint} mt-0`}>Highlight in featured sections.</span>
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isAvailable" defaultChecked className={admin.checkbox} />
                <span className="text-sm">
                  <span className="font-medium text-[#1a1a1a] block">Available</span>
                  <span className={`${admin.hint} mt-0`}>Allow add-to-cart flows where applicable.</span>
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
            <Link href="/admin/products" className={`${admin.secondaryBtn} w-full sm:w-auto justify-center`}>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || blockingOpen}
              className={`${admin.primaryBtn} w-full sm:w-auto min-w-[160px] justify-center shadow-[0_8px_24px_rgba(75,38,164,0.25)]`}
              style={{ backgroundColor: ADMIN_PURPLE }}
            >
              {loading ? "Creating…" : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
