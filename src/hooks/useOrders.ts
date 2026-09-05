"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { orderService, type Order } from "@/services/order.service";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login?redirect=/orders");
  }, [authLoading, router, user]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      const result = await orderService.list({
        page,
        limit: 10,
        status: status === "all" ? undefined : status,
      });
      if (result.error) {
        toast.error(result.error.message || "Unable to load your orders.");
      } else if (result.data) {
        setOrders(result.data.items);
        setTotalPages(result.data.meta.totalPages);
      }
      setLoading(false);
    };

    void fetchOrders();
  }, [user, page, status]);

  return {
    orders,
    loading,
    user,
    authLoading,
    status,
    setStatus: (value: string) => {
      setStatus(value);
      setPage(1);
    },
    page,
    setPage,
    totalPages,
  };
};
