import { Head } from "$fresh/runtime.ts";
import Navbar from "../islands/Navbar.tsx";
import Footer from "./Footer.tsx";

interface LayoutProps {
  children: preact.ComponentChildren;
  title?: string;
  description?: string;
}

export default function Layout({ children, title = "个人博客", description = "分享技术心得和项目经验" }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <div class="min-h-screen flex flex-col">
        <Navbar />
        <main class="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
} 