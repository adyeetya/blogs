// export const dynamic = "force-dynamic";

import React from "react";
import { SERVER_URL } from "@/config";
import { Share2, ThumbsUp } from "lucide-react";


type BlogParams = Promise<{ slug: string }>;


async function fetchBlog(slug: string) {
  const res = await fetch(`${SERVER_URL}/api/blogs/${slug}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour (3600 seconds)
  });
  if (!res.ok) {
    throw new Error("Failed to fetch blog post");
  }
  return res.json();
}
export default async function PPage({ params }: { params: BlogParams }) {
  try {
    const blogsee = await fetchBlog((await params).slug); // await the Promise
    
 
    const blog = blogsee.data;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-orange-600 text-sm font-medium mb-4">
              <span>Blog</span>
              <span>/</span>
              <span className="text-xs md:text-md text-orange-800">{blog.title}</span>
            </div>

            <h1 className="text-xl lg:text-5xl font-bold text-orange-500 leading-tight mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-orange-700 text-sm mb-6">
              {blog.author && (
                <div className="flex items-center gap-2">
                  <span>
                    By{" "}
                    {typeof blog.author === "string"
                      ? blog.author
                      : blog.author?.name ?? "Author"}
                  </span>
                </div>
              )}
              {blog.createdAt && (
                <div className="flex items-center gap-2">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {typeof blog.readingTime === "number" && (
                <div className="flex items-center gap-2">
                  <span>{blog.readingTime} min read</span>
                </div>
              )}
              {typeof blog.views === "number" && (
                <div className="flex items-center gap-2">
                  <span>{blog.views} views</span>
                </div>
              )}
            </div>

            {Array.isArray(blog.tags) && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-orange-200 text-orange-800 text-xs font-medium rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={
                blog.featuredImage ||
                blog.image ||
                "https://res.cloudinary.com/dx9d4xqej/image/upload/v1696343303/default_blog_image_oqtqtp.png"
              }
              alt={blog.title}
              className="w-full h-64 md:h-80 lg:h-96 object-cover"
            />
          </div>

          {blog.excerpt && (
            <div className="mb-8 p-6 bg-orange-100 border-l-4 border-orange-500 rounded-r-lg">
              <p className="text-orange-900 text-lg italic leading-relaxed">
                {blog.excerpt}
              </p>
            </div>
          )}

          <article className="prose prose-lg prose-orange max-w-none">
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: typeof blog.content === "string" ? blog.content : "",
              }}
              // dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          </article>

          <div className="mt-12 pt-8 border-t border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {typeof blog.likesCount === "number" && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <span className="text-lg"><ThumbsUp /></span>
                    <span>{blog.likesCount} likes</span>
                  </div>
                )}
                {typeof blog.savesCount === "number" && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <span className="text-lg"><Share2 /></span>
                    <span>{blog.savesCount} Shares </span>
                  </div>
                )}
              </div>

              <div className="text-orange-600 text-sm">
                {typeof blog.wordCount === "number" && (
                  <span>{blog.wordCount.toLocaleString()} words</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl text-orange-400 mb-4">📝</div>
          <h1 className="text-2xl font-bold text-orange-500 mb-2">
            Blog Post Not Found
          </h1>
          <p className="text-orange-700 mb-6">
            The blog post you&apos;re looking for doesn&apos;t exist or
            couldn&apos;t be loaded.
          </p>
          <button
            // onClick={() => window.history.back()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
}
