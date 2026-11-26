"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEffect, useCallback } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  rows?: number;
}

export default function RichTextEditor({ value, onChange, rows = 4 }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL:", editor.getAttributes("link").href || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: "3px 8px",
    background: active ? "#333" : "transparent",
    border: "1px solid #333",
    borderRadius: 4,
    color: active ? "#fff" : "#aaa",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: active ? 700 : 400,
    lineHeight: 1.4,
  });

  return (
    <div style={{ border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden", background: "#1a1a1a" }}>
      <div style={{ display: "flex", gap: 4, padding: "6px 8px", borderBottom: "1px solid #2a2a2a", flexWrap: "wrap" }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive("bold"))}><b>B</b></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive("italic"))}><i>I</i></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} style={btnStyle(editor.isActive("underline"))}><u>U</u></button>
        <button type="button" onClick={setLink} style={btnStyle(editor.isActive("link"))}>🔗</button>
        {editor.isActive("link") && (
          <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} style={btnStyle(false)}>✕ link</button>
        )}
      </div>
      <EditorContent
        editor={editor}
        style={{ minHeight: `${rows * 1.6}rem`, padding: "0.65rem 0.85rem", color: "#fff", fontSize: "0.85rem", outline: "none" }}
      />
      <style>{`
        .tiptap { outline: none; }
        .tiptap p { margin: 0 0 0.5rem; }
        .tiptap p:last-child { margin-bottom: 0; }
        .tiptap a { color: #9ca3af; text-decoration: underline; }
      `}</style>
    </div>
  );
}
