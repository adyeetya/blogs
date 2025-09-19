/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../create-blog/ImageUpload"; // reuse same component path as in BlogCreate

const schema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Title too long"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Use lowercase, numbers and dashes only"),
  dateOfPublish: z.string().min(1, "Publish date is required"),
  author: z.string().min(1, "Author is required"),
  publisher: z.string().min(1, "Publisher is required"),
  coverSummary: z.string().max(500, "Summary too long").optional(),
  keywords: z.string().optional(), // comma separated in UI
  coverImage: z.string().optional(), // optional URL (S3 or CDN)
  pdfFile: z.any().optional(), // injected at submit
});

type FormData = z.infer<typeof schema>;

export default function MagazineCreate({
  onSubmit,
  loading,
}: {
  onSubmit: (data: any) => Promise<void> | void;
  loading?: boolean;
}) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      dateOfPublish: "",
      author: "",
      publisher: "",
      coverSummary: "",
      keywords: "",
      coverImage: "",
    },
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const disabled = loading || isSubmitting;

  const processSubmit = (data: FormData) => {
    const keywordsArr = data.keywords
      ? data.keywords.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const payload = {
      ...data,
      keywords: keywordsArr,
      pdfFile,
    };
    return onSubmit(payload);
  };

  const slugSuggestion = useMemo(() => {
    const t = watch("title") || "";
    return t
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }, [watch("title")]);

  return (
    <Card className="max-w-4xl mx-auto my-10">
      <CardHeader>
        <h2 className="text-2xl font-bold">Create New Magazine</h2>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input placeholder="Magazine title..." {...register("title")} disabled={disabled} />
            {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <Input placeholder="modern-living-magazine" {...register("slug")} disabled={disabled} />
              {!!slugSuggestion && (
                <p className="text-xs text-muted-foreground mt-1">Suggestion: {slugSuggestion}</p>
              )}
              {errors.slug && <p className="text-destructive text-sm mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Publish Date</label>
              <Input type="date" {...register("dateOfPublish")} disabled={disabled} />
              {errors.dateOfPublish && <p className="text-destructive text-sm mt-1">{errors.dateOfPublish.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Author</label>
              <Input placeholder="Jane Doe" {...register("author")} disabled={disabled} />
              {errors.author && <p className="text-destructive text-sm mt-1">{errors.author.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Publisher</label>
              <Input placeholder="Living Media" {...register("publisher")} disabled={disabled} />
              {errors.publisher && <p className="text-destructive text-sm mt-1">{errors.publisher.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cover Summary</label>
            <Textarea
              placeholder="Short description that appears on the cover..."
              rows={3}
              {...register("coverSummary")}
              disabled={disabled}
            />
            {errors.coverSummary && <p className="text-destructive text-sm mt-1">{errors.coverSummary.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Keywords</label>
            <Input placeholder="design, architecture, lifestyle, trends" {...register("keywords")} disabled={disabled} />
            <p className="text-xs text-muted-foreground mt-1">Enter comma-separated keywords.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image (optional)</label>
              <ImageUpload
                onUpload={(url: string | null) => setValue("coverImage", url || "", { shouldValidate: true })}
                disabled={disabled}
              />
              {errors.coverImage && <p className="text-destructive text-sm mt-1">{(errors as any).coverImage?.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Magazine PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                disabled={disabled}
                className="block w-full text-sm border rounded p-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Upload a PDF to auto-generate page images.</p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" disabled={disabled} onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={disabled}>
              {disabled ? "Saving..." : "Create Magazine"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
