export interface Project {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  avatar?: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  demoUrl?: string;
}

// Project data
export const projects: Record<string, Project> = {
  "personal-website": {
    title: "Personal Website",
    description: "Modern personal website built with Fresh framework",
    longDescription: `
This is a personal website built with Deno's Fresh framework. The website includes a blog system and project showcase functionality,
using modern design and technology stack.

## Key Features

- Responsive design, adapts to various devices
- Blog system supporting Markdown
- Project showcase page
- Modern UI design
- High-performance static generation

## Technical Implementation

The website is built with the Fresh framework, a modern web framework based on Deno. It provides many powerful features,
such as file system routing, islands architecture, and built-in TailwindCSS support.
    `,
    image: "/images/projects/personal-website.png",
    avatar: "/images/avatars/default-project.png",
    technologies: ["Deno", "Fresh", "TypeScript", "TailwindCSS"],
    features: [
      "Responsive Design",
      "Blog System",
      "Project Showcase",
      "Modern UI",
      "High Performance",
    ],
    githubUrl: "https://github.com/SisyphusZheng/personal-website",
    demoUrl: "https://z-js.dev",
  },
  "online-code-editor": {
    title: "Online Code Editor",
    description: "Online code editor based on Monaco Editor",
    longDescription: `
This is an online code editor based on Monaco Editor, supporting multiple programming languages and themes.
The editor provides features like code highlighting, auto-completion, error hints, and more.

## Key Features

- Support for multiple programming languages
- Code highlighting and auto-completion
- Multi-theme support
- Real-time error hints
- Code formatting

## Technical Implementation

The editor uses Monaco Editor as its core, which is a code editor developed by the VS Code team.
The frontend is built with React and TypeScript, providing a good development experience.
    `,
    image: "/images/projects/code-editor.png",
    avatar: "/images/avatars/default-project.png",
    technologies: ["React", "TypeScript", "Monaco Editor"],
    features: [
      "Multi-language Support",
      "Code Highlighting",
      "Auto-completion",
      "Multiple Themes",
      "Error Hints",
    ],
    githubUrl: "https://github.com/SisyphusZheng/online-code-editor",
  },
};

export function getAllProjects(): Project[] {
  return Object.values(projects);
}

export function getProjectBySlug(slug: string): Project | null {
  return projects[slug] || null;
}

export function getProjectAvatar(project: Project): string {
  return project.avatar || "/images/avatars/default-project.png";
}
