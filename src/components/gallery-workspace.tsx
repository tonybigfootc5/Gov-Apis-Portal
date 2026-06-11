"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { History, Images, MapPin, Plus, Save, Trash2, UploadCloud } from "lucide-react";
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
      ? {
          url: firstImage.url,
          caption: firstImage.caption,
          date: firstImage.date.slice(0, 16),
          place: firstImage.place ?? "",
          category: firstImage.category,
          year: firstImage.year,
          published: firstImage.published,
        }
      : {
          ...emptyGalleryDraft,
          date: new Date().toISOString().slice(0, 16),
          year: new Date().getFullYear(),
        },
  );
  const [uploadAssets, setUploadAssets] = useState<UploadAsset[]>([]);
  const [uploadNotice, setUploadNotice] = useState("");
  const [isUploading, startUploadTransition] = useTransition();

  const selectedImage = useMemo(
    () => (selectedId === "new" ? null : images.find((image) => image.id === selectedId) ?? images[0] ?? null),
    [images, selectedId],
  );

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
    setDraft({
      url: image.url,
      caption: image.caption,
      date: image.date.slice(0, 16),
      place: image.place ?? "",
      category: image.category,
      year: image.year,
      published: image.published,
    });
    setUploadAssets([]);
    setUploadNotice("");
  }

  function updateDraft<K extends keyof GalleryDraftInput>(key: K, value: GalleryDraftInput[K]) {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      if (key === "date") {
        next.year = new Date(String(value)).getFullYear();
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
            headers: {
              "Content-Type": file.type,
            },
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
            ? "Image uploaded and ready to save."
            : `${uploaded.length} images uploaded and ready to save.`,
        );
      } catch (error) {
        setUploadNotice(error instanceof Error ? error.message : "Gallery upload failed.");
      }
    });
  }

  async function handleCreate() {
    const records = (uploadAssets.length ? uploadAssets : [{ name: draft.caption || "gallery-image", url: draft.url }]).map(
      (asset, index) => ({
        ...draft,
        url: asset.url,
        caption:
          uploadAssets.length > 1
            ? `${draft.caption || normalizeCaptionFromFilename(asset.name)} ${index + 1}`
            : draft.caption || normalizeCaptionFromFilename(asset.name),
      }),
    );

    await onCreate(records);
    setSelectedId(images[0]?.id ?? "new");
  }

  async function handleSave() {
    if (!selectedImage) return;
    await onSave(selectedImage.id, draft);
  }

  async function handleDelete() {
    if (!selectedImage) return;
    await onDelete(selectedImage.id);
    setSelectedId("new");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.52)] p-4">
        <div className="rounded-[1.5rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-4 shadow-[0_12px_28px_rgba(64,44,8,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9c6a18]">Gallery archive</p>
            <div className="rounded-full bg-[#f6efe4] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#607366]">
              {images.length}
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {images.map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => handleSelectExisting(image)}
                className={`rounded-[1.3rem] border p-3 text-left transition ${
                  selectedId === image.id
                    ? "border-[rgba(23,63,51,0.18)] bg-[#173f33] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.14)]"
                    : "border-[rgba(27,59,43,0.08)] bg-[#faf7ef] text-[#173f33] hover:bg-[#f3ecdf]"
                }`}
              >
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem]">
                    <Image src={image.url} alt={image.caption} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${selectedId === image.id ? "bg-[rgba(255,255,255,0.14)] text-[#f4e7bd]" : "bg-[#eef8f1] text-[#21533f]"}`}>
                        {image.published ? "Published" : "Hidden"}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${selectedId === image.id ? "bg-[rgba(255,255,255,0.14)] text-[#dde4dc]" : "bg-[#f6efe4] text-[#9c6a18]"}`}>
                        {image.year}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6">{image.caption}</p>
                    <p className={`mt-1 text-xs ${selectedId === image.id ? "text-[#dde4dc]" : "text-[#607366]"}`}>
                      {formatDateLabel(image.date)}{image.place ? ` • ${image.place}` : ""}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-end gap-3">
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
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
              selectedId === "new"
                ? "bg-[#173f33] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)]"
                : "bg-[#ebb428] text-[#173f33]"
            }`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New photo
          </button>
        </div>

        <article className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.52)] p-4">
          <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">
                  {selectedImage ? "Selected photo" : "New photo"}
                </p>
                <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">
                  {selectedImage ? "Edit gallery image" : "Add gallery image"}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#607366]">
                  Upload natural field and institutional imagery, then organize it with captions, place, category, and year.
                </p>
              </div>
              {selectedImage ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={disabled}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(146,70,45,0.16)] bg-[#fff8f5] px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-[#92462d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete
                </button>
              ) : null}
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="grid gap-4">
                <label className="grid gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#718477]">
                  Image upload
                  <div className="rounded-[1.35rem] border border-dashed border-[rgba(27,59,43,0.18)] bg-[#f8f4ea] p-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => handleFileUpload(event.target.files)}
                      className="block w-full rounded-[1rem] border border-[rgba(27,59,43,0.08)] bg-white px-3 py-3 text-sm text-[#173f33]"
                    />
                    <p className="mt-3 text-sm leading-6 text-[#607366]">
                      Multiple uploads are allowed. If you upload more than one image, the same metadata will be used for each photo when saving.
                    </p>
                    {uploadNotice ? <p className="mt-3 text-sm font-semibold text-[#21533f]">{uploadNotice}</p> : null}
                    {isUploading ? <p className="mt-2 text-sm font-semibold text-[#9c6a18]">Uploading to Cloudflare R2...</p> : null}
                  </div>
                </label>

                <label className="grid gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#718477]">
                  Title / Caption
                  <input
                    value={draft.caption}
                    onChange={(event) => updateDraft("caption", event.target.value)}
                    className="rounded-[1.35rem] border border-[rgba(27,59,43,0.12)] bg-[#f8f4ea] px-4 py-3 text-sm text-[#173f33] outline-none ring-[#d9a127] transition focus:bg-white focus:ring-2"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#718477]">
                    Date & Time
                    <input
                      type="datetime-local"
                      value={draft.date}
                      onChange={(event) => updateDraft("date", event.target.value)}
                      className="rounded-[1.35rem] border border-[rgba(27,59,43,0.12)] bg-[#f8f4ea] px-4 py-3 text-sm text-[#173f33] outline-none ring-[#d9a127] transition focus:bg-white focus:ring-2"
                    />
                  </label>

                  <label className="grid gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#718477]">
                    Location / Place
                    <input
                      value={draft.place ?? ""}
                      onChange={(event) => updateDraft("place", event.target.value)}
                      className="rounded-[1.35rem] border border-[rgba(27,59,43,0.12)] bg-[#f8f4ea] px-4 py-3 text-sm text-[#173f33] outline-none ring-[#d9a127] transition focus:bg-white focus:ring-2"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#718477]">
                    Category
                    <select
                      value={draft.category}
                      onChange={(event) => updateDraft("category", event.target.value)}
                      className="rounded-[1.35rem] border border-[rgba(27,59,43,0.12)] bg-[#f8f4ea] px-4 py-3 text-sm text-[#173f33] outline-none ring-[#d9a127] transition focus:bg-white focus:ring-2"
                    >
                      {galleryCategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#718477]">
                    Year
                    <input
                      type="number"
                      value={draft.year}
                      onChange={(event) => updateDraft("year", Number(event.target.value))}
                      className="rounded-[1.35rem] border border-[rgba(27,59,43,0.12)] bg-[#f8f4ea] px-4 py-3 text-sm text-[#173f33] outline-none ring-[#d9a127] transition focus:bg-white focus:ring-2"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => updateDraft("published", !draft.published)}
                  className={`flex items-center justify-between rounded-[1.4rem] border px-4 py-4 text-left transition ${
                    draft.published
                      ? "border-[rgba(33,83,63,0.16)] bg-[#eef8f1]"
                      : "border-[rgba(27,59,43,0.1)] bg-[#f8f4ea]"
                  }`}
                >
                  <div>
                    <p className="text-sm font-black text-[#173f33]">
                      {draft.published ? "Published on gallery page" : "Unpublished from gallery page"}
                    </p>
                    <p className="mt-1 text-sm text-[#607366]">
                      {draft.published
                        ? "This image is visible on the public gallery."
                        : "This image stays in admin only until published."}
                    </p>
                  </div>
                  <span
                    className={`relative inline-flex h-8 w-14 rounded-full transition ${
                      draft.published ? "bg-[#34c759]" : "bg-[#d6d4cd]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.16)] transition ${
                        draft.published ? "left-7" : "left-1"
                      }`}
                    />
                  </span>
                </button>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={disabled || isUploading || !draft.url}
                    onClick={selectedImage ? handleSave : handleCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f33] px-5 py-3 text-sm font-black text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {selectedImage ? <Save className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                    {selectedImage ? "Save changes" : "Add photo"}
                  </button>
                  {!selectedImage ? (
                    <button
                      type="button"
                      onClick={() => {
                        setDraft({
                          ...emptyGalleryDraft,
                          date: new Date().toISOString().slice(0, 16),
                          year: new Date().getFullYear(),
                        });
                        setUploadAssets([]);
                        setUploadNotice("");
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(27,59,43,0.12)] bg-[#f8f4ea] px-5 py-3 text-sm font-black text-[#173f33]"
                    >
                      Reset draft
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="overflow-hidden rounded-[1.6rem] border border-[rgba(27,59,43,0.1)] bg-[#f8f4ea]">
                  <div className="relative aspect-[4/5] w-full">
                    {draft.url ? (
                      <Image src={draft.url} alt={draft.caption || "Gallery preview"} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[linear-gradient(180deg,rgba(244,236,220,0.9),rgba(234,241,236,0.9))]">
                        <div className="text-center text-[#607366]">
                          <Images className="mx-auto h-10 w-10 text-[#b36b00]" aria-hidden="true" />
                          <p className="mt-3 px-6 text-sm leading-6">Upload a gallery image to preview it here.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-[rgba(27,59,43,0.08)] bg-[#faf7ef] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">Preview details</p>
                  <div className="mt-3 grid gap-3 text-sm text-[#516253]">
                    <p className="font-semibold text-[#173f33]">{draft.caption || "Gallery caption will appear here"}</p>
                    <p>{getGalleryCategoryLabel(draft.category)}</p>
                    <p className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />
                      {draft.place || "Place not added yet"}
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <UploadCloud className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />
                      {uploadAssets.length
                        ? `${uploadAssets.length} file${uploadAssets.length === 1 ? "" : "s"} uploaded`
                        : draft.url
                          ? "Existing image selected"
                          : "No image uploaded yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

function formatDateLabel(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
