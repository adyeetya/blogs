/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { SERVER_URL } from "@/config";

type CategoryParams = Promise<{ category: string }>;

export default async function CategoryPage({
  params,
}: {
  params: CategoryParams;
}) {
  try {
    const category = (await params).category;
   
    const res = await fetch(
      `${SERVER_URL}/api/blogs/categories/${encodeURIComponent(category)}`,
      { next: { revalidate: 3600 } }
    );
    // console.log('Fetch response:', res);
    if (!res.ok) throw new Error("Failed to fetch blogs for category");
    const blogsRes = await res.json();
    // console.log('Blogs response data:', blogsRes);
    const blogs = blogsRes.blogs || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-3xl font-bold text-orange-500 mb-8 capitalize">
            Category: {category}
          </h1>
          {blogs.length === 0 ? (
            <div className="text-orange-700">
              No blogs found in this category.
            </div>
          ) : (
            <div className="space-y-8">
              {blogs.map((blog: any) => (
                <div key={blog.slug} className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-semibold text-orange-600 mb-2">
                    {blog.title}
                  </h2>
                  <div className="text-gray-700 mb-2">
                    {blog.excerpt ||
                      (blog.content && blog.content.slice(0, 120) + "...")}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-orange-700 mb-2">
                    {blog.author && (
                      <span>
                        By{" "}
                        {typeof blog.author === "string"
                          ? blog.author
                          : blog.author?.name}
                      </span>
                    )}
                    {blog.createdAt && (
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <a
                    href={`/blogs/${blog.slug}`}
                    className="inline-block mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                    Read More
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl text-orange-400 mb-4">📝</div>
          <h1 className="text-2xl font-bold text-orange-500 mb-2">
            Category Not Found
          </h1>
          <p className="text-orange-700 mb-6">
            The category you&apos;re looking for doesn&apos;t exist or
            couldn&apos;t be loaded.
          </p>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
}
