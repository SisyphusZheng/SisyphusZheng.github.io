/**
 * FreshPress Search Plugin
 * 提供全站搜索功能
 */

export const name = "search";
export const version = "1.0.0";
export const description = "Full-text search for FreshPress sites";

// 搜索配置
export const config = {
  // 搜索索引文件路径
  indexPath: "./data/search-index.json",
  // 搜索结果数量限制
  resultLimit: 10,
  // 高亮关键词
  highlightKeywords: true,
  // 搜索范围
  searchScope: ["title", "content", "tags"],
};

// 搜索函数
export async function search(query: string, options = config) {
  try {
    // 读取搜索索引
    const indexContent = await Deno.readTextFile(options.indexPath);
    const searchIndex = JSON.parse(indexContent);

    // 执行搜索
    const results = [];
    const searchTerms = query.toLowerCase().split(" ");

    for (const item of searchIndex) {
      let score = 0;

      // 计算相关度分数
      for (const term of searchTerms) {
        for (const field of options.searchScope) {
          if (item[field] && item[field].toLowerCase().includes(term)) {
            score += 1;
          }
        }
      }

      if (score > 0) {
        results.push({
          ...item,
          score,
        });
      }
    }

    // 按相关度排序
    results.sort((a, b) => b.score - a.score);

    // 限制结果数量
    return results.slice(0, options.resultLimit);
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

// 生成搜索索引
export async function generateSearchIndex(
  content: any[],
  outputPath = config.indexPath
) {
  try {
    // 创建搜索索引
    const searchIndex = content.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      tags: item.tags || [],
      url: item.url,
      date: item.date,
    }));

    // 写入索引文件
    await Deno.writeTextFile(outputPath, JSON.stringify(searchIndex, null, 2));

    return true;
  } catch (error) {
    console.error("Error generating search index:", error);
    return false;
  }
}

// 高亮搜索结果中的关键词
export function highlightKeywords(text: string, keywords: string[]): string {
  let highlightedText = text;

  for (const keyword of keywords) {
    const regex = new RegExp(`(${keyword})`, "gi");
    highlightedText = highlightedText.replace(regex, "<mark>$1</mark>");
  }

  return highlightedText;
}
