import { NextRequest, NextResponse } from "next/server";
import { saveFile } from "@/lib/storage";
import { auth } from "@/lib/auth";

// POST /api/upload — Upload an image or video file (admin only)
export async function POST(req: NextRequest) {
  // ── Auth guard ──────────────────────────────────────────────────────────
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "products";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // 10MB limit for images, 50MB for videos
    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large (max ${isVideo ? "50" : "10"}MB)` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // saveFile now uploads to Supabase Storage and returns the public CDN URL
    const saved = await saveFile(buffer, file.name, folder);

    return NextResponse.json({ url: saved.url, filename: saved.filename });
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
