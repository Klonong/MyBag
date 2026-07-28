import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

function sanitizeSegment(segment: string): string {
  const cleaned = segment
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "misc";
}

/**
 * Saves an uploaded file to /public/uploads and returns its public URL.
 * Folder segments and file extensions are sanitized to prevent path traversal.
 */
export async function saveUploadedFile(file: File, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large (max 8MB).");
  }

  const safeFolder = folder
    .split("/")
    .filter(Boolean)
    .map(sanitizeSegment)
    .join("/") || "misc";

  const rawExt = file.name.split(".").pop() ?? "bin";
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const targetDir = path.join(UPLOAD_ROOT, safeFolder);
  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, fileName), Buffer.from(await file.arrayBuffer()));

  return `/uploads/${safeFolder}/${fileName}`;
}
