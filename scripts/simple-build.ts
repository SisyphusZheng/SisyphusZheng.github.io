// FreshPress 静态站点生成器
export {};

import { getAllPosts } from "../utils/blog.ts";
import { getAllProjects } from "../utils/projects.ts";
import { Locale, t, translations } from "../utils/i18n.ts";
import { siteConfig } from "../data/config.ts";
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";

const BUILD_DIR = "./dist";
const STATIC_DIR = "./static";
const LOCALES: Locale[] = ["zh-CN", "en-US"];

async function build() {
  console.log("🍋 开始构建 FreshPress 静态网站...");

  // 确保构建目录存在
  try {
    await Deno.mkdir(BUILD_DIR, { recursive: true });
    console.log(`📁 创建构建目录: ${BUILD_DIR}`);
  } catch (e) {
    if (!(e instanceof Deno.errors.AlreadyExists)) {
      throw e;
    }
    console.log(`📁 构建目录已存在: ${BUILD_DIR}`);
  }

  // 复制静态资源
  console.log(`📦 复制静态资源...`);
  await Deno.mkdir(`${BUILD_DIR}/static`, { recursive: true });

  try {
    // 使用Deno的API复制目录
    for await (const entry of Deno.readDir(STATIC_DIR)) {
      const srcPath = path.join(STATIC_DIR, entry.name);
      const destPath = path.join(BUILD_DIR, "static", entry.name);

      if (entry.isFile) {
        await Deno.copyFile(srcPath, destPath);
        console.log(`📄 复制文件: ${entry.name}`);
      } else if (entry.isDirectory) {
        await copyDir(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`❌ 复制静态资源失败:`, error);
  }

  // 获取所有博客文章和项目
  const posts = await getAllPosts();
  const projects = await getAllProjects();

  // 为每个语言生成页面
  for (const locale of LOCALES) {
    console.log(`🌐 正在生成 ${locale} 页面...`);

    // 创建语言目录
    const localeDir = locale === "zh-CN" ? BUILD_DIR : `${BUILD_DIR}/${locale}`;
    await Deno.mkdir(localeDir, { recursive: true });

    // 生成首页
    await generateHomePage(localeDir, locale, posts, projects);

    // 生成博客列表页
    await generateBlogListPage(localeDir, locale, posts);

    // 生成博客文章页面
    await generateBlogPages(localeDir, locale, posts);

    // 生成项目列表页
    await generateProjectListPage(localeDir, locale, projects);

    // 生成项目详情页面
    await generateProjectPages(localeDir, locale, projects);
  }

  console.log("✅ FreshPress 静态站点构建完成！");
}

// 复制目录及其内容
async function copyDir(src: string, dest: string) {
  await Deno.mkdir(dest, { recursive: true });

  for await (const entry of Deno.readDir(src)) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isFile) {
      await Deno.copyFile(srcPath, destPath);
    } else if (entry.isDirectory) {
      await copyDir(srcPath, destPath);
    }
  }
}

