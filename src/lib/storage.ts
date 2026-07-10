/**
 * File Storage — Supabase Storage
 *
 * All uploads go to the `product-images` Supabase Storage bucket.
 * Returns a permanent public CDN URL.  Works the same in local dev
 * and production — no ephemeral local disk involved.
 *
 * Callers remain unchanged; only this module's implementation changed.
 */

import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";
import { v4 as uuid } from "uuid";
import path from "path";

export interface SavedFile {
  url: string;      // Full public CDN URL (e.g. https://….supabase.co/storage/v1/object/public/…)
  filename: string; // Storage path within the bucket (e.g. products/abc123.jpg)
}

/**
 * Upload a file buffer to Supabase Storage
 */
export async function saveFile(
  buffer: Buffer,
  originalName: string,
  folder: string = "products"
): Promise<SavedFile> {
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  const filename = `${folder}/${uuid()}${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(filename, buffer, {
      contentType: getMimeType(ext),
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  const { data: publicData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filename);

  return {
    url: publicData.publicUrl,
    filename,
  };
}

/**
 * Delete a file from Supabase Storage by its public URL.
 * Extracts the storage path from the URL and removes the object.
 */
export async function deleteFile(publicUrl: string): Promise<void> {
  try {
    // Extract the storage path from the full public URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const marker = `/object/public/${STORAGE_BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) {
      // Not a Supabase Storage URL (e.g. old local /uploads/… path) — skip silently
      return;
    }
    const storagePath = publicUrl.substring(idx + marker.length);

    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.error("[deleteFile] Supabase Storage delete error:", error.message);
    }
  } catch (err) {
    console.error("[deleteFile] Unexpected error:", err);
  }
}

/**
 * Upload a base64 data URL to Supabase Storage
 */
export async function saveBase64File(
  dataUrl: string,
  folder: string = "products"
): Promise<SavedFile> {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 data URL");

  const mimeType = matches[1];
  const ext = mimeType.split("/")[1] ?? "jpg";
  const buffer = Buffer.from(matches[2], "base64");
  return saveFile(buffer, `file.${ext}`, folder);
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
  };
  return map[ext.toLowerCase()] ?? "application/octet-stream";
}
