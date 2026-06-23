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
import {
  incrementProductTaxonomyCreatedPresetCount,
  ProductCategorySelects,
} from "@/components/admin/ProductCategorySelects";
import { ProductTitlePresetInput } from "@/components/admin/ProductTitlePresetInput";
import { admin } from "@/components/admin/adminTheme";
import type {
  ProductAttributeValue,
  TemplateFieldDef,
} from "@/lib/category-template";
import { generateProductSeo } from "@/lib/product-seo";
import { ArrowLeft, ImagePlus, Save, Tag } from "lucide-react";
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
  const [topCategoryId, setTopCategoryId] = useState("");
  const [topSubCategoryId, setTopSubCategoryId] = useState("");
  const [customPresetMode, setCustomPresetMode] = useState(false);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<TaxonomySelection>(
    emptyTaxonomySelection
  );
  const [templateFields, setTemplateFields] = useState<TemplateFieldDef[]>([]);
  const [liveTitle, setLiveTitle] = useState("");
  const [liveAttributes, setLiveAttributes] = useState<Record<string, ProductAttributeValue>>({});
  const [seoTitleOverride, setSeoTitleOverride] = useState<string | null>(null);
  const [seoDescriptionOverride, setSeoDescriptionOverride] = useState<string | null>(null);
  const [searchKeywordsOverride, setSearchKeywordsOverride] = useState<string | null>(null);
  const [canonicalProductId, setCanonicalProductId] = useState("");
  const [selectedProductTitlePresetId, setSelectedProductTitlePresetId] = useState<string | null>(
    null
  );
  const [presetFieldKeys, setPresetFieldKeys] = useState<string[] | undefined>(
    undefined
  );
  const [presetRevision, setPresetRevision] = useState(0);

  const canShowProductFields = Boolean(selectedTaxonomy.categoryId);
  const canShowTitleSection = canShowProductFields || customPresetMode;

  const prevCategoryIdRef = useRef("");

  const resetCreateForm = useCallback(() => {
    prevCategoryIdRef.current = "";
    setFormKey((k) => k + 1);
    setError("");
    setTopCategoryId("");
    setTopSubCategoryId("");
    setCustomPresetMode(false);
    setSelectedTaxonomy(emptyTaxonomySelection);
    setTemplateFields([]);
    setLiveTitle("");
    setLiveAttributes({});
    setSeoTitleOverride(null);
    setSeoDescriptionOverride(null);
    setSearchKeywordsOverride(null);
    setCanonicalProductId("");
    setSelectedProductTitlePresetId(null);
    setPresetFieldKeys(undefined);
    setPresetRevision(0);
  }, []);

  const handleTaxonomySelection = useCallback((selection: TaxonomySelection) => {
    const categoryChanged = prevCategoryIdRef.current !== selection.categoryId;
    prevCategoryIdRef.current = selection.categoryId;

    setTopCategoryId(selection.categoryId);
    setTopSubCategoryId(selection.subCategoryId);
    if (selection.categoryId) setCustomPresetMode(false);
    setSelectedTaxonomy(selection);
    setSelectedProductTitlePresetId(null);

    if (categoryChanged) {
      setLiveAttributes({});
      setPresetFieldKeys(undefined);
      setPresetRevision((revision) => revision + 1);
    }
  }, []);

  const clearTopTaxonomyForCustomPreset = useCallback(() => {
    setCustomPresetMode(true);
    setTopCategoryId("");
    setTopSubCategoryId("");
    setSelectedTaxonomy(emptyTaxonomySelection);
    setSelectedProductTitlePresetId(null);
    setTemplateFields([]);
    setLiveAttributes({});
    setPresetFieldKeys(undefined);
    setPresetRevision((revision) => revision + 1);
  }, []);

  const handleCustomPresetSelection = useCallback((selection: TaxonomySelection) => {
    setCustomPresetMode(true);
    setSelectedTaxonomy(selection);
    setSelectedProductTitlePresetId(null);
    setTemplateFields([]);
    setLiveAttributes({});
    setPresetFieldKeys(undefined);
    setPresetRevision((revision) => revision + 1);
  }, []);

  const refreshPresetAfterSave = useCallback(() => {
    setPresetRevision((revision) => revision + 1);
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
      categoryId: selectedTaxonomy.categoryId || null,
      subCategoryId: selectedTaxonomy.subCategoryId || null,
      images: commit.urls,
      published: fd.get("published") === "on",
      isFeatured: fd.get("isFeatured") === "on",
      isAvailable: fd.get("isAvailable") === "on",
      attributes: parseProductAttributes(fd, templateFields),
      seoTitle: String(fd.get("seoTitle") || ""),
      seoDescription: String(fd.get("seoDescription") || ""),
      searchKeywords: String(fd.get("searchKeywords") || "")
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
      canonicalProductId: canonicalProductId.trim() || null,
      productTitlePresetId: selectedProductTitlePresetId,
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
    const row = (await res.json()) as {
      id: string;
      presetProgressIncremented?: boolean;
    };
    if (row.presetProgressIncremented && selectedTaxonomy.categoryId) {
      incrementProductTaxonomyCreatedPresetCount(selectedTaxonomy.categoryId);
    }
    resetCreateForm();
    setCreatedId(row.id);
  }

  function goToProductsTable() {
    setCreatedId(null);
    router.push("/admin/products");
  }

  const generatedSeo = generateProductSeo({
    title: liveTitle,
    categoryName: selectedTaxonomy.categoryName,
    subCategoryName: selectedTaxonomy.subCategoryName,
    attributes: liveAttributes,
  });
  const seoTitleValue = seoTitleOverride ?? generatedSeo.seoTitle;
  const seoDescriptionValue = seoDescriptionOverride ?? generatedSeo.seoDescription;
  const searchKeywordsValue =
    searchKeywordsOverride ?? generatedSeo.searchKeywords.join(", ");

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
            <div className="border-b border-black/6 bg-admin-bg/60 px-5 py-4 md:px-7">
              <ProductCategorySelects
                layout="row"
                selectedCategoryId={topCategoryId}
                selectedSubCategoryId={topSubCategoryId}
                onSelectionChange={handleTaxonomySelection}
              />
            </div>

            <div className="p-5 md:p-7 lg:p-8">
              {!canShowTitleSection ? (
                <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-black/10 bg-admin-bg/40 p-8 text-center text-sm text-admin-ink/45">
                  Select a category above to load the product form.
                </div>
              ) : (
                <div className="space-y-7">
                  <section>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-admin-ink">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-bg text-admin-accent">
                          <Save size={16} aria-hidden="true" />
                        </span>
                        Product
                      </div>
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-admin-accent/10 px-3 py-1 text-xs font-semibold text-admin-accent">
                          <Tag size={12} aria-hidden />
                          {selectedTaxonomy.categoryName || "Choose preset category"}
                        </span>
                        {selectedTaxonomy.subCategoryName ? (
                          <span className="inline-flex items-center rounded-full bg-admin-bg px-3 py-1 text-xs font-semibold text-admin-ink/70 ring-1 ring-black/8">
                            {selectedTaxonomy.subCategoryName}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <ProductTitlePresetInput
                      categoryId={selectedTaxonomy.categoryId}
                      subCategoryId={selectedTaxonomy.subCategoryId}
                      categoryName={selectedTaxonomy.categoryName}
                      subCategoryName={selectedTaxonomy.subCategoryName}
                      onTitleChange={setLiveTitle}
                      onPresetIdentityChange={setSelectedProductTitlePresetId}
                      onPresetSelected={(attributes) => {
                        setLiveAttributes(attributes);
                        setPresetFieldKeys(Object.keys(attributes));
                        setPresetRevision((revision) => revision + 1);
                      }}
                      onAddCustomRequested={clearTopTaxonomyForCustomPreset}
                      onPresetCreated={refreshPresetAfterSave}
                      onClearFormRequested={resetCreateForm}
                      onCustomPresetSelectionChange={handleCustomPresetSelection}
                    />
                  </section>

                  {!canShowProductFields ? (
                    <div className="rounded-2xl border border-dashed border-black/10 bg-admin-bg/50 p-5 text-sm text-admin-ink/55">
                      Choose a preset category and click Add preset to load the product
                      details form for this custom title.
                    </div>
                  ) : (
                    <>
                      <section>
                        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-admin-ink">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-bg text-admin-accent">
                            <ImagePlus size={16} aria-hidden="true" />
                          </span>
                          Gallery
                        </div>
                        <AdminGalleryUpload ref={galleryRef} id="product-gallery-file" />
                      </section>

                      <ProductTemplateFields
                        key={`${selectedTaxonomy.categoryId}-${presetRevision}`}
                        categoryId={selectedTaxonomy.categoryId}
                        subCategoryId={selectedTaxonomy.subCategoryId}
                        initialAttributes={liveAttributes}
                        initialFieldKeys={presetFieldKeys}
                        onFieldsLoaded={setTemplateFields}
                        onAttributesChange={setLiveAttributes}
                      />

                      <section className="rounded-2xl border border-black/8 bg-admin-bg/55 p-4 md:p-5">
                        <div className="mb-4">
                          <p className={`${admin.formSectionTitle} mb-1`}>SEO &amp; Search</p>
                          <p className="text-xs leading-relaxed text-admin-ink/45">
                            Auto-filled from title, category and specs. Edit only when you want a custom search result.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label htmlFor="seo-title" className={admin.labelModern}>
                              SEO title
                            </label>
                            <input
                              id="seo-title"
                              name="seoTitle"
                              value={seoTitleValue}
                              onChange={(event) => setSeoTitleOverride(event.target.value)}
                              maxLength={80}
                              className={admin.fieldModern}
                            />
                            <p className="mt-1 text-[11px] text-admin-ink/38">
                              {seoTitleValue.length}/80 characters
                            </p>
                          </div>
                          <div>
                            <label htmlFor="seo-description" className={admin.labelModern}>
                              SEO description
                            </label>
                            <textarea
                              id="seo-description"
                              name="seoDescription"
                              value={seoDescriptionValue}
                              onChange={(event) => setSeoDescriptionOverride(event.target.value)}
                              maxLength={180}
                              rows={3}
                              className={admin.fieldModern}
                            />
                            <p className="mt-1 text-[11px] text-admin-ink/38">
                              {seoDescriptionValue.length}/180 characters
                            </p>
                          </div>
                          <div>
                            <label htmlFor="search-keywords" className={admin.labelModern}>
                              Search keywords
                            </label>
                            <textarea
                              id="search-keywords"
                              name="searchKeywords"
                              value={searchKeywordsValue}
                              onChange={(event) => setSearchKeywordsOverride(event.target.value)}
                              rows={3}
                              className={admin.fieldModern}
                            />
                            <p className="mt-1 text-[11px] text-admin-ink/38">
                              Comma-separated keywords for internal search and SEO matching.
                            </p>
                          </div>
                          <div>
                            <label htmlFor="canonical-product-id" className={admin.labelModern}>
                              Canonical/master product ID
                            </label>
                            <input
                              id="canonical-product-id"
                              value={canonicalProductId}
                              onChange={(event) => setCanonicalProductId(event.target.value)}
                              placeholder="Optional master product UUID"
                              className={admin.fieldModern}
                            />
                            <p className="mt-1 text-[11px] text-admin-ink/38">
                              Optional. Use later for variants that should point to one master product.
                            </p>
                          </div>
                        </div>
                      </section>

                      <section>
                        <label className={admin.labelModern}>Description</label>
                        <RichText name="description" defaultHtml="" embed editorMinHeight={220} />
                      </section>

                      <section>
                        <label className={admin.labelModern}>Options</label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-black/8 bg-admin-bg/70 px-4 py-3 text-sm font-semibold text-admin-ink">
                            <input type="checkbox" name="published" className={admin.checkbox} />
                            Live on website
                          </label>
                          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-black/8 bg-admin-bg/70 px-4 py-3 text-sm font-semibold text-admin-ink">
                            <input type="checkbox" name="isFeatured" className={admin.checkbox} />
                            Featured on homepage
                          </label>
                          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-black/8 bg-admin-bg/70 px-4 py-3 text-sm font-semibold text-admin-ink">
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
                    </>
                  )}

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
                    {canShowProductFields ? (
                      <>
                        <button
                          type="submit"
                          disabled={loading || blockingOpen}
                          className={`${admin.primaryBtn} w-full min-w-[140px] justify-center gap-2 sm:w-auto`}
                        >
                          <Save size={16} aria-hidden="true" />
                          {loading ? "Saving..." : "Save product"}
                        </button>
                      </>
                    ) : null}
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
