import { h } from "preact";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { t } from "../utils/i18n.ts";
import { searchContent, type SearchResult } from "../utils/search.ts";

export default function Search() {
  const query = useSignal("");
  const results = useSignal<SearchResult[]>([]);
  const searching = useSignal(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        query.value = "";
        results.value = [];
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    query.value = value;

    if (value.length < 2) {
      results.value = [];
      return;
    }

    searching.value = true;
    try {
      results.value = await searchContent(value);
    } finally {
      searching.value = false;
    }
  };

  return (
    <div class="relative" ref={searchRef}>
      <input
        type="text"
        value={query.value}
        onInput={handleSearch}
        placeholder={t("search.placeholder")}
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {searching.value && (
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
      {results.value.length > 0 && (
        <div class="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {results.value.map((result) => (
            <a
              href={result.url}
              class="block px-4 py-2 hover:bg-gray-100 text-gray-800"
            >
              <div class="font-medium">{result.title}</div>
              {result.excerpt && (
                <div class="text-sm text-gray-600">{result.excerpt}</div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
} 