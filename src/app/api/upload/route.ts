import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/guards";
import { saveUploadedFile } from "@/server/uploads/upload.service";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const formData = await request.formData();
  const folder = String(formData.get("folder") ?? "misc");
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
  }

  try {
    const urls = await Promise.all(
      files.map((file) => saveUploadedFile(file, folder))
    );
    return NextResponse.json({ urls });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
