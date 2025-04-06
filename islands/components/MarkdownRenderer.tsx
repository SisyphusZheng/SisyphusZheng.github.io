import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { useEffect, useState } from "preact/hooks";

interface MarkdownProps {
  content: string;
  enableToc?: boolean;
  enableHighlight?: boolean;
}

export default function MarkdownRenderer({
  content,
  enableToc = true,
  enableHighlight = true,
}: MarkdownProps) {
  const [renderedHtml, setRenderedHtml] = useState("");
  const [toc, setToc] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);

  useEffect(() => {
    if (enableHighlight) {
      marked.use(
        markedHighlight({
          langPrefix: "hljs language-",
          highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : "plaintext";
            return hljs.highlight(code, { language }).value;
          },
        })
      );
    }

    // Collect table of contents
    const headings: Array<{ id: string; text: string; level: number }> = [];
    const renderer = new marked.Renderer();

    // Save original heading renderer
    const originalHeadingRenderer = renderer.heading;

    // Custom heading renderer to generate TOC and IDs
    renderer.heading = function (text, level, raw) {
      if (level <= 3) {
        const slug = text
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        const id = `heading-${slug}`;
        headings.push({ id, text, level });

        return `<h${level} id="${id}">${text}</h${level}>`;
      }

      return originalHeadingRenderer.call(this, text, level, raw);
    };

    marked.use({ renderer });

    const html = marked(content);
    setRenderedHtml(html);

    if (enableToc) {
      setToc(headings);
    }
  }, [content, enableToc, enableHighlight]);

  return (
    <div class="markdown-container">
      {enableToc && toc.length > 0 && (
        <div class="table-of-contents mb-8 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
          <h3 class="text-lg font-bold mb-2">Table of Contents</h3>
          <ul class="space-y-1">
            {toc.map((heading) => (
              <li class={`pl-[calc(1rem*(${heading.level - 1}))]`}>
                <a
                  href={`#${heading.id}`}
                  class="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        class="prose lg:prose-xl max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    </div>
  );
}
