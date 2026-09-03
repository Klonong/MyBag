"use client";

import { Form } from "@base-ui/react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminService } from "@/services/admin.service";

const statuses = ["pending", "paid", "shipped", "completed", "cancelled"];
export function OrderForm({ orderId }: { orderId: string }) { const [status, setStatus] = useState("pending"); const [customer, setCustomer] = useState("Loading order..."); const [error, setError] = useState<string | null>(null); const [saving, setSaving] = useState(false); useEffect(() => { void adminService.listOrders().then((result) => { const order = result.data?.find((item) => item.id === orderId); if (result.error) setError(result.error.message); else if (order) { setStatus(order.status); setCustomer(order.customer ?? order.user_id ?? order.id); } else setError("Order not found."); }); }, [orderId]); async function submit() { setSaving(true); const result = await adminService.updateOrderStatus(orderId, status); setSaving(false); if (result.error) setError(result.error.message); else window.location.href = "/admin/orders"; } return <div className="max-w-2xl space-y-7"><Button variant="ghost" nativeButton={false} render={<Link href="/admin/orders" />}><ArrowLeft /> Back to orders</Button><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Fulfilment</p><h1 className="font-headline text-4xl font-bold">Edit order</h1><p className="mt-2 text-sm text-zinc-500">Update the fulfilment status for {customer}.</p></div><Form onFormSubmit={submit} className="space-y-6 border border-zinc-200 bg-white p-6"><div className="space-y-2"><label className="text-sm font-medium">Order status</label><Select value={status} onValueChange={(value) => { if (value) setStatus(value); }}><SelectTrigger className="bg-white"><SelectValue /></SelectTrigger><SelectContent>{statuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>{error && <p className="text-sm text-red-500">{error}</p>}<div className="flex justify-end"><Button type="submit" disabled={saving}>{saving ? "Saving..." : <><Save /> Save status</>}</Button></div></Form></div>; }
