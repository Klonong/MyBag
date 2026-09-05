"use client";

import { Form } from "@base-ui/react";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { badgesService } from "@/services/badges.service";

export function BadgeForm({ badgeId }: { badgeId?: number }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(Boolean(badgeId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (!badgeId) return; void badgesService.getById(badgeId).then((result) => { if (result.error) setError(result.error.message); else if (result.data) setName(result.data.name); else setError("Badge not found."); setLoading(false); }); }, [badgeId]);
  async function submit() { if (!name.trim()) { setError("Badge name is required."); return; } setSaving(true); setError(null); const result = badgeId ? await badgesService.update(badgeId, name.trim()) : await badgesService.create(name.trim()); setSaving(false); if (result.error) { setError(result.error.message); return; } router.push("/admin/badges"); }
  return <div className="max-w-2xl space-y-7"><Button variant="ghost" nativeButton={false} render={<a href="/admin/badges" />}><ArrowLeft /> Back to badges</Button><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Catalog structure</p><h1 className="font-headline text-4xl font-bold">{badgeId ? "Edit badge" : "Create badge"}</h1><p className="mt-2 text-sm text-zinc-500">{badgeId ? "Update how this badge appears on products." : "Create a new badge to highlight products."}</p></div><Form onFormSubmit={submit} className="space-y-6 border border-zinc-200 bg-white p-6">{loading ? <p className="text-sm text-zinc-500">Loading badge...</p> : <><div className="space-y-2"><Label htmlFor="badge-name">Badge name</Label><Input id="badge-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. BESTSELLER" /></div>{error && <p className="text-sm text-red-500">{error}</p>}<div className="flex justify-end"><Button type="submit" disabled={saving}>{saving ? "Saving..." : <><Save /> {badgeId ? "Save badge" : "Create badge"}</>}</Button></div></>}</Form></div>;
}
