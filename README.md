# 🍋 FreshPress

A modern static site generator based on the Fresh framework, designed specifically for personal blogs and portfolios. A high-performance static site generator built with Deno and Fresh, featuring rich functionality and a modern development experience. Similar to VitePress, but based on the Fresh and Deno ecosystem.

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Based on Fresh Framework**: Leverages Fresh's advantages, supporting static site generation (SSG)
- 🌐 **Multi-language Support**: Built-in English and Chinese internationalization, easily add more languages
- 🔍 **Smart Search**: Full-text search functionality, supporting multi-language content retrieval
- 📱 **Responsive Design**: Perfect adaptation for various devices, from mobile to desktop
- 🎨 **Modern UI**: Beautiful user interface built with TailwindCSS
- 📝 **Markdown Support**: Easily write blog posts and project documentation
- 🌙 **Dark Mode**: Built-in dark theme support, automatically following system settings
- 🎯 **Islands Architecture**: Efficient rendering of interactive components
- 🚀 **One-click Deployment**: Easy deployment to Deno Deploy or other static hosting services
- 🔧 **Theme System**: Customizable themes, supporting CSS variables and Tailwind theme extensions
- 📋 **Automatic Table of Contents**: Auto-generated article directories and navigation
- 💻 **Code Highlighting**: Built-in code block syntax highlighting
- 🗺️ **Automatic Sitemap**: Generate SEO-friendly sitemaps

## 🚀 Quick Start

### Prerequisites

- [Deno](https://deno.land/) 1.40.0 or higher
- [Git](https://git-scm.com/)

### Installation

```bash
# Clone repository
git clone https://github.com/freshpress/freshpress.git
cd freshpress

# Start development server
deno task start
```

### Development

```bash
# Start development server (basic monitoring)
deno task start

# Start development server (comprehensive monitoring)
deno task dev:full

# Build static files (basic build)
deno task build

# Build static site (complete static site generation)
deno task build:static

# Preview build results
deno task preview
```

## 📝 Content Creation

### Blog Posts

Create Markdown files in the `blog/` directory:

```markdown
---
title: Article Title
date: 2024-03-21
description: Brief article description
tags: [tag1, tag2]
locale: en-US  # or zh-CN, leave empty to display in both languages
cover: /static/images/cover.jpg  # optional cover image
---

Article content...
```

### Project Showcase

Create Markdown files in the `projects/` directory:

```markdown
---
title: Project Name
description: Project introduction
tags: [tag1, tag2]
locale: en-US  # or zh-CN, leave empty to display in both languages
cover: /static/images/project.jpg  # optional cover image
link: https://github.com/yourproject  # optional project link
featured: true  # whether to showcase on the homepage
---

Detailed project description...
```

## 🛠️ Configuration

### Site Configuration

Configure website information in `data/config.ts`:

```typescript
export const siteConfig = {
  site: {
    title: "FreshPress",
    description: "Modern static site generator based on Fresh framework",
    author: "FreshPress Team",
  },
  // Other configurations...
};
```

### Internationalization

Configure translations in `utils/i18n.ts`:

```typescript
export const translations = {
  "zh-CN": {
    // Chinese translations
  },
  "en-US": {
    // English translations
  }
};
```

## 🔧 Custom Themes

### Tailwind Customization

FreshPress uses TailwindCSS for styling, you can customize the theme by modifying the `tailwind.config.ts` file:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          // ...other colors
        },
        // ...other custom colors
      },
    },
  },
  // ...other configurations
};
```

### Theme System

FreshPress provides a CSS variable-based theme system, you can create new theme files in the `static/css/themes/` directory:

```css
/* static/css/themes/custom.css */
:root {
  /* Primary colors */
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  /* More variables... */
}
```

Then add support for the new theme in `islands/ThemeToggle.tsx`.

## 📁 Project Structure

```
freshpress/
├── blog/           # Blog post Markdown files
├── components/     # Reusable components
├── data/           # Site configuration and data
├── islands/        # Client-side interactive components
├── projects/       # Project showcase Markdown files
├── routes/         # Page routes
├── scripts/        # Build scripts
├── static/         # Static assets
│   ├── css/        # CSS style files
│   │   └── themes/ # Theme files
├── utils/          # Utility functions
├── fresh.config.ts # Fresh configuration
├── deno.json       # Deno configuration
└── tailwind.config.ts # Tailwind configuration
```

## 📷 Screenshots

![FreshPress Homepage](/static/images/screenshot-home.png)
![FreshPress Blog](/static/images/screenshot-blog.png)

## 🔄 FreshPress vs VitePress

| Feature | FreshPress | VitePress |
|------|------------|-----------|
| **Base Framework** | Fresh (Deno) | Vite (Node.js) |
| **Rendering Framework** | Preact | Vue.js |
| **Style System** | TailwindCSS | CSS Variables+SCSS |
| **Multi-language** | ✅ Built-in | ✅ Built-in |
| **Dark Mode** | ✅ Built-in | ✅ Built-in |
| **Search Functionality** | ✅ Built-in | ✅ Built-in |
| **Code Highlighting** | ✅ highlight.js | ✅ Shiki |
| **Hot Reload** | ✅ | ✅ |
| **Static Site Generation** | ✅ | ✅ |
| **Markdown Extension** | ✅ Basic Support | ✅ Rich Support |
| **Ecosystem** | Deno | Node.js |
| **Deployment** | Deno Deploy, Any Static Hosting | Netlify, Vercel, Any Static Hosting |
| **SSR Support** | ✅ | ❌ |
| **Islands Architecture** | ✅ | ❌ |

## 📚 Documentation

Complete documentation can be found at [freshpress.deno.dev/docs](https://freshpress.deno.dev/docs)

## 🤝 Contribution

We welcome Issue and Pull Request! Before starting, please read [Contribution Guide](CONTRIBUTING.md).

## 📞 Support

- Documentation: [freshpress.deno.dev/docs](https://freshpress.deno.dev/docs)
- Discord: [Join our Discord Community](https://discord.gg/freshpress)
- GitHub Issues: [Submit Issue](https://github.com/freshpress/freshpress/issues)

## 📜 License

[MIT License](LICENSE) - © FreshPress Team