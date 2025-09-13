import { useQuery } from '@tanstack/react-query';
import { searchBlogs } from './blogsApi';

export interface BlogSearchParams {
  q?: string;
  category?: string;
  author?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export function useBlogSearch(params: BlogSearchParams, enabled = true) {
  return useQuery({
    queryKey: ['blog-search', params],
    queryFn: () => searchBlogs(params),
    enabled,
  // keepPreviousData: true, // Not supported in useQuery, only in useInfiniteQuery
    staleTime: 1000 * 60 * 2,
  });
}
