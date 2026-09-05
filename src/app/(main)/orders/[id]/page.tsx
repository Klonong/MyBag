"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BasePage } from "@/components/base";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useOrderDetail } from "@/hooks/useOrderDetail";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { order, loading, error, user, authLoading } = useOrderDetail(id);

  if (authLoading || !user) return null;

  return (
    <BasePage>
      <Link href="/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading order...</p>
      ) : error || !order ? (
        <p className="text-sm text-destructive">{error || "Order not found."}</p>
      ) : (
        <div className="max-w-2xl">
          <div className="mb-6">
            <p className="font-mono text-xs text-muted-foreground">#{order.id}</p>
            <h1 className="mt-2 font-headline text-3xl font-semibold text-primary">
              Order {order.status}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border border-input p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Items</p>
            <div className="mt-4 space-y-3">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-primary">{item.product_name}</p>
                    {item.color_name && <p className="text-xs text-muted-foreground">{item.color_name}</p>}
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-primary">{formatPrice(Number(item.subtotal))}</p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping ({order.delivery_method})</span>
                <span>{formatPrice(Number(order.shipping_fee))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>{formatPrice(Number(order.tax))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-tertiary">
                  <span>Discount</span>
                  <span>-{formatPrice(Number(order.discount))}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-primary">
                <span className="text-xs uppercase tracking-widest">Total</span>
                <span className="font-headline text-lg">{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Payment method: <span className="text-primary">{order.payment_method}</span>
          </p>

          <Button variant="outline" className="mt-6" render={<Link href="/orders" />}>
            View all orders
          </Button>
        </div>
      )}
    </BasePage>
  );
}
