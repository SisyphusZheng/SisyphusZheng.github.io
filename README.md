# 🍋 FreshPress <a href="https://fresh.deno.dev"><img width="30" height="30" src="https://fresh.deno.dev/fresh-badge.svg" alt="Made with Fresh" /></a>

A modern static site generator based on the Fresh framework, designed specifically for personal blogs and portfolios. Built with Deno and Fresh, FreshPress offers high performance, multilingual support, and a modern development experience.

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![deno module](https://shield.deno.dev/x/freshpress)](https://deno.land/x/freshpress)

## ✨ Key Features

- **Fresh Framework Integration**: Leverages Fresh's benefits with SSG support
- **Multilingual Support**: Built-in English and Chinese internationalization
- **Smart Search System**: Full-text search across all your content
- **Responsive Design**: Perfect adaptation from mobile to desktop
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Markdown Blog Engine**: Write content in Markdown with code highlighting
- **Project Showcase**: Dedicated area to highlight your projects
- **Island Architecture**: Efficient and selective hydration for interactive components
- **Seamless Deployment**: Easy deployment to Deno Deploy or static hosting

## 🚀 Getting Started

### Prerequisites

- [Deno](https://deno.land/) 1.40.0 or higher

### Quick Start

```bash
# Install FreshPress CLI
deno install -A -f https://deno.land/x/freshpress/cli.ts

# Create a new project
freshpress create my-website

# Navigate to project directory
cd my-website

# Start development server
deno task dev
```

### Manual Setup

```bash
# Clone the repository
git clone https://github.com/username/freshpress.git my-website

# Navigate to project directory
cd my-website

# Start development server
deno task dev
```

## 📝 Usage Guide

### Project Structure Overview

```
my-website/
├── blog/             # Blog post Markdown files
├── components/       # Reusable UI components
├── data/             # Site configuration and data
├── islands/          # Interactive components
├── routes/           # Page routes and layouts
├── static/           # Static assets (images, CSS)
├── utils/            # Utility functions
├── deno.json         # Deno configuration
└── fresh.config.ts   # Fresh framework config
```

### Creating Content

#### Blog Posts

Create a Markdown file in the `blog/` directory:

```markdown
---
title: Getting Started with FreshPress
date: 2024-04-10
description: Learn how to use FreshPress to build your personal website
tags: [FreshPress, Deno, Fresh, Tutorial]
locale: en-US  # or zh-CN
---

# Getting Started with FreshPress

This is my first blog post using FreshPress!

## Features I Love

- Fast rendering
- Multilingual support
- Dark mode
```

#### Projects

Add your projects to the `data/config.ts` file:

```typescript
export const siteConfig = {
  // ... other configuration
  projects: {
    items: [
      {
        title: "Personal Website",
        description: "Built with FreshPress and Deno",
        technologies: ["Deno", "Fresh", "TypeScript"],
        link: "https://github.com/yourusername/website",
        featured: true
      }
    ]
  }
}
```

### Configuration

#### Site Settings

Configure your website in `data/config.ts`:

```typescript
export const siteConfig = {
  site: {
    title: "My Personal Site",
    description: "Developer, writer, and open source enthusiast",
    author: "Your Name",
  },
  // Other configurations...
};
```

#### Internationalization

Add translations in `utils/i18n.ts`:

```typescript
export const translations = {
  "en-US": {
    nav: {
      home: "Home",
      blog: "Blog",
      projects: "Projects",
    },
    // More translations...
  },
  "zh-CN": {
    nav: {
      home: "首页",
      blog: "博客",
      projects: "项目",
    },
    // More translations...
  }
};
```

## 🌍 Deployment

### Static Site Generation

```bash
# Build static site
deno task build

# The output will be in the dist/ directory
```

### Deploy to Deno Deploy

1. Create a new project on [Deno Deploy](https://deno.com/deploy)
2. Connect your GitHub repository
3. Set the entry point to `main.ts`
4. Deploy!

### Other Hosting Options

For static hosting (Netlify, Vercel, GitHub Pages):

```bash
# Build the static site
deno task build

# Deploy the dist/ directory
```

## 🔄 Workflow Example

1. **Setup**: Create a new FreshPress project
2. **Configuration**: Customize `data/config.ts` with your details
3. **Content Creation**: Add blog posts to the `blog/` directory 
4. **Customization**: Modify styles in `static/css/` or via Tailwind
5. **Development**: Run `deno task dev` to see changes locally
6. **Build**: Run `deno task build` to generate static output
7. **Deployment**: Upload the `dist/` directory to your hosting

## 📊 Performance

FreshPress is built for speed and efficiency:

- **Lighthouse Score**: 95+ across all categories
- **Page Load**: Under 1s for most pages
- **First Contentful Paint**: ~300ms
- **Minimal JS**: Only loads JavaScript for interactive components

## 🤝 Contributing

Contributions are welcome! Check out the [contribution guidelines](CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.