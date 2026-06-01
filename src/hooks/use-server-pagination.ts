"use client";

import { useCallback, useMemo, useState } from "react";
import type { PageResponse } from "@/types/api";

export interface ServerPaginationState {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export function useServerPagination(initialSize = 20) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(initialSize);

  const params = useMemo(() => ({ page, size }), [page, size]);

  const applyPageResponse = useCallback((response?: PageResponse<unknown>): ServerPaginationState => {
    if (!response) {
      return { page, size, totalElements: 0, totalPages: 0, first: true, last: true };
    }
    return {
      page: response.page,
      size: response.size,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      first: response.first,
      last: response.last
    };
  }, [page, size]);

  const resetPage = useCallback(() => setPage(0), []);

  return {
    page,
    size,
    params,
    setPage,
    setSize,
    resetPage,
    applyPageResponse
  };
}
