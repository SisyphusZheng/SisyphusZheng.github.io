import { marked } from "marked";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  const html = marked(content);

  return (
    <div
      class="prose lg:prose-xl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
} 