// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $blog_slug_ from "./routes/blog/[slug].tsx";
import * as $blog_index from "./routes/blog/index.tsx";
import * as $index from "./routes/index.tsx";
import * as $projects_slug_ from "./routes/projects/[slug].tsx";
import * as $projects_index from "./routes/projects/index.tsx";
import * as $resume from "./routes/resume.tsx";
import * as $BlogList from "./islands/BlogList.tsx";
import * as $Navbar from "./islands/Navbar.tsx";
import * as $Search from "./islands/Search.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/blog/[slug].tsx": $blog_slug_,
    "./routes/blog/index.tsx": $blog_index,
    "./routes/index.tsx": $index,
    "./routes/projects/[slug].tsx": $projects_slug_,
    "./routes/projects/index.tsx": $projects_index,
    "./routes/resume.tsx": $resume,
  },
  islands: {
    "./islands/BlogList.tsx": $BlogList,
    "./islands/Navbar.tsx": $Navbar,
    "./islands/Search.tsx": $Search,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
