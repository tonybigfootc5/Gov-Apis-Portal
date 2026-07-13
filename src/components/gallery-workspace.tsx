"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  CheckSquare,
  Eye,
  History,
  ImagePlus,
  Images,
  MapPin,
  MoreVertical,
  Plus,
  Save,
  Search,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { optimizeImageForInlineStorage } from "@/lib/client-media";
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
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
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

  const allVisibleSelected = filteredImages.length > 0 && filteredImages.every((image) => selectedImageIds.includes(image.id));

  function handleNewPhoto() {
    setSelectedId("new");
    setDraft({
      ...emptyGalleryDraft,
      date: new Date().toISOString().slice(0, 16),
      year: new Date().getFullYear(),
    });
    setUploadAssets([]);
    setUploadNotice("");
    setActiveMenuId(null);
  }

  function handleSelectExisting(image: GalleryAdminItem) {
    setSelectedId(image.id);
    setDraft(toDraft(image));
    setUploadAssets([]);
    setUploadNotice("");
    setActiveMenuId(null);
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
          if (!file.type.startsWith("image/")) {
            throw new Error("Temporary inline storage supports images only right now.");
          }
          const optimized = await optimizeImageForInlineStorage(file, { maxSide: 1800 });

          uploaded.push({
            name: optimized.fileName,
            url: optimized.dataUrl,
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
            ? "Photo staged for gallery save."
            : `${uploaded.length} photos staged for gallery save.`,
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
    setSelectedImageIds((current) => current.filter((id) => id !== selectedImage.id));
    handleNewPhoto();
  }

  async function handleBulkDelete() {
    for (const id of selectedImageIds) {
      await onDelete(id);
    }
    setSelectedImageIds([]);
    handleNewPhoto();
  }

  async function handleQuickVisibility(image: GalleryAdminItem, published: boolean) {
    await onSave(image.id, { ...toDraft(image), published });
    setActiveMenuId(null);
  }

  function toggleSelection(id: string) {
    setSelectedImageIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleAllVisible() {
    if (allVisibleSelected) {
      setSelectedImageIds((current) => current.filter((id) => !filteredImages.some((image) => image.id === id)));
      return;
    }

    setSelectedImageIds((current) => [...new Set([...current, ...filteredImages.map((image) => image.id)])]);
  }

  return (
    <div className="grid gap-5">
      <div className="overflow-hidden rounded-[1.7rem] bg-white shadow-[0_20px_48px_rgba(23,63,51,0.08)]">
        <div className="grid grid-cols-3 text-sm font-black text-[#173f33]">
          <StepHeader active number="01" title="Images" subtitle="Add, edit, remove" />
          <StepHeader number="02" title="Details" subtitle="Caption and metadata" />
          <StepHeader number="03" title="Publish" subtitle="Visibility and archive" />
        </div>
      </div>

      <section className="rounded-[1.7rem] bg-white p-4 shadow-[0_20px_48px_rgba(23,63,51,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-[0.9rem] bg-[#f8f4ea]">
              {firstImage ? <Image src={firstImage.url} alt={firstImage.caption} fill className="object-cover" sizes="3.5rem" /> : null}
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#173f33]">Gallery Library ({images.length})</h3>
              <p className="mt-1 text-sm font-semibold text-[#607366]">{publishedCount} live, {hiddenCount} hidden, {currentYearCount} from {currentYear}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenHistory}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f7faf7] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#173f33]"
            >
              <History className="h-4 w-4" aria-hidden="true" />
              History
            </button>
            <button
              type="button"
              onClick={handleNewPhoto}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#f5c65e] px-4 text-sm font-black text-[#173f33]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add image
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-[1.2rem] bg-[#f7faf7] p-3">
          <button
            type="button"
            onClick={toggleAllVisible}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-3 text-xs font-black text-[#173f33]"
          >
            {allVisibleSelected ? <CheckSquare className="h-4 w-4" aria-hidden="true" /> : <Square className="h-4 w-4" aria-hidden="true" />}
            All images
          </button>
          <label className="flex min-w-[16rem] flex-1 items-center rounded-full bg-white px-4 lg:max-w-sm">
            <Search className="h-4 w-4 text-[#718477]" aria-hidden="true" />
            <input
              value={libraryQuery}
              onChange={(event) => setLibraryQuery(event.target.value)}
              placeholder="Search caption, place, year"
              className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-[#173f33] outline-none placeholder:text-[#90a094]"
            />
          </label>
          <select value={libraryStatus} onChange={(event) => setLibraryStatus(event.target.value as "ALL" | "PUBLISHED" | "HIDDEN")} className="h-10 rounded-full bg-white px-3 text-xs font-black text-[#607366] outline-none">
            <option value="ALL">All status</option>
            <option value="PUBLISHED">Published</option>
            <option value="HIDDEN">Hidden</option>
          </select>
          <select value={libraryCategory} onChange={(event) => setLibraryCategory(event.target.value)} className="h-10 rounded-full bg-white px-3 text-xs font-black text-[#607366] outline-none">
            <option value="ALL">All categories</option>
            {galleryCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select value={sortMode} onChange={(event) => setSortMode(event.target.value as "NEWEST" | "OLDEST")} className="h-10 rounded-full bg-white px-3 text-xs font-black text-[#607366] outline-none">
            <option value="NEWEST">Newest</option>
            <option value="OLDEST">Oldest</option>
          </select>
          {selectedImageIds.length ? (
            <button
              type="button"
              disabled={disabled}
              onClick={handleBulkDelete}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#fff0ec] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#92462d] disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete {selectedImageIds.length}
            </button>
          ) : null}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <section className="rounded-[1.7rem] bg-white p-4 shadow-[0_20px_48px_rgba(23,63,51,0.08)]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <button
              type="button"
              onClick={handleNewPhoto}
              className="flex aspect-[1.22] flex-col items-center justify-center rounded-[1.1rem] border-2 border-dashed border-[#b8c6bc] bg-[#f7faf7] text-[#173f33] transition hover:bg-[#fff8df]"
            >
              <ImagePlus className="h-8 w-8" aria-hidden="true" />
              <span className="mt-3 text-sm font-black">Add image</span>
            </button>

            {filteredImages.map((image) => (
              <GalleryImageTile
                key={image.id}
                image={image}
                selected={selectedId === image.id}
                checked={selectedImageIds.includes(image.id)}
                menuOpen={activeMenuId === image.id}
                onCheck={() => toggleSelection(image.id)}
                onSelect={() => handleSelectExisting(image)}
                onMenu={() => setActiveMenuId((current) => (current === image.id ? null : image.id))}
                onDelete={async () => {
                  await onDelete(image.id);
                  setSelectedImageIds((current) => current.filter((id) => id !== image.id));
                  setActiveMenuId(null);
                }}
                onVisibility={(published) => void handleQuickVisibility(image, published)}
              />
            ))}
          </div>

          {!filteredImages.length ? (
            <div className="mt-4 rounded-[1.2rem] border border-dashed border-[#dce4de] bg-[#f7faf7] px-4 py-10 text-center text-sm font-semibold text-[#607366]">
              No photos match the current search or filters.
            </div>
          ) : null}
        </section>

        <GalleryInspector
          disabled={disabled}
          draft={draft}
          selectedImage={selectedImage}
          uploadAssets={uploadAssets}
          uploadNotice={uploadNotice}
          uploadedCount={uploadedCount}
          isUploading={isUploading}
          onDraftChange={updateDraft}
          onFileUpload={handleFileUpload}
          onCreate={handleCreate}
          onSave={handleSave}
          onDelete={handleDelete}
          onReset={handleNewPhoto}
        />
      </div>
    </div>
  );
}

function StepHeader({ active, number, title, subtitle }: { active?: boolean; number: string; title: string; subtitle: string }) {
  return (
    <div className={`relative px-5 py-4 ${active ? "bg-[#bde8b7]" : "bg-white"}`}>
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-black ${active ? "border-[#173f33] bg-white text-[#173f33]" : "border-[#cfd8d2] text-[#607366]"}`}>{number}</span>
        <div>
          <p className="text-sm font-black text-[#173f33]">{title}</p>
          <p className="mt-0.5 text-xs font-semibold text-[#607366]">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function GalleryImageTile({
  image,
  selected,
  checked,
  menuOpen,
  onCheck,
  onSelect,
  onMenu,
  onDelete,
  onVisibility,
}: {
  image: GalleryAdminItem;
  selected: boolean;
  checked: boolean;
  menuOpen: boolean;
  onCheck: () => void;
  onSelect: () => void;
  onMenu: () => void;
  onDelete: () => void;
  onVisibility: (published: boolean) => void;
}) {
  return (
    <article className={`group relative rounded-[1.1rem] border bg-white p-2 shadow-[0_10px_24px_rgba(23,63,51,0.06)] ${selected ? "border-[#173f33]" : "border-[#e2e8e3]"}`}>
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div className="relative aspect-[1.45] overflow-hidden rounded-[0.85rem] bg-[#f7faf7]">
          <Image src={image.url} alt={image.caption} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
        </div>
        <p className="mt-2 truncate text-sm font-black text-[#173f33]">{image.caption || "Untitled photo"}</p>
        <p className="mt-1 truncate text-xs font-semibold text-[#718477]">{getGalleryCategoryLabel(image.category)}</p>
      </button>
      <button
        type="button"
        onClick={onCheck}
        className="absolute left-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-[0.35rem] bg-white text-[#173f33] shadow-[0_6px_14px_rgba(23,63,51,0.14)]"
        aria-label="Select image"
      >
        {checked ? <CheckSquare className="h-4 w-4" aria-hidden="true" /> : <Square className="h-4 w-4" aria-hidden="true" />}
      </button>
      <button
        type="button"
        onClick={onMenu}
        className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#173f33] shadow-[0_6px_14px_rgba(23,63,51,0.14)]"
        aria-label="Image actions"
      >
        <MoreVertical className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className={`absolute bottom-[3.9rem] left-3 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${image.published ? "bg-[#eef8f1] text-[#1f6b4b]" : "bg-[#fff5ea] text-[#8c4d1e]"}`}>
        {image.published ? "Live" : "Hidden"}
      </span>
      {menuOpen ? (
        <div className="absolute right-3 top-11 z-20 w-52 rounded-[0.9rem] border border-[#dce4de] bg-white p-2 shadow-[0_18px_38px_rgba(23,63,51,0.16)]">
          <ActionMenuButton onClick={onSelect}>Edit details</ActionMenuButton>
          <ActionMenuButton onClick={() => onVisibility(!image.published)}>{image.published ? "Hide image" : "Publish image"}</ActionMenuButton>
          <ActionMenuButton onClick={onSelect}>View metadata</ActionMenuButton>
          <ActionMenuButton danger onClick={onDelete}>Delete image</ActionMenuButton>
        </div>
      ) : null}
    </article>
  );
}

function GalleryInspector({
  disabled,
  draft,
  selectedImage,
  uploadAssets,
  uploadNotice,
  uploadedCount,
  isUploading,
  onDraftChange,
  onFileUpload,
  onCreate,
  onSave,
  onDelete,
  onReset,
}: {
  disabled: boolean;
  draft: GalleryDraftInput;
  selectedImage: GalleryAdminItem | null;
  uploadAssets: UploadAsset[];
  uploadNotice: string;
  uploadedCount: number;
  isUploading: boolean;
  onDraftChange: <K extends keyof GalleryDraftInput>(key: K, value: GalleryDraftInput[K]) => void;
  onFileUpload: (files: FileList | null) => void;
  onCreate: () => Promise<void>;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  onReset: () => void;
}) {
  return (
    <aside className="sticky top-4 rounded-[1.7rem] bg-white p-4 shadow-[0_20px_48px_rgba(23,63,51,0.08)]">
      <div className="overflow-hidden rounded-[1.25rem] bg-[#f7faf7]">
        <div className="relative aspect-[4/3]">
          {draft.url ? (
            <Image src={draft.url} alt={draft.caption || "Gallery preview"} fill className="object-cover" sizes="26rem" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImagePlus className="h-10 w-10 text-[#9c6a18]" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">{selectedImage ? "Edit image" : "New upload"}</p>
          <p className="mt-1 text-lg font-black text-[#173f33]">{selectedImage ? "Image details" : "Upload details"}</p>
        </div>
        <span className="rounded-full bg-[#eef3ef] px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#607366]">
          {selectedImage ? "Existing" : "New"}
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="rounded-[1.2rem] border border-dashed border-[#dce4de] bg-[#fbfdfb] p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-[#173f33]">Upload photos</p>
            <span className="rounded-full bg-[#eef8f1] px-2 py-1 text-[10px] font-black text-[#1f6b4b]">
              {uploadedCount ? `${uploadedCount} selected` : "Queue empty"}
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => onFileUpload(event.target.files)}
            className="mt-3 block w-full rounded-[0.9rem] border border-[#e2e8e3] bg-white px-3 py-3 text-sm text-[#173f33]"
          />
          {uploadAssets.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {uploadAssets.map((asset) => (
                <span key={asset.url} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#607366]">
                  {truncateLabel(asset.name, 24)}
                </span>
              ))}
            </div>
          ) : null}
          {uploadNotice ? <p className="mt-3 text-sm font-semibold text-[#1f6b4b]">{uploadNotice}</p> : null}
          {isUploading ? <p className="mt-2 text-sm font-semibold text-[#9c6a18]">Preparing images...</p> : null}
        </div>

        <Field label="Caption">
          <input value={draft.caption} onChange={(event) => onDraftChange("caption", event.target.value)} className={fieldClass()} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <Field label="Date">
            <input type="datetime-local" value={draft.date} onChange={(event) => onDraftChange("date", event.target.value)} className={fieldClass()} />
          </Field>
          <Field label="Year">
            <input type="number" value={draft.year} onChange={(event) => onDraftChange("year", Number(event.target.value))} className={fieldClass()} />
          </Field>
        </div>
        <Field label="Place">
          <input value={draft.place ?? ""} onChange={(event) => onDraftChange("place", event.target.value)} className={fieldClass()} />
        </Field>
        <Field label="Category">
          <select value={draft.category} onChange={(event) => onDraftChange("category", event.target.value)} className={fieldClass()}>
            {galleryCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </Field>
        <button
          type="button"
          onClick={() => onDraftChange("published", !draft.published)}
          className="flex items-center justify-between rounded-[1rem] bg-[#f7faf7] px-3 py-3 text-sm font-black text-[#173f33]"
        >
          {draft.published ? "Visible on gallery" : "Hidden from gallery"}
          <span className={`relative inline-flex h-7 w-12 rounded-full ${draft.published ? "bg-[#34c759]" : "bg-[#d6d4cd]"}`}>
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${draft.published ? "left-6" : "left-1"}`} />
          </span>
        </button>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          <button
            type="button"
            disabled={disabled || isUploading || !draft.url}
            onClick={selectedImage ? onSave : onCreate}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-3 text-sm font-black text-[#fff9ec] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {selectedImage ? <Save className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            {selectedImage ? "Save changes" : "Save upload"}
          </button>
          {selectedImage ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={disabled}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#fff0ec] px-4 py-3 text-sm font-black text-[#92462d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
            </button>
          ) : (
            <button type="button" onClick={onReset} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#eef3ef] px-4 py-3 text-sm font-black text-[#173f33]">
              <X className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <MiniInfo icon={<MapPin className="h-4 w-4" aria-hidden="true" />} label="Place">{draft.place || "Location can be added later"}</MiniInfo>
        <MiniInfo icon={<Images className="h-4 w-4" aria-hidden="true" />} label="Category">{getGalleryCategoryLabel(draft.category)}</MiniInfo>
        <MiniInfo icon={<Eye className="h-4 w-4" aria-hidden="true" />} label="Status">{draft.published ? "Public" : "Hidden"}</MiniInfo>
      </div>
    </aside>
  );
}

function ActionMenuButton({ children, danger, onClick }: { children: React.ReactNode; danger?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full rounded-[0.6rem] px-3 py-2 text-left text-sm font-semibold hover:bg-[#f7faf7] ${danger ? "text-[#92462d]" : "text-[#173f33]"}`}
    >
      {children}
    </button>
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
    <div className="rounded-[1rem] bg-[#f7faf7] p-3">
      <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#9c6a18]">
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
  return "w-full rounded-[1rem] border border-[#e2e8e3] bg-[#f8f4ea] px-3 py-2.5 text-sm text-[#173f33] outline-none ring-[#d9a127] transition focus:bg-white focus:ring-2";
}

function truncateLabel(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}
