"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { BasePage } from "@/components/base";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { useOrders } from "@/hooks/useOrders";

const statuses = ["pending", "paid", "shipped", "completed", "cancelled"];

export default function OrdersPage() {
  const { orders, loading, user, authLoading, status, setStatus, page, setPage, totalPages } = useOrders();

  if (authLoading || !user) return null;

  return (
    <BasePage>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Account</p>
          <h1 className="mt-2 font-headline text-4xl font-semibold text-primary">Your Orders</h1>
          <p className="mt-2 text-sm text-muted-foreground">Track deliveries and review past purchases.</p>
        </div>
        <Select value={status} onValueChange={(value) => value && setStatus(value)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((item) => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-input p-8 text-center">
          <Package className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No orders yet.</p>
          <Link href="/shop" className="mt-4 inline-block text-sm font-semibold text-tertiary hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-lg border border-input p-5 transition-colors hover:border-tertiary"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()} · {order.order_items.length} item
                    {order.order_items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-tertiary">{order.status}</p>
                  <p className="mt-1 font-semibold text-primary">{formatPrice(Number(order.total))}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="flex items-center px-2 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
    </BasePage>
  );
}
