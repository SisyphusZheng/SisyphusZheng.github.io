import MarkdownRenderer from "../islands/components/MarkdownRenderer.tsx";

interface MarkdownProps {
  content: string;
  enableToc?: boolean;
  enableHighlight?: boolean;
}

// Server-side component that uses the client-side island component for rendering
export default function Markdown({
  content,
  enableToc = true,
  enableHighlight = true,
}: MarkdownProps) {
  // Use simple pre-rendered version for server, actual rendering happens in the island
  return (
    <MarkdownRenderer
      content={content}
      enableToc={enableToc}
      enableHighlight={enableHighlight}
    />
  );
}
