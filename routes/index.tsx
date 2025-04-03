import { Handlers } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import Hero from "../components/Hero.tsx";
import { siteConfig } from "../data/config.ts";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

export const handler: Handlers = {
  async GET(_req, ctx) {
    // 读取最近的博客文章
    const posts: Post[] = [];
    for await (const dirEntry of Deno.readDir("./blog")) {
      if (dirEntry.isFile && dirEntry.name.endsWith(".md")) {
        const file = await Deno.readTextFile(`./blog/${dirEntry.name}`);
        const { attrs, body } = parseFrontMatter(file);
        posts.push({
          slug: dirEntry.name.replace(".md", ""),
          title: attrs.title || "未命名文章",
          date: attrs.date || new Date().toISOString(),
          tags: attrs.tags ? attrs.tags.split(",").map((tag: string) => tag.trim()) : [],
          content: body,
        });
      }
    }
    // 按日期排序，获取最新的文章
    const latestPost = posts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    // 获取最新的项目
    const latestProject = siteConfig.projects.items[0];

    return ctx.render({ latestPost, latestProject });
  },
};

function parseFrontMatter(content: string): { attrs: Record<string, any>; body: string } {
  const lines = content.split("\n");
  const attrs: Record<string, any> = {};
  let body = content;
  let inFrontMatter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "---") {
      if (!inFrontMatter) {
        inFrontMatter = true;
        continue;
      } else {
        body = lines.slice(i + 1).join("\n");
        break;
      }
    }

    if (inFrontMatter) {
      const [key, ...values] = line.split(":");
      if (key && values.length > 0) {
        const value = values.join(":").trim();
        attrs[key.trim()] = value.replace(/^['"]|['"]$/g, "");
      }
    }
  }

  return { attrs, body };
}

export default function Home({ data }: { data: { latestPost: Post; latestProject: any } }) {
  const { latestPost, latestProject } = data;
  
  return (
    <Layout>
      <Hero />
      
      {/* 技能展示区域 */}
      <section class="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center mb-12 animate-fade-in">
            {siteConfig.skills.title}
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            {siteConfig.skills.items.map((skill, index) => (
              <div 
                class="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div class="text-4xl mb-4">{skill.icon}</div>
                <h3 class="text-xl font-semibold">{skill.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 最新动态 */}
      <section class="py-16 bg-gradient-to-b from-white to-gray-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center mb-12 animate-fade-in">
            {siteConfig.news.title}
          </h2>
          <div class="grid md:grid-cols-2 gap-8">
            {/* 最新博客文章 */}
            <div class="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 animate-fade-in-up">
              <h3 class="text-xl font-semibold mb-4">{siteConfig.news.items[0].title}</h3>
              {latestPost ? (
                <>
                  <h4 class="text-lg font-medium mb-2">
                    <a href={`/blog/${latestPost.slug}`} class="text-blue-600 hover:text-blue-800">
                      {latestPost.title}
                    </a>
                  </h4>
                  <p class="text-gray-500 mb-2">
                    {new Date(latestPost.date).toLocaleDateString()}
                  </p>
                  <p class="text-gray-600 mb-4">
                    {latestPost.content.split("\n")[0]}
                  </p>
                  <a
                    href={`/blog/${latestPost.slug}`}
                    class="text-blue-600 hover:text-blue-800 inline-flex items-center"
                  >
                    {siteConfig.news.items[0].linkText}
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </>
              ) : (
                <p class="text-gray-600">暂无博客文章</p>
              )}
            </div>

            {/* 最新项目 */}
            <div class="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 animate-fade-in-up">
              <h3 class="text-xl font-semibold mb-4">{siteConfig.news.items[1].title}</h3>
              {latestProject ? (
                <>
                  <h4 class="text-lg font-medium mb-2">
                    <a href={latestProject.link} class="text-blue-600 hover:text-blue-800" target="_blank">
                      {latestProject.title}
                    </a>
                  </h4>
                  <p class="text-gray-600 mb-4">
                    {latestProject.description}
                  </p>
                  <div class="flex flex-wrap gap-2 mb-4">
                    {latestProject.tags.map((tag: string) => (
                      <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={latestProject.link}
                    class="text-blue-600 hover:text-blue-800 inline-flex items-center"
                    target="_blank"
                  >
                    {siteConfig.news.items[1].linkText}
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </>
              ) : (
                <p class="text-gray-600">暂无项目</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section class="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in-up">
              <div class="text-4xl font-bold text-blue-600 mb-2">240K+</div>
              <p class="text-gray-600">博客浏览量</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in-up">
              <div class="text-4xl font-bold text-blue-600 mb-2">1K+</div>
              <p class="text-gray-600">博客粉丝</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in-up">
              <div class="text-4xl font-bold text-blue-600 mb-2">7</div>
              <p class="text-gray-600">社区收录文章</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in-up">
              <div class="text-4xl font-bold text-blue-600 mb-2">2</div>
              <p class="text-gray-600">开源项目</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 