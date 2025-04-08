/**
 * FreshPress 内部配置文件
 * 用于存储框架内部配置，不同于用户项目的主配置文件
 */

export const config = {
  // 构建选项
  build: {
    // 是否在构建过程中删除旧的输出目录
    cleanBeforeBuild: true,

    // 是否压缩输出文件
    minify: true,

    // 是否生成源映射文件
    sourceMap: false,

    // 构建后是否自动打开预览
    openAfterBuild: false,
  },

  // 开发服务器选项
  dev: {
    // 开发服务器端口
    port: 8000,

    // 开发服务器主机
    host: "localhost",

    // 是否自动打开浏览器
    open: true,

    // 是否在控制台中显示编译信息
    silent: false,
  },

  // 内容选项
  content: {
    // 文档根目录（相对于项目根目录）
    docRoot: "docs",

    // Markdown 渲染选项
    markdown: {
      // 是否启用语法高亮
      enableHighlight: true,

      // 是否解析 frontmatter
      enableFrontmatter: true,

      // 是否自动生成目录
      enableToc: true,
    },
  },
};

export default config;
