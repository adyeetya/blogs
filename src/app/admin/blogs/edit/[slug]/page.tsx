"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchBlogBySlug } from "@/lib/blogsApi";
import axios from "axios";
import { SERVER_URL } from "@/config";
import { fetchCategories } from "@/lib/categoriesApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/app/admin/create-blog/ImageUpload";
import BlogContentEditor from "@/components/BlogContentEditor";
import { toast } from "sonner";

const EditBlogPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [blog, setBlog] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  // Fetch blog and categories, and set up editor/image state
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const blogRes = await fetchBlogBySlug(String(slug));
        setBlog(blogRes.data);
        setImageUrl(blogRes.data.featuredImage || "");
        const catRes = await fetchCategories();
        setCategories(catRes.data || catRes.categories || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setBlog({ ...blog, category: value });
  };

  const handleStatusChange = (value: string) => {
    setBlog({ ...blog, status: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (!blog?._id) throw new Error("Blog ID missing");
      const token = localStorage.getItem("admin_token");
      // Prepare payload (convert tags to array if string)
      // Remove 'id' field if present (use _id for backend)
      const { id, ...rest } = blog;
      const payload = {
        ...rest,
        tags: Array.isArray(blog.tags)
          ? blog.tags
          : (typeof blog.tags === "string" ? blog.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []),
        category: blog.category?._id || blog.category || undefined,
      };
      console.log("Updating blog with payload:", payload);
      await axios.put(`${SERVER_URL}/api/blogs/${blog._id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      toast.success("Blog updated successfully");
      router.push("/admin/blogs");
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  // Delete blog handler
  const handleDelete = async () => {
    if (!blog?._id) return;
    if (!window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) return;
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      await axios.delete(`${SERVER_URL}/api/blogs/${blog._id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      toast.success("Blog deleted successfully");
      router.push("/admin/blogs");
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to delete blog");
    } finally {
      setSaving(false);
    }
  };



  if (loading) return <div className="p-8 h-screen mt-12">Loading...</div>;
  if (error) return <div className="p-8 text-red-500 h-screen mt-12">{error}</div>;
  if (!blog) return <div className="p-8 h-screen mt-12">Blog not found.</div>;

  return (
    <div className="max-w-4xl mt-12 mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <Input
            name="title"
            value={blog.title || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Content Editor */}
        <div>
          {blog && (
            <BlogContentEditor
              value={blog.content || ""}
              onChange={(html: string) =>
                setBlog((prev: any) => ({ ...prev, content: html }))
              }
              disabled={saving}
            />
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium mb-2">Excerpt</label>
          <Textarea
            name="excerpt"
            value={blog.excerpt || ""}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <Input
            name="tags"
            value={
              Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || ""
            }
            onChange={(e) =>
              setBlog({
                ...blog,
                tags: e.target.value.split(",").map((t: string) => t.trim()),
              })
            }
          />
        </div>

        {/* Category select */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select
            value={blog.category?._id || blog.category || ""}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className=" bg-white">
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Author, Featured Image, Likes, Saves */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Author */}
          <div>
            <label className="block text-sm font-medium mb-2">Author *</label>
            <Input
              name="author"
              value={blog.author || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2">Status *</label>
          <Select
            value={blog.status || "draft"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className=" bg-white">
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Image, Likes, Saves */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Featured Image (required) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Featured Image *
            </label>
            <ImageUpload
              onUpload={(url: string | null) => {
                setImageUrl(url ?? "");
                setBlog((prev: any) => ({ ...prev, featuredImage: url ?? "" }));
              }}
              disabled={saving}
              // Show current image if exists
              key={imageUrl}
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Featured"
                className="mt-2 max-h-40 rounded border"
              />
            )}
          </div>
          {/* Likes Count */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Likes Count
            </label>
            <Input
              type="number"
              min={0}
              step={1}
              name="likesCount"
              value={blog.likesCount || 0}
              onChange={handleChange}
            />
          </div>
          {/* Saves Count */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Saves Count
            </label>
            <Input
              type="number"
              min={0}
              step={1}
              name="savesCount"
              value={blog.savesCount || 0}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit & Delete Buttons */}
        <div className="flex justify-between items-center space-x-2 mt-8">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={saving}
            className="bg-red-400"
          >
            Delete Blog
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPage;