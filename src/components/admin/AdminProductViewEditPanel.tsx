"use client";

import RichText from "@/app/admin/ui/Richtext";
import AdminGalleryUpload, {
  type AdminGalleryUploadHandle,
} from "@/components/admin/AdminGalleryUpload";
import { AdminBlockingOverlay, AdminSuccessModal } from "@/components/admin/AdminFormOverlays";
import { admin } from "@/components/admin/adminTheme";
import {
  notifyProductTaxonomyChanged,
  ProductCategorySelects,
} from "@/components/admin/ProductCategorySelects";
import {
  parseProductAttributes,
  ProductTemplateFields,
} from "@/components/admin/ProductTemplateFields";
import { ProductTitlePresetInput } from "@/components/admin/ProductTitlePresetInput";
import { products } from "@/db/schema";
import type { ProductAttributeValue, TemplateFieldDef } from "@/lib/category-template";
import { generateProductSeo } from "@/lib/product-seo";
import type { InferSelectModel } from "drizzle-orm";
import { ImageIcon } from "lucide-react";
import { FormEvent, useCallback, useRef, useState } from "react";

type ProductRow = InferSelectModel<typeof products>;

type TaxonomySelection = {
  categoryId: string;
  subCategoryId: string;
  categoryName: string;
  subCategoryName: string;
  hasSubcategories: boolean;
  subCategoryRequired: boolean;
};

type Props = {
  product: ProductRow;
  onCancel: () => void;
  onSaved: (product: ProductRow) => void;
};

