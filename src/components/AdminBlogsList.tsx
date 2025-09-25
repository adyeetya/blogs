import React from 'react';
import Link from 'next/link';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchLatestBlogs, fetchOlderBlogs } from '@/lib/blogsApi';
import { Button } from '@/components/ui/button';

const AdminBlogsList: React.FC = () => {
  // Fetch latest blogs (top 3)
  const { data: latestData, isLoading: latestLoading, error: latestError } = useQuery({
    queryKey: ['admin-latest-blogs'],
    queryFn: fetchLatestBlogs,
    staleTime: 1000 * 60 * 5,
  });

  // Paginated fetch for older blogs
  const {
    data: olderData,
    isLoading: olderLoading,
    error: olderError,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['admin-older-blogs'],
    queryFn: ({ pageParam = 1 }) => fetchOlderBlogs({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.previousPage ?? undefined,
    initialPageParam: 1,
  });

  if (latestLoading || olderLoading) return <div>Loading blogs...</div>;
  if (latestError || olderError) return <div>Error loading blogs.</div>;

  // Combine latest and older blogs, avoiding duplicates
  const latestBlogs = latestData?.blogs || [];
  const olderPages = olderData?.pages || [];
  let olderBlogs = olderPages.flatMap((p) => p.blogs || []);
  // Remove any older blogs that are also in latestBlogs (by slug)
  const latestSlugs = new Set(latestBlogs.map((b: any) => b.slug));
  olderBlogs = olderBlogs.filter((b: any) => !latestSlugs.has(b.slug));

  const currentPage = olderData?.pageParams?.length || 1;
  const totalPages = olderPages[0]?.totalPages || 1;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Blogs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {/* Latest blogs first */}
            {latestBlogs.map((blog: any) => (
              <tr key={blog.slug} className="bg-orange-50">
                <td className="px-4 py-2 font-medium text-gray-900">{blog.title}</td>
                <td className="px-4 py-2 text-gray-700">{blog.author}</td>
                <td className="px-4 py-2 text-gray-700">{blog.category}</td>
                <td className="px-4 py-2">
                  <Link href={`/admin/blogs/edit/${blog.slug}`}>
                    <Button size="sm" variant="outline">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {/* Paginated older blogs */}
            {olderBlogs.map((blog: any) => (
              <tr key={blog.slug}>
                <td className="px-4 py-2 font-medium text-gray-900">{blog.title}</td>
                <td className="px-4 py-2 text-gray-700">{blog.author}</td>
                <td className="px-4 py-2 text-gray-700">{blog.category}</td>
                <td className="px-4 py-2">
                  <Link href={`/admin/blogs/edit/${blog.slug}`}>
                    <Button size="sm" variant="outline">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500">
          Page {currentPage} {totalPages && `of ${totalPages}`}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => fetchPreviousPage()}
            disabled={!hasPreviousPage || isFetchingPreviousPage}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <Button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogsList;
