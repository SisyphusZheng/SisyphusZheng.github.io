import { useState, useRef, useEffect } from "preact/hooks";

// 定义搜索结果类型（不从模块导入）
interface SearchResult {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  type: string;
  score: number;
  highlights?: string[];
}

// 内联定义搜索功能
export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 加载最近搜索
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("解析最近搜索数据失败", e);
      }
    }
  }, []);

  // 保存最近搜索
  const saveRecentSearch = (query: string) => {
    if (!query || query.trim() === "") return;

    const newRecent = [
      query,
      ...recentSearches.filter((s) => s !== query),
    ].slice(0, 5);

    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
  };

  // 处理搜索
  async function handleSearch() {
    if (!query || query.trim() === "") return;

    setIsSearching(true);
    setError(null);

    try {
      console.log("开始搜索:", query);

      // 发起API搜索请求
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`搜索请求失败: ${response.status}`);
      }

      const searchResults = await response.json();

      if (searchResults && searchResults.length > 0) {
        setResults(searchResults);
        saveRecentSearch(query);
      } else {
        setResults([]);
      }
    } catch (searchError) {
      console.error("搜索执行错误:", searchError);
      setError("搜索过程中发生错误");
    } finally {
      setIsSearching(false);
    }
  }

  // 使用最近搜索
  const useRecentSearch = (query: string) => {
    setQuery(query);
    inputRef.current!.value = query;
    handleSearch();
  };

  // 清除搜索结果
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center mb-6">
        <input
          ref={inputRef}
          type="text"
          placeholder="搜索内容..."
          className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        {query && (
          <>
            <button
              onClick={clearSearch}
              className="absolute right-14 text-gray-500 hover:text-gray-700"
              aria-label="清空搜索"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </>
        )}

        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="absolute right-3 text-blue-500 hover:text-blue-700"
          aria-label="搜索"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {/* 搜索提示和错误 */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* 搜索中指示器 */}
      {isSearching && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* 搜索结果 */}
      {!isSearching && results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">搜索结果 ({results.length})</h2>
          <div className="divide-y divide-gray-200">
            {results.map((result) => (
              <div key={result.id} className="py-4">
                <a
                  href={result.url}
                  className="block hover:bg-gray-50 rounded-lg p-3 -mx-3 transition-colors"
                >
                  <h3 className="text-lg font-medium text-blue-600">
                    {result.title}
                  </h3>
                  <p className="text-sm text-gray-500">{result.url}</p>
                  <p className="mt-1 text-gray-700">
                    {result.highlights?.[0] || result.excerpt}
                  </p>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 无结果提示 */}
      {!isSearching && query && results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">没有找到与 "{query}" 相关的结果</p>
          <p className="text-sm text-gray-500 mt-2">
            尝试使用不同的关键词或更简短的搜索词
          </p>
        </div>
      )}

      {/* 最近搜索 */}
      {!isSearching && !query && recentSearches.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">最近搜索</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => useRecentSearch(search)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
