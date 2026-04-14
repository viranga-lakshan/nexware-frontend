export interface ApiError {
  code: string;
  message: string;
  fieldViolations?: Array<{ field: string; message: string }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: ApiError;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
}
