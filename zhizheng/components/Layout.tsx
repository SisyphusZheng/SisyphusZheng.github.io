// components/Layout.tsx

import { ComponentChildren } from "preact";
import Navbar from "../islands/Navbar.tsx";

interface LayoutProps {
  children: ComponentChildren;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div class="layout">
      <Navbar />
      <main>
        {children} {/* 这里会渲染 Markdown 内容 */}
      </main>
    </div>
  );
}
