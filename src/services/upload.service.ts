import { api } from "@/lib/api";

/** Uploads files to the NestJS backend, which stores them and returns public URLs. */
export async function uploadFiles(files: File[], folder: string): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const { data, error } = await api.upload<{ url: string }>("/uploads", formData);
    if (error) throw new Error(`Upload failed: ${error.message}`);
    if (data) urls.push(data.url);
  }
  return urls;
}
