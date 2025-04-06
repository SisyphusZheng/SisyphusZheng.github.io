import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { signal } from "@preact/signals";
import { searchContent } from "../utils/search.ts";

// 搜索状态信号
const searchQuery = signal("");
const isSearching = signal(false);

// 定义SearchResult接口
interface SearchResult {
  type: string;
  title: string;
  url: string;
  excerpt?: string;
  date?: string;
  tags?: string[];
  relevance?: number;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 处理搜索
  const handleSearch = async (searchTerm: string) => {
    setQuery(searchTerm);
    searchQuery.value = searchTerm;

    if (searchTerm.length < 2) {
      setResults([]);
      isSearching.value = false;
      return;
    }

    setIsLoading(true);
    isSearching.value = true;

    console.log("搜索关键词:", searchTerm);

    try {
      // 调用搜索API
      const searchResults = await searchContent(searchTerm);
      console.log("搜索结果:", searchResults);
      setResults(searchResults);
    } catch (error) {
      console.error("搜索错误:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
      isSearching.value = false;
    }
  };

  // 清空搜索
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    searchQuery.value = "";
    isSearching.value = false;
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // 高亮匹配文本
  const highlightMatch = (text: string, query: string): string => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      `<mark class="bg-yellow-200 dark:bg-yellow-700 dark:text-white font-medium px-1 rounded">$1</mark>`
    );
  };

  return (
    <div class="w-full mx-auto max-w-3xl px-4">
      <div class="relative mb-6">
        <div class="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="搜索文章和项目的标题与标签..."
            value={query}
            onInput={(e: Event) =>
              handleSearch((e.target as HTMLInputElement).value)
            }
            class="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {query && (
            <button
              onClick={clearSearch}
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          支持搜索博客文章和项目的标题和标签
        </div>

        {isLoading && (
          <div class="flex justify-center items-center py-6">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* 搜索结果 */}
        {!isLoading && results.length > 0 && (
          <div class="mt-4">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
              找到 {results.length} 个结果
            </p>
            <div class="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result) => (
                <div key={result.url} class="pt-4">
                  <a
                    href={result.url}
                    class="block hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-3 -mx-3 transition-colors"
                  >
                    <div class="flex justify-between items-center mb-1">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(result.title, query),
                          }}
                        />
                      </h3>
                      <span class="text-sm text-gray-500 dark:text-gray-400 ml-3">
                        {result.type === "blog" ? "博客" : "项目"}
                      </span>
                    </div>
                    {result.date && (
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(result.date).toLocaleDateString()}
                      </p>
                    )}
                    {result.excerpt && (
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(result.excerpt, query),
                          }}
                        />
                      </p>
                    )}
                    {result.tags && result.tags.length > 0 && (
                      <div class="mt-2 flex flex-wrap">
                        {result.tags.map((tag) => (
                          <span
                            key={tag}
                            class="mr-2 mb-1 px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 无结果提示 */}
        {!isLoading && query.length >= 2 && results.length === 0 && (
          <div class="mt-6 text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p class="text-gray-500 dark:text-gray-300">
              未找到与 "{query}" 相关的结果
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
