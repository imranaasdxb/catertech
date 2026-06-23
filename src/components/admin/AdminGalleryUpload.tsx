"use client";

import { admin } from "@/components/admin/adminTheme";
import { uploadMediaPublicUrl } from "@/lib/upload-media-client";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type DragEvent,
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
    const [dragOver, setDragOver] = useState(false);
    const [lastError, setLastError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const galleryActiveRef = useRef(false);

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

    const moveItem = useCallback((fromIndex: number, toIndex: number) => {
      setItems((prev) => {
        if (
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= prev.length ||
          toIndex >= prev.length ||
          fromIndex === toIndex
        ) {
          return prev;
        }

        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    }, []);

    const addImageFiles = useCallback((files: FileList | File[] | null) => {
      if (!files?.length) {
        if (fileRef.current) fileRef.current.value = "";
        setPickingBusy(false);
        return;
      }

      const list = Array.isArray(files) ? files : Array.from(files);
      const additions: GalleryItem[] = [];
      let rejected = 0;
      for (const file of list) {
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

    const readClipboardImages = useCallback((clipboard: DataTransfer | null) => {
      if (!clipboard) return [] as File[];

      const fromItems: File[] = [];
      if (clipboard.items?.length) {
        for (let i = 0; i < clipboard.items.length; i++) {
          const item = clipboard.items[i];
          if (item.kind !== "file") continue;
          const file = item.getAsFile();
          if (file && isChosenImageFile(file)) fromItems.push(file);
        }
      }

      if (fromItems.length) return fromItems;

      return Array.from(clipboard.files ?? []).filter(isChosenImageFile);
    }, []);

    useEffect(() => {
      const onDocMouseDown = (e: MouseEvent) => {
        galleryActiveRef.current = Boolean(
          dropZoneRef.current?.contains(e.target as Node)
        );
      };
      document.addEventListener("mousedown", onDocMouseDown);
      return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, []);

    useEffect(() => {
      const onPaste = (e: ClipboardEvent) => {
        if (committing || pickingBusy) return;

        const active = document.activeElement;
        const inGallery =
          galleryActiveRef.current ||
          Boolean(active && dropZoneRef.current?.contains(active));
        if (!inGallery) return;

        if (active instanceof HTMLInputElement && active.type !== "file") return;
        if (active instanceof HTMLTextAreaElement) return;
        if (active instanceof HTMLElement && active.isContentEditable) return;

        const pasted = readClipboardImages(e.clipboardData);
        if (!pasted.length) return;

        e.preventDefault();
        setPickingBusy(true);
        addImageFiles(pasted);
      };

      document.addEventListener("paste", onPaste);
      return () => document.removeEventListener("paste", onPaste);
    }, [addImageFiles, committing, pickingBusy, readClipboardImages]);

    const handleDragOver = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        if (committing || pickingBusy) return;
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
      },
      [committing, pickingBusy]
    );

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const next = e.relatedTarget as Node | null;
      if (!next || !e.currentTarget.contains(next)) setDragOver(false);
    }, []);

    const handleDrop = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        if (committing || pickingBusy) return;
        setPickingBusy(true);
        addImageFiles(e.dataTransfer.files);
      },
      [addImageFiles, committing, pickingBusy]
    );

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
              const up = await uploadMediaPublicUrl(row.file);
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
      <div
        ref={dropZoneRef}
        tabIndex={-1}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`space-y-3 rounded-xl outline-none transition-[box-shadow] ${
          dragOver ? "ring-2 ring-admin-accent/35 ring-offset-2 ring-offset-white" : ""
        }`}
      >
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
            addImageFiles(e.target.files);
          }}
        />

        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor={id}
            className={`${admin.secondaryBtn} inline-flex cursor-pointer items-center gap-2 border border-[#ebe6f7] bg-white ${committing ? "pointer-events-none opacity-50" : ""}`}
          >
            {pickingBusy ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-admin-accent" aria-hidden />
            ) : (
              <ImagePlus className="h-4 w-4 shrink-0 text-admin-accent" aria-hidden />
            )}
            {pickingBusy ? "Adding…" : "Choose images"}
          </label>
          <p className="text-[11px] text-admin-ink/40">
            Upload, drag and drop, or paste multiple images. Use the arrows to set image order.
          </p>
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
                <div className="absolute inset-0 flex items-center justify-center bg-[#fff6f1]/90">
                  <Loader2 className="h-6 w-6 animate-spin text-admin-accent" aria-hidden />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <label
            htmlFor={id}
            className={`flex min-h-[7.5rem] w-full cursor-pointer items-center justify-center rounded-xl border border-dashed transition-colors ${
              dragOver
                ? "border-admin-accent/50 bg-[#fff6f1]"
                : "border-black/12 bg-admin-bg/50 hover:border-admin-accent/35 hover:bg-[#fff6f1]/80"
            } ${committing ? "pointer-events-none opacity-50" : ""}`}
          >
            <span className="inline-flex flex-col items-center gap-1 text-center">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-admin-ink/40">
                <ImagePlus className="h-4 w-4 text-admin-accent/60" aria-hidden />
                Add images
              </span>
              <span className="text-[10px] font-medium text-admin-ink/30">
                Drag &amp; drop or paste here
              </span>
            </span>
          </label>
        ) : (
          <div
            role="list"
            className={`relative flex gap-3 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin] rounded-xl border border-dashed border-transparent transition-colors ${
              dragOver ? "border-admin-accent/35 bg-[#fff6f1]/60" : ""
            }`}
          >
            {items.map((it, idx) => (
              <article
                key={it.id}
                role="listitem"
                className="relative w-[7.5rem] shrink-0 overflow-hidden rounded-xl border border-black/[0.06] bg-[#fff6f1] shadow-sm"
              >
                <span
                  aria-label={`Image position ${idx + 1}`}
                  className="absolute left-1.5 top-1.5 z-10 flex h-6 min-w-6 items-center justify-center rounded-full bg-admin-accent px-1.5 text-[11px] font-bold text-white shadow"
                >
                  {idx + 1}
                </span>
                <button
                  type="button"
                  aria-label={`Remove image ${idx + 1}`}
                  onClick={() => removeAt(idx)}
                  className="absolute right-1.5 top-1.5 z-10 rounded-full bg-white/95 p-1 text-admin-ink/60 shadow hover:text-red-600"
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
                <div className="flex items-center justify-between gap-1 border-t border-black/[0.04] px-1.5 py-1">
                  <button
                    type="button"
                    aria-label={`Move image ${idx + 1} earlier`}
                    title="Move earlier"
                    onClick={() => moveItem(idx, idx - 1)}
                    disabled={committing || idx === 0}
                    className="rounded p-1 text-admin-ink/50 hover:bg-white hover:text-admin-accent disabled:pointer-events-none disabled:opacity-20"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <p
                    className={`text-center text-[9px] font-semibold uppercase tracking-wide ${
                      idx === 0 ? "text-admin-accent/90" : "text-admin-ink/45"
                    }`}
                  >
                    {idx === 0 ? "Main" : `Image ${idx + 1}`}
                  </p>
                  <button
                    type="button"
                    aria-label={`Move image ${idx + 1} later`}
                    title="Move later"
                    onClick={() => moveItem(idx, idx + 1)}
                    disabled={committing || idx === items.length - 1}
                    className="rounded p-1 text-admin-ink/50 hover:bg-white hover:text-admin-accent disabled:pointer-events-none disabled:opacity-20"
                  >
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
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
