"use client";

import { useEffect, useState, useTransition, type DependencyList } from "react";
import type { ApiResult } from "@/lib/api";

interface UseAsyncDataOptions<TResult, TData> {
  /** Maps the raw API result to the state to keep — apply mock-data fallbacks here. */
  select: (result: ApiResult<TResult>) => TData;
  initial: TData;
}

/**
 * Runs `fetcher` whenever `deps` change, tracking loading/error state so callers
 * don't hand-roll the same `useState` trio on every admin page. `loading` comes
 * from React's own transition-pending flag (React 19 supports async transitions)
 * instead of a manually managed boolean, and a "still active" guard drops the
 * result of a fetch superseded by a newer one (deps changed again, or unmounted).
 */
export function useAsyncData<TResult, TData = TResult>(
  fetcher: () => Promise<ApiResult<TResult>>,
  deps: DependencyList,
  { select, initial }: UseAsyncDataOptions<TResult, TData>,
) {
  const [data, setData] = useState<TData>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    startTransition(async () => {
      const result = await fetcher();
      if (!active) return;
      setError(result.error?.message ?? null);
      setData(select(result));
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, setData, loading, error, setError } as const;
}
