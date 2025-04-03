export const siteConfig = {
  // 站点基本信息
  site: {
    title: "郑治的个人网站",
    description: "一名热爱技术的前端开发者",
    author: "郑治",
    email: "example@example.com",
    github: "github.com/yourusername",
  },

  // 导航菜单
  nav: {
    home: "首页",
    blog: "博客",
    projects: "项目",
    resume: "简历",
  },

  // Hero 部分
  hero: {
    title: "你好，我是郑治",
    subtitle: "一名热爱技术的前端开发者",
    buttons: {
      blog: "查看博客",
      projects: "查看项目",
    },
  },

  // 技能部分
  skills: {
    title: "技术栈",
    items: [
      { name: "TypeScript", icon: "⚡" },
      { name: "React", icon: "⚛️" },
      { name: "Node.js", icon: "🟢" },
      { name: "Deno", icon: "🦕" },
      { name: "TailwindCSS", icon: "🎨" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "Docker", icon: "🐳" },
      { name: "Git", icon: "📦" },
    ],
  },

  // 最新动态
  news: {
    title: "最新动态",
    items: [
      {
        title: "博客更新",
        description: "最近更新了关于 Deno 和 Fresh 框架的技术文章，分享了一些实用的开发经验。",
        link: "/blog",
        linkText: "阅读更多 →",
      },
      {
        title: "项目进展",
        description: "正在开发一个基于 Fresh 的个人网站，集成了博客和项目展示功能。",
        link: "/projects",
        linkText: "查看详情 →",
      },
    ],
  },

  // 博客相关
  blog: {
    title: "博客文章",
    description: "分享技术心得和项目经验",
    searchPlaceholder: "搜索文章...",
    allTags: "全部",
    readMore: "阅读更多 →",
    noPosts: "没有找到匹配的文章",
    pagination: {
      previous: "上一页",
      next: "下一页",
      pageInfo: "第 {current} 页，共 {total} 页",
    },
  },

  // 项目相关
  projects: {
    title: "项目展示",
    description: "展示我的个人项目和开源贡献",
    items: [
      {
        title: "个人网站",
        description: "使用 Fresh 框架构建的个人网站，包含博客和项目展示功能。",
        tags: ["Deno", "Fresh", "TypeScript"],
        link: "https://github.com/yourusername/personal-website",
      },
      {
        title: "在线工具",
        description: "一个实用的在线工具集合，包含各种常用功能。",
        tags: ["React", "TypeScript", "TailwindCSS"],
        link: "https://github.com/yourusername/online-tools",
      },
    ],
  },

  // 简历相关
  resume: {
    title: "个人简历",
    sections: {
      basicInfo: {
        title: "基本信息",
        items: {
          name: "郑治",
          education: "软件工程 硕士",
          status: "在校",
          email: "zhizheng@z-js.dev",
          phone: "13370765023",
          github: "SisyphusZheng",
          devto: "SisyphusZheng"
        }
      },
      education: {
        title: "教育背景",
        items: [
          {
            school: "爱尔兰利莫瑞克大学",
            degree: "软件工程 硕士",
            period: "2023-2026",
            courses: [
              "软件质量",
              "软件进化",
              "HCI(人机交互)",
              "项目管理",
              "软件架构"
            ]
          },
          {
            school: "重庆大学城市科技学院",
            degree: "软件工程 本科",
            period: "2018-2022",
            courses: [
              "编程技术 92%",
              "算法分析 97%",
              "Linux 基础 91%",
              "高级编程技术 91%"
            ]
          }
        ]
      },
      skills: {
        title: "技术栈",
        categories: {
          frontend: {
            title: "前端方向",
            items: [
              "TypeScript",
              "React Hooks",
              "函数式组件开发",
              "TailwindCSS",
              "Web Components",
              "StencilJS"
            ]
          },
          backend: {
            title: "后端方向",
            items: [
              "Node.js",
              "Express",
              "MongoDB",
              "RESTful API",
              "JWT",
              "OAuth"
            ]
          },
          engineering: {
            title: "工程化方向",
            items: [
              "Monorepo",
              "Git Flow",
              "GitHub Actions",
              "Docker",
              "Vite",
              "Nginx"
            ]
          }
        }
      },
      projects: {
        title: "项目经验",
        items: [
          {
            name: "组件库",
            url: "https://air.js.org",
            description: "基于 StencilJS 与 TailwindCSS 构建的现代化 Web Components 组件库，收录于 Stencil Community 官方生态。",
            highlights: [
              "采用 Figma 进行 UI/UX 设计",
              "GitHub Actions 配置 CI/CD",
              "Jest 单元测试与组件快照测试"
            ]
          },
          {
            name: "实时聊天应用",
            url: "https://cchat.chat",
            description: "基于 MERN 技术栈开发的即时通讯系统。",
            highlights: [
              "GitHub OAuth 2.0 认证",
              "Socket.io 实时消息传输",
              "亮/暗双主题切换",
              "JWT 身份验证"
            ]
          }
        ]
      },
      experience: {
        title: "校园经历",
        items: [
          {
            organization: "利莫瑞克大学计算机社团",
            position: "成员",
            period: "2023-09 ~ 2025-01",
            highlights: [
              "欧洲 PythonCon 会议志愿者",
              "IrlCPC(爱尔兰程序设计)2024 集训"
            ]
          },
          {
            organization: "学院软件社团与计算机社团",
            position: "软社社长,计社部长",
            period: "2020-09 ~ 2021-06",
            highlights: [
              "协助教研室 CCPC&蓝桥杯集训",
              "校内赛 WebDev 培训"
            ]
          }
        ]
      },
      achievements: {
        title: "荣誉证书",
        items: [
          "爱尔兰利莫瑞克大学优秀硕士录取奖学金",
          "重庆市优秀毕业生",
          "第九届 CCPC 重庆市三等奖",
          "重庆城市科技学院优秀毕业生",
          "重庆城市科技学院优秀学共青团干与学干",
          "重庆城市科技学院综测奖学金"
        ]
      },
      contributions: {
        title: "开源贡献",
        items: [
          "PR#2828 合并到 OpenWebComponent 项目，修复路由模块兼容性问题，优化工具链"
        ]
      },
      blog: {
        title: "技术博客",
        items: [
          "alien.blog.csdn.net 7篇收录在松山湖开发者社区与开放原子",
          "浏览量 240K+, 粉丝 1K+"
        ]
      }
    }
  },

  // 页脚
  footer: {
    copyright: "© {year} {author}. All rights reserved.",
    links: {
      github: "GitHub",
      email: "联系我",
    },
  },
}; 