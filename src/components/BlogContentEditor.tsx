import React, { useCallback, useState, useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";

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
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false })],
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

    // Listen to selection and transaction updates
    editor.on("selectionUpdate", forceRerender);
    editor.on("transaction", forceRerender);

    // Cleanup listeners
    return () => {
      editor.off("selectionUpdate", forceRerender);
      editor.off("transaction", forceRerender);
    };
  }, [editor]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (!editor || editor.getHTML() === value) return;

    // Update content without emitting to avoid infinite loops
    editor.commands.setContent(value, { emitUpdate: false });
  }, [value, editor]);

  // Toolbar actions
  const addLink = useCallback(() => {
    const url = window.prompt("Enter a URL");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

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
