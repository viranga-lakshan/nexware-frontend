import type { PageParams } from "@/types/api";

export function buildPageParams(
  page: number,
  size: number,
  extra?: Record<string, string | number | boolean | undefined>
): PageParams & Record<string, string | number | boolean | undefined> {
  return { page, size, ...extra };
}
