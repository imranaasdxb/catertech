"use client";

import RichText from "@/app/admin/ui/Richtext";
import AdminGalleryUpload, {
  type AdminGalleryUploadHandle,
} from "@/components/admin/AdminGalleryUpload";
import { AdminBlockingOverlay, AdminSuccessModal } from "@/components/admin/AdminFormOverlays";
import { AdminTypedDeleteDialog } from "@/components/admin/AdminTypedDeleteDialog";
import {
  parseProductAttributes,
  ProductTemplateFields,
} from "@/components/admin/ProductTemplateFields";
import {
  notifyProductTaxonomyChanged,
  ProductCategorySelects,
} from "@/components/admin/ProductCategorySelects";
import { ADMIN_PURPLE, admin, adminCardShadow } from "@/components/admin/adminTheme";
import { products } from "@/db/schema";
import type { TemplateFieldDef } from "@/lib/category-template";
import type { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

type Row = InferSelectModel<typeof products>;

type Props = {
  product: Row;
  variant?: "page" | "modal";
  onDeleted?: () => void;
};

export default function ProductEditClient({
  product,
  variant = "page",
  onDeleted,
}: Props) {
  const router = useRouter();
  const galleryRef = useRef<AdminGalleryUploadHandle>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [blockingOpen, setBlockingOpen] = useState(false);
  const [blockingTitle, setBlockingTitle] = useState("");
  const [blockingSubtitle, setBlockingSubtitle] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [typedDeleteOpen, setTypedDeleteOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(product.categoryId ?? "");
  const [subCategoryId, setSubCategoryId] = useState(product.subCategoryId ?? "");
  const [templateFields, setTemplateFields] = useState<TemplateFieldDef[]>([]);
  const [publishIntent, setPublishIntent] = useState<"draft" | "live">(
    product.published ? "live" : "draft"
  );

  const isModal = variant === "modal";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);

    setBlockingOpen(true);
    setBlockingTitle("Uploading images…");
    setBlockingSubtitle("Sending any new files to CaterTech storage.");
    const commit = await galleryRef.current!.commitPendingUploads();
    if (!commit.ok) {
      setBlockingOpen(false);
      setError(commit.message);
      return;
    }

    setBlockingTitle("Saving product…");
    setBlockingSubtitle("Updating your catalogue entry.");
    const payload = {
      title: String(fd.get("title") || ""),
      description: String(fd.get("description") || "") || null,
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
      published: publishIntent === "live",
      isFeatured: fd.get("isFeatured") === "on",
      isAvailable: fd.get("isAvailable") === "on",
      attributes: parseProductAttributes(fd, templateFields),
    };

    setLoading(true);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
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
    notifyProductTaxonomyChanged();
    void router.refresh();
    setShowSaved(true);
  }

  async function runDelete() {
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    notifyProductTaxonomyChanged();
    setTypedDeleteOpen(false);
    void Promise.resolve().then(() => {
      if (onDeleted) onDeleted();
      else router.push("/admin/products");
    });
  }

  const formSurface = isModal ? admin.formModernCard : admin.formCardNarrow;
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
        message="Your product and gallery were updated successfully."
        confirmLabel="OK"
        onConfirm={() => setShowSaved(false)}
        onDismiss={() => setShowSaved(false)}
      />
      <AdminTypedDeleteDialog
        open={typedDeleteOpen}
        noun="product"
        highlight={product.title}
        onCancel={() => setTypedDeleteOpen(false)}
        onConfirm={runDelete}
      />

      <div className={isModal ? "space-y-1" : admin.page}>
        {!isModal ? (
          <div className="mb-6">
            <Link
              href="/admin/products"
              className={`${admin.link} text-xs font-semibold uppercase tracking-wide`}
            >
              ← Back to products
            </Link>
            <h1 className={`${admin.h1} mt-4`}>Edit product</h1>
            <p className={`${admin.muted} mt-1`}>Update catalogue details and visibility.</p>
          </div>
        ) : null}

        <form onSubmit={(e) => void onSubmit(e)} className={formSurface} style={formStyle}>
          <div>
            <label className={admin.labelModern}>Title *</label>
            <input name="title" required defaultValue={product.title} className={admin.fieldModern} />
          </div>
          <div>
            <ProductCategorySelects
              initialCategoryId={product.categoryId}
              initialSubCategoryId={product.subCategoryId}
              hint='Update the master list from the products screen (“Category master”). Sub-categories are optional.'
              onSelectionChange={(sel) => {
                setCategoryId(sel.categoryId);
                setSubCategoryId(sel.subCategoryId);
              }}
            />
          </div>

          {categoryId ? (
            <ProductTemplateFields
              key={categoryId}
              categoryId={categoryId}
              subCategoryId={subCategoryId}
              initialAttributes={(product.attributes ?? {}) as Record<string, string | { value: string; unit?: string }>}
              onFieldsLoaded={setTemplateFields}
            />
          ) : null}

          <div>
            <label className={admin.labelModern}>Description</label>
            <RichText
              key={product.id}
              name="description"
              defaultHtml={product.description ?? ""}
              embed
              editorMinHeight={220}
            />
          </div>
          <div>
            <label className={admin.labelModern}>Gallery images</label>
            <AdminGalleryUpload
              key={product.id}
              ref={galleryRef}
              id={`product-gallery-${product.id}`}
              defaultUrls={product.images}
            />
          </div>
          <div className={`${admin.checkRow} mt-4 flex-wrap`}>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} className={admin.checkbox} />
              Featured
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="isAvailable"
                defaultChecked={product.isAvailable}
                className={admin.checkbox}
              />
              Available
            </label>
          </div>

          {error ? <p className={`${admin.error} mt-4`}>{error}</p> : null}

          <div className="flex flex-wrap gap-3 pt-5">
            <button
              type="submit"
              disabled={loading || blockingOpen}
              onClick={() => setPublishIntent("draft")}
              className={`${admin.secondaryBtn} ${isModal ? "text-xs py-3" : ""}`}
            >
              {loading && publishIntent === "draft" ? "Saving…" : "Save as draft"}
            </button>
            <button
              type="submit"
              disabled={loading || blockingOpen}
              onClick={() => setPublishIntent("live")}
              className={`${admin.primaryBtn} ${isModal ? "text-xs py-3" : ""}`}
              style={{ backgroundColor: ADMIN_PURPLE }}
            >
              {loading && publishIntent === "live" ? "Publishing…" : "Publish live"}
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