// 生成页面的通用布局
function getPageLayout(title: string, content: string, locale: Locale): string {
  return `<!DOCTYPE html>
<html lang="${locale === "zh-CN" ? "zh" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ${siteConfig.site.title}</title>
  <meta name="description" content="${siteConfig.site.description}">
  <meta name="author" content="${siteConfig.site.author}">
  <meta name="generator" content="FreshPress">
  <link rel="stylesheet" href="/static/styles.css">
  <script>
    window.LOCALE = "${locale}";
  </script>
</head>
<body class="min-h-screen bg-gray-50 flex flex-col">
  <header class="bg-white shadow">
    <nav class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <span class="text-2xl font-bold mr-2">🍋</span>
        <a href="${
          locale === "zh-CN" ? "/" : `/${locale}/`
        }" class="text-xl font-bold text-gray-900">
          ${siteConfig.site.title}
        </a>
      </div>
      <div class="flex space-x-6">
        <a href="${
          locale === "zh-CN" ? "/" : `/${locale}/`
        }" class="text-gray-700 hover:text-blue-600 transition-colors">
          ${t("nav.home", locale)}
        </a>
        <a href="${
          locale === "zh-CN" ? "/blog" : `/${locale}/blog`
        }" class="text-gray-700 hover:text-blue-600 transition-colors">
          ${t("nav.blog", locale)}
        </a>
        <a href="${
          locale === "zh-CN" ? "/projects" : `/${locale}/projects`
        }" class="text-gray-700 hover:text-blue-600 transition-colors">
          ${t("nav.projects", locale)}
        </a>
        <div class="relative group">
          <button class="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
            ${locale === "zh-CN" ? "🇨🇳 中文" : "🇺🇸 English"}
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <a href="${
              locale === "zh-CN" ? "/en-US/" : "/"
            }" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              ${locale === "zh-CN" ? "🇺🇸 English" : "🇨🇳 中文"}
            </a>
          </div>
        </div>
      </div>
    </nav>
  </header>
  
  <main class="flex-grow">
    ${content}
  </main>
  
  <footer class="bg-gray-900 text-white mt-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
        <p>
          <span class="block sm:inline">${siteConfig.footer.copyright}</span>
          <span class="block sm:inline sm:ml-4">${t(
            "footer.poweredBy",
            locale
          )} <a href="https://github.com/freshpress/freshpress" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">FreshPress</a></span>
        </p>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

// 生成首页
async function generateHomePage(
  dir: string,
  locale: Locale,
  posts: any[],
  projects: any[]
) {
  const recentPosts = posts
    .filter((post) => post.locale === locale || post.locale === "all")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const featuredProjects = projects
    .filter((project) => project.locale === locale || project.locale === "all")
    .filter((project) => project.featured)
    .slice(0, 4);

  const content = `
  <div class="bg-blue-600 text-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 class="text-4xl font-bold mb-4">${t("hero.title", locale)}</h1>
      <p class="text-xl max-w-2xl">${t("hero.subtitle", locale)}</p>
    </div>
  </div>
  
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-8 text-center">${t(
        "blog.recentPosts",
        locale
      )}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${recentPosts
          .map(
            (post) => `
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            ${
              post.cover
                ? `<img src="${post.cover}" alt="${post.title}" class="w-full h-48 object-cover">`
                : ""
            }
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                ${new Date(post.date).toLocaleDateString(
                  locale === "zh-CN" ? "zh-CN" : "en-US"
                )}
              </div>
              <h3 class="text-xl font-semibold mb-2">
                <a href="${locale === "zh-CN" ? "/blog/" : `/${locale}/blog/`}${
              post.slug
            }" class="text-gray-900 hover:text-blue-600 transition-colors">
                  ${post.title}
                </a>
              </h3>
              <p class="text-gray-600 mb-4">${post.description || ""}</p>
              <div class="flex flex-wrap gap-2">
                ${(post.tags || [])
                  .map(
                    (tag: string) => `
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ${tag}
                  </span>
                `
                  )
                  .join("")}
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="text-center mt-8">
        <a href="${
          locale === "zh-CN" ? "/blog" : `/${locale}/blog`
        }" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          ${t("blog.viewAll", locale)}
          <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
    
    <section>
      <h2 class="text-3xl font-bold mb-8 text-center">${t(
        "projects.featured",
        locale
      )}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${featuredProjects
          .map(
            (project) => `
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            ${
              project.cover
                ? `<img src="${project.cover}" alt="${project.title}" class="w-full h-48 object-cover">`
                : ""
            }
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">
                <a href="${
                  locale === "zh-CN" ? "/projects/" : `/${locale}/projects/`
                }${
              project.slug
            }" class="text-gray-900 hover:text-blue-600 transition-colors">
                  ${project.title}
                </a>
              </h3>
              <p class="text-gray-600 mb-4">${project.description || ""}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                ${(project.tags || [])
                  .map(
                    (tag: string) => `
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ${tag}
                  </span>
                `
                  )
                  .join("")}
              </div>
              <a href="${
                locale === "zh-CN" ? "/projects/" : `/${locale}/projects/`
              }${
              project.slug
            }" class="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                ${t("projects.readMore", locale)}
                <svg class="ml-1 w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="text-center mt-8">
        <a href="${
          locale === "zh-CN" ? "/projects" : `/${locale}/projects`
        }" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          ${t("projects.viewAll", locale)}
          <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  </div>
  `;

  const html = getPageLayout(t("nav.home", locale), content, locale);
  await Deno.writeTextFile(`${dir}/index.html`, html);
  console.log(`📄 生成首页: ${dir}/index.html`);
}

// 生成博客列表页
async function generateBlogListPage(dir: string, locale: Locale, posts: any[]) {
  const filteredPosts = posts
    .filter((post) => post.locale === locale || post.locale === "all")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const content = `
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-3xl font-bold mb-8">${t("blog.title", locale)}</h1>
    
    <div class="grid grid-cols-1 gap-8">
      ${filteredPosts
        .map(
          (post) => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6">
            <div class="flex items-center text-sm text-gray-500 mb-2">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              ${new Date(post.date).toLocaleDateString(
                locale === "zh-CN" ? "zh-CN" : "en-US"
              )}
            </div>
            <h2 class="text-xl font-semibold mb-2">
              <a href="${locale === "zh-CN" ? "/blog/" : `/${locale}/blog/`}${
            post.slug
          }" class="text-gray-900 hover:text-blue-600 transition-colors">
                ${post.title}
              </a>
            </h2>
            <p class="text-gray-600 mb-4">${post.description || ""}</p>
            <div class="flex flex-wrap gap-2">
              ${(post.tags || [])
                .map(
                  (tag: string) => `
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ${tag}
                </span>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  </div>
  `;

  await Deno.mkdir(`${dir}/blog`, { recursive: true });
  const html = getPageLayout(t("blog.title", locale), content, locale);
  await Deno.writeTextFile(`${dir}/blog/index.html`, html);
  console.log(`📄 生成博客列表页: ${dir}/blog/index.html`);
}

// 生成博客文章页面
async function generateBlogPages(dir: string, locale: Locale, posts: any[]) {
  const filteredPosts = posts.filter(
    (post) => post.locale === locale || post.locale === "all"
  );

  await Deno.mkdir(`${dir}/blog`, { recursive: true });

  for (const post of filteredPosts) {
    const content = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">${post.title}</h1>
        <div class="flex items-center text-sm text-gray-500 mb-4">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${new Date(post.date).toLocaleDateString(
            locale === "zh-CN" ? "zh-CN" : "en-US"
          )}
        </div>
        <div class="flex flex-wrap gap-2 mb-6">
          ${(post.tags || [])
            .map(
              (tag: string) => `
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              ${tag}
            </span>
          `
            )
            .join("")}
        </div>
      </div>
      
      <div class="prose prose-blue max-w-none">
        ${post.content || ""}
      </div>
      
      <div class="mt-12 pt-8 border-t border-gray-200">
        <a href="${
          locale === "zh-CN" ? "/blog" : `/${locale}/blog`
        }" class="text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center">
          <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${t("blog.backToList", locale)}
        </a>
      </div>
    </div>
    `;

    const html = getPageLayout(post.title, content, locale);
    await Deno.writeTextFile(`${dir}/blog/${post.slug}.html`, html);
    console.log(`📄 生成博客文章: ${dir}/blog/${post.slug}.html`);
  }
}

// 生成项目列表页
async function generateProjectListPage(
  dir: string,
  locale: Locale,
  projects: any[]
) {
  const filteredProjects = projects.filter(
    (project) => project.locale === locale || project.locale === "all"
  );

  const content = `
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-3xl font-bold mb-8">${t("projects.title", locale)}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      ${filteredProjects
        .map(
          (project) => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          ${
            project.cover
              ? `<img src="${project.cover}" alt="${project.title}" class="w-full h-48 object-cover">`
              : ""
          }
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">
              <a href="${
                locale === "zh-CN" ? "/projects/" : `/${locale}/projects/`
              }${
            project.slug
          }" class="text-gray-900 hover:text-blue-600 transition-colors">
                ${project.title}
              </a>
            </h2>
            <p class="text-gray-600 mb-4">${project.description || ""}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              ${(project.tags || [])
                .map(
                  (tag: string) => `
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ${tag}
                </span>
              `
                )
                .join("")}
            </div>
            <a href="${
              locale === "zh-CN" ? "/projects/" : `/${locale}/projects/`
            }${
            project.slug
          }" class="text-blue-600 hover:text-blue-800 transition-colors font-medium">
              ${t("projects.readMore", locale)}
              <svg class="ml-1 w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  </div>
  `;

  await Deno.mkdir(`${dir}/projects`, { recursive: true });
  const html = getPageLayout(t("projects.title", locale), content, locale);
  await Deno.writeTextFile(`${dir}/projects/index.html`, html);
  console.log(`📄 生成项目列表页: ${dir}/projects/index.html`);
}

// 生成项目详情页面
async function generateProjectPages(
  dir: string,
  locale: Locale,
  projects: any[]
) {
  const filteredProjects = projects.filter(
    (project) => project.locale === locale || project.locale === "all"
  );

  await Deno.mkdir(`${dir}/projects`, { recursive: true });

  for (const project of filteredProjects) {
    const content = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">${project.title}</h1>
        ${
          project.cover
            ? `<img src="${project.cover}" alt="${project.title}" class="w-full h-64 object-cover rounded-lg shadow-md mb-6">`
            : ""
        }
        <p class="text-gray-600 mb-6 text-lg">${project.description || ""}</p>
        <div class="flex flex-wrap gap-2 mb-6">
          ${(project.tags || [])
            .map(
              (tag: string) => `
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              ${tag}
            </span>
          `
            )
            .join("")}
        </div>
        ${
          project.link
            ? `
          <a href="${project.link}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 mb-6">
            ${t("projects.viewProject", locale)}
            <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        `
            : ""
        }
      </div>
      
      <div class="prose prose-blue max-w-none">
        ${project.content || ""}
      </div>
      
      <div class="mt-12 pt-8 border-t border-gray-200">
        <a href="${
          locale === "zh-CN" ? "/projects" : `/${locale}/projects`
        }" class="text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center">
          <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${t("projects.backToList", locale)}
        </a>
      </div>
    </div>
    `;

    const html = getPageLayout(project.title, content, locale);
    await Deno.writeTextFile(`${dir}/projects/${project.slug}.html`, html);
    console.log(`📄 生成项目详情: ${dir}/projects/${project.slug}.html`);
  }
}

// 运行构建
try {
  await build();
} catch (error) {
  console.error("❌ 构建出错:", error);
  Deno.exit(1);
}
