"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { orderService, type Order } from "@/services/order.service";

export const useOrderDetail = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace(`/login?redirect=/orders/${orderId}`);
  }, [authLoading, router, user, orderId]);

  useEffect(() => {
    if (!user) return;

    const fetchOrder = async () => {
      setLoading(true);
      const result = await orderService.getById(orderId);
      if (result.error) {
        setError(result.error.message || "Unable to load this order.");
        toast.error(result.error.message || "Unable to load this order.");
      } else {
        setOrder(result.data);
      }
      setLoading(false);
    };

    void fetchOrder();
  }, [user, orderId]);

  return { order, loading, error, user, authLoading };
};
