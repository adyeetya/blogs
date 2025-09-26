/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { SERVER_URL } from "@/config";

interface BlogContentEditorProps {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  minHeight?: string;
}

export default function BlogContentEditor({
  value,
  onChange,
  disabled = false,
  minHeight = "300px",
}: BlogContentEditorProps) {
  const [, setRenderTick] = useState(0);
  const [imageDialog, setImageDialog] = useState(false);
  const [imageData, setImageData] = useState({
    src: "",
    alt: "",
    width: "",
    height: "",
    alignment: "none",
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
        allowBase64: false, // Prevent base64 storage
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const forceRerender = () => {
      setRenderTick((tick) => tick + 1);
    };

    editor.on("selectionUpdate", forceRerender);
    editor.on("transaction", forceRerender);

    return () => {
      editor.off("selectionUpdate", forceRerender);
      editor.off("transaction", forceRerender);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || editor.getHTML() === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [value, editor]);

  // Handle file selection and preview
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to S3 using your existing route
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("files", selectedFile);

    try {
      const token = localStorage.getItem("admin_token");
      const res = await axios.post(`${SERVER_URL}/api/blogs/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const imageUrl = res.data.url;
      setImageData({ ...imageData, src: imageUrl });
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Insert image with attributes
  const insertImage = () => {
    if (!editor || !imageData.src) return;

    // Prepare image options
    const imageOptions: {
      src: string;
      alt?: string;
      title?: string;
      width?: number;
      height?: number;
    } = {
      src: imageData.src,
      alt: imageData.alt || "",
    };

    // Add dimensions if provided
    if (imageData.width) imageOptions.width = Number(imageData.width);
    if (imageData.height) imageOptions.height = Number(imageData.height);

    editor.chain().focus().setImage(imageOptions).run();

    // Apply alignment and styling
    if (imageData.alignment !== "none" || imageData.width || imageData.height) {
      let style = "";
      if (imageData.width) style += `width: ${imageData.width}px; `;
      if (imageData.height) style += `height: ${imageData.height}px; `;

      switch (imageData.alignment) {
        case "left":
          style += "float: left; margin: 0 16px 16px 0;";
          break;
        case "center":
          style += "display: block; margin: 16px auto;";
          break;
        case "right":
          style += "float: right; margin: 0 0 16px 16px;";
          break;
      }

      editor
        .chain()
        .focus()
        .updateAttributes("image", {
          "data-align":
            imageData.alignment !== "none" ? imageData.alignment : undefined,
          style: style || undefined,
        })
        .run();
    }

    // Reset dialog
    resetImageDialog();
  };

  // Reset dialog state
  const resetImageDialog = () => {
    setImageDialog(false);
    setImageData({
      src: "",
      alt: "",
      width: "",
      height: "",
      alignment: "none",
    });
    setSelectedFile(null);
    setPreview("");
  };

  // Image alignment functions for selected images
  const alignImage = (alignment: string) => {
    if (!editor) return;

    const { selection } = editor.state;
    const node = editor.state.doc.nodeAt(selection.from);

    if (node && node.type.name === "image") {
      const attrs = node.attrs;
      let style = "";

      // Preserve existing width/height
      if (attrs.width) style += `width: ${attrs.width}px; `;
      if (attrs.height) style += `height: ${attrs.height}px; `;

      // Add alignment styles
      switch (alignment) {
        case "left":
          style += "float: left; margin: 0 16px 16px 0;";
          break;
        case "center":
          style += "display: block; margin: 16px auto;";
          break;
        case "right":
          style += "float: right; margin: 0 0 16px 16px;";
          break;
        case "none":
          break;
      }

      editor
        .chain()
        .focus()
        .updateAttributes("image", {
          "data-align": alignment,
          style:
            alignment === "none"
              ? attrs.width || attrs.height
                ? style
                : null
              : style,
        })
        .run();
    }
  };

  const addLink = useCallback(() => {
    const url = window.prompt("Enter a URL");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const isImageSelected = editor.isActive("image");

  return (
    <div>
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
          className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
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
          className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
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

        {/* Image Upload Button */}
        <Dialog open={imageDialog} onOpenChange={setImageDialog}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className={editor.isActive("image") ? "bg-muted" : ""}
            >
              📷 Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <Label htmlFor="image-file">Upload Image</Label>
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                {selectedFile && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleImageUpload}
                      disabled={uploading}
                      className="mt-1"
                    >
                      {uploading ? "Uploading..." : "Upload to S3"}
                    </Button>
                  </div>
                )}
                {preview && !imageData.src && (
                  <div className="mt-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              {/* URL Input */}
              <div>
                <Label htmlFor="image-url">Or Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageData.src}
                  onChange={(e) =>
                    setImageData({ ...imageData, src: e.target.value })
                  }
                />
              </div>

              {/* Show uploaded image */}
              {imageData.src && (
                <div>
                  <Label>Uploaded Image</Label>
                  <img
                    src={imageData.src}
                    alt="Uploaded"
                    className="max-w-full h-32 object-cover rounded border mt-1"
                  />
                </div>
              )}

              {/* Alt Text */}
              <div>
                <Label htmlFor="image-alt">Alt Text</Label>
                <Input
                  id="image-alt"
                  placeholder="Description of the image"
                  value={imageData.alt}
                  onChange={(e) =>
                    setImageData({ ...imageData, alt: e.target.value })
                  }
                />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image-width">Width (px)</Label>
                  <Input
                    id="image-width"
                    type="number"
                    placeholder="Auto"
                    value={imageData.width}
                    onChange={(e) =>
                      setImageData({ ...imageData, width: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="image-height">Height (px)</Label>
                  <Input
                    id="image-height"
                    type="number"
                    placeholder="Auto"
                    value={imageData.height}
                    onChange={(e) =>
                      setImageData({ ...imageData, height: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Alignment */}
              <div>
                <Label htmlFor="image-alignment">Alignment</Label>
                <Select
                  value={imageData.alignment}
                  onValueChange={(value) =>
                    setImageData({ ...imageData, alignment: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetImageDialog}>
                Cancel
              </Button>
              <Button
                onClick={insertImage}
                disabled={!imageData.src || uploading}
              >
                Insert Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image Alignment Buttons (show only when image is selected) */}
        {isImageSelected && (
          <>
            <div className="border-l mx-1" />
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => alignImage("left")}
              title="Align Left"
            >
              ←
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => alignImage("center")}
              title="Align Center"
            >
              ↔
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => alignImage("right")}
              title="Align Right"
            >
              →
            </Button>
          </>
        )}

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
      <div
        className="border rounded p-4 prose prose-sm max-w-none"
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
