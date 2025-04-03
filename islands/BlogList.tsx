import { useState } from "preact/hooks";
import { posts } from "../data/posts.ts";
import Markdown from "../components/Markdown.tsx";

export default function BlogList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 5;
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <input
          type="text"
          placeholder="搜索文章..."
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onInput={(e) => setSearchQuery(e.currentTarget.value)}
        />
      </div>

      <div class="mb-8 flex flex-wrap gap-2">
        <button
          class={`px-4 py-2 rounded-full text-sm ${
            selectedTag === null
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => setSelectedTag(null)}
        >
          全部
        </button>
        {allTags.map((tag) => (
          <button
            class={`px-4 py-2 rounded-full text-sm ${
              selectedTag === tag
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div class="space-y-8">
        {paginatedPosts.map((post) => (
          <article class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold mb-2">
                <a
                  href={`/blog/${post.slug}`}
                  class="text-gray-900 hover:text-blue-500"
                >
                  {post.title}
                </a>
              </h2>
              <div class="flex items-center text-gray-500 mb-4">
                <span>{post.date}</span>
                <div class="flex gap-2 ml-4">
                  {post.tags.map((tag) => (
                    <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div class="prose max-w-none">
                <Markdown content={post.content.split("\n")[0]} />
              </div>
              <a
                href={`/blog/${post.slug}`}
                class="inline-block mt-4 text-blue-500 hover:text-blue-600"
              >
                阅读更多 →
              </a>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div class="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              class={`px-4 py-2 rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 