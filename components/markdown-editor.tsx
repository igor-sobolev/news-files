'use client';

import { useRef } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

const toolbarButtons = [
  { label: 'H2', prefix: '## ', suffix: '', placeholder: 'Section title' },
  { label: 'Bold', prefix: '**', suffix: '**', placeholder: 'important detail' },
  { label: 'Italic', prefix: '_', suffix: '_', placeholder: 'nuance' },
  { label: 'Quote', prefix: '> ', suffix: '', placeholder: 'Quoted insight' },
  { label: 'List', prefix: '- ', suffix: '', placeholder: 'List item' },
  { label: 'Link', prefix: '[', suffix: '](https://example.com)', placeholder: 'source' },
];

export function MarkdownEditor({ value, onChange, error }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const applyFormatting = (prefix: string, suffix: string, placeholder: string) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selected = value.slice(selectionStart, selectionEnd) || placeholder;
    const nextValue = `${value.slice(0, selectionStart)}${prefix}${selected}${suffix}${value.slice(selectionEnd)}`;

    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPosition = selectionStart + prefix.length + selected.length + suffix.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-3 rounded-[1.75rem] border border-(--line) bg-white/70 p-4">
        <div className="flex flex-wrap gap-2">
          {toolbarButtons.map((button) => (
            <button
              key={button.label}
              type="button"
              onClick={() => applyFormatting(button.prefix, button.suffix, button.placeholder)}
              className="rounded-full border border-(--line) px-3 py-1.5 text-sm font-semibold text-slate-900 transition hover:border-(--accent) hover:bg-(--accent-soft)"
            >
              {button.label}
            </button>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={18}
          className="min-h-104 w-full rounded-[1.25rem] border border-(--line) bg-(--surface-strong) px-4 py-3 text-base leading-7 outline-none transition focus:border-(--accent)"
          placeholder="Write the article body in Markdown..."
        />

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      </div>

      <div className="rounded-[1.75rem] border border-(--line) bg-white/70 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-(--muted)">Preview</p>
        <div className="prose-news mt-4 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || '_Preview will appear here._'}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}