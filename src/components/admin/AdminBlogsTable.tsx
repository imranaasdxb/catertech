"use client";

import BlogEditClient from "@/app/admin/blogs/[id]/BlogEditClient";
import { admin, adminCardShadow } from "@/components/admin/adminTheme";
import { AdminPanelModal } from "@/components/admin/AdminPanelModal";
import { AdminTypedDeleteDialog } from "@/components/admin/AdminTypedDeleteDialog";
import { blogPosts } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type AdminBlogListRow = {
  id: string;
  title: string;
  slug: string;
  excerptSnippet: string | null;
  published: boolean;
  thumbUrl: string | null;
};

type BlogRow = InferSelectModel<typeof blogPosts>;

function Thumb({ url }: { url: string | null }) {
  if (!url) {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ede9f7] to-[#e4ddf3] text-[11px] font-semibold text-[#5B2D9B]/45">
        —
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- admin list; external R2 URLs
    <img
      src={url}
      alt=""
      className="h-11 w-11 shrink-0 rounded-xl border border-black/8 object-cover shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    />
  );
}

export default function AdminBlogsTable({ rows }: { rows: AdminBlogListRow[] }) {
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBlogListRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editPost, setEditPost] = useState<BlogRow | null>(null);
  const [editLoadErr, setEditLoadErr] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [viewPost, setViewPost] = useState<BlogRow | null>(null);
  const [viewLoadErr, setViewLoadErr] = useState("");
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    if (!editId) {
      setEditPost(null);
      setEditLoadErr("");
      setEditLoading(false);
      return;
    }
    let cancelled = false;
    setEditLoading(true);
    setEditPost(null);
    setEditLoadErr("");
    fetch(`/api/admin/blogs/${editId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Could not load post");
        return r.json();
      })
      .then((data: BlogRow) => {
        if (!cancelled) setEditPost(data);
      })
      .catch(() => {
        if (!cancelled) setEditLoadErr("Unable to load this post.");
      })
      .finally(() => {
        if (!cancelled) setEditLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [editId]);

  useEffect(() => {
    if (!viewId) {
      setViewPost(null);
      setViewLoadErr("");
      setViewLoading(false);
      return;
    }
    let cancelled = false;
    setViewLoading(true);
    setViewPost(null);
    setViewLoadErr("");
    fetch(`/api/admin/blogs/${viewId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Could not load post");
        return r.json();
      })
      .then((data: BlogRow) => {
        if (!cancelled) setViewPost(data);
      })
      .catch(() => {
        if (!cancelled) setViewLoadErr("Unable to load this post.");
      })
      .finally(() => {
        if (!cancelled) setViewLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [viewId]);

  const viewRowMeta = rows.find((r) => r.id === viewId);

  return (
    <div className="mx-auto w-full max-w-6xl lg:max-w-7xl">
      <AdminPanelModal
        open={Boolean(editId)}
        title="Edit post"
        subtitle="Changes apply when you save."
        widthClass="max-w-[min(100%-1rem,48rem)]"
        onClose={() => setEditId(null)}
      >
        {editLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-[#1a1a1a]/50">
            <Loader2 className="h-8 w-8 animate-spin text-[#5B2D9B]" aria-hidden />
            <p className="text-sm">Loading editor…</p>
          </div>
        ) : editLoadErr ? (
          <p className={`${admin.error} text-center py-8`}>{editLoadErr}</p>
        ) : editPost ? (
          <BlogEditClient
            variant="modal"
            post={editPost}
            onDeleted={() => {
              setEditId(null);
              void router.refresh();
            }}
          />
        ) : null}
      </AdminPanelModal>

      <AdminPanelModal
        open={Boolean(viewId)}
        title={viewPost?.title ?? viewRowMeta?.title ?? "View post"}
        subtitle={viewPost?.published ? "Published article" : "Draft (not public)"}
        widthClass="max-w-[min(100%-1rem,44rem)]"
        onClose={() => setViewId(null)}
      >
        {viewLoading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-[#1a1a1a]/50">
            <Loader2 className="h-8 w-8 animate-spin text-[#5B2D9B]" />
            <p className="text-sm">Loading…</p>
          </div>
        ) : viewLoadErr ? (
          <p className={`${admin.error} text-center py-8`}>{viewLoadErr}</p>
        ) : viewPost ? (
          <div className="space-y-5 rounded-xl border border-black/8 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`rounded-full px-3 py-1 ${admin.secondaryBtn} border-black/10`}>/{viewPost.slug}</span>
              {viewPost.published ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800">Published</span>
              ) : (
                <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-900">Draft</span>
              )}
            </div>
            {(viewPost.coverImage ?? viewPost.images?.[0]) ? (
              <div className="overflow-hidden rounded-lg border border-black/6 bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={(viewPost.coverImage ?? viewPost.images?.[0])!}
                  alt=""
                  className="max-h-56 w-full object-cover object-center"
                />
              </div>
            ) : null}
            {viewPost.excerpt ? (
              <p className="text-sm leading-relaxed text-[#1a1a1a]/55">{viewPost.excerpt}</p>
            ) : null}
            <div
              className="rounded-lg border border-black/6 bg-[#faf8ff]/60 p-4 text-sm leading-relaxed text-[#1a1a1a]/90 [&_img]:max-w-full [&_video]:max-w-full"
              dangerouslySetInnerHTML={{ __html: viewPost.content }}
            />
          </div>
        ) : null}
      </AdminPanelModal>

      <AdminTypedDeleteDialog
        open={Boolean(deleteTarget)}
        noun="post"
        highlight={deleteTarget?.title}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          setDeletingId(deleteTarget.id);
          try {
            const res = await fetch(`/api/admin/blogs/${deleteTarget.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            router.refresh();
          } finally {
            setDeletingId(null);
          }
        }}
      />

      <div className={admin.tableShell} style={adminCardShadow}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/[0.07] bg-gradient-to-b from-[#faf9fc] via-[#f7f6fa] to-[#f3f1f7]">
                <th
                  scope="col"
                  className="w-14 px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/40"
                >
                  <span className="sr-only">Thumb</span>
                  <span aria-hidden className="text-[#1a1a1a]/30">
                    •
                  </span>
                </th>
                <th
                  scope="col"
                  className="min-w-[200px] max-w-[28%] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/40"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="w-[15%] min-w-[8.5rem] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/40"
                >
                  Slug
                </th>
                <th
                  scope="col"
                  className="min-w-[14rem] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/40"
                >
                  Excerpt
                </th>
                <th
                  scope="col"
                  className="w-[6.5rem] px-3 py-3.5 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/40"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="w-[7.25rem] px-3 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/40"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-black/[0.05] transition-colors last:border-b-0 hover:bg-[#5B2D9B]/[0.035]"
                >
                  <td className="px-4 py-3 align-middle">
                    <Thumb url={r.thumbUrl} />
                  </td>
                  <td className="max-w-0 px-4 py-3 align-middle">
                    <p className="truncate font-semibold leading-snug text-[#1a1a1a]" title={r.title}>
                      {r.title}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <p
                      className="truncate font-mono text-[12px] leading-snug text-[#1a1a1a]/58"
                      title={r.slug}
                    >
                      {r.slug}
                    </p>
                  </td>
                  <td className="max-w-0 px-4 py-3 align-middle">
                    <p
                      className="line-clamp-2 text-[13px] leading-[1.45] text-[#1a1a1a]/52"
                      title={r.excerptSnippet ?? undefined}
                    >
                      {r.excerptSnippet ?? "—"}
                    </p>
                  </td>
                  <td className="px-3 py-3 align-middle text-center">
                    {r.published ? (
                      <span className="inline-flex min-w-[4.25rem] justify-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200/60">
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex min-w-[4.25rem] justify-center rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-neutral-600 ring-1 ring-black/6">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <div className="flex items-center justify-end gap-0.5">
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#5B2D9B] transition-colors hover:bg-[#5B2D9B]/12"
                        title="Edit"
                        aria-label={`Edit ${r.title}`}
                        onClick={() => setEditId(r.id)}
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#1a1a1a]/60 transition-colors hover:bg-black/[0.06]"
                        title="View"
                        aria-label={`View ${r.title}`}
                        onClick={() => setViewId(r.id)}
                      >
                        <Eye className="h-4 w-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === r.id}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-600 transition-colors hover:bg-red-50 disabled:opacity-45"
                        title="Delete"
                        aria-label={`Delete ${r.title}`}
                        onClick={() => setDeleteTarget(r)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className={admin.emptyCell}>
                    No posts yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
