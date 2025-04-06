import { t } from "../utils/i18n.ts";
import { getCopyright, getContent } from "../utils/content.ts";

export default function Footer() {
  const copyright = getCopyright();
  const githubLink = getContent(["quickStart", "cta", "link"]);

  return (
    <footer class="bg-gray-800 text-white py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between mb-8">
          <div class="mb-6 md:mb-0">
            <h2 class="text-2xl font-bold mb-4">FreshPress</h2>
            <p class="text-gray-300 max-w-md">
              {getContent(["site", "description"])}
            </p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 class="text-lg font-semibold mb-3">Navigation</h3>
              <ul class="space-y-2">
                <li>
                  <a
                    href="/"
                    class="text-gray-300 hover:text-white transition-colors"
                  >
                    {getContent(["nav", "home"])}
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    class="text-gray-300 hover:text-white transition-colors"
                  >
                    {getContent(["nav", "blog"])}
                  </a>
                </li>
                <li>
                  <a
                    href="/projects"
                    class="text-gray-300 hover:text-white transition-colors"
                  >
                    {getContent(["nav", "projects"])}
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    class="text-gray-300 hover:text-white transition-colors"
                  >
                    {getContent(["nav", "about"])}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-3">Resources</h3>
              <ul class="space-y-2">
                <li>
                  <a
                    href="/docs"
                    class="text-gray-300 hover:text-white transition-colors"
                  >
                    {getContent(["footer", "links", "docs"])}
                  </a>
                </li>
                <li>
                  <a
                    href={githubLink}
                    class="text-gray-300 hover:text-white transition-colors"
                    target="_blank"
                  >
                    {getContent(["footer", "links", "github"])}
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/freshpress"
                    class="text-gray-300 hover:text-white transition-colors"
                    target="_blank"
                  >
                    {getContent(["footer", "links", "twitter"])}
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/freshpress"
                    class="text-gray-300 hover:text-white transition-colors"
                    target="_blank"
                  >
                    {getContent(["footer", "links", "discord"])}
                  </a>
                </li>
              </ul>
            </div>
            <div class="col-span-2 sm:col-span-1">
              <h3 class="text-lg font-semibold mb-3">Contact Us</h3>
              <p class="text-gray-300 mb-2">{getContent(["site", "email"])}</p>
              <div class="flex space-x-4 mt-4">
                <a
                  href={githubLink}
                  class="text-gray-300 hover:text-white"
                  target="_blank"
                  aria-label="GitHub"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com/freshpress"
                  class="text-gray-300 hover:text-white"
                  target="_blank"
                  aria-label="Twitter"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="https://discord.gg/freshpress"
                  class="text-gray-300 hover:text-white"
                  target="_blank"
                  aria-label="Discord"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-8 mt-8 border-t border-gray-700 text-center sm:text-left">
          <p class="text-gray-400 text-sm">{copyright}</p>
          <p class="text-gray-400 text-sm mt-2">
            {getContent(["footer", "poweredBy"])}
          </p>
        </div>
      </div>
    </footer>
  );
}
