import React from "react";
import { SERVER_URL } from "@/config";

const dummyBlog = {
  _id: "660fa5ccaf7cf0158cfeabde",
  title: "The Future of Web Development: Trends in 2025",
  content: `
    <h2>Overview</h2>
    <p>The landscape of web development is rapidly evolving with modern frameworks and AI-driven tools.</p>
    <h3>Key Trends</h3>
    <ul>
      <li>Server Components in React</li>
      <li>AI Assistance for Coding</li>
      <li>Performance-centric architectures</li>
    </ul>
    <p><strong>Stay tuned</strong> for the next big thing!</p>
    <img src="https://www.example.com/sample-image.jpg" alt="Web Trends" />
  `,
  image:
    "https://res.cloudinary.com/dx9d4xqej/image/upload/v1696343303/default_blog_image_oqtqtp.png",
  excerpt:
    "Discover the hottest web development trends for 2025 including React Server Components, AI-powered coding assistants, and more. Explore what's next in tech.",
  slug: "the-future-of-web-development-trends-in-2025",
  author: {
    _id: "650abfeeb4e31875647cee98",
    name: "Alex Tan",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  tags: ["react", "nextjs", "webdev", "2025", "trends"],
  category: {
    _id: "662d97fdaf7cf0158cfeabcd",
    name: "Development",
  },
  featuredImage: "https://www.example.com/featured.jpg",
  status: "published",
  publishedAt: "2025-09-01T08:10:00.000Z",
  views: 823,
  likesCount: 41,
  savesCount: 12,
  wordCount: 254,
  readingTime: 2,
  plainTextContent:
    "The landscape of web development is rapidly evolving with modern frameworks and AI-driven tools. Key Trends: Server Components in React, AI Assistance for Coding, Performance-centric architectures. Stay tuned for the next big thing!",
  contentType: "html",
  createdAt: "2025-08-25T12:15:00.000Z",
  updatedAt: "2025-09-01T09:00:00.000Z",
  __v: 0, // mongoose version key
};

interface PageProps {
  params: {
    slug: string;
  };
}

async function fetchBlog(slug: string) {
  const res = await fetch(`${SERVER_URL}/api/blogs/${slug}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour (3600 seconds)
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blog post");
  }

  return res.json();
}

const page = async ({ params }: PageProps) => {
  try {
    // const blog = await fetchBlog(params.slug);
    const blog = dummyBlog;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-6 py-24">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-orange-600 text-sm font-medium mb-4">
              <span>Blog</span>
              <span>/</span>
              <span className="text-orange-800">{blog.title}</span>
            </div>

            <h1 className="text-5xl font-bold text-orange-500 leading-tight mb-4">
              {blog.title}
            </h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-orange-700 text-sm mb-6">
              {blog.author && (
                <div className="flex items-center gap-2">
                  <span>By {blog.author.name || "Author"}</span>
                </div>
              )}
              {blog.publishedAt && (
                <div className="flex items-center gap-2">
                  <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                </div>
              )}
              {blog.readingTime && (
                <div className="flex items-center gap-2">
                  <span>{blog.readingTime} min read</span>
                </div>
              )}
              {blog.views && (
                <div className="flex items-center gap-2">
                  <span>{blog.views} views</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-200 text-orange-800 text-xs font-medium rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={
                blog.image ||
                "https://res.cloudinary.com/dx9d4xqej/image/upload/v1696343303/default_blog_image_oqtqtp.png"
              }
              alt={blog.title}
              className="w-full h-64 md:h-80 lg:h-96 object-cover"
            />
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <div className="mb-8 p-6 bg-orange-100 border-l-4 border-orange-500 rounded-r-lg">
              <p className="text-orange-900 text-lg italic leading-relaxed">
                {blog.excerpt}
              </p>
            </div>
          )}

          {/* Main Content */}
          <article className="prose prose-lg prose-orange max-w-none">
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Interaction Section */}
          <div className="mt-12 pt-8 border-t border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {blog.likesCount !== undefined && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <span className="text-lg">👍</span>
                    <span>{blog.likesCount} likes</span>
                  </div>
                )}
                {blog.savesCount !== undefined && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <span className="text-lg">📌</span>
                    <span>{blog.savesCount} saves</span>
                  </div>
                )}
              </div>

              <div className="text-orange-600 text-sm">
                {blog.wordCount && (
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
            onClick={() => window.history.back()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
};

export default page;
