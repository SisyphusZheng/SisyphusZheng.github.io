# FreshPress 项目

这是一个使用 FreshPress 创建的静态网站项目。

## 开始使用

1. 安装依赖:
   ```bash
   deno task install
   ```

2. 启动开发服务器:
   ```bash
   deno task dev
   ```

3. 构建静态网站:
   ```bash
   deno task build
   ```

4. 预览构建结果:
   ```bash
   deno task preview
   ```

## 项目结构

```
.
├── .freshpress/     # FreshPress 配置目录
├── docs/           # 文档目录
├── public/         # 静态资源目录
├── plugins/        # 插件目录
├── themes/         # 主题目录
├── deno.json       # Deno 配置文件
└── import_map.json # 导入映射文件
```

## 文档

更多信息请访问 [FreshPress 文档](https://freshpress.dev)。 