import { Head } from "$fresh/runtime.ts";
import Navbar from "../islands/Navbar.tsx";
import Footer from "./Footer.tsx";
import { t } from "../plugins/i18n/mod.ts";
import { siteConfig } from "../docs/config.ts";

interface LayoutProps {
  children: preact.ComponentChildren;
  title?: string;
  description?: string;
}

export default function Layout({
  children,
  title = siteConfig.site.title,
  description = siteConfig.site.description,
}: LayoutProps) {
  const pageTitle =
    title === siteConfig.site.title
      ? title
      : `${title} | ${siteConfig.site.title}`;

  const author = siteConfig.site.author || "FreshPress";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content={author} />
        <meta name="generator" content="FreshPress" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="/styles.css" />
        <link
          rel="stylesheet"
          href="/css/themes/default.css"
          id="theme-default"
        />
        <link
          rel="stylesheet"
          href="/css/themes/dark.css"
          id="theme-dark"
          media="(prefers-color-scheme: dark)"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // 检测系统暗色模式
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            // 读取用户设置
            const savedTheme = localStorage.getItem('theme');
            
            // 应用主题
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
              document.documentElement.classList.add('dark');
            }
          `,
          }}
        />
        <script src="/fp-config.js"></script>
      </Head>
      <div class="min-h-screen flex flex-col">
        <Navbar />
        <main class="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
