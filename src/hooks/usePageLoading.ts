import { useCallback, useState } from "react";

export const usePageLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  return {
    isLoading,
    setIsLoading,
    startLoading,
    stopLoading,
  };
};
