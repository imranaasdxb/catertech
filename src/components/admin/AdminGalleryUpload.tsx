"use client";

import { admin } from "@/components/admin/adminTheme";
import { uploadMediaToR2PublicUrl } from "@/lib/upload-to-r2-client";
import { ImagePlus, Loader2, X } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

export type GalleryCommitResult =
  | { ok: true; urls: string[] }
  | { ok: false; message: string };

export type AdminGalleryUploadHandle = {
  commitPendingUploads: () => Promise<GalleryCommitResult>;
};

type GalleryItem =
  | { id: string; kind: "remote"; url: string }
  | { id: string; kind: "local"; file: File; previewUrl: string };

type Props = {
  id?: string;
  defaultUrls?: string[];
  hint?: string;
};

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Browsers/OS often omit MIME or send application/octet-stream for valid picks. */
function isChosenImageFile(file: File): boolean {
  const t = (file.type || "").trim().toLowerCase();
  if (t.startsWith("image/")) return true;
  if (t !== "" && t !== "application/octet-stream") return false;
  const m = /\.([a-zA-Z0-9]+)$/.exec(file.name);
  const ext = m ? m[1].toLowerCase() : "";
  return /^(jpe?g|png|gif|webp|bmp|svg|heic|heif|avif|tiff?|ico)$/.test(ext);
}

