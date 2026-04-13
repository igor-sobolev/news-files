"use client";

import MDEditor, { commands } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function MarkdownEditor({
  value,
  onChange,
  error,
}: MarkdownEditorProps) {
  return (
    <div className="space-y-3 rounded-[1.75rem] border border-(--line) bg-white/70 p-4">
      <MDEditor
        style={{
          border: "none",
          boxShadow: "none",
          overflow: "hidden",
          background: "transparent",
        }}
        value={value}
        onChange={(nextValue = "") => onChange(nextValue)}
        preview="live"
        height={520}
        commands={[
          commands.title,
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.divider,
          commands.link,
          commands.image,
          commands.divider,
          commands.code,
        ]}
      />

      {error ? (
        <p className="text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
