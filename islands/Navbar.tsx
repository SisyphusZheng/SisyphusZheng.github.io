import { useState, useEffect } from "preact/hooks";

interface Blog {
  title: string;
  date: string;
  slug: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch("/api/blogs") // 这里会请求一个 API，返回博客列表
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a
              href="#"
              className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
            >
              Zhi
            </a>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600"
              >
                首页
              </a>
              <a
                href="#projects"
                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600"
              >
                项目
              </a>
              <div className="relative">
                <button
                  onClick={() => setIsBlogOpen(!isBlogOpen)}
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 focus:outline-none"
                >
                  博客
                </button>
                {isBlogOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-2">
                    {blogs.map((blog) => (
                      <a
                        key={blog.slug}
                        href={`/${blog.slug}`}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      >
                        {blog.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <a
                href="#contact"
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg"
              >
                联系我
              </a>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-200"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
