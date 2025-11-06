// components/common/Markdown.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownProps = {
  /** Raw markdown string */
  children: string;
  /** Optional className for prose styling */
  className?: string;
  /** If true, limit to a compact card style (smaller text, tighter spacing) */
  compact?: boolean;
};

/**
 * Markdown renderer with GFM support. Raw HTML is not rendered.
 * Use Tailwind prose classes for consistent typography.
 */
export function Markdown({ children, className, compact }: MarkdownProps) {
  // Tailwind prose for light and invert for dark backgrounds
  const base =
    "prose prose-invert max-w-none prose-p:leading-7 prose-headings:scroll-mt-24";
  const size = compact
    ? "prose-sm prose-p:my-2 prose-ul:my-2 prose-ol:my-2"
    : "prose-base";
  const links = "prose-a:text-dam-gold hover:prose-a:underline";
  const code =
    "prose-code:bg-black/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded";
  const quotes =
    "prose-blockquote:border-white/20 prose-blockquote:text-white/85";
  const tables =
    "prose-thead:border-white/20 prose-tr:border-white/10 prose-th:text-white/85 prose-td:text-white/85";

  const wrapperClass = [base, size, links, code, quotes, tables, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // Raw HTML is disabled by default. Do not add rehypeRaw unless you trust the content.
        components={{
          strong: ({ node, ...props }) => <strong {...props} />,
          em: ({ node, ...props }) => <em {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
