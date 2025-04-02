import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>zhizheng</title>
        <link rel="stylesheet" href="/styles.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const storedTheme = localStorage.theme;
              const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const shouldBeDark = storedTheme === 'dark' || (!storedTheme && systemDark);
              document.documentElement.classList.toggle('dark', shouldBeDark);
            `,
          }}
        />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