const AdminGalleryUpload = forwardRef<AdminGalleryUploadHandle, Props>(
  function AdminGalleryUpload({ defaultUrls = [], id = "admin-gallery-file", hint }, ref) {
    const cleanDefaults = useMemo(
      () => defaultUrls.filter((u, i, a) => u && a.indexOf(u) === i),
      [defaultUrls]
    );

    const [items, setItems] = useState<GalleryItem[]>(() =>
      cleanDefaults.map((url) => ({ id: newId(), kind: "remote" as const, url }))
    );
    const itemsRef = useRef(items);
    itemsRef.current = items;

    const [pickingBusy, setPickingBusy] = useState(false);
    const [committing, setCommitting] = useState(false);
    const [lastError, setLastError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      return () => {
        for (const it of itemsRef.current) {
          if (it.kind === "local") URL.revokeObjectURL(it.previewUrl);
        }
      };
    }, []);

    const removeAt = useCallback((index: number) => {
      setItems((prev) => {
        const rm = prev[index];
        const next = prev.filter((_, j) => j !== index);
        if (rm?.kind === "local") URL.revokeObjectURL(rm.previewUrl);
        return next;
      });
    }, []);

    const runPickFiles = useCallback((files: FileList | null) => {
      if (!files?.length) {
        if (fileRef.current) fileRef.current.value = "";
        setPickingBusy(false);
        return;
      }

      const additions: GalleryItem[] = [];
      let rejected = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!isChosenImageFile(file)) {
          rejected++;
          continue;
        }
        const previewUrl = URL.createObjectURL(file);
        additions.push({ id: newId(), kind: "local", file, previewUrl });
      }

      if (!additions.length && rejected > 0) {
        setLastError(
          "Those files were not recognised as images (missing type). Try JPG, PNG, or WebP, or rename with a proper extension (.jpg, .png, …)."
        );
      } else {
        setLastError("");
      }

      if (additions.length) {
        setItems((prev) => [...prev, ...additions]);
      }

      setPickingBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }, []);

    useImperativeHandle(ref, () => ({
      async commitPendingUploads() {
        setLastError("");
        const order = [...itemsRef.current];

        const hasLocal = order.some((r) => r.kind === "local");
        if (!hasLocal) {
          const urlsOnly = order
            .filter((r): r is Extract<GalleryItem, { kind: "remote" }> => r.kind === "remote")
            .map((r) => r.url);
          return { ok: true as const, urls: urlsOnly };
        }

        setCommitting(true);
        const revokeAfter: string[] = [];
        const out: string[] = [];

        try {
          for (const row of order) {
            if (row.kind === "remote") out.push(row.url);
            else {
              const up = await uploadMediaToR2PublicUrl(row.file);
              if (!up.ok) {
                setLastError(up.message);
                setCommitting(false);
                return { ok: false as const, message: up.message };
              }
              revokeAfter.push(row.previewUrl);
              out.push(up.url);
            }
          }
          for (const u of revokeAfter) URL.revokeObjectURL(u);
          const nextRows: GalleryItem[] = out.map((url) => ({
            id: newId(),
            kind: "remote" as const,
            url,
          }));
          setItems(nextRows);
          return { ok: true as const, urls: out };
        } catch {
          setCommitting(false);
          return { ok: false as const, message: "Something went wrong while uploading images." };
        } finally {
          setCommitting(false);
        }
      },
    }));

    const showHint = Boolean(hint?.trim());

    return (
      <div className="space-y-3">
        <input
          ref={fileRef}
          id={id}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={pickingBusy || committing}
          onChange={(e) => {
            setPickingBusy(true);
            runPickFiles(e.target.files);
          }}
        />

        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor={id}
            className={`${admin.secondaryBtn} inline-flex cursor-pointer items-center gap-2 border border-[#ebe6f7] bg-white ${committing ? "pointer-events-none opacity-50" : ""}`}
          >
            {pickingBusy ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#5B2D9B]" aria-hidden />
            ) : (
              <ImagePlus className="h-4 w-4 shrink-0 text-[#5B2D9B]" aria-hidden />
            )}
            {pickingBusy ? "Adding…" : "Choose images"}
          </label>
        </div>

        {showHint ? <p className={admin.hint}>{hint}</p> : null}

        {lastError ? (
          <p
            role="alert"
            className={`${admin.error} rounded-lg border border-red-100 bg-red-50/80 px-3 py-2 text-sm`}
          >
            {lastError}
          </p>
        ) : null}

        {committing ? (
          <div className="flex gap-3 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin]">
            {items.map(({ id }) => (
              <div
                key={id}
                className="relative h-[7.5rem] w-[7.5rem] shrink-0 animate-pulse overflow-hidden rounded-xl border border-black/[0.06] bg-[#eae8f2]"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-[#faf8ff]/90">
                  <Loader2 className="h-6 w-6 animate-spin text-[#5B2D9B]" aria-hidden />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <label
            htmlFor={id}
            className={`flex min-h-[7.5rem] w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-black/12 bg-[#F5F5F7]/50 transition-colors hover:border-[#5B2D9B]/35 hover:bg-[#faf8ff]/80 ${committing ? "pointer-events-none opacity-50" : ""}`}
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium text-[#1a1a1a]/40">
              <ImagePlus className="h-4 w-4 text-[#5B2D9B]/60" aria-hidden />
              Add images
            </span>
          </label>
        ) : (
          <div
            role="list"
            className="relative flex gap-3 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin]"
          >
            {items.map((it, idx) => (
              <article
                key={it.id}
                role="listitem"
                className="relative w-[7.5rem] shrink-0 overflow-hidden rounded-xl border border-black/[0.06] bg-[#faf8ff] shadow-sm"
              >
                <button
                  type="button"
                  aria-label={`Remove image ${idx + 1}`}
                  onClick={() => removeAt(idx)}
                  className="absolute right-1.5 top-1.5 z-10 rounded-full bg-white/95 p-1 text-[#1a1a1a]/60 shadow hover:text-red-600"
                  disabled={committing}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="relative aspect-square w-[7.5rem] bg-neutral-100">
                  <img
                    src={it.kind === "remote" ? it.url : it.previewUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                {idx === 0 ? (
                  <p className="border-t border-black/[0.04] px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-[#5B2D9B]/90">
                    Primary
                  </p>
                ) : (
                  <p className="border-t border-black/[0.04] px-2 py-1 text-center text-[10px] text-[#1a1a1a]/40">
                    &nbsp;
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }
);

AdminGalleryUpload.displayName = "AdminGalleryUpload";

export default AdminGalleryUpload;
