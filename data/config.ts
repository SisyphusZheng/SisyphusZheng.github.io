export const siteConfig = {
  // Site basic information
  site: {
    title: "FreshPress",
    description: "Modern static site generator based on Fresh framework",
    author: "FreshPress Team",
    email: "freshpress@example.com",
    github: "github.com/freshpress/freshpress",
  },

  // Navigation menu
  nav: {
    home: "Home",
    blog: "Blog",
    projects: "Projects",
    resume: "Resume",
  },

  // Hero section
  hero: {
    title: "FreshPress",
    subtitle:
      "Modern static site generator based on Fresh, build your website quickly",
    buttons: {
      blog: "Browse Blog",
      projects: "View Projects",
    },
  },

  // Skills section
  skills: {
    title: "Tech Stack",
    items: [
      { name: "Deno", icon: "🦕" },
      { name: "Fresh", icon: "🍋" },
      { name: "TypeScript", icon: "⚡" },
      { name: "TailwindCSS", icon: "🎨" },
      { name: "Preact", icon: "⚛️" },
      { name: "Markdown", icon: "📝" },
      { name: "Static Site", icon: "📦" },
      { name: "SEO", icon: "🔍" },
    ],
  },

  // Latest updates
  news: {
    title: "Latest Updates",
    items: [
      {
        title: "Blog Update",
        description:
          "Published a tutorial series on how to build static websites with FreshPress.",
        link: "/blog",
        linkText: "Read More →",
      },
      {
        title: "Project Progress",
        description:
          "FreshPress 1.0.0 version has been released, supporting multilingual and enhanced search functionality.",
        link: "/projects",
        linkText: "View Details →",
      },
    ],
  },

  // Blog related
  blog: {
    title: "Blog Posts",
    description: "Sharing technical insights and project experiences",
    searchPlaceholder: "Search articles...",
    allTags: "All",
    readMore: "Read More →",
    noPosts: "No matching articles found",
    pagination: {
      previous: "Previous",
      next: "Next",
      pageInfo: "Page {current} of {total}",
    },
  },

  // Projects related
  projects: {
    title: "Project Showcase",
    description: "Open source projects developed by the FreshPress team",
    items: [
      {
        title: "FreshPress",
        description: "Modern static site generator based on Fresh framework",
        link: "https://github.com/freshpress/freshpress",
        image: "/images/projects/freshpress.png",
        tags: ["Deno", "Fresh", "TypeScript", "TailwindCSS"],
      },
      {
        title: "Fresh Blog Starter",
        description: "Blog starter template built with Fresh framework",
        link: "https://github.com/freshpress/blog-starter",
        image: "/images/projects/blog-starter.png",
        tags: ["Deno", "Fresh", "Markdown", "Blog"],
      },
      {
        title: "Fresh i18n",
        description: "Internationalization plugin for Fresh framework",
        link: "https://github.com/freshpress/fresh-i18n",
        image: "/images/projects/i18n.png",
        tags: ["Deno", "Fresh", "i18n", "Plugin"],
      },
      {
        title: "Fresh Search",
        description: "Powerful search functionality for Fresh framework",
        link: "https://github.com/freshpress/fresh-search",
        image: "/images/projects/search.png",
        tags: ["Deno", "Fresh", "Search", "Plugin"],
      },
    ],
  },

  // Resume related
  resume: {
    title: "Developer Resume",
    sections: {
      basicInfo: {
        title: "Basic Information",
        items: {
          name: "FreshPress Developer",
          education: "Bachelor of Computer Science",
          status: "Full-time",
          email: "dev@freshpress.dev",
          phone: "+86 123 4567 8910",
          github: "github.com/freshpress",
        },
      },
      education: {
        title: "Education Background",
        items: [
          {
            school: "Well-known University",
            degree: "Computer Science and Technology, Bachelor's Degree",
            period: "2018 - 2022",
            courses: [
              "Web Frontend Development",
              "Full-stack Application Development",
              "Data Structures and Algorithms",
              "AI Fundamentals",
            ],
          },
        ],
      },
      skills: {
        title: "Technical Skills",
        categories: {
          frontend: {
            title: "Frontend Development",
            items: [
              "HTML",
              "CSS",
              "JavaScript",
              "TypeScript",
              "React",
              "Vue",
              "TailwindCSS",
            ],
          },
          backend: {
            title: "Backend Development",
            items: ["Node.js", "Deno", "Express", "Fresh", "RESTful API"],
          },
          tools: {
            title: "Development Tools",
            items: ["Git", "VS Code", "Docker", "CI/CD", "Webpack", "Vite"],
          },
        },
      },
      projects: {
        title: "Project Experience",
        items: [
          {
            name: "FreshPress",
            url: "https://github.com/freshpress/freshpress",
            description:
              "Modern static site generator based on Fresh framework",
            highlights: [
              "Developed a high-performance static site generation system",
              "Implemented multi-language support and full-text search",
              "Optimized SEO and page loading performance",
              "Enhanced developer experience and documentation system",
            ],
          },
          {
            name: "Fresh Blog Template",
            url: "https://github.com/freshpress/blog-starter",
            description: "Blog starter template based on Fresh",
            highlights: [
              "Designed an easy-to-use blog template system",
              "Developed article management and tag categorization features",
              "Implemented responsive design and theme customization",
              "Integrated comment system and social sharing functionality",
            ],
          },
        ],
      },
      experience: {
        title: "Work Experience",
        items: [
          {
            organization: "Tech Company",
            position: "Frontend Developer",
            period: "2022 - Present",
            highlights: [
              "Led the development of multiple enterprise web applications",
              "Optimized frontend architecture and build processes",
              "Improved team code quality and test coverage",
              "Mentored junior developers and interns",
            ],
          },
          {
            organization: "Startup Company",
            position: "Web Development Intern",
            period: "2021 - 2022",
            highlights: [
              "Participated in frontend development of main company products",
              "Implemented multiple UI components and page features",
              "Assisted in optimizing website performance and user experience",
              "Participated in code reviews and technical discussions",
            ],
          },
        ],
      },
      achievements: {
        title: "Honors and Certificates",
        items: [
          "First Prize in Programming Competition (2021)",
          "Outstanding Graduate (2022)",
          "Annual Contributor in Technical Community (2023)",
        ],
      },
      contributions: {
        title: "Open Source Contributions",
        items: [
          "Fresh Framework: Contributed multiple features and fixed several issues",
          "Popular Frontend Library: Implemented new features and optimized performance",
          "Development Tool: Added new features and improved documentation",
        ],
      },
      blog: {
        title: "Technical Blog",
        items: [
          "Published 20+ technical articles on personal blog",
          "Have 1000+ followers in technical community",
          "Articles were reposted and referenced by multiple technical platforms",
        ],
      },
    },
  },

  // Social media links
  social: {
    github: "https://github.com/freshpress",
    twitter: "https://twitter.com/freshpress",
    discord: "https://discord.gg/freshpress",
  },

  // Site footer
  footer: {
    copyright: "© 2023 FreshPress. All rights reserved.",
    links: [
      { text: "Home", url: "/" },
      { text: "Blog", url: "/blog" },
      { text: "Projects", url: "/projects" },
      { text: "GitHub", url: "https://github.com/freshpress" },
    ],
  },
};
