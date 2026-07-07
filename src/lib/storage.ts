/**
 * File Storage Abstraction
 * For local dev: saves files to /public/uploads
 * To switch to Cloudinary: replace the implementation below
 * without changing any callers.
 */

import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export interface SavedFile {
  url: string; // Public URL (e.g., /uploads/abc123.jpg)
  filename: string;
}

/**
 * Save a file buffer to local storage
 */
export async function saveFile(
  buffer: Buffer,
  originalName: string,
  folder: string = "products"
): Promise<SavedFile> {
  const ext = path.extname(originalName).toLowerCase();
  const filename = `${uuid()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  // Ensure directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/${folder}/${filename}`,
    filename,
  };
}

/**
 * Delete a file by its public URL
 */
export async function deleteFile(publicUrl: string): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), "public", publicUrl);
    await fs.unlink(filePath);
  } catch {
    // File may not exist — silently ignore
  }
}

/**
 * Save a base64 data URL as a file
 */
export async function saveBase64File(
  dataUrl: string,
  folder: string = "products"
): Promise<SavedFile> {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 data URL");

  const ext = matches[1].split("/")[1] ?? "jpg";
  const buffer = Buffer.from(matches[2], "base64");
  return saveFile(buffer, `file.${ext}`, folder);
}
