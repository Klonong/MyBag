"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { reviewsService, type Review } from "@/services/reviews.service";

export const useProductReviews = (productId: string | null) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) return;
    let active = true;
    void reviewsService.list(productId).then((result) => {
      if (!active) return;
      if (result.data) setReviews(result.data.items);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [productId]);

  const hasReviewed = Boolean(user && reviews.some((review) => review.user.id === user.id));

  const submitReview = async () => {
    if (!productId) return;
    setSubmitting(true);
    const result = await reviewsService.create(productId, { rating, comment: comment.trim() || undefined });
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error.message || "Unable to submit your review.");
      return;
    }

    if (result.data) {
      setReviews((current) => [result.data as Review, ...current]);
      setComment("");
      setRating(5);
      toast.success("Thanks for your review!");
    }
  };

  return {
    reviews,
    loading,
    user,
    hasReviewed,
    rating,
    setRating,
    comment,
    setComment,
    submitting,
    submitReview,
  };
};
