import Layout from "../components/Layout.tsx";
import { siteConfig } from "../data/config.ts";

export default function Resume() {
  const { resume } = siteConfig;
  
  return (
    <Layout>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="p-6">
            <h1 class="text-4xl font-bold mb-8">{resume.title}</h1>

            {/* 基本信息 */}
            <section class="mb-8">
              <h2 class="text-2xl font-bold mb-4">{resume.sections.basicInfo.title}</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-gray-600">姓名：{resume.sections.basicInfo.items.name}</p>
                  <p class="text-gray-600">学历：{resume.sections.basicInfo.items.education}</p>
                  <p class="text-gray-600">状态：{resume.sections.basicInfo.items.status}</p>
                </div>
                <div>
                  <p class="text-gray-600">邮箱：{resume.sections.basicInfo.items.email}</p>
                  <p class="text-gray-600">电话：{resume.sections.basicInfo.items.phone}</p>
                  <p class="text-gray-600">GitHub：{resume.sections.basicInfo.items.github}</p>
                </div>
              </div>
            </section>

            {/* 教育背景 */}
            <section class="mb-8">
              <h2 class="text-2xl font-bold mb-4">{resume.sections.education.title}</h2>
              <div class="space-y-6">
                {resume.sections.education.items.map((edu) => (
                  <div class="border-l-4 border-blue-500 pl-4">
                    <h3 class="text-xl font-semibold">{edu.school}</h3>
                    <p class="text-gray-600">{edu.degree}</p>
                    <p class="text-gray-500">{edu.period}</p>
                    <ul class="list-disc pl-6 mt-2 text-gray-600">
                      {edu.courses.map((course) => (
                        <li>{course}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 技术栈 */}
            <section class="mb-8">
              <h2 class="text-2xl font-bold mb-4">{resume.sections.skills.title}</h2>
              <div class="space-y-6">
                {Object.entries(resume.sections.skills.categories).map(([key, category]) => (
                  <div>
                    <h3 class="text-xl font-semibold mb-2">{category.title}</h3>
                    <div class="flex flex-wrap gap-2">
                      {category.items.map((skill) => (
                        <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 项目经验 */}
            <section class="mb-8">
              <h2 class="text-2xl font-bold mb-4">{resume.sections.projects.title}</h2>
              <div class="space-y-6">
                {resume.sections.projects.items.map((project) => (
                  <div class="border-l-4 border-green-500 pl-4">
                    <h3 class="text-xl font-semibold">
                      <a href={project.url} class="text-blue-600 hover:text-blue-800" target="_blank">
                        {project.name}
                      </a>
                    </h3>
                    <p class="text-gray-600 mt-2">{project.description}</p>
                    <ul class="list-disc pl-6 mt-2 text-gray-600">
                      {project.highlights.map((highlight) => (
                        <li>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 校园经历 */}
            <section class="mb-8">
              <h2 class="text-2xl font-bold mb-4">{resume.sections.experience.title}</h2>
              <div class="space-y-6">
                {resume.sections.experience.items.map((exp) => (
                  <div class="border-l-4 border-purple-500 pl-4">
                    <h3 class="text-xl font-semibold">{exp.organization}</h3>
                    <p class="text-gray-600">{exp.position}</p>
                    <p class="text-gray-500">{exp.period}</p>
                    <ul class="list-disc pl-6 mt-2 text-gray-600">
                      {exp.highlights.map((highlight) => (
                        <li>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 荣誉证书 */}
            <section class="mb-8">
              <h2 class="text-2xl font-bold mb-4">{resume.sections.achievements.title}</h2>
              <ul class="list-disc pl-6 text-gray-600">
                {resume.sections.achievements.items.map((achievement) => (
                  <li>{achievement}</li>
                ))}
              </ul>
            </section>

            {/* 开源贡献 */}
            <section class="mb-8">
              <h2 class="text-2xl font-bold mb-4">{resume.sections.contributions.title}</h2>
              <ul class="list-disc pl-6 text-gray-600">
                {resume.sections.contributions.items.map((contribution) => (
                  <li>{contribution}</li>
                ))}
              </ul>
            </section>

            {/* 技术博客 */}
            <section class="mb-8">
              <h2 class="text-2xl font-bold mb-4">{resume.sections.blog.title}</h2>
              <ul class="list-disc pl-6 text-gray-600">
                {resume.sections.blog.items.map((item) => (
                  <li>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
} 