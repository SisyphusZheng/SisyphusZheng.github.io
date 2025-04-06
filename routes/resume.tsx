import { Handlers } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import { t, currentLocale, type Locale } from "../utils/i18n.ts";

// 可以定义一个简单的简历数据结构，以后可以扩展
interface ResumeSection {
  title: string;
  items: Array<any>;
}

export const handler: Handlers = {
  async GET(req, ctx) {
    // 从URL获取语言参数
    const url = new URL(req.url);
    const langParam = url.searchParams.get("lang");
    const locale =
      langParam === "zh-CN" || langParam === "en-US" ? langParam : undefined;

    return ctx.render({ locale });
  },
};

export default function Resume({ data }: { data: { locale?: Locale } }) {
  // 使用传入的locale或默认locale
  const effectiveLocale = data.locale || currentLocale.value;

  // 以下内容应该从i18n翻译系统获取
  // 这部分应该添加到utils/i18n.ts的翻译文件中
  return (
    <Layout title={t("nav.resume", effectiveLocale)}>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="p-6">
            <h1 class="text-4xl font-bold mb-8">
              {t("nav.resume", effectiveLocale)}
            </h1>

            {/* 基本信息 */}
            <section class="mb-8">
              <h2 class="text-2xl font-bold mb-4">
                {t("resume.basicInfo", effectiveLocale)}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-gray-600">
                    {t("resume.name", effectiveLocale)}: John Doe
                  </p>
                  <p class="text-gray-600">
                    {t("resume.education", effectiveLocale)}: Bachelor of
                    Computer Science
                  </p>
                </div>
                <div>
                  <p class="text-gray-600">
                    {t("resume.email", effectiveLocale)}: example@example.com
                  </p>
                  <p class="text-gray-600">
                    {t("resume.github", effectiveLocale)}: github.com/example
                  </p>
                </div>
              </div>
            </section>

            {/* 技能 */}
            <section class="mb-8">
              <h2 class="text-2xl font-bold mb-4">
                {t("resume.skills", effectiveLocale)}
              </h2>
              <div class="flex flex-wrap gap-2">
                {[
                  "TypeScript",
                  "JavaScript",
                  "HTML",
                  "CSS",
                  "React",
                  "Node.js",
                ].map((skill) => (
                  <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* 项目经验 */}
            <section class="mb-8">
              <h2 class="text-2xl font-bold mb-4">
                {t("resume.projects", effectiveLocale)}
              </h2>
              <div class="space-y-4">
                <div class="border-l-4 border-blue-500 pl-4">
                  <h3 class="text-xl font-semibold">FreshPress</h3>
                  <p class="text-gray-600">
                    {t("resume.projectDescription", effectiveLocale)}
                  </p>
                </div>
              </div>
            </section>

            {/* 工作经验 */}
            <section class="mb-8">
              <h2 class="text-2xl font-bold mb-4">
                {t("resume.experience", effectiveLocale)}
              </h2>
              <div class="space-y-6">
                <div class="border-l-4 border-purple-500 pl-4">
                  <h3 class="text-xl font-semibold">Web Developer</h3>
                  <p class="text-gray-600">XYZ Company</p>
                  <p class="text-gray-500">2020 - Present</p>
                  <ul class="list-disc pl-6 mt-2 text-gray-600">
                    <li>{t("resume.responsibility1", effectiveLocale)}</li>
                    <li>{t("resume.responsibility2", effectiveLocale)}</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
