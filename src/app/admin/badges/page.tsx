"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Plus, Trash2 } from "lucide-react";
import { Form } from "@base-ui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { badgesService, type Badge } from "@/services/badges.service";
import Link from "next/link";

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  useEffect(() => { void badgesService.list().then((result) => { if (result.error) setError(result.error.message); else setBadges(result.data ?? []); setLoading(false); }); }, []);
  async function addBadge() { if (!name.trim()) return; const result = await badgesService.create(name.trim()); if (result.error || !result.data) { setError(result.error?.message ?? "Unable to create badge."); return; } setBadges((current) => [...current, result.data as Badge]); setName(""); }
  async function deleteBadge(id: number) { const result = await badgesService.remove(id); if (result.error) { setError(result.error.message); return; } setBadges((current) => current.filter((item) => item.id !== id)); }
  return <div className="space-y-7"><div><div className="mb-3 flex size-11 items-center justify-center bg-tertiary/10 text-tertiary"><BadgeCheck className="size-5" /></div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Catalog structure</p><h1 className="font-headline text-4xl font-bold">Badges</h1><p className="mt-2 text-sm text-zinc-500">Highlight products with labels like Bestseller or Limited.</p></div><div className="flex gap-2"><Form onFormSubmit={addBadge} className="flex max-w-lg flex-1 gap-2"><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="New badge name" aria-label="New badge name" /><Button type="submit"><Plus /> Add badge</Button></Form><Button variant="outline" nativeButton={false} render={<Link href="/admin/badges/new" />}>Create page</Button></div>{error && <p className="text-sm text-red-500">{error}</p>}<div className="overflow-hidden border border-zinc-200 bg-white"><Table><TableHeader><TableRow><TableHead>Badge</TableHead><TableHead>Products</TableHead><TableHead className="w-32" /></TableRow></TableHeader><TableBody>{loading ? <TableRow><TableCell colSpan={3} className="text-center">Loading badges...</TableCell></TableRow> : badges.map((badge) => <TableRow key={badge.id}><TableCell className="font-medium">{badge.name}</TableCell><TableCell className="text-zinc-500">{badge.productCount ?? 0}</TableCell><TableCell><div className="flex items-center justify-end gap-1"><Button size="icon-sm" variant="ghost" nativeButton={false} render={<Link href={`/admin/badges/${badge.id}/edit`} />} aria-label={`Edit ${badge.name}`}>Edit</Button><Button size="icon-sm" variant="ghost" aria-label={`Delete ${badge.name}`} onClick={() => void deleteBadge(badge.id)}><Trash2 className="size-4 text-zinc-400" /></Button></div></TableCell></TableRow>)}</TableBody></Table></div></div>;
}
