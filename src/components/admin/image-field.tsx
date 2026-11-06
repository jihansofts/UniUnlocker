"use client";

import { ImagePlus, Search, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { TextField } from "@/components/admin/form";
import { Modal } from "@/components/ui/modal";
import { SafeImage } from "@/components/ui/safe-image";
import { useToast } from "@/components/ui/toast";
import { useResource } from "@/hooks/use-resource";
import { apiFetch, errorMessage } from "@/lib/client-api";
import type { PexelsPhoto } from "@/types";

function PexelsPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (url: string) => void }) {
  const [query, setQuery] = useState("smartphone repair");
  const [photos, setPhotos] = useState<PexelsPhoto[] | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function search(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();
    setBusy(true);
    try {
      const result = await apiFetch<{ photos: PexelsPhoto[] }>(`/api/pexels?q=${encodeURIComponent(query)}`);
      setPhotos(result.photos);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Choose a photo from Pexels" className="max-w-3xl">
      <form onSubmit={search} className="flex gap-2">
        <input
          aria-label="Search Pexels"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="admin-input"
        />
        <button type="submit" disabled={busy} className="admin-btn admin-btn-primary">
          <Search aria-hidden className="size-4" /> {busy ? "Searching…" : "Search"}
        </button>
      </form>
      {photos && photos.length === 0 && <p className="mt-6 text-center text-sm text-admin-muted">No photos found. Try other words.</p>}
      {photos && photos.length > 0 && (
        <ul className="mt-4 grid max-h-[26rem] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
          {photos.map((photo) => (
            <li key={photo.id}>
              <button
                type="button"
                onClick={() => {
                  onPick(photo.url);
                  onClose();
                }}
                className="group w-full text-left"
              >
                <span className="relative block aspect-[3/2] overflow-hidden rounded-lg border border-admin-line group-hover:border-primary">
                  <Image src={photo.thumb} alt={photo.alt} fill sizes="240px" className="object-cover" />
                </span>
                <span className="mt-1 block truncate text-xs text-admin-muted">Photo by {photo.photographer}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

/** Image input: upload to Cloudinary, pick from Pexels, or paste an allowed URL. */
export function ImageField({
  label,
  value,
  onChange,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { data: sources } = useResource<{ uploads: boolean; pexels: boolean }>("/api/upload");
  const toast = useToast();

  async function upload(file: File) {
    const body = new FormData();
    body.set("file", file);
    setUploading(true);
    try {
      const { url } = await apiFetch<{ url: string }>("/api/upload", { method: "POST", body });
      onChange(url);
      toast.success("Image uploaded. Save to apply it.");
    } catch (uploadError) {
      toast.error(errorMessage(uploadError));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-lg border border-admin-line p-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex aspect-[3/2] w-full shrink-0 items-center justify-center overflow-hidden rounded-md bg-admin-bg sm:w-40">
          {value ? (
            <SafeImage src={value} alt={`${label} preview`} fill sizes="160px" className="object-cover" />
          ) : (
            <ImagePlus aria-hidden className="size-7 text-admin-muted" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <TextField
            label={label}
            value={value}
            onChange={onChange}
            error={error}
            hint={hint ?? "Upload a file, or paste a Pexels or Cloudinary image URL."}
            placeholder="https://"
          />
          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/x-icon,image/vnd.microsoft.icon"
              aria-label={`Upload ${label}`}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
            />
            <button
              type="button"
              disabled={uploading || sources?.uploads === false}
              title={sources?.uploads === false ? "Add Cloudinary keys to enable uploads" : undefined}
              onClick={() => inputRef.current?.click()}
              className="admin-btn admin-btn-secondary"
            >
              <Upload aria-hidden className="size-4" /> {uploading ? "Uploading…" : "Upload"}
            </button>
            {sources?.pexels && (
              <button type="button" onClick={() => setPickerOpen(true)} className="admin-btn admin-btn-secondary">
                <Search aria-hidden className="size-4" /> Pexels
              </button>
            )}
            {value && (
              <button type="button" onClick={() => onChange("")} className="admin-btn admin-btn-secondary">
                <Trash2 aria-hidden className="size-4" /> Remove
              </button>
            )}
          </div>
          {sources?.uploads === false && (
            <p className="text-xs text-status-maintenance">Uploads are off until Cloudinary keys are added to the environment.</p>
          )}
        </div>
      </div>
      {sources?.pexels && <PexelsPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={onChange} />}
    </div>
  );
}
