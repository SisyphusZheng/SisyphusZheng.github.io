## FreshPress
### 🚧 Project Pivot: From Website Prototype to SSG Framework 🚧

This repository initially started as a static website prototype built with Fresh v2 (aiming to quickly launch a documentation site/blog). However, during development, identified key pain points:

Redundant development of common features (e.g., Markdown parsing, i18n support)
Lack of flexible SSG tools fully optimized for Fresh v2’s island architecture and edge capabilities

As a result, pivoted to transform this into the FreshPress SSG Framework—leveraging the technical foundations of the website prototype to extract reusable plugin systems and a minimalist CLI, enabling developers to build static sites via a modular, Lego-like approach.

### 🌟 Architecture Design
1. Core Components
- @freshpress/cli: Command-line interface providing init, build, and dev commands. Planned

2. Plugin System
- @freshpress/fresh-plugin-md	render markdown content Development
- @freshpress/fresh-plugin-search	Dependency-free full-text search	Planned
- @freshpress/fresh-plugin-i18n	Multi-language content routing	Planned
- [ **@freshpress/fresh-plugin-screenshot**](https://github.com/SisyphusZheng/fresh-plugins-screenshot) Simple Screenshot plugin can be use right now
- @freshpress/fresh-plugin-freshtify	ui lib build by web components and tailwind	Planned
