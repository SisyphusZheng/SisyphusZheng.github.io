## FreshPress
### 🚧 Development Preview: Core architecture under active evolution 🚧

FreshPress is a modular static site generator (SSG) built on Fresh v2, designed to deliver an "out-of-the-box" high-performance static site solution through a plugin-driven architecture and minimalist CLI toolchain. As Fresh v2 evolves, the project is progressively splitting functionality into independent plugins and a lightweight core CLI.

### 🌟 Architecture Design
1. Core Components
- @freshpress/cli: Command-line interface providing init, build, and dev commands.

2. Plugin System
- @freshpress/fresh-plugin-blog	Blog content management & routing	In Development
- @freshpress/fresh-plugin-search	Dependency-free full-text search	Planned
- @freshpress/fresh-plugin-i18n	Multi-language content routing	Planned
- [ **@freshpress/fresh-plugin-screenshot**](https://github.com/SisyphusZheng/fresh-plugins-screenshot) Simple Screenshot plugin can be use right now
