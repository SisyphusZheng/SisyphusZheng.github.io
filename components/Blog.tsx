// components/Blog.tsx
export default function Blog() {
  const posts = [
    {
      title: "如何构建现代化Web Components组件库",
      excerpt:
        "本文介绍如何使用StencilJS和TailwindCSS构建可重用的Web Components，以及如何配置自动化测试和部署流程。",
      date: "2023-12-15",
      readTime: "10 分钟",
      category: "Web开发",
      image: "/images/blog-1.webp",
    },
    {
      title: "全栈应用中的实时通信：Socket.io 最佳实践",
      excerpt:
        "探讨在MERN Stack应用中集成Socket.io实现实时通信功能的最佳实践，包括性能优化和安全考虑。",
      date: "2023-11-20",
      readTime: "8 分钟",
      category: "后端开发",
      image: "/images/blog-2.webp",
    },
    {
      title: "使用GitHub Actions构建前端项目的CI/CD工作流",
      excerpt:
        "从零开始配置GitHub Actions，实现前端项目的自动化测试、构建和部署，提高开发效率。",
      date: "2023-10-05",
      readTime: "12 分钟",
      category: "DevOps",
      image: "/images/blog-3.webp",
    },
  ];

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gsap-section-title">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          技术博客
        </h2>

        <div className="flex flex-col items-center mb-10">
          <p className="text-gray-600 dark:text-gray-300 text-center mb-5 max-w-2xl">
            分享我的技术心得、项目经验和编程技巧。在CSDN上已有7篇文章被松山湖开发者社区与开放原子收录，总浏览量超过240K+，粉丝1K+。
          </p>
          <a
            href="https://alien.blog.csdn.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center"
          >
            访问我的CSDN博客
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div
              key={index}
              className="gsap-blog-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 to-purple-600/80 flex items-center justify-center">
                  <h3 className="text-xl font-bold text-white text-center px-4">
                    {post.title}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full">
                    {post.category}
                  </span>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {post.readTime}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {post.date}
                  </span>
                  <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium">
                    阅读全文
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
