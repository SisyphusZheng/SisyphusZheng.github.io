// components/Hero.tsx
import { IS_BROWSER } from "$fresh/runtime.ts";

interface HeroProps {
  data: {
    name: string;
    title: string;
    contact: {
      email: string;
      phone: string;
      github: string;
      devto: string;
    };
    skills: {
      frontend: string[];
      backend: string[];
      devops: string[];
    };
  };
}

export default function Hero({ data }: HeroProps) {
  return (
    <section id="hero" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="gsap-hero-content">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
                你好，我是
                <span className="text-indigo-600 dark:text-indigo-400">
                  {data.name}
                </span>
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
                {data.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                我是一名热爱前端技术的工程师，专注于使用现代 Web
                技术构建响应式、高性能的应用程序。
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {data.skills.frontend
                  .concat(data.skills.backend.slice(0, 3))
                  .map((skill, i) => (
                    <span
                      key={skill}
                      className="gsap-skill-badge inline-block py-1.5 px-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-sm"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {skill}
                    </span>
                  ))}
              </div>
              <div className="flex gap-4">
                <a
                  href="#projects"
                  className="gsap-btn-primary bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  查看项目
                </a>
                <a
                  href="#contact"
                  className="gsap-btn-secondary border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 py-2 px-6 rounded-lg font-medium hover:bg-indigo-600/10 transition-all"
                >
                  联系我
                </a>
              </div>
            </div>
          </div>
          <div className="md:w-5/12">
            <div className="gsap-hero-image relative">
              <div className="aspect-square rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-600">
                    {data.name.charAt(0)}
                  </div>
                </div>
              </div>
              <div className="absolute top-5 right-0 w-20 h-20 bg-yellow-400 dark:bg-yellow-500/80 rounded-full blur-xl opacity-70 -z-10"></div>
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-indigo-600 dark:bg-indigo-500/80 rounded-full blur-xl opacity-70 -z-10"></div>
            </div>
          </div>
        </div>

        <div className="mt-24 gsap-about">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            关于我
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-transform hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                技术栈
              </h3>
              <div>
                <div className="mb-4">
                  <h4 className="text-sm uppercase font-medium text-gray-500 dark:text-gray-400 mb-2">
                    前端
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.frontend.map((skill) => (
                      <span
                        key={skill}
                        className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-2 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm uppercase font-medium text-gray-500 dark:text-gray-400 mb-2">
                    后端
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.backend.map((skill) => (
                      <span
                        key={skill}
                        className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-2 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm uppercase font-medium text-gray-500 dark:text-gray-400 mb-2">
                    DevOps
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.devops.map((skill) => (
                      <span
                        key={skill}
                        className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-2 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-transform hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                联系方式
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-5 h-5 text-indigo-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {data.contact.email}
                  </a>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-5 h-5 text-indigo-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{data.contact.phone}</span>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-5 h-5 text-indigo-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  <a
                    href={`https://github.com/${data.contact.github}`}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    github.com/{data.contact.github}
                  </a>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-5 h-5 text-indigo-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  <a
                    href={`https://dev.to/${data.contact.devto}`}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    dev.to/{data.contact.devto}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
