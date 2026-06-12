"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  History,
  ImagePlus,
  Images,
  MapPin,
  Plus,
  Save,
  Search,
  SlidersHorizontal,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { getPresignedUploadUrlAction } from "@/app/actions/storage";
import { galleryCategoryOptions, getGalleryCategoryLabel } from "@/lib/gallery";

export type GalleryAdminItem = {
  id: string;
  url: string;
  caption: string;
  date: string;
  place: string | null;
  category: string;
  year: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type GalleryDraftInput = Omit<GalleryAdminItem, "id" | "createdAt" | "updatedAt">;

type UploadAsset = {
  name: string;
  url: string;
};

const emptyGalleryDraft: GalleryDraftInput = {
  url: "",
  caption: "",
  date: new Date().toISOString().slice(0, 16),
  place: "",
  category: "TRAINING_PROGRAMS",
  year: new Date().getFullYear(),
  published: true,
};

export function GalleryWorkspace({
  disabled,
  images,
  onOpenHistory,
  onCreate,
  onSave,
  onDelete,
}: {
  disabled: boolean;
  images: GalleryAdminItem[];
  onOpenHistory: () => void;
  onCreate: (records: GalleryDraftInput[]) => Promise<void>;
  onSave: (id: string, record: GalleryDraftInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const firstImage = images[0] ?? null;
  const [selectedId, setSelectedId] = useState<string | "new">(firstImage?.id ?? "new");
  const [draft, setDraft] = useState<GalleryDraftInput>(
    firstImage
      ? toDraft(firstImage)
      : {
          ...emptyGalleryDraft,
          date: new Date().toISOString().slice(0, 16),
          year: new Date().getFullYear(),
        },
  );
  const [uploadAssets, setUploadAssets] = useState<UploadAsset[]>([]);
  const [uploadNotice, setUploadNotice] = useState("");
  const [libraryQuery, setLibraryQuery] = useState("");
  const [libraryStatus, setLibraryStatus] = useState<"ALL" | "PUBLISHED" | "HIDDEN">("ALL");
  const [libraryCategory, setLibraryCategory] = useState<string>("ALL");
  const [sortMode, setSortMode] = useState<"NEWEST" | "OLDEST">("NEWEST");
  const [libraryCollapsed, setLibraryCollapsed] = useState(false);
  const [isUploading, startUploadTransition] = useTransition();

  const selectedImage = useMemo(
    () => (selectedId === "new" ? null : images.find((image) => image.id === selectedId) ?? images[0] ?? null),
    [images, selectedId],
  );

  const publishedCount = images.filter((image) => image.published).length;
  const hiddenCount = images.length - publishedCount;
  const currentYear = new Date().getFullYear();
  const currentYearCount = images.filter((image) => image.year === currentYear).length;
  const uploadedCount = uploadAssets.length;

  const filteredImages = useMemo(() => {
    const normalizedQuery = libraryQuery.trim().toLowerCase();

    return [...images]
      .filter((image) => {
        if (libraryStatus === "PUBLISHED" && !image.published) return false;
        if (libraryStatus === "HIDDEN" && image.published) return false;
        if (libraryCategory !== "ALL" && image.category !== libraryCategory) return false;
        if (!normalizedQuery) return true;

        const haystack = `${image.caption} ${image.place ?? ""} ${getGalleryCategoryLabel(image.category)} ${image.year}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .sort((left, right) => {
        const delta = new Date(right.date).getTime() - new Date(left.date).getTime();
        return sortMode === "NEWEST" ? delta : -delta;
      });
  }, [images, libraryCategory, libraryQuery, libraryStatus, sortMode]);

  function handleNewPhoto() {
    setSelectedId("new");
    setDraft({
      ...emptyGalleryDraft,
      date: new Date().toISOString().slice(0, 16),
      year: new Date().getFullYear(),
    });
    setUploadAssets([]);
    setUploadNotice("");
  }

  function handleSelectExisting(image: GalleryAdminItem) {
    setSelectedId(image.id);
    setDraft(toDraft(image));
    setUploadAssets([]);
    setUploadNotice("");
  }

  function updateDraft<K extends keyof GalleryDraftInput>(key: K, value: GalleryDraftInput[K]) {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      if (key === "date") {
        const nextYear = new Date(String(value)).getFullYear();
        if (!Number.isNaN(nextYear)) next.year = nextYear;
      }
      return next;
    });
  }

  function normalizeCaptionFromFilename(name: string) {
    return name
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function handleFileUpload(files: FileList | null) {
    if (!files?.length) return;

    const incoming = Array.from(files);
    startUploadTransition(async () => {
      try {
        const uploaded: UploadAsset[] = [];
        for (const file of incoming) {
          const { uploadUrl, publicUrl } = await getPresignedUploadUrlAction(file.name, file.type, "gallery");
          const response = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          if (!response.ok) {
            throw new Error(`Upload failed for ${file.name}.`);
          }

          uploaded.push({
            name: file.name,
            url: publicUrl,
          });
        }

        setUploadAssets(uploaded);
        setDraft((current) => ({
          ...current,
          url: uploaded[0]?.url ?? current.url,
          caption: current.caption || normalizeCaptionFromFilename(uploaded[0]?.name ?? ""),
        }));
        setUploadNotice(
          uploaded.length === 1
            ? "Photo uploaded and ready for the gallery."
            : `${uploaded.length} photos uploaded and ready for the gallery.`,
        );
      } catch (error) {
        setUploadNotice(error instanceof Error ? error.message : "Gallery upload failed.");
      }
    });
  }

  async function handleCreate() {
    const records = (uploadAssets.length
      ? uploadAssets
      : [{ name: draft.caption || "gallery-image", url: draft.url }]).map((asset, index) => ({
      ...draft,
      url: asset.url,
      caption:
        uploadAssets.length > 1
          ? `${draft.caption || normalizeCaptionFromFilename(asset.name)} ${index + 1}`
          : draft.caption || normalizeCaptionFromFilename(asset.name),
    }));

    await onCreate(records);
    handleNewPhoto();
  }

  async function handleSave() {
    if (!selectedImage) return;
    await onSave(selectedImage.id, draft);
  }

  async function handleDelete() {
    if (!selectedImage) return;
    await onDelete(selectedImage.id);
    handleNewPhoto();
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <StatTile label="Frames" value={String(images.length)} tone="neutral" />
          <StatTile label="Live" value={String(publishedCount)} tone="green" />
          <StatTile label="Hidden" value={String(hiddenCount)} tone="gold" />
          <StatTile label="This Year" value={String(currentYearCount)} tone="neutral" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(23,63,51,0.12)] bg-[#f8f4ea] px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-[#173f33]"
          >
            <History className="h-4 w-4" aria-hidden="true" />
            History
          </button>
          <button
            type="button"
            onClick={handleNewPhoto}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ebb428] px-5 py-3 text-sm font-black text-[#173f33] shadow-[0_14px_30px_rgba(235,180,40,0.18)]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New upload
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-start">
        <aside
          className={`rounded-[2rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] shadow-[0_18px_40px_rgba(64,44,8,0.06)] transition-all duration-300 ease-out ${
            libraryCollapsed ? "xl:w-[5.5rem]" : "xl:w-[24rem]"
          }`}
        >
          <div className={`p-4 ${libraryCollapsed ? "flex h-full flex-col items-center gap-4" : ""}`}>
            <div className={`flex items-start ${libraryCollapsed ? "w-full flex-col items-center gap-3" : "justify-between gap-3"}`}>
              {libraryCollapsed ? (
                <>
                  <button
                    type="button"
                    onClick={() => setLibraryCollapsed(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(23,63,51,0.12)] bg-[#f8f4ea] text-[#173f33]"
                    aria-label="Open photo library"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <div className="rounded-full bg-[#173f33] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#fff9ec] [writing-mode:vertical-rl] rotate-180">
                    {filteredImages.length} shown
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">Photo library</p>
                    <p className="mt-2 text-sm leading-6 text-[#607366]">Search, filter, and reopen any saved gallery frame fast.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#173f33] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#fff9ec]">
                      {filteredImages.length} shown
                    </span>
                    <button
                      type="button"
                      onClick={() => setLibraryCollapsed(true)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(23,63,51,0.12)] bg-[#f8f4ea] text-[#173f33]"
                      aria-label="Collapse photo library"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {!libraryCollapsed ? (
              <>
                <div className="mt-4 grid gap-3">
                  <label className="relative block">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b8d80]" aria-hidden="true" />
                    <input
                      value={libraryQuery}
                      onChange={(event) => setLibraryQuery(event.target.value)}
                      placeholder="Search caption or place"
                      className="w-full rounded-[1rem] border border-[rgba(27,59,43,0.1)] bg-[#f8f4ea] py-3 pl-11 pr-4 text-sm text-[#173f33] outline-none ring-[#d9a127] transition focus:bg-white focus:ring-2"
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Status">
                      <select value={libraryStatus} onChange={(event) => setLibraryStatus(event.target.value as "ALL" | "PUBLISHED" | "HIDDEN")} className={fieldClass()}>
                        <option value="ALL">All photos</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="HIDDEN">Hidden</option>
                      </select>
                    </Field>
                    <Field label="Sort">
                      <select value={sortMode} onChange={(event) => setSortMode(event.target.value as "NEWEST" | "OLDEST")} className={fieldClass()}>
                        <option value="NEWEST">Newest first</option>
                        <option value="OLDEST">Oldest first</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Category">
                    <div className="relative">
                      <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b8d80]" aria-hidden="true" />
                      <select value={libraryCategory} onChange={(event) => setLibraryCategory(event.target.value)} className={`${fieldClass()} pl-11`}>
                        <option value="ALL">All categories</option>
                        {galleryCategoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Field>
                </div>

                <div className="mt-4 grid max-h-[52rem] gap-3 overflow-y-auto pr-1">
                  {filteredImages.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => handleSelectExisting(image)}
                      className={`rounded-[1.35rem] border p-3 text-left transition ${
                        selectedId === image.id
                          ? "border-[rgba(23,63,51,0.18)] bg-[#173f33] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.14)]"
                          : "border-[rgba(27,59,43,0.08)] bg-[#faf7ef] text-[#173f33] hover:bg-[#f3ecdf]"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem]">
                          <Image src={image.url} alt={image.caption} fill className="object-cover" sizes="5rem" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                                image.published
                                  ? selectedId === image.id
                                    ? "bg-[rgba(255,255,255,0.14)] text-[#e4f6ea]"
                                    : "bg-[#eef8f1] text-[#21533f]"
                                  : selectedId === image.id
                                    ? "bg-[rgba(255,255,255,0.14)] text-[#fff2d7]"
                                    : "bg-[#fff5ea] text-[#8c4d1e]"
                              }`}
                            >
                              {image.published ? "Published" : "Hidden"}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                                selectedId === image.id ? "bg-[rgba(255,255,255,0.14)] text-[#f4e7bd]" : "bg-[#f6efe4] text-[#9c6a18]"
                              }`}
                            >
                              {image.year}
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6">{image.caption}</p>
                          <p className={`mt-1 text-xs ${selectedId === image.id ? "text-[#dde4dc]" : "text-[#607366]"}`}>
                            {formatDateLabel(image.date)}
                            {image.place ? ` | ${truncateLabel(image.place, 28)}` : ""}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}

                  {!filteredImages.length ? (
                    <div className="rounded-[1.35rem] border border-dashed border-[rgba(27,59,43,0.14)] bg-[#faf8f2] px-4 py-8 text-center text-sm text-[#607366]">
                      No photos match the current search or filters.
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </aside>

        <section className="rounded-[2rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-5 shadow-[0_24px_60px_rgba(64,44,8,0.07)]">
          <div className="grid gap-6 lg:grid-cols-[24rem_minmax(0,1fr)] lg:items-start">
            <div className="grid gap-5">
              <div className="overflow-hidden rounded-[1.8rem] border border-[rgba(27,59,43,0.1)] bg-[#f8f4ea]">
                <div className="relative aspect-[4/5] w-full">
                  {draft.url ? (
                    <Image
                      src={draft.url}
                      alt={draft.caption || "Gallery preview"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 24rem"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(235,180,40,0.22),transparent_18rem),linear-gradient(180deg,rgba(244,236,220,0.95),rgba(231,239,233,0.95))]">
                      <div className="px-8 text-center text-[#607366]">
                        <ImagePlus className="mx-auto h-12 w-12 text-[#b36b00]" aria-hidden="true" />
                        <p className="mt-4 text-sm leading-6">Upload a photo and it will appear here instantly for review.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-dashed border-[rgba(27,59,43,0.18)] bg-[#faf8f2] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#173f33]">Upload photos</p>
                    <p className="mt-1 text-sm text-[#607366]">Add one or many photos, then save them with the right metadata.</p>
                  </div>
                  <span className="rounded-full bg-[#eef8f1] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#21533f]">
                    {uploadedCount ? `${uploadedCount} ready` : "No queue"}
                  </span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => handleFileUpload(event.target.files)}
                  className="mt-4 block w-full rounded-[1rem] border border-[rgba(27,59,43,0.08)] bg-white px-3 py-3 text-sm text-[#173f33]"
                />

                {uploadAssets.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {uploadAssets.map((asset) => (
                      <span
                        key={asset.url}
                        className="rounded-full bg-[#fffdf8] px-3 py-1.5 text-xs font-semibold text-[#516253] shadow-[0_8px_18px_rgba(64,44,8,0.05)]"
                      >
                        {truncateLabel(asset.name, 26)}
                      </span>
                    ))}
                  </div>
                ) : null}

                {uploadNotice ? <p className="mt-4 text-sm font-semibold text-[#21533f]">{uploadNotice}</p> : null}
                {isUploading ? <p className="mt-2 text-sm font-semibold text-[#9c6a18]">Uploading to Cloudflare R2...</p> : null}

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MiniInfo icon={<UploadCloud className="h-4 w-4" aria-hidden="true" />} label="Direct upload">
                    Straight to R2
                  </MiniInfo>
                  <MiniInfo icon={<Images className="h-4 w-4" aria-hidden="true" />} label="Multi-select">
                    Add several photos
                  </MiniInfo>
                  <MiniInfo icon={<Eye className="h-4 w-4" aria-hidden="true" />} label="Review">
                    Check before publish
                  </MiniInfo>
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-[1.6rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-4 shadow-[0_14px_30px_rgba(64,44,8,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">
                      {selectedImage ? "Edit photo" : "Photo details"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#607366]">
                      Keep the metadata short, clear, and easy to scan on the live gallery.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f6efe4] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">
                    {selectedImage ? "Existing" : "New"}
                  </span>
                </div>

                <div className="mt-4 grid gap-4">
                  <Field label="Caption">
                    <input value={draft.caption} onChange={(event) => updateDraft("caption", event.target.value)} className={fieldClass()} />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Date & Time">
                      <input type="datetime-local" value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} className={fieldClass()} />
                    </Field>
                    <Field label="Year">
                      <input type="number" value={draft.year} onChange={(event) => updateDraft("year", Number(event.target.value))} className={fieldClass()} />
                    </Field>
                  </div>

                  <Field label="Location / Place">
                    <input value={draft.place ?? ""} onChange={(event) => updateDraft("place", event.target.value)} className={fieldClass()} />
                  </Field>

                  <Field label="Category">
                    <select value={draft.category} onChange={(event) => updateDraft("category", event.target.value)} className={fieldClass()}>
                      {galleryCategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="grid gap-4 rounded-[1.4rem] border border-[rgba(27,59,43,0.08)] bg-[#f8f4ea] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div>
                      <p className="text-sm font-black text-[#173f33]">
                        {draft.published ? "Visible on public gallery" : "Hidden from public gallery"}
                      </p>
                      <p className="mt-1 text-sm text-[#607366]">
                        Use this toggle only when the photo is approved and ready for visitors.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateDraft("published", !draft.published)}
                      className={`relative inline-flex h-8 w-14 rounded-full transition ${draft.published ? "bg-[#34c759]" : "bg-[#d6d4cd]"}`}
                      aria-label="Toggle gallery visibility"
                    >
                      <span
                        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.16)] transition ${
                          draft.published ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="button"
                      disabled={disabled || isUploading || !draft.url}
                      onClick={selectedImage ? handleSave : handleCreate}
                      className="inline-flex min-w-[10rem] items-center justify-center gap-2 rounded-full bg-[#173f33] px-5 py-3 text-sm font-black text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {selectedImage ? <Save className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                      {selectedImage ? "Save photo" : "Save upload"}
                    </button>

                    {selectedImage ? (
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={disabled}
                        className="inline-flex min-w-[9rem] items-center justify-center gap-2 rounded-full border border-[rgba(146,70,45,0.16)] bg-[#fff8f5] px-5 py-3 text-sm font-black text-[#92462d] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Delete
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNewPhoto}
                        className="inline-flex min-w-[8rem] items-center justify-center gap-2 rounded-full border border-[rgba(27,59,43,0.12)] bg-[#f8f4ea] px-5 py-3 text-sm font-black text-[#173f33]"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MiniInfo icon={<MapPin className="h-4 w-4" aria-hidden="true" />} label="Place">
                  {draft.place || "Add the exact location for quick archive search"}
                </MiniInfo>
                <MiniInfo icon={<Images className="h-4 w-4" aria-hidden="true" />} label="Category">
                  {getGalleryCategoryLabel(draft.category)}
                </MiniInfo>
                <MiniInfo icon={<Eye className="h-4 w-4" aria-hidden="true" />} label="Status">
                  {draft.published ? "Live on public gallery" : "Hidden until review"}
                </MiniInfo>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function toDraft(image: GalleryAdminItem): GalleryDraftInput {
  return {
    url: image.url,
    caption: image.caption,
    date: image.date.slice(0, 16),
    place: image.place ?? "",
    category: image.category,
    year: image.year,
    published: image.published,
  };
}

function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "green" | "gold";
}) {
  const className =
    tone === "green"
      ? "bg-[#eef8f1] text-[#21533f] border-[rgba(33,83,63,0.12)]"
      : tone === "gold"
        ? "bg-[#fff7df] text-[#946600] border-[rgba(148,102,0,0.12)]"
        : "bg-[#fffdf8] text-[#173f33] border-[rgba(27,59,43,0.08)]";

  return (
    <div className={`rounded-[1.6rem] border px-4 py-3 shadow-[0_14px_30px_rgba(64,44,8,0.05)] ${className}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.18em]">{label}</p>
      <p className="font-display mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function MiniInfo({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.2rem] border border-[rgba(27,59,43,0.08)] bg-[#faf7ef] p-3">
      <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#516253]">{children}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#718477]">
      {label}
      {children}
    </label>
  );
}

function fieldClass() {
  return "w-full rounded-[1.2rem] border border-[rgba(27,59,43,0.12)] bg-[#f8f4ea] px-4 py-3 text-sm text-[#173f33] outline-none ring-[#d9a127] transition focus:bg-white focus:ring-2";
}

function formatDateLabel(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function truncateLabel(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}
