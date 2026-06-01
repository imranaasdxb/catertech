"use client";

import RichText from "@/app/admin/ui/Richtext";
import AdminGalleryUpload, {
  type AdminGalleryUploadHandle,
} from "@/components/admin/AdminGalleryUpload";
import { AdminBlockingOverlay, AdminSuccessModal } from "@/components/admin/AdminFormOverlays";
import {
  parseProductAttributes,
  ProductTemplateFields,
} from "@/components/admin/ProductTemplateFields";
import { ProductCategorySelects } from "@/components/admin/ProductCategorySelects";
import { ADMIN_PURPLE, admin } from "@/components/admin/adminTheme";
import type { TemplateFieldDef } from "@/lib/category-template";
import { ArrowLeft, ImagePlus, Save, Tag, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useRef, useState } from "react";

type TaxonomySelection = {
  categoryId: string;
  subCategoryId: string;
  categoryName: string;
  subCategoryName: string;
  hasSubcategories: boolean;
  subCategoryRequired: boolean;
};

const emptyTaxonomySelection: TaxonomySelection = {
  categoryId: "",
  subCategoryId: "",
  categoryName: "",
  subCategoryName: "",
  hasSubcategories: false,
  subCategoryRequired: false,
};

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
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<TaxonomySelection>(
    emptyTaxonomySelection
  );
  const [templateFields, setTemplateFields] = useState<TemplateFieldDef[]>([]);
  const [publishIntent, setPublishIntent] = useState<"draft" | "live">("draft");

  const canShowProductFields = Boolean(selectedTaxonomy.categoryId);

  const resetCreateForm = useCallback(() => {
    setFormKey((k) => k + 1);
    setError("");
    setSelectedTaxonomy(emptyTaxonomySelection);
    setTemplateFields([]);
    setPublishIntent("draft");
  }, []);

  const dismissSuccessModal = useCallback(() => {
    setCreatedId(null);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);

    setBlockingOpen(true);
    setBlockingTitle("Uploading images...");
    setBlockingSubtitle("Sending files to CaterTech storage.");
    const commit = await galleryRef.current!.commitPendingUploads();
    if (!commit.ok) {
      setBlockingOpen(false);
      setError(commit.message);
      return;
    }

    setBlockingTitle("Creating product...");
    setBlockingSubtitle("Saving catalogue entry.");
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
      published: publishIntent === "live",
      isFeatured: fd.get("isFeatured") === "on",
      isAvailable: fd.get("isAvailable") === "on",
      attributes: parseProductAttributes(fd, templateFields),
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
    resetCreateForm();
    setCreatedId(row.id);
  }

  function goToProductsTable() {
    setCreatedId(null);
    router.push("/admin/products");
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
        message="Your product was saved. Close to create another, or go back to the products list."
        confirmLabel="Back to products"
        onConfirm={goToProductsTable}
        onDismiss={dismissSuccessModal}
      />

      <div className={`${admin.page} min-h-full w-full px-4 py-6 md:px-8 md:py-8`}>
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-6">
            <Link
              href="/admin/products"
              className={`${admin.link} inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide`}
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Products
            </Link>
            <h1 className={`${admin.h1} mt-4`}>New product</h1>
          </div>

          <form
            key={formKey}
            onSubmit={onSubmit}
            className="overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0px_24px_80px_rgba(0,0,0,0.06)]"
          >
            <div className="border-b border-black/6 bg-[#F5F5F7]/60 px-5 py-4 md:px-7">
              <ProductCategorySelects layout="row" onSelectionChange={setSelectedTaxonomy} />
            </div>

            <div className="p-5 md:p-7 lg:p-8">
              {!canShowProductFields ? (
                <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-black/10 bg-[#F5F5F7]/40 p-8 text-center text-sm text-[#1a1a1a]/45">
                  Select a category above to load the product form.
                </div>
              ) : (
                <div className="space-y-7">
                  <section>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#1a1a1a]">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F7] text-[#5B2D9B]">
                          <Save size={16} aria-hidden="true" />
                        </span>
                        Product
                      </div>
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5B2D9B]/10 px-3 py-1 text-xs font-semibold text-[#5B2D9B]">
                          <Tag size={12} aria-hidden />
                          {selectedTaxonomy.categoryName}
                        </span>
                        {selectedTaxonomy.subCategoryName ? (
                          <span className="inline-flex items-center rounded-full bg-[#F5F5F7] px-3 py-1 text-xs font-semibold text-[#1a1a1a]/70 ring-1 ring-black/8">
                            {selectedTaxonomy.subCategoryName}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <label htmlFor="product-title" className={admin.labelModern}>
                      Title *
                    </label>
                    <input
                      id="product-title"
                      name="title"
                      required
                      autoComplete="off"
                      placeholder="Enter product name"
                      className={admin.fieldModern}
                    />
                  </section>

                  <section>
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1a1a1a]">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F7] text-[#5B2D9B]">
                        <ImagePlus size={16} aria-hidden="true" />
                      </span>
                      Gallery
                    </div>
                    <AdminGalleryUpload ref={galleryRef} id="product-gallery-file" />
                  </section>

                  <ProductTemplateFields
                    key={`${selectedTaxonomy.categoryId}-${selectedTaxonomy.subCategoryId}`}
                    categoryId={selectedTaxonomy.categoryId}
                    subCategoryId={selectedTaxonomy.subCategoryId}
                    onFieldsLoaded={setTemplateFields}
                  />

                  <section>
                    <label className={admin.labelModern}>Description</label>
                    <RichText name="description" defaultHtml="" embed editorMinHeight={220} />
                  </section>

                  <section>
                    <label className={admin.labelModern}>Options</label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-black/8 bg-[#F5F5F7]/70 px-4 py-3 text-sm font-semibold text-[#1a1a1a]">
                        <input type="checkbox" name="isFeatured" className={admin.checkbox} />
                        Featured on homepage
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-black/8 bg-[#F5F5F7]/70 px-4 py-3 text-sm font-semibold text-[#1a1a1a]">
                        <input
                          type="checkbox"
                          name="isAvailable"
                          defaultChecked
                          className={admin.checkbox}
                        />
                        Available for quote
                      </label>
                    </div>
                  </section>

                  {error ? (
                    <p className={`${admin.error} rounded-xl border border-red-100 bg-red-50/80 px-4 py-3`}>
                      {error}
                    </p>
                  ) : null}

                  <div className="flex flex-col-reverse gap-3 border-t border-black/6 pt-6 sm:flex-row sm:items-center sm:justify-end">
                    <Link
                      href="/admin/products"
                      className={`${admin.secondaryBtn} w-full justify-center sm:w-auto`}
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={loading || blockingOpen}
                      onClick={() => setPublishIntent("draft")}
                      className={`${admin.secondaryBtn} w-full min-w-[140px] justify-center gap-2 sm:w-auto`}
                    >
                      <Save size={16} aria-hidden="true" />
                      {loading && publishIntent === "draft" ? "Saving…" : "Save as draft"}
                    </button>
                    <button
                      type="submit"
                      disabled={loading || blockingOpen}
                      onClick={() => setPublishIntent("live")}
                      className={`${admin.primaryBtn} w-full min-w-[160px] justify-center gap-2 shadow-[0_8px_24px_rgba(75,38,164,0.25)] sm:w-auto`}
                      style={{ backgroundColor: ADMIN_PURPLE }}
                    >
                      <Upload size={16} aria-hidden="true" />
                      {loading && publishIntent === "live" ? "Publishing…" : "Publish live"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
