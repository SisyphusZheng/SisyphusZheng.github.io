# FreshPress Workflow Guide

This guide outlines a typical workflow for developing a website with FreshPress, from initial setup to deployment.

## Overview

FreshPress provides a modern development experience for creating static websites with the Deno and Fresh ecosystem. Here's an overview of a typical workflow:

1. **Setup**: Create a new project
2. **Configuration**: Customize site settings
3. **Content Creation**: Add blog posts and projects
4. **Development**: Run the dev server and make changes
5. **Customization**: Modify components and styles
6. **Testing**: Test your site locally
7. **Building**: Generate the production build
8. **Deployment**: Deploy to your hosting provider

## Setup

Start by creating a new FreshPress project:

```bash
# Install FreshPress CLI (if not already installed)
deno install -A -f https://deno.land/x/freshpress/cli.ts

# Create a new project
freshpress create my-website

# Navigate to the project directory
cd my-website
```

## Configuration

Customize your site's configuration by editing `data/config.ts`:

```typescript
export const siteConfig = {
  site: {
    title: "My Personal Website",
    description: "Developer, writer, and open source enthusiast",
    author: "Your Name",
    email: "your.email@example.com",
    github: "yourusername",
  },
  
  // Navigation items
  nav: {
    links: [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: "Projects", path: "/projects" },
      { name: "Resume", path: "/resume" },
    ],
  },
  
  // Social links
  social: {
    github: "https://github.com/yourusername",
    twitter: "https://twitter.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
  },
  
  // Project showcase
  projects: {
    title: "My Projects",
    description: "Here are some projects I've worked on",
    items: [
      {
        title: "Project One",
        description: "A description of your first project",
        technologies: ["TypeScript", "Deno", "Fresh"],
        link: "https://github.com/yourusername/project-one",
        featured: true,
      },
      // Add more projects here
    ],
  },
};
```

## Content Creation

### Blog Posts

Create Markdown files in the `blog/` directory for your blog posts:

```markdown
---
title: Getting Started with FreshPress
date: 2024-04-10
description: Learn how to create a personal website with FreshPress
tags: [FreshPress, Deno, Tutorial]
locale: en-US
---

# Getting Started with FreshPress

This is my first blog post using FreshPress. In this article, I'll cover how to set up a personal website using the FreshPress static site generator.

## Installation

First, make sure you have Deno installed...
```

### Projects

Add your projects to the `data/config.ts` file as shown in the Configuration section above.

## Development

Start the development server to see your changes in real-time:

```bash
deno task dev
```

This will start a local server at `http://localhost:8000` with hot reloading enabled.

## Customization

### Modifying Components

Customize your site's appearance by modifying components in the `components/` directory:

```tsx
// components/Header.tsx
export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          My Website
        </a>
        <nav className="flex space-x-4">
          <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Home</a>
          <a href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Blog</a>
          <a href="/projects" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Projects</a>
        </nav>
      </div>
    </header>
  );
}
```

### Styling

FreshPress uses TailwindCSS for styling. You can customize your styles by:

1. Using Tailwind classes directly in your components
2. Modifying `tailwind.config.ts` to extend the default theme
3. Adding custom CSS in `static/styles.css`

Example of extending Tailwind's theme:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          // ... other shades
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  // ...other configurations
};
```

## Testing

Test your site locally to make sure everything works as expected:

```bash
# Start development server
deno task dev

# Generate search index for testing search functionality
deno task gen-search-index
```

Check for common issues:
- Responsive design on different screen sizes
- Dark mode functionality
- Language switching if using internationalization
- Navigation links and routing
- Blog post rendering
- Search functionality

## Building

Generate the production build of your site:

```bash
deno task build
```

This will create a `dist/` directory containing all the static files needed for deployment.

Preview the built site locally:

```bash
deno task preview
```

## Deployment

Deploy your site to your preferred hosting provider. See the [DEPLOYMENT.md](DEPLOYMENT.md) guide for detailed instructions on deploying to various platforms.

Quick example for GitHub Pages:

```bash
# Build the site
deno task build

# Deploy to GitHub Pages (if you've set up GitHub Actions)
git add .
git commit -m "Update website content"
git push
```

## Common Workflows

### Adding a New Blog Post

1. Create a new Markdown file in `blog/`
2. Add frontmatter with title, date, description, tags
3. Write your content
4. Run `deno task dev` to preview
5. Commit and push changes

### Updating Projects

1. Edit the projects section in `data/config.ts`
2. Add or update project entries
3. Preview changes with `deno task dev`
4. Commit and push changes

### Creating a New Page

1. Create a new file in `routes/` directory (e.g., `routes/about.tsx`)
2. Implement the page component
3. Add the link to navigation in `components/Navbar.tsx`
4. Preview with `deno task dev`
5. Commit and push changes

### Modifying Site Theme

1. Edit `tailwind.config.ts` to customize colors, fonts, etc.
2. Update CSS variables in `static/styles.css` for custom theme support
3. Test different themes with the theme toggle
4. Preview changes with `deno task dev`
5. Commit and push changes

## Tips & Best Practices

1. **Use Islands Architecture**: Keep most of your site static and only use islands for interactive components
2. **Optimize Images**: Compress and properly size images before adding them to `static/images/`
3. **Consistent Content Structure**: Maintain a consistent format for blog posts and projects
4. **Regular Backups**: Keep your content and code backed up with Git
5. **Semantic HTML**: Use appropriate HTML elements for better accessibility and SEO
6. **Progressive Enhancement**: Make sure your site works without JavaScript where possible
7. **Consistent Styling**: Follow a consistent design language across your site 