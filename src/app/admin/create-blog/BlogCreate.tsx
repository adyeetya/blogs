/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from "@/components/ui/select";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageUpload from "./ImageUpload";
import { toast } from "sonner";
import { fetchCategories, createCategory } from "@/lib/categoriesApi";
// Validation schema matching backend
const schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z
    .string()
    .max(300, "Excerpt cannot exceed 300 characters")
    .optional(),
  tags: z.string().optional(),
  category: z.string().optional(), // Category ID
  featuredImage: z.string().min(1, "Featured image is required"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  contentType: z.enum(["html", "markdown"]).default("html"),
  author: z.string().min(1, "Author is required"),
  likesCount: z.coerce.number().int().min(0, "Likes must be 0 or more").optional(),
  savesCount: z.coerce.number().int().min(0, "Saves must be 0 or more").optional(),
});

export function BlogCreate({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '', color: '' });
  const [addingCat, setAddingCat] = useState(false);
  // Fetch categories on mount
  // useEffect(() => {
  //   setCatLoading(true);
  //   fetchCategories()
  //     .then(res => setCategories(res.data))
  //     .catch(() => toast.error('Failed to load categories'))
  //     .finally(() => setCatLoading(false));
  // }, []);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
      status: "draft",
      contentType: "html",
      author: "",
      likesCount: 0,
      savesCount: 0,
      featuredImage: "",
    },
  });
  const [imageUrl, setImageUrl] = useState("");
  // Editor instance
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false })],
    content: "",
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML(), { shouldValidate: true });
    },
  });

  // Toolbar actions
  const addLink = useCallback(() => {
    const url = window.prompt("Enter a URL");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  // Process form data before submission
  const processSubmit = (data: any) => {
    // Convert comma-separated tags to array
    const processedData = {
      ...data,
      tags: data.tags
        ? data.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean)
        : [],
      // Remove empty optional fields
      excerpt: data.excerpt || undefined,
      category: data.category || undefined,
      featuredImage: data.featuredImage || undefined,
      likesCount: data.likesCount !== undefined ? Number(data.likesCount) : 0,
      savesCount: data.savesCount !== undefined ? Number(data.savesCount) : 0,
    };
    onSubmit(processedData);
  };

  // Show toast for client-side validation errors
  const handleFormError = (formErrors: any) => {
    const errorMessages = Object.values(formErrors)
      .map((err: any) => err?.message)
      .filter(Boolean);
    if (errorMessages.length > 0) {
      toast.error(
        <div>
          <div className="font-semibold mb-1">Validation Error:</div>
          <ul className="list-disc ml-5">
            {errorMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  if (!editor) return null;

  return (
    <Card className="max-w-4xl mx-auto my-10">
      <CardHeader>
        <h2 className="text-2xl font-bold">Create New Blog Post</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit, handleFormError)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input placeholder="Enter blog title..." {...register("title")} />
            {errors.title && (
              <p className="text-destructive text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 mb-2 border rounded px-2 py-2 bg-muted/40">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-muted" : ""}
              >
                <b>B</b>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-muted" : ""}
              >
                <i>I</i>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "bg-muted" : ""}
              >
                <u>U</u>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "bg-muted" : ""}
              >
                <s>S</s>
              </Button>
              <div className="border-l mx-1" />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={
                  editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""
                }
              >
                H1
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                  editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
                }
              >
                H2
              </Button>
              <div className="border-l mx-1" />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-muted" : ""}
              >
                • List
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-muted" : ""}
              >
                1. List
              </Button>
              <div className="border-l mx-1" />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "bg-muted" : ""}
              >
                Quote
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive("codeBlock") ? "bg-muted" : ""}
              >
                Code
              </Button>
              <div className="border-l mx-1" />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={addLink}
                className={editor.isActive("link") ? "bg-muted" : ""}
              >
                Link
              </Button>
              <div className="border-l mx-1" />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
              >
                ↶
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
              >
                ↷
              </Button>
            </div>

            {/* Editor Content */}
            <Controller
              name="content"
              control={control}
              render={() => (
                <div>
                  <div className="border rounded min-h-[300px] p-4 prose prose-sm max-w-none">
                    <EditorContent editor={editor} />
                  </div>
                  {errors.content && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.content.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <Textarea
              placeholder="Brief description of the blog post (auto-generated if left empty)..."
              rows={3}
              {...register("excerpt")}
            />
            {errors.excerpt && (
              <p className="text-destructive text-sm mt-1">
                {errors.excerpt.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <Input
              placeholder="Enter tags separated by commas (e.g., technology, tutorial, javascript)..."
              {...register("tags")}
            />
          </div>

          {/* Category select/add */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            {catLoading ? (
              <div>Loading categories...</div>
            ) : (
              <div className="flex gap-2 items-center">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button type="button" size="sm" variant="outline" onClick={() => setShowAddCat(v => !v)}>
                  {showAddCat ? 'Cancel' : 'Add New'}
                </Button>
              </div>
            )}
            {showAddCat && (
              <div className="mt-2 flex flex-col gap-2 border p-3 rounded bg-muted/30">
                <Input
                  placeholder="Category name"
                  value={newCat.name}
                  onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                  required
                  className="w-64"
                />
                <Input
                  placeholder="Description (optional)"
                  value={newCat.description}
                  onChange={e => setNewCat({ ...newCat, description: e.target.value })}
                  className="w-64"
                />
                <Input
                  placeholder="#Color (optional)"
                  value={newCat.color}
                  onChange={e => setNewCat({ ...newCat, color: e.target.value })}
                  className="w-64"
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={addingCat}
                  onClick={async () => {
                    setAddingCat(true);
                    try {
                      const token = localStorage.getItem('admin_token') || '';
                      const res = await createCategory(newCat, token);
                      setCategories((prev) => [...prev, res.data]);
                      setValue('category', res.data._id, { shouldValidate: true });
                      setShowAddCat(false);
                      setNewCat({ name: '', description: '', color: '' });
                      toast.success('Category added!');
                    } catch (err: any) {
                      toast.error(err?.response?.data?.error || 'Failed to add category');
                    } finally {
                      setAddingCat(false);
                    }
                  }}
                >
                  {addingCat ? 'Adding...' : 'Add Category'}
                </Button>
              </div>
            )}
          </div>

          {/* Author, Featured Image, Likes, Saves */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Author */}
            <div>
              <label className="block text-sm font-medium mb-2">Author *</label>
              <Input placeholder="Enter author name..." {...register("author")} />
              {errors.author && (
                <p className="text-destructive text-sm mt-1">{errors.author.message}</p>
              )}
            </div>
          </div>
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status *</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  
                    <SelectContent className=" bg-white">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                 
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-destructive text-sm mt-1">{errors.status.message}</p>
            )}
          </div>


          {/* Featured Image, Likes, Saves */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Featured Image (required) */}
            <div>
              <label className="block text-sm font-medium mb-2">Featured Image *</label>
              <ImageUpload
                onUpload={(url) => {
                  setImageUrl(url ?? "");
                  setValue("featuredImage", url ?? "", { shouldValidate: true });
                }}
                disabled={isSubmitting}
              />
              {errors.featuredImage && (
                <p className="text-destructive text-sm mt-1">{errors.featuredImage.message}</p>
              )}
            </div>
            {/* Likes Count */}
            <div>
              <label className="block text-sm font-medium mb-2">Likes Count</label>
              <Input
                type="number"
                min={0}
                step={1}
                {...register("likesCount")}
              />
              {errors.likesCount && (
                <p className="text-destructive text-sm mt-1">{errors.likesCount.message}</p>
              )}
            </div>
            {/* Saves Count */}
            <div>
              <label className="block text-sm font-medium mb-2">Saves Count</label>
              <Input
                type="number"
                min={0}
                step={1}
                {...register("savesCount")}
              />
              {errors.savesCount && (
                <p className="text-destructive text-sm mt-1">{errors.savesCount.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Blog"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
