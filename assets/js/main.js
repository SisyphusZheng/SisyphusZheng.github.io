// 引入 marked 库
import { marked } from 'marked';

// 获取要显示 Markdown 的容器
const contentElement = document.getElementById('content');

// 获取 Markdown 文件名
const markdownFile = 'blog1.md'; // 或 'project1.md'

// 使用 fetch 获取 Markdown 文件
fetch(markdownFile)
    .then(response => response.text())
    .then(text => {
        // 将 Markdown 转换为 HTML
        const htmlContent = marked(text);
        // 插入 HTML 到页面中
        contentElement.innerHTML = htmlContent;
    })
    .catch(error => {
        console.error('Error fetching the Markdown file:', error);
    });