export default function AdminProductViewEditPanel({ product, onCancel, onSaved }: Props) {
  const galleryRef = useRef<AdminGalleryUploadHandle>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [blockingOpen, setBlockingOpen] = useState(false);
  const [blockingTitle, setBlockingTitle] = useState("");
  const [blockingSubtitle, setBlockingSubtitle] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [savedRow, setSavedRow] = useState<ProductRow | null>(null);

  const [topCategoryId, setTopCategoryId] = useState(product.categoryId ?? "");
  const [topSubCategoryId, setTopSubCategoryId] = useState(product.subCategoryId ?? "");
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<TaxonomySelection>({
    categoryId: product.categoryId ?? "",
    subCategoryId: product.subCategoryId ?? "",
    categoryName: product.category?.split(" › ")[0]?.trim() ?? "",
    subCategoryName: product.category?.split(" › ").slice(1).join(" › ").trim() ?? "",
    hasSubcategories: false,
    subCategoryRequired: false,
  });
  const [templateFields, setTemplateFields] = useState<TemplateFieldDef[]>([]);
  const [liveTitle, setLiveTitle] = useState(product.title);
  const [liveAttributes, setLiveAttributes] = useState<Record<string, ProductAttributeValue>>(
    (product.attributes ?? {}) as Record<string, ProductAttributeValue>
  );
  const [seoTitleOverride, setSeoTitleOverride] = useState<string | null>(product.seoTitle);
  const [seoDescriptionOverride, setSeoDescriptionOverride] = useState<string | null>(
    product.seoDescription
  );
  const [searchKeywordsOverride, setSearchKeywordsOverride] = useState<string | null>(
    product.searchKeywords?.join(", ") ?? null
  );
  const canShowFields = Boolean(selectedTaxonomy.categoryId);

  const handleTaxonomySelection = useCallback((selection: TaxonomySelection) => {
    setTopCategoryId((prev) => (prev === selection.categoryId ? prev : selection.categoryId));
    setTopSubCategoryId((prev) => (prev === selection.subCategoryId ? prev : selection.subCategoryId));
    setSelectedTaxonomy((prev) =>
      prev.categoryId === selection.categoryId &&
      prev.subCategoryId === selection.subCategoryId &&
      prev.categoryName === selection.categoryName &&
      prev.subCategoryName === selection.subCategoryName
        ? prev
        : selection
    );
  }, []);

  const handlePresetSelected = useCallback((attributes: Record<string, ProductAttributeValue>) => {
    setLiveAttributes(attributes);
  }, []);

  const generatedSeo = generateProductSeo({
    title: liveTitle,
    categoryName: selectedTaxonomy.categoryName,
    subCategoryName: selectedTaxonomy.subCategoryName,
    description: product.description,
    attributes: liveAttributes,
  });
  const seoTitleValue = seoTitleOverride ?? generatedSeo.seoTitle;
  const seoDescriptionValue = seoDescriptionOverride ?? generatedSeo.seoDescription;
  const searchKeywordsValue =
    searchKeywordsOverride ?? generatedSeo.searchKeywords.join(", ");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

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

    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") || ""),
      description: String(fd.get("description") || "") || null,
      categoryId: selectedTaxonomy.categoryId || null,
      subCategoryId: selectedTaxonomy.subCategoryId || null,
      images: commit.urls,
      published: fd.get("published") === "on",
      isFeatured: fd.get("isFeatured") === "on",
      isAvailable: fd.get("isAvailable") === "on",
      attributes: parseProductAttributes(fd, templateFields),
      seoTitle: seoTitleValue,
      seoDescription: seoDescriptionValue,
      searchKeywords: searchKeywordsValue
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
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
      setError(typeof data.error === "string" ? data.error : "Save failed");
      return;
    }

    const updated = (await res.json()) as ProductRow;
    notifyProductTaxonomyChanged();
    setSavedRow(updated);
    setShowSaved(true);
  }

  return (
    <>
      <AdminBlockingOverlay open={blockingOpen} title={blockingTitle} subtitle={blockingSubtitle} />
      <AdminSuccessModal
        open={showSaved}
        title="Saved"
        message="Product updated successfully."
        confirmLabel="OK"
        onConfirm={() => {
          setShowSaved(false);
          if (savedRow) onSaved(savedRow);
        }}
        onDismiss={() => {
          setShowSaved(false);
          if (savedRow) onSaved(savedRow);
        }}
      />

      <form onSubmit={(e) => void onSubmit(e)} className="grid items-start gap-3 sm:gap-3.5 lg:grid-cols-12 lg:gap-4">
        {/* Category + title band */}
        <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white lg:col-span-12">
          <div className="border-b border-black/6 bg-admin-bg/50 px-3 py-3 sm:px-4">
            <ProductCategorySelects
              layout="row"
              initialCategoryId={product.categoryId}
              initialSubCategoryId={product.subCategoryId}
              selectedCategoryId={topCategoryId}
              selectedSubCategoryId={topSubCategoryId}
              onSelectionChange={handleTaxonomySelection}
            />
          </div>
          <div className="space-y-3 p-3 sm:p-4">
            {canShowFields ? (
              <ProductTitlePresetInput
                categoryId={selectedTaxonomy.categoryId}
                subCategoryId={selectedTaxonomy.subCategoryId}
                categoryName={selectedTaxonomy.categoryName}
                subCategoryName={selectedTaxonomy.subCategoryName}
                initialTitle={product.title}
                initialPresetId={product.productTitlePresetId}
                onTitleChange={setLiveTitle}
                onPresetSelected={handlePresetSelected}
              />
            ) : (
              <p className="rounded-lg border border-dashed border-black/10 py-4 text-center text-xs text-admin-ink/45">
                Select a category above to edit title and specifications.
              </p>
            )}
            <div className={`${admin.checkRow} flex-wrap gap-4`}>
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-admin-ink">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={product.published}
                  className={admin.checkbox}
                />
                Live
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-admin-ink">
                <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} className={admin.checkbox} />
                Featured
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-admin-ink">
                <input
                  type="checkbox"
                  name="isAvailable"
                  defaultChecked={product.isAvailable}
                  className={admin.checkbox}
                />
                Available
              </label>
            </div>
            <p className="font-mono text-[11px] text-admin-ink/40">{product.productId}</p>
          </div>
        </div>

        {/* Left column: gallery + SEO stacked */}
        <div className="flex flex-col gap-3 sm:gap-3.5 lg:col-span-5 lg:min-w-0">
          <div className="rounded-xl border border-black/[0.07] bg-white p-3 sm:p-3.5">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-admin-ink/55">
              <ImageIcon className="h-3.5 w-3.5 text-admin-accent" aria-hidden />
              Gallery
            </p>
            <AdminGalleryUpload
              key={`edit-gallery-${product.id}`}
              ref={galleryRef}
              id={`view-edit-gallery-${product.id}`}
              defaultUrls={product.images}
              hint="Drag & drop or click to add images."
            />
          </div>

          <div className="flex flex-col rounded-xl border border-black/[0.07] bg-white p-3 sm:p-3.5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-admin-ink/55">
              SEO &amp; search
            </p>
            <div className="space-y-3">
              <div>
                <label htmlFor="view-edit-seo-title" className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-admin-ink/40">
                  SEO title
                </label>
                <input
                  id="view-edit-seo-title"
                  name="seoTitle"
                  value={seoTitleValue}
                  onChange={(event) => setSeoTitleOverride(event.target.value)}
                  maxLength={80}
                  className={`${admin.fieldModern} py-2 text-xs`}
                />
              </div>
              <div>
                <label htmlFor="view-edit-seo-desc" className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-admin-ink/40">
                  SEO description
                </label>
                <textarea
                  id="view-edit-seo-desc"
                  name="seoDescription"
                  value={seoDescriptionValue}
                  onChange={(event) => setSeoDescriptionOverride(event.target.value)}
                  maxLength={180}
                  rows={3}
                  className={`${admin.fieldModern} py-2 text-xs`}
                />
              </div>
              <div>
                <label htmlFor="view-edit-keywords" className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-admin-ink/40">
                  Search keywords
                </label>
                <textarea
                  id="view-edit-keywords"
                  name="searchKeywords"
                  value={searchKeywordsValue}
                  onChange={(event) => setSearchKeywordsOverride(event.target.value)}
                  rows={3}
                  className={`${admin.fieldModern} py-2 text-xs`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: specs + description */}
        <div className="flex flex-col gap-3 sm:gap-3.5 lg:col-span-7 lg:min-w-0">
          <div className="rounded-xl border border-black/[0.07] bg-white p-3 sm:p-3.5">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-admin-ink/55">
              Specifications
            </p>
            {canShowFields ? (
              <ProductTemplateFields
                key={`${selectedTaxonomy.categoryId}-${selectedTaxonomy.subCategoryId}`}
                categoryId={selectedTaxonomy.categoryId}
                subCategoryId={selectedTaxonomy.subCategoryId}
                initialAttributes={liveAttributes}
                onFieldsLoaded={setTemplateFields}
                onAttributesChange={setLiveAttributes}
              />
            ) : (
              <p className="text-xs text-admin-ink/40">Choose a category to edit specifications.</p>
            )}
          </div>

          <div className="rounded-xl border border-black/[0.07] bg-white p-3 sm:p-3.5">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-admin-ink/55">
              Description
            </p>
            {canShowFields ? (
              <RichText
                key={`edit-desc-${product.id}`}
                name="description"
                defaultHtml={product.description ?? ""}
                embed
                editorMinHeight={160}
              />
            ) : (
              <p className="text-xs text-admin-ink/40">Choose a category to edit description.</p>
            )}
          </div>
        </div>

        {/* Sticky save bar — always visible at bottom of modal scroll area */}
        <div className="sticky bottom-0 z-10 -mx-3 border-t border-black/8 bg-[#fafafa]/95 px-3 py-3 backdrop-blur-sm sm:-mx-5 sm:px-5 lg:col-span-12">
          {error ? <p className={`${admin.error} mb-2 text-xs`}>{error}</p> : null}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className={`${admin.secondaryBtn} cursor-pointer px-4 py-2 text-xs`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || blockingOpen || !canShowFields}
              className={`${admin.primaryBtn} cursor-pointer px-5 py-2 text-xs`}
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
