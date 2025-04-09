import{a as x}from"./chunk-ANSKVZLX.js";import{a,d as e}from"./chunk-67FELWPG.js";import"./chunk-ESCFK4PK.js";import"./chunk-6RK4QHXZ.js";var o=[{title:"\u4F7F\u7528 Fresh \u6846\u67B6\u6784\u5EFA\u4E2A\u4EBA\u7F51\u7AD9",date:"2024-03-20",content:`# \u4F7F\u7528 Fresh \u6846\u67B6\u6784\u5EFA\u4E2A\u4EBA\u7F51\u7AD9

Fresh \u662F Deno \u7684\u4E00\u4E2A\u73B0\u4EE3\u5316 Web \u6846\u67B6\uFF0C\u5B83\u63D0\u4F9B\u4E86\u8BB8\u591A\u5F3A\u5927\u7684\u529F\u80FD\uFF0C\u8BA9\u6211\u4EEC\u53EF\u4EE5\u5FEB\u901F\u6784\u5EFA\u9AD8\u6027\u80FD\u7684\u7F51\u7AD9\u3002

## \u4E3A\u4EC0\u4E48\u9009\u62E9 Fresh\uFF1F

1. **\u96F6\u914D\u7F6E**\uFF1A\u5F00\u7BB1\u5373\u7528\uFF0C\u65E0\u9700\u590D\u6742\u7684\u914D\u7F6E
2. **TypeScript \u652F\u6301**\uFF1A\u5B8C\u6574\u7684\u7C7B\u578B\u652F\u6301
3. **\u5C9B\u5C7F\u67B6\u6784**\uFF1A\u90E8\u5206\u6C34\u5408\uFF0C\u63D0\u9AD8\u6027\u80FD
4. **\u5185\u7F6E\u8DEF\u7531**\uFF1A\u6587\u4EF6\u7CFB\u7EDF\u8DEF\u7531
5. **TailwindCSS \u96C6\u6210**\uFF1A\u8F7B\u677E\u6784\u5EFA\u7F8E\u89C2\u7684 UI

## \u5F00\u59CB\u4F7F\u7528

\u9996\u5148\uFF0C\u6211\u4EEC\u9700\u8981\u5B89\u88C5 Deno\uFF1A

\`\`\`bash
curl -fsSL https://deno.land/x/install/install.sh | sh
\`\`\`

\u7136\u540E\u521B\u5EFA\u65B0\u7684 Fresh \u9879\u76EE\uFF1A

\`\`\`bash
deno run -A -r https://fresh.deno.dev my-website
\`\`\`

## \u9879\u76EE\u7ED3\u6784

Fresh \u9879\u76EE\u7684\u57FA\u672C\u7ED3\u6784\u5982\u4E0B\uFF1A

- \`routes/\`: \u9875\u9762\u8DEF\u7531
- \`components/\`: \u53EF\u590D\u7528\u7EC4\u4EF6
- \`islands/\`: \u4EA4\u4E92\u5F0F\u7EC4\u4EF6
- \`static/\`: \u9759\u6001\u8D44\u6E90

## \u603B\u7ED3

Fresh \u662F\u4E00\u4E2A\u5F3A\u5927\u7684\u6846\u67B6\uFF0C\u7279\u522B\u9002\u5408\u6784\u5EFA\u4E2A\u4EBA\u7F51\u7AD9\u3002\u5B83\u7684\u7B80\u5355\u6027\u548C\u6027\u80FD\u4F7F\u5176\u6210\u4E3A\u4E00\u4E2A\u5F88\u597D\u7684\u9009\u62E9\u3002`,tags:["Deno","Fresh","Web Development"],slug:"building-personal-website-with-fresh"},{title:"TypeScript \u7C7B\u578B\u7CFB\u7EDF\u8FDB\u9636",date:"2024-03-15",content:`# TypeScript \u7C7B\u578B\u7CFB\u7EDF\u8FDB\u9636

TypeScript \u7684\u7C7B\u578B\u7CFB\u7EDF\u662F\u5176\u6700\u5F3A\u5927\u7684\u7279\u6027\u4E4B\u4E00\u3002\u8BA9\u6211\u4EEC\u6DF1\u5165\u63A2\u8BA8\u4E00\u4E9B\u9AD8\u7EA7\u7C7B\u578B\u7279\u6027\u3002

## \u6CDB\u578B

\u6CDB\u578B\u5141\u8BB8\u6211\u4EEC\u521B\u5EFA\u53EF\u91CD\u7528\u7684\u7EC4\u4EF6\uFF1A

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

## \u6761\u4EF6\u7C7B\u578B

\u6761\u4EF6\u7C7B\u578B\u8BA9\u6211\u4EEC\u53EF\u4EE5\u6839\u636E\u5176\u4ED6\u7C7B\u578B\u6765\u5B9A\u4E49\u7C7B\u578B\uFF1A

\`\`\`typescript
type NonNullable<T> = T extends null | undefined ? never : T;
\`\`\`

## \u7C7B\u578B\u63A8\u65AD

TypeScript \u53EF\u4EE5\u81EA\u52A8\u63A8\u65AD\u7C7B\u578B\uFF1A

\`\`\`typescript
const numbers = [1, 2, 3]; // \u63A8\u65AD\u4E3A number[]
\`\`\`

## \u603B\u7ED3

\u638C\u63E1\u8FD9\u4E9B\u9AD8\u7EA7\u7C7B\u578B\u7279\u6027\u53EF\u4EE5\u8BA9\u6211\u4EEC\u5199\u51FA\u66F4\u7C7B\u578B\u5B89\u5168\u7684\u4EE3\u7801\u3002`,tags:["TypeScript","Programming"],slug:"typescript-type-system-advanced"},{title:"\u4F7F\u7528 TailwindCSS \u6784\u5EFA\u73B0\u4EE3\u5316 UI",date:"2024-03-10",content:`# \u4F7F\u7528 TailwindCSS \u6784\u5EFA\u73B0\u4EE3\u5316 UI

TailwindCSS \u662F\u4E00\u4E2A\u529F\u80FD\u7C7B\u4F18\u5148\u7684 CSS \u6846\u67B6\uFF0C\u5B83\u8BA9\u6211\u4EEC\u53EF\u4EE5\u5FEB\u901F\u6784\u5EFA\u73B0\u4EE3\u5316\u7684\u7528\u6237\u754C\u9762\u3002

## \u4E3A\u4EC0\u4E48\u9009\u62E9 TailwindCSS\uFF1F

1. **\u5B9E\u7528\u4F18\u5148**\uFF1A\u76F4\u63A5\u4F7F\u7528\u7C7B\u540D\u6784\u5EFA UI
2. **\u54CD\u5E94\u5F0F\u8BBE\u8BA1**\uFF1A\u5185\u7F6E\u54CD\u5E94\u5F0F\u5DE5\u5177\u7C7B
3. **\u81EA\u5B9A\u4E49\u4E3B\u9898**\uFF1A\u8F7B\u677E\u5B9A\u5236\u8BBE\u8BA1\u7CFB\u7EDF
4. **\u6027\u80FD\u4F18\u5316**\uFF1A\u53EA\u751F\u6210\u4F7F\u7528\u7684 CSS
5. **\u5F00\u53D1\u4F53\u9A8C**\uFF1A\u5FEB\u901F\u8FED\u4EE3\u548C\u539F\u578B\u8BBE\u8BA1

## \u5F00\u59CB\u4F7F\u7528

\u5B89\u88C5 TailwindCSS\uFF1A

\`\`\`bash
npm install -D tailwindcss
npx tailwindcss init
\`\`\`

\u914D\u7F6E TailwindCSS\uFF1A

\`\`\`javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

## \u5B9E\u7528\u6280\u5DE7

1. \u4F7F\u7528 @apply \u63D0\u53D6\u91CD\u590D\u7684\u6837\u5F0F
2. \u4F7F\u7528 JIT \u6A21\u5F0F\u63D0\u9AD8\u5F00\u53D1\u6548\u7387
3. \u4F7F\u7528\u63D2\u4EF6\u6269\u5C55\u529F\u80FD
4. \u4F7F\u7528\u81EA\u5B9A\u4E49\u914D\u7F6E\u7EDF\u4E00\u8BBE\u8BA1\u7CFB\u7EDF

## \u603B\u7ED3

TailwindCSS \u662F\u4E00\u4E2A\u5F3A\u5927\u7684\u5DE5\u5177\uFF0C\u53EF\u4EE5\u5927\u5927\u63D0\u9AD8\u6211\u4EEC\u7684\u5F00\u53D1\u6548\u7387\u3002`,tags:["CSS","TailwindCSS","Web Development"],slug:"building-modern-ui-with-tailwindcss"}];function c({content:n,enableToc:r=!0,enableHighlight:s=!0}){return e(x,{content:n,enableToc:r,enableHighlight:s})}function w(){let[n,r]=a(""),[s,d]=a(null),[u,h]=a(1),i=5,m=Array.from(new Set(o.flatMap(t=>t.tags))),p=o.filter(t=>{let l=t.title.toLowerCase().includes(n.toLowerCase())||t.content.toLowerCase().includes(n.toLowerCase()),f=s?t.tags.includes(s):!0;return l&&f}),g=Math.ceil(p.length/i),b=(u-1)*i,y=p.slice(b,b+i);return e("div",{class:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:[e("div",{class:"mb-8",children:e("input",{type:"text",placeholder:"\u641C\u7D22\u6587\u7AE0...",class:"w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",value:n,onInput:t=>r(t.currentTarget.value)})}),e("div",{class:"mb-8 flex flex-wrap gap-2",children:[e("button",{class:`px-4 py-2 rounded-full text-sm ${s===null?"bg-blue-500 text-white":"bg-gray-100 text-gray-800"}`,onClick:()=>d(null),children:"\u5168\u90E8"}),m.map(t=>e("button",{class:`px-4 py-2 rounded-full text-sm ${s===t?"bg-blue-500 text-white":"bg-gray-100 text-gray-800"}`,onClick:()=>d(t),children:t}))]}),e("div",{class:"space-y-8",children:y.map(t=>e("article",{class:"bg-white shadow-lg rounded-lg overflow-hidden",children:e("div",{class:"p-6",children:[e("h2",{class:"text-2xl font-bold mb-2",children:e("a",{href:`/blog/${t.slug}`,class:"text-gray-900 hover:text-blue-500",children:t.title})}),e("div",{class:"flex items-center text-gray-500 mb-4",children:[e("span",{children:t.date}),e("div",{class:"flex gap-2 ml-4",children:t.tags.map(l=>e("span",{class:"bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm",children:l}))})]}),e("div",{class:"prose max-w-none",children:e(c,{content:t.excerpt})}),e("a",{href:`/blog/${t.slug}`,class:"inline-block mt-4 text-blue-500 hover:text-blue-600",children:"\u9605\u8BFB\u66F4\u591A \u2192"})]})}))}),g>1&&e("div",{class:"mt-8 flex justify-center gap-2",children:Array.from({length:g},(t,l)=>l+1).map(t=>e("button",{class:`px-4 py-2 rounded ${u===t?"bg-blue-500 text-white":"bg-gray-100 text-gray-800"}`,onClick:()=>h(t),children:t}))})]})}export{w as default};
