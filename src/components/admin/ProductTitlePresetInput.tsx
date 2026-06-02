"use client";

import { admin } from "@/components/admin/adminTheme";
import type { ProductAttributeValue } from "@/lib/category-template";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ProductPreset = {
  id: string;
  title: string;
  sourceLabel: string;
  attributes: Record<string, ProductAttributeValue>;
};

type Props = {
  categoryId: string;
  subCategoryId: string;
  onPresetSelected: (attributes: Record<string, ProductAttributeValue>) => void;
};

export function ProductTitlePresetInput({
  categoryId,
  subCategoryId,
  onPresetSelected,
}: Props) {
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [title, setTitle] = useState("");
  const [presets, setPresets] = useState<ProductPreset[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    let cancelled = false;
    const params = new URLSearchParams({ categoryId });
    if (subCategoryId) params.set("subCategoryId", subCategoryId);

    void fetch(`/api/admin/product-presets?${params}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("load failed");
        return (await res.json()) as { presets?: ProductPreset[] };
      })
      .then((data) => {
        if (!cancelled) setPresets(data.presets ?? []);
      })
      .catch(() => {
        if (!cancelled) setPresets([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId, subCategoryId]);

  const filtered = useMemo(() => {
    const query = title.trim().toLowerCase();
    if (!query) return presets;
    return presets.filter((preset) =>
      `${preset.title} ${preset.sourceLabel}`.toLowerCase().includes(query)
    );
  }, [presets, title]);

  function selectPreset(preset: ProductPreset) {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setTitle(preset.title);
    setOpen(false);
    onPresetSelected(preset.attributes);
  }

  return (
    <div className="relative">
      <label htmlFor="product-title" className={admin.labelModern}>
        Title *
      </label>
      <div className="relative">
        <Search
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/35"
        />
        <input
          id="product-title"
          name="title"
          required
          autoComplete="off"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          placeholder="Type a product name or choose a preset"
          className={`${admin.fieldModern} pl-9 pr-11`}
        />
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setOpen((current) => !current)}
          className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[#1a1a1a]/55 transition hover:bg-black/5 hover:text-[#1a1a1a]"
          aria-label="Show product title presets"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={17} />}
        </button>
      </div>

      {open && presets.length ? (
        <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-black/10 bg-white p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.14)]">
          {filtered.length ? (
            filtered.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectPreset(preset)}
                className="block w-full rounded-lg px-3 py-2.5 text-left transition hover:bg-[#F5F5F7]"
              >
                <span className="block text-sm font-semibold text-[#1a1a1a]">{preset.title}</span>
                {preset.sourceLabel !== preset.title ? (
                  <span className="mt-0.5 block text-xs text-[#1a1a1a]/50">
                    {preset.sourceLabel}
                  </span>
                ) : null}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-[#1a1a1a]/50">
              No matching preset. Continue typing to add a custom product.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
