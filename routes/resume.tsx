import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Layout from "../components/Layout.tsx";
import { ResumePlugin } from "../plugins/resume/mod.ts";

interface ResumePageData {
  resumeHtml: string;
  resumeStyles: string;
  locale: string;
  translations: Record<string, string>;
}

export const handler: Handlers<ResumePageData> = {
  async GET(req, ctx) {
    // 从URL获取语言设置
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    let locale = searchParams.get("lang") || "zh";

    // 只允许zh或en
    if (locale !== "zh" && locale !== "en") {
      locale = "zh";
    }

    // 初始化简历插件，使用当前语言的JSON文件
    const resumePlugin = new ResumePlugin({
      dataPath: `./docs/resume/resume_${locale}.json`,
      printable: true,
      downloadable: true,
    });

    // 加载简历数据
    await resumePlugin.init();

    // 获取渲染后的简历HTML和样式
    const resumeHtml = resumePlugin.renderResume();
    const resumeStyles = resumePlugin.getResumeStyles();

    // 准备UI文本翻译
    const translations = {
      title: locale === "zh" ? "简历 - FreshPress" : "Resume - FreshPress",
      description: locale === "zh" ? "我的个人简历" : "My professional resume",
      print: locale === "zh" ? "打印简历" : "Print Resume",
      switchLanguage: locale === "zh" ? "Switch to English" : "切换到中文",
    };

    // 返回渲染数据
    return ctx.render({
      resumeHtml,
      resumeStyles,
      locale,
      translations,
    });
  },
};

export default function ResumePage({ data }: PageProps<ResumePageData>) {
  const { resumeHtml, resumeStyles, locale, translations } = data;

  // 切换语言的URL
  const switchLangUrl = locale === "zh" ? "/resume?lang=en" : "/resume?lang=zh";

  return (
    <Layout title={translations.title} description={translations.description}>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: resumeStyles }} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex justify-between">
          <a
            href={switchLangUrl}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <i className="fas fa-language mr-2"></i>{" "}
            {translations.switchLanguage}
          </a>

          <button
            onClick="window.print();"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <i className="fas fa-print mr-2"></i> {translations.print}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border dark:border-gray-700">
          <div
            className="p-6"
            dangerouslySetInnerHTML={{ __html: resumeHtml }}
          />
        </div>
      </div>

      <style>{`
        @media print {
          .layout-navbar, .layout-footer, button, a {
            display: none;
          }
          
          body, html {
            background-color: white !important;
          }
          
          .max-w-4xl {
            max-width: none;
            padding: 0;
            margin: 0;
          }
          
          .shadow-md {
            box-shadow: none;
          }
          
          .rounded-lg {
            border-radius: 0;
          }
          
          .border {
            border: none;
          }
          
          .p-6 {
            padding: 0;
          }
        }
        
        /* 暗色模式下简历内容文字为白色 */
        .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6,
        .dark p, .dark span, .dark div, .dark li, .dark table, 
        .dark td, .dark th, .dark tr, .dark a, .dark ul, .dark ol,
        .dark dl, .dark dt, .dark dd {
          color: white !important;
        }
      `}</style>
    </Layout>
  );
}
